# Pharma Care - AI-Powered Pharmacy Management System

## Overview
Pharma Care is a comprehensive pharmacy management system designed specifically for pharmacies in Zimbabwe. The system integrates AI-powered drug interaction checking, intelligent inventory management, and MCAZ (Medicines Control Authority of Zimbabwe) regulatory compliance features.

## Project Status
**Current State:** Full-stack application with complete database schema, frontend components, backend API, and AI integration

**Last Updated:** October 13, 2025

## Technology Stack

### Frontend
- **Framework:** React with TypeScript
- **Routing:** Wouter
- **UI Components:** Shadcn UI with Tailwind CSS
- **State Management:** TanStack Query (React Query v5)
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js with Express
- **Language:** TypeScript
- **ORM:** Drizzle ORM
- **Database:** Supabase PostgreSQL (postgres-js driver)
- **Authentication:** Replit Auth (OIDC)
- **Session Storage:** PostgreSQL with connect-pg-simple

### AI Services
- **Drug Interactions:** DeepSeek API (DEEPSEEK_API_KEY)
- **Demand Forecasting:** Google Gemini API (GEMINI_API_KEY)

## Architecture

### Database Schema
The system uses PostgreSQL with the following main tables:
- `users` - User accounts with role-based access (Administrator, Pharmacist, Technician, Store Manager)
- `patients` - Patient profiles with medical history, allergies, chronic conditions
- `suppliers` - Supplier information
- `manufacturers` - Drug manufacturer details
- `products` - Drug/medication catalog
- `inventory` - Current stock levels by batch
- `stock_movements` - Audit trail of all stock operations (GRN, GRV, IBT)
- `prescriptions` - Prescription records
- `prescription_items` - Individual items in prescriptions
- `audit_logs` - System activity audit trail
- `sessions` - Secure session storage for authentication

### Key Features

#### 1. Patient Management
- Comprehensive patient profiles
- Medical history tracking
- Allergy and chronic condition management
- Insurance information

#### 2. AI-Powered Prescriptions
- Real-time drug interaction checking using DeepSeek AI
- Automatic allergy cross-checking
- Contraindication warnings for chronic conditions
- Multi-drug interaction analysis

#### 3. Intelligent Inventory
- Batch-level stock tracking
- Automated reorder level alerts
- Expiry date management (30-day warning system)
- Stock movement tracking (GRN, GRV, IBT)

#### 4. MCAZ Compliance
- Controlled substance tracking
- Prescription-only medication enforcement
- Comprehensive audit logging
- Regulatory reporting capabilities

#### 5. Analytics & Forecasting
- AI-powered demand forecasting using Gemini
- Sales trend analysis
- Stock optimization recommendations
- Patient adherence risk identification

## Design System

### Color Scheme
- **Primary:** Professional Blue (#3B82F6 / hsl(217, 91%, 60%))
- **Background:** White (#FFFFFF)
- **Foreground:** Dark Gray for text
- **Accent:** Light Blue variants for highlights

### Design Principles
- Clean, modern healthcare-focused UI
- Material Design 3 adapted for enterprise healthcare
- High contrast for accessibility
- Consistent spacing and typography
- Mobile-responsive design

## User Roles & Permissions

### Administrator
- Full system access
- User management
- System settings
- All operational functions

### Pharmacist
- Patient management
- Prescription processing
- Drug dispensing
- Clinical decision support

### Technician
- Stock management
- Inventory operations
- Prescription preparation support

### Store Manager
- Inventory management
- Reporting and analytics
- Supplier relations

## Environment Variables

### Required
- `DATABASE_URL` - Supabase PostgreSQL connection string (Transaction Pooler)
- `SESSION_SECRET` - Session encryption secret
- `REPLIT_DOMAINS` - Replit deployment domains
- `REPL_ID` - Replit app ID for OIDC

### Optional AI Services
- `DEEPSEEK_API_KEY` - For advanced drug interaction analysis
- `GEMINI_API_KEY` - For demand forecasting and analytics

## API Endpoints

### Authentication
- `GET /api/login` - Initiate Replit Auth login
- `GET /api/callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `GET /api/logout` - Logout

### Core Resources
- `GET/POST /api/patients` - Patient operations
- `GET/POST /api/products` - Product/drug catalog
- `GET /api/inventory` - Inventory levels
- `GET/POST /api/prescriptions` - Prescription management
- `POST /api/prescriptions/check-interactions` - AI drug interaction check
- `POST /api/stock-movements` - Stock operations (GRN/GRV/IBT)
- `GET /api/suppliers` - Supplier list
- `GET /api/manufacturers` - Manufacturer list
- `GET /api/users` - User management
- `GET /api/dashboard/stats` - Dashboard statistics

## Development Workflow

### Running the Application
```bash
npm run dev
```
The app runs on port 5000 (both frontend and backend).

### Database Operations
```bash
# Push schema changes to database
npm run db:push

# Force push (use when schema changes cause conflicts)
npm run db:push --force
```

### Sample Data
The database includes sample data:
- 2 Suppliers (Zimbabwe-based)
- 4 Manufacturers (local and international)
- 5 Common medications
- 4 Sample patients
- Initial inventory levels

## Recent Changes
- **2025-10-19:** GitHub import setup in Replit environment
  - Switched database driver from @neondatabase/serverless to postgres-js for Supabase compatibility
  - Installed dependencies and configured development workflow
  - Configured deployment settings for autoscale
  - Verified application runs successfully with Supabase PostgreSQL
- **2025-10-13:** System fully implemented and production-ready
  - Full database schema with all 11 tables
  - Complete frontend with all main pages and sidebar navigation
  - Backend API with Replit Auth (OIDC) authentication
  - **Role-Based Access Control (RBAC)** - All routes protected with appropriate role restrictions
  - **Audit Logging** - Full MCAZ compliance with controlled substance tracking
  - **AI Integration** - DeepSeek for drug interactions, Gemini for demand forecasting
  - **Controlled Substance Validation** - Prescription requirements enforced with audit logging
  - Sample data populated for testing
  - All critical bugs fixed and system tested

## File Structure
```
client/
  src/
    components/     # Reusable UI components and forms
    pages/         # Main application pages
    hooks/         # Custom React hooks (useAuth)
    lib/           # Utilities and query client
server/
  db.ts           # Database connection
  storage.ts      # Data access layer
  routes.ts       # API routes
  replitAuth.ts   # Authentication middleware
  ai-services.ts  # AI integration (DeepSeek, Gemini)
shared/
  schema.ts       # Shared database schema and types
```

## User Preferences
- Use DeepSeek for drug interactions (NOT OpenAI)
- Use Gemini for analytics and forecasting
- Color scheme: White background with professional blue accent
- Database: Supabase PostgreSQL (postgres-js driver, NOT Neon)
- Authentication: Replit Auth (OIDC)

## System Status
✅ **Production Ready** - All core features implemented and tested
- Authentication and authorization fully functional
- Role-based access control enforced on all routes
- Audit logging operational for MCAZ compliance
- AI services integrated (DeepSeek & Gemini)
- Controlled substance tracking implemented
- Sample data available for testing

## Known Issues
None - All critical issues resolved

## Completed Features
- ✅ User authentication (Replit Auth OIDC)
- ✅ Role-based access control (4 roles: Administrator, Pharmacist, Technician, Store Manager)
- ✅ Patient management with medical history
- ✅ AI-powered prescription processing (DeepSeek drug interactions)
- ✅ Intelligent inventory management
- ✅ Controlled substance tracking and audit logging
- ✅ Stock movement tracking (GRN, GRV, IBT)
- ✅ AI demand forecasting (Gemini)
- ✅ Dashboard with real-time statistics
- ✅ Sample data for testing

## Future Enhancements
- [ ] Report generation (PDF export)
- [ ] User role management UI in settings
- [ ] Batch prescription dispensing
- [ ] SMS notifications for prescription readiness
- [ ] Advanced audit log viewer with filters
- [ ] Data export for MCAZ reporting
- [ ] Prescription barcode printing
