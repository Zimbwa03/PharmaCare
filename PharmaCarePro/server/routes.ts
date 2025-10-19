import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, requireRole } from "./auth";
import authRoutes from "./authRoutes";
import { insertPatientSchema, insertProductSchema, insertStockMovementSchema } from "@shared/schema";
import { checkDrugInteractions, forecastDemand } from "./ai-services";

// Helper function to create audit logs
async function auditLog(userId: string, action: string, entityType: string, entityId: string, details?: any) {
  try {
    await storage.createAuditLog({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Custom authentication routes
  app.use('/api/auth', authRoutes);

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth(), async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const prescriptions = await storage.getAllPrescriptions();
      const inventory = await storage.getAllInventory();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const prescriptionsToday = prescriptions.filter(
        (p) => p.createdAt && new Date(p.createdAt) >= today
      ).length;

      const lowStockItems = inventory.filter((item) => item.quantity <= item.reorderLevel).length;

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiringItems = inventory.filter(
        (item) => item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow
      ).length;

      res.json({
        totalPatients: patients.length,
        prescriptionsToday,
        lowStockItems,
        expiringItems,
        salesTrend: [],
        topProducts: [],
        prescriptionVolume: [],
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Patients routes
  app.get("/api/patients", requireAuth(), requireRole("Administrator", "Pharmacist", "Technician"), async (req: any, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.post("/api/patients", requireAuth(), requireRole("Administrator", "Pharmacist"), async (req: any, res) => {
    try {
      const validated = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validated);
      
      await auditLog(req.dbUser.id, "CREATE", "patient", patient.id, {
        patientName: `${patient.firstName} ${patient.lastName}`,
      });
      
      res.json(patient);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid patient data" });
    }
  });

  // Products routes
  app.get("/api/products", requireAuth(), async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", requireAuth(), requireRole("Administrator", "Store Manager"), async (req: any, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      
      await auditLog(req.dbUser.id, "CREATE", "product", product.id, {
        productName: product.name,
        isControlled: product.isControlledSubstance,
      });
      
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid product data" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", requireAuth(), async (req, res) => {
    try {
      const inventory = await storage.getAllInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Prescriptions routes
  app.get("/api/prescriptions", requireAuth(), async (req, res) => {
    try {
      const prescriptions = await storage.getAllPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  app.post("/api/prescriptions", requireAuth(), requireRole("Administrator", "Pharmacist"), async (req: any, res) => {
    try {
      const { patientId, prescriberName, prescriberId, notes, items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "At least one item is required" });
      }

      // Get products and patient info
      const products = await storage.getAllProducts();
      const patient = await storage.getPatient(patientId);
      
      if (!patient) {
        return res.status(400).json({ message: "Patient not found" });
      }

      // Validate controlled substances and prescriptions
      const selectedProducts = products.filter(p => items.some((i: any) => i.productId === p.id));
      const controlledProducts = selectedProducts.filter(p => p.isControlledSubstance);
      const prescriptionOnlyProducts = selectedProducts.filter(p => p.requiresPrescription);
      
      if (controlledProducts.length > 0) {
        await auditLog(req.dbUser.id, "DISPENSE_CONTROLLED", "prescription", "pending", {
          patientId,
          products: controlledProducts.map(p => ({ id: p.id, name: p.name })),
        });
      }

      if (prescriptionOnlyProducts.length > 0 && !prescriberName) {
        return res.status(400).json({ 
          message: "Prescriber information required for prescription-only medications",
        });
      }

      // Check drug interactions using AI
      const interactionWarnings = await checkDrugInteractions(patient, selectedProducts);

      // Generate prescription number
      const prescriptionNumber = `RX${Date.now()}`;

      // Calculate total amount
      const prescriptionItems = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        const unitPrice = product ? parseFloat(product.sellingPrice) : 0;
        const totalPrice = unitPrice * item.quantity;

        return {
          productId: item.productId,
          quantity: item.quantity,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions,
          unitPrice: unitPrice.toString(),
          totalPrice: totalPrice.toString(),
        };
      });

      const totalAmount = prescriptionItems.reduce(
        (sum: number, item: any) => sum + parseFloat(item.totalPrice),
        0
      );

      const prescription = await storage.createPrescription(
        {
          prescriptionNumber,
          patientId,
          prescriberName,
          prescriberId,
          notes: interactionWarnings.length > 0 
            ? `${notes}\n\nAI WARNINGS: ${interactionWarnings.join("; ")}`
            : notes,
          totalAmount: totalAmount.toString(),
          status: "pending",
          dispensedBy: req.dbUser.id,
        },
        prescriptionItems
      );

      await auditLog(req.dbUser.id, "CREATE", "prescription", prescription.id, {
        prescriptionNumber,
        patientId,
        itemCount: items.length,
        hasWarnings: interactionWarnings.length > 0,
      });

      res.json({ 
        prescription, 
        warnings: interactionWarnings.length > 0 ? interactionWarnings : undefined,
      });
    } catch (error: any) {
      console.error("Prescription creation error:", error);
      res.status(400).json({ message: error.message || "Failed to create prescription" });
    }
  });

  app.post("/api/prescriptions/check-interactions", requireAuth(), async (req, res) => {
    try {
      const { patientId, productIds } = req.body;

      if (!patientId || !productIds || productIds.length === 0) {
        return res.json({ warnings: [] });
      }

      const patient = await storage.getPatient(patientId);
      const products = await storage.getAllProducts();
      const selectedProducts = products.filter((p) => productIds.includes(p.id));

      const warnings = await checkDrugInteractions(patient, selectedProducts);

      res.json({ warnings });
    } catch (error) {
      res.status(500).json({ message: "Failed to check interactions" });
    }
  });

  // Stock movements routes
  app.post("/api/stock-movements", requireAuth(), requireRole("Administrator", "Store Manager", "Technician"), async (req: any, res) => {
    try {
      const validated = insertStockMovementSchema.parse(req.body);
      
      const movement = await storage.createStockMovement({
        ...validated,
        userId: req.dbUser.id,
      });

      // Update inventory based on movement type
      const quantity = validated.movementType === "grv" ? -validated.quantity : validated.quantity;
      await storage.updateInventory(validated.productId, validated.batchNumber || null, quantity);

      await auditLog(req.dbUser.id, "STOCK_MOVEMENT", "inventory", validated.productId, {
        movementType: validated.movementType,
        quantity: validated.quantity,
        batchNumber: validated.batchNumber,
      });

      res.json(movement);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to record stock movement" });
    }
  });

  // Suppliers routes
  app.get("/api/suppliers", requireAuth(), async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // Manufacturers routes
  app.get("/api/manufacturers", requireAuth(), async (req, res) => {
    try {
      const manufacturers = await storage.getAllManufacturers();
      res.json(manufacturers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manufacturers" });
    }
  });

  // Users routes
  app.get("/api/users", requireAuth(), requireRole("Administrator"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Audit logs routes
  app.get("/api/audit-logs", requireAuth(), requireRole("Administrator", "Pharmacist"), async (req, res) => {
    try {
      const { userId, action, entityType } = req.query;
      const logs = await storage.getAuditLogs({
        userId: userId as string,
        action: action as string,
        entityType: entityType as string,
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // AI-powered analytics
  app.get("/api/analytics/forecast", requireAuth(), requireRole("Administrator", "Store Manager"), async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const inventory = await storage.getAllInventory();
      const prescriptions = await storage.getAllPrescriptions();
      
      // Get AI forecast for top products
      const topProducts = products.slice(0, 5);
      const forecasts = await Promise.all(
        topProducts.map(async (product) => {
          const productInventory = inventory.filter(i => i.productId === product.id);
          const forecast = await forecastDemand(product, productInventory, prescriptions);
          return {
            productId: product.id,
            productName: product.name,
            ...forecast,
          };
        })
      );

      res.json(forecasts);
    } catch (error) {
      console.error("Forecast error:", error);
      res.status(500).json({ message: "Failed to generate forecast" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
