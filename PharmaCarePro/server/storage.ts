import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  patients,
  products,
  inventory,
  prescriptions,
  prescriptionItems,
  stockMovements,
  suppliers,
  manufacturers,
  auditLogs,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Product,
  type InsertProduct,
  type Inventory,
  type InsertInventory,
  type Prescription,
  type InsertPrescription,
  type PrescriptionItem,
  type InsertPrescriptionItem,
  type StockMovement,
  type InsertStockMovement,
  type Supplier,
  type InsertSupplier,
  type Manufacturer,
  type InsertManufacturer,
  type AuditLog,
  type InsertAuditLog,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<UpsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Patients
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;

  // Inventory
  getAllInventory(): Promise<(Inventory & { productName: string; reorderLevel: number })[]>;
  getInventoryByProduct(productId: string): Promise<Inventory[]>;
  updateInventory(productId: string, batchNumber: string | null, quantity: number): Promise<void>;

  // Prescriptions
  getAllPrescriptions(): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription, items: InsertPrescriptionItem[]): Promise<Prescription>;
  getPrescriptionItems(prescriptionId: string): Promise<PrescriptionItem[]>;

  // Stock Movements
  getAllStockMovements(): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;

  // Suppliers
  getAllSuppliers(): Promise<Supplier[]>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;

  // Manufacturers
  getAllManufacturers(): Promise<Manufacturer[]>;
  createManufacturer(manufacturer: InsertManufacturer): Promise<Manufacturer>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: { userId?: string; action?: string; entityType?: string }): Promise<AuditLog[]>;
}

class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async createUser(user: UpsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: string, data: Partial<UpsertUser>): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const [upserted] = await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          role: user.role || "pharmacist", // Update role if provided, default to pharmacist
          updatedAt: new Date(),
        },
      })
      .returning();
    return upserted;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Patients
  async getAllPatients(): Promise<Patient[]> {
    return db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [created] = await db.insert(patients).values(patient).returning();
    return created;
  }

  async updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updated] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updated;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  // Inventory
  async getAllInventory(): Promise<(Inventory & { productName: string; reorderLevel: number })[]> {
    const result = await db
      .select({
        id: inventory.id,
        productId: inventory.productId,
        productName: products.name,
        batchNumber: inventory.batchNumber,
        quantity: inventory.quantity,
        expiryDate: inventory.expiryDate,
        location: inventory.location,
        updatedAt: inventory.updatedAt,
        reorderLevel: products.reorderLevel,
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .orderBy(desc(inventory.updatedAt));
    
    return result as (Inventory & { productName: string; reorderLevel: number })[];
  }

  async getInventoryByProduct(productId: string): Promise<Inventory[]> {
    return db.select().from(inventory).where(eq(inventory.productId, productId));
  }

  async updateInventory(productId: string, batchNumber: string | null, quantity: number): Promise<void> {
    const existing = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.productId, productId),
          batchNumber ? eq(inventory.batchNumber, batchNumber) : sql`${inventory.batchNumber} IS NULL`
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(inventory)
        .set({ quantity: existing[0].quantity + quantity, updatedAt: new Date() })
        .where(eq(inventory.id, existing[0].id));
    } else {
      await db.insert(inventory).values({
        productId,
        batchNumber,
        quantity,
      });
    }
  }

  // Prescriptions
  async getAllPrescriptions(): Promise<Prescription[]> {
    return db.select().from(prescriptions).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescription(id: string): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id)).limit(1);
    return prescription;
  }

  async createPrescription(prescription: InsertPrescription, items: InsertPrescriptionItem[]): Promise<Prescription> {
    const [created] = await db.insert(prescriptions).values(prescription).returning();
    
    if (items.length > 0) {
      await db.insert(prescriptionItems).values(
        items.map(item => ({
          ...item,
          prescriptionId: created.id,
        }))
      );
    }
    
    return created;
  }

  async getPrescriptionItems(prescriptionId: string): Promise<PrescriptionItem[]> {
    return db.select().from(prescriptionItems).where(eq(prescriptionItems.prescriptionId, prescriptionId));
  }

  // Stock Movements
  async getAllStockMovements(): Promise<StockMovement[]> {
    return db.select().from(stockMovements).orderBy(desc(stockMovements.createdAt));
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const [created] = await db.insert(stockMovements).values(movement).returning();
    return created;
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [created] = await db.insert(suppliers).values(supplier).returning();
    return created;
  }

  // Manufacturers
  async getAllManufacturers(): Promise<Manufacturer[]> {
    return db.select().from(manufacturers).orderBy(desc(manufacturers.createdAt));
  }

  async createManufacturer(manufacturer: InsertManufacturer): Promise<Manufacturer> {
    const [created] = await db.insert(manufacturers).values(manufacturer).returning();
    return created;
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getAuditLogs(filters?: { userId?: string; action?: string; entityType?: string }): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters?.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }
    if (filters?.entityType) {
      conditions.push(eq(auditLogs.entityType, filters.entityType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query.orderBy(desc(auditLogs.timestamp));
  }
}

export const storage = new DatabaseStorage();
