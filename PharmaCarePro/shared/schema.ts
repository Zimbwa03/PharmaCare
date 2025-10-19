import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['administrator', 'pharmacist', 'receptionist', 'technician', 'store_manager']);

// User storage table - Custom email/password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phoneNumber: varchar("phone_number"),
  pharmacyBranch: varchar("pharmacy_branch"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default('receptionist'),
  isActive: boolean("is_active").notNull().default(true),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: varchar("verification_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nationalId: varchar("national_id").unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  city: varchar("city"),
  allergies: text("allergies").array(),
  chronicConditions: text("chronic_conditions").array(),
  medicalHistory: text("medical_history"),
  insuranceProvider: varchar("insurance_provider"),
  insuranceNumber: varchar("insurance_number"),
  emergencyContact: varchar("emergency_contact"),
  emergencyPhone: varchar("emergency_phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  contactPerson: varchar("contact_person"),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Manufacturers table
export const manufacturers = pgTable("manufacturers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  country: varchar("country"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertManufacturerSchema = createInsertSchema(manufacturers).omit({
  id: true,
  createdAt: true,
});

export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;
export type Manufacturer = typeof manufacturers.$inferSelect;

// Products/Drugs table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: varchar("barcode").unique(),
  name: varchar("name").notNull(),
  genericName: varchar("generic_name"),
  category: varchar("category"),
  drugForm: varchar("drug_form"), // tablet, capsule, syrup, etc.
  strength: varchar("strength"), // e.g., "500mg"
  packSize: integer("pack_size"),
  supplierId: varchar("supplier_id").references(() => suppliers.id),
  manufacturerId: varchar("manufacturer_id").references(() => manufacturers.id),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  markupPercentage: decimal("markup_percentage", { precision: 5, scale: 2 }),
  vatPercentage: decimal("vat_percentage", { precision: 5, scale: 2 }).default('15'),
  reorderLevel: integer("reorder_level").default(10),
  requiresPrescription: boolean("requires_prescription").default(true),
  isControlledSubstance: boolean("is_controlled_substance").default(false),
  storageInstructions: text("storage_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Stock movement types
export const stockMovementTypeEnum = pgEnum('stock_movement_type', [
  'grn', // Goods Received Note
  'grv', // Goods Return Voucher
  'ibt', // Inter-Branch Transfer
  'dispensing',
  'breakage',
  'expired',
  'adjustment'
]);

// Inventory table (current stock levels)
export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  batchNumber: varchar("batch_number"),
  quantity: integer("quantity").notNull().default(0),
  expiryDate: timestamp("expiry_date"),
  location: varchar("location"), // For multi-branch
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  updatedAt: true,
});

export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;

// Stock movements table
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  movementType: stockMovementTypeEnum("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  batchNumber: varchar("batch_number"),
  expiryDate: timestamp("expiry_date"),
  referenceNumber: varchar("reference_number"), // GRN/GRV/IBT reference
  notes: text("notes"),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;

// Prescription status enum
export const prescriptionStatusEnum = pgEnum('prescription_status', [
  'pending',
  'verified',
  'dispensed',
  'cancelled'
]);

// Prescriptions table
export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prescriptionNumber: varchar("prescription_number").unique().notNull(),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  prescriberId: varchar("prescriber_id"),
  prescriberName: varchar("prescriber_name"),
  status: prescriptionStatusEnum("status").notNull().default('pending'),
  dispensedBy: varchar("dispensed_by").references(() => users.id),
  dispensedAt: timestamp("dispensed_at"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  aiWarnings: text("ai_warnings").array(), // AI-detected interactions/warnings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;

// Prescription items table
export const prescriptionItems = pgTable("prescription_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prescriptionId: varchar("prescription_id").notNull().references(() => prescriptions.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  dosage: varchar("dosage"), // e.g., "1 tablet"
  frequency: varchar("frequency"), // e.g., "twice daily"
  duration: varchar("duration"), // e.g., "7 days"
  instructions: text("instructions"),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const insertPrescriptionItemSchema = createInsertSchema(prescriptionItems).omit({
  id: true,
});

export type InsertPrescriptionItem = z.infer<typeof insertPrescriptionItemSchema>;
export type PrescriptionItem = typeof prescriptionItems.$inferSelect;

// Audit log actions enum
export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'login',
  'logout',
  'dispense',
  'stock_movement'
]);

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: auditActionEnum("action").notNull(),
  entity: varchar("entity").notNull(), // e.g., 'prescription', 'patient', 'product'
  entityId: varchar("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

// Sale/Transaction status enum
export const saleStatusEnum = pgEnum('sale_status', [
  'pending',
  'completed',
  'refunded',
  'partially_refunded',
  'cancelled'
]);

// Sale type enum
export const saleTypeEnum = pgEnum('sale_type', [
  'prescription',  // From pharmacist prescription
  'otc',          // Over-the-counter direct sale
  'quotation'     // Quotation
]);

// Sales/Transactions table
export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleNumber: varchar("sale_number").unique().notNull(),
  saleType: saleTypeEnum("sale_type").notNull(),
  patientId: varchar("patient_id").references(() => patients.id),
  prescriptionId: varchar("prescription_id").references(() => prescriptions.id),
  cashierId: varchar("cashier_id").notNull().references(() => users.id),
  status: saleStatusEnum("status").notNull().default('pending'),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
  change: decimal("change", { precision: 10, scale: 2 }),
  notes: text("notes"),
  shiftId: varchar("shift_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

// Sale items table
export const saleItems = pgTable("sale_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull().references(() => sales.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  vatAmount: decimal("vat_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  batchNumber: varchar("batch_number"),
  expiryDate: timestamp("expiry_date"),
  instructions: text("instructions"),
});

export const insertSaleItemSchema = createInsertSchema(saleItems).omit({
  id: true,
});

export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;
export type SaleItem = typeof saleItems.$inferSelect;

// Payment method enum
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'card',
  'ecocash',
  'onemoney',
  'bank_transfer',
  'insurance'
]);

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleId: varchar("sale_id").notNull().references(() => sales.id),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reference: varchar("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Return status enum
export const returnStatusEnum = pgEnum('return_status', [
  'pending',
  'approved',
  'rejected',
  'completed'
]);

// Returns table
export const returns = pgTable("returns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  returnNumber: varchar("return_number").unique().notNull(),
  saleId: varchar("sale_id").notNull().references(() => sales.id),
  customerId: varchar("customer_id").references(() => patients.id),
  returnedBy: varchar("returned_by").notNull().references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  status: returnStatusEnum("status").notNull().default('pending'),
  reason: text("reason"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundMethod: paymentMethodEnum("refund_method"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReturnSchema = createInsertSchema(returns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReturn = z.infer<typeof insertReturnSchema>;
export type Return = typeof returns.$inferSelect;

// Return items table
export const returnItems = pgTable("return_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  returnId: varchar("return_id").notNull().references(() => returns.id),
  saleItemId: varchar("sale_item_id").notNull().references(() => saleItems.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantityReturned: integer("quantity_returned").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
});

export const insertReturnItemSchema = createInsertSchema(returnItems).omit({
  id: true,
});

export type InsertReturnItem = z.infer<typeof insertReturnItemSchema>;
export type ReturnItem = typeof returnItems.$inferSelect;

// Drug short codes table (for quick access keys F1-F12, etc.)
export const drugShortCodes = pgTable("drug_short_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyCode: varchar("key_code").unique().notNull(), // e.g., "F1", "F2", etc.
  productId: varchar("product_id").notNull().references(() => products.id),
  userId: varchar("user_id").references(() => users.id), // If user-specific, null for global
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDrugShortCodeSchema = createInsertSchema(drugShortCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDrugShortCode = z.infer<typeof insertDrugShortCodeSchema>;
export type DrugShortCode = typeof drugShortCodes.$inferSelect;

// Quotations table
export const quotations = pgTable("quotations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationNumber: varchar("quotation_number").unique().notNull(),
  customerId: varchar("customer_id").references(() => patients.id),
  customerName: varchar("customer_name"),
  customerPhone: varchar("customer_phone"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until"),
  notes: text("notes"),
  status: varchar("status").default('active'), // active, expired, converted
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
});

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;

// Quotation items table
export const quotationItems = pgTable("quotation_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: varchar("quotation_id").notNull().references(() => quotations.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({
  id: true,
});

export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type QuotationItem = typeof quotationItems.$inferSelect;

// Shift status enum
export const shiftStatusEnum = pgEnum('shift_status', [
  'open',
  'closed',
  'reconciled'
]);

// Shifts table (for cash management and reconciliation)
export const shifts = pgTable("shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shiftNumber: varchar("shift_number").unique().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: shiftStatusEnum("status").notNull().default('open'),
  openingCash: decimal("opening_cash", { precision: 10, scale: 2 }).notNull(),
  closingCash: decimal("closing_cash", { precision: 10, scale: 2 }),
  expectedCash: decimal("expected_cash", { precision: 10, scale: 2 }),
  cashVariance: decimal("cash_variance", { precision: 10, scale: 2 }),
  totalSales: decimal("total_sales", { precision: 10, scale: 2 }),
  totalCashSales: decimal("total_cash_sales", { precision: 10, scale: 2 }),
  totalCardSales: decimal("total_card_sales", { precision: 10, scale: 2 }),
  totalMobileMoneySales: decimal("total_mobile_money_sales", { precision: 10, scale: 2 }),
  notes: text("notes"),
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
  openedAt: true,
});

export type InsertShift = z.infer<typeof insertShiftSchema>;
export type Shift = typeof shifts.$inferSelect;
