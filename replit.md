# Pharma Care - AI-Powered Pharmacy Management System

## Overview

Pharma Care is a comprehensive pharmacy management system designed specifically for pharmacies in Zimbabwe. The application provides end-to-end pharmacy operations management including patient records, prescription processing, inventory control, stock operations, and regulatory compliance reporting. It integrates AI-powered features for drug interaction checking and demand forecasting, while maintaining strict compliance with Zimbabwe's Medicines Control Authority (MCAZ) regulations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

The system follows a monorepo architecture with clear separation between frontend and backend:

- **Frontend**: Located in `/client` directory, built with React and TypeScript
- **Backend**: Located in `/server` directory, built with Express and TypeScript  
- **Shared**: Common schemas and types in `/shared` directory for type safety across the stack

**Rationale**: This structure enables code sharing between frontend and backend while maintaining clear boundaries. The shared schema ensures consistency in data validation and type definitions across the entire application.

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: Shadcn UI components built on Radix UI primitives with Tailwind CSS for styling. The design follows Material Design 3 principles adapted for healthcare enterprise use.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**State Management**: TanStack Query (React Query v5) handles all server state, caching, and data synchronization. No additional global state management library is used.

**Form Management**: React Hook Form with Zod schema validation for type-safe form handling

**Design System**: Custom healthcare-focused design with specific color palettes for light/dark modes optimized for medical contexts. Emphasizes safety, information hierarchy, and accessibility (WCAG 2.1 AA compliance).

**Rationale**: This stack prioritizes type safety, performance, and developer experience. Shadcn UI provides accessible, customizable components without the bundle size overhead of traditional component libraries. TanStack Query eliminates the need for separate state management while providing excellent caching and synchronization capabilities.

### Backend Architecture

**Runtime & Framework**: Node.js with Express server

**Database ORM**: Drizzle ORM for type-safe database operations

**API Design**: RESTful API with JSON request/response format

**Authentication**: Custom email/password authentication with bcrypt for secure password hashing

**Session Management**: Memory-based sessions using express-session with memorystore (development)

**Rationale**: Express provides a minimal, flexible foundation. Drizzle ORM offers excellent TypeScript integration and performance while staying close to SQL. Custom authentication provides full control over user management and security.

### Data Storage

**Primary Database**: PostgreSQL accessed through Supabase

**Database Driver**: postgres-js for connection pooling and performance

**Schema Management**: Drizzle Kit for migrations and schema versioning

**Key Tables**:
- `users` - User accounts with role-based access
- `patients` - Patient profiles with medical history, allergies, chronic conditions
- `products` - Drug/medication catalog with detailed specifications
- `inventory` - Stock levels tracked by batch and expiry date
- `prescriptions` & `prescription_items` - Prescription records and line items
- `stock_movements` - Audit trail for all inventory operations (GRN, GRV, IBT)
- `suppliers` & `manufacturers` - Supplier and manufacturer master data
- `audit_logs` - System activity audit trail
- `sessions` - Secure session storage for authentication

**Rationale**: PostgreSQL provides robust ACID guarantees essential for pharmacy operations. The schema design supports complex business logic including batch tracking, expiry management, and comprehensive audit trails required for regulatory compliance.

### AI Integration

**Drug Interaction Checking**: Custom implementation using patient allergies and chronic conditions cross-referenced against medication data. Currently uses rule-based logic with placeholders for DeepSeek API integration.

**Demand Forecasting**: Designed to use Google Gemini API for predictive analytics based on historical sales, seasonal trends, and local disease patterns.

**API Keys Required**:
- `DEEPSEEK_API_KEY` - For advanced drug interaction analysis
- `GEMINI_API_KEY` - For AI-powered demand forecasting

**Rationale**: Starting with rule-based interaction checking provides immediate value while the AI integration can be enhanced incrementally. The architecture separates AI services into dedicated modules (`server/ai-services.ts`) for easy testing and replacement.

### Authentication & Authorization

**Authentication Provider**: Custom email/password authentication with bcrypt password hashing

**Session Storage**: Memory-based sessions using express-session with memorystore (development), upgradable to PostgreSQL-backed sessions for production

**Authorization Model**: Role-based access control with three role levels:
- Administrator (full system access + user management)
- Pharmacist (clinical operations + prescriptions)
- Receptionist (patient registration + basic operations)

**User Registration**:
- First admin created via `/create-admin` signup page (email, password, phone, pharmacy branch)
- Additional users (Pharmacist, Receptionist) created by Administrators through Settings
- Email verification system with verification tokens (placeholder implementation)

**Security Features**:
- bcrypt password hashing with salt rounds
- HTTPS-only cookies with httpOnly flag
- Session expiration (7-day TTL)
- Protected routes with `requireAuth()` and `requireRole()` middleware
- Both `req.user` and `req.dbUser` set for compatibility with existing routes
- Audit logging of all critical operations

**Rationale**: Custom authentication provides full control over user management and eliminates third-party dependencies. bcrypt ensures secure password storage. Memory-based sessions work well for development and can be upgraded to PostgreSQL-backed sessions for production scalability. Role-based access ensures proper separation of duties for regulatory compliance.

### Type Safety & Validation

**Schema Definition**: Single source of truth in `/shared/schema.ts` using Drizzle ORM

**Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod

**Type Flow**: Database types → API contracts → Frontend forms with full TypeScript inference

**Rationale**: This approach eliminates type drift between layers. Changes to database schema automatically propagate through the validation layer to the frontend, reducing runtime errors and improving developer productivity.

### Build & Deployment

**Development**: 
- Vite dev server for frontend with HMR
- tsx for running TypeScript backend directly
- Concurrent development with proxy setup

**Production Build**:
- Vite builds frontend to `/dist/public`
- esbuild bundles backend to `/dist`
- Single production server serves both static assets and API

**Environment Variables Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key (required for secure session management)
- `DEEPSEEK_API_KEY` - Optional AI service key
- `GEMINI_API_KEY` - Optional AI service key

**Rationale**: This setup optimizes for development speed while producing an efficient production bundle. The single-server architecture simplifies deployment and reduces infrastructure complexity.

## External Dependencies

### Third-Party Services

**Supabase**: PostgreSQL database hosting and management
- Used for: Primary data storage
- Connection: Standard PostgreSQL connection string via `DATABASE_URL`

**DeepSeek API**: AI service for drug interaction analysis (planned integration)
- Used for: Advanced drug interaction checking and clinical decision support
- Configuration: Via `DEEPSEEK_API_KEY` environment variable

**Google Gemini API**: AI service for predictive analytics (planned integration)
- Used for: Demand forecasting and inventory optimization
- Configuration: Via `GEMINI_API_KEY` environment variable

### UI Component Libraries

**Radix UI**: Unstyled, accessible UI primitives for React
- Components used: Dialog, Dropdown Menu, Select, Tabs, Toast, Tooltip, and 20+ others
- Rationale: Provides accessible foundation without styling constraints

**Shadcn UI**: Pre-styled component patterns built on Radix UI
- Customization: Components copied into project for full control
- Rationale: Best practices for accessibility and UX without library lock-in

### Utility Libraries

**TanStack Query**: Data synchronization and caching
**React Hook Form**: Form state management
**Zod**: Schema validation
**date-fns**: Date manipulation
**Tailwind CSS**: Utility-first CSS framework
**Recharts**: Charting library for analytics dashboards

### Development Tools

**TypeScript**: Type safety across the stack
**Vite**: Frontend build tool and dev server
**esbuild**: Backend bundler for production
**Drizzle Kit**: Database migration tool
**tsx**: TypeScript execution for development