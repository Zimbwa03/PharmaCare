# Replit Agent Prompt: Pharma Care - AI-Powered Pharmacy Management System

## Project Title

**Pharma Care: An AI-Powered Pharmacy Management System for Zimbabwe**

## Project Goal

Develop a comprehensive, modern, and AI-powered pharmacy management system named "Pharma Care." This system aims to significantly advance beyond existing solutions like DispenseWare, specifically tailored to meet the unique needs and regulatory environment of pharmacies in Zimbabwe. The primary objective is to create a highly efficient, intelligent, and compliant platform that streamlines pharmacy operations, enhances patient care, and provides robust data analytics.

## Target Audience

Pharmacies operating within Zimbabwe, ranging from small independent pharmacies to larger chains.

## Key Differentiators & Value Proposition

Pharma Care will distinguish itself through:

*   **AI-Powered Intelligence:** Integration of artificial intelligence for advanced stock management, predictive analytics, personalized patient insights, and enhanced decision-making.
*   **Comprehensive Feature Set:** A holistic suite of modules covering all aspects of pharmacy operations, from patient management and dispensing to inventory, reporting, and regulatory compliance.
*   **Zimbabwean Regulatory Compliance:** Strict adherence to the Medicines and Allied Substances Control Act [Chapter 15:03] and its associated regulations, ensuring legal and ethical operation within the Zimbabwean context.
*   **Modern User Experience:** Intuitive, user-friendly interfaces designed for efficiency and ease of use by pharmacists, technicians, and administrative staff.
*   **Scalable & Robust Backend:** Leveraging Supabase for a powerful, secure, and scalable backend infrastructure.

## Technical Stack

*   **Backend:** Supabase (PostgreSQL Database, Authentication, Realtime Subscriptions, Storage, Edge Functions, API Generation)
*   **Frontend:** (To be determined by Replit Agent, but anticipate a modern web framework like React, Vue, or Angular for a rich, interactive user interface.)
*   **AI/ML Integration:** Python-based libraries (e.g., TensorFlow, PyTorch, scikit-learn) for AI models, potentially deployed as Supabase Edge Functions or external microservices.

## Core Modules and Features

Pharma Care will include the following modules, with a strong emphasis on AI integration and compliance:

### 1. Patient Management

*   **Patient Registration & Profiles:**
    *   Comprehensive demographic data capture (name, contact, address, national ID).
    *   Detailed medical history (allergies, chronic conditions, past medications, family history).
    *   Insurance information management.
    *   Support for main members and dependents with clear relationship tracking.
    *   **AI Feature:** Flagging potential risks or missing critical information during registration based on patterns.
*   **Patient Engagement & Communication:**
    *   Integrated patient portal/mobile app for refill requests, medication history viewing, and appointment scheduling.
    *   Automated SMS/email notifications for refill reminders, pickup alerts, and health tips.
    *   **AI Feature:** Personalized medication adherence programs and health recommendations based on patient profiles and historical data.

### 2. Dispensing & Prescription Management

*   **Prescription Intake & Verification:**
    *   Support for electronic prescriptions (e-prescriptions) from healthcare providers.
    *   Manual prescription entry with OCR capabilities for scanned prescriptions (AI-enhanced).
    *   Automated verification of prescription validity (dosage, frequency, prescriber details) against regulatory guidelines and drug databases.
    *   **AI Feature:** Real-time drug-drug interaction checks, drug-allergy checks, and contraindication alerts based on patient history.
    *   **AI Feature:** Suggestions for generic alternatives or therapeutic equivalents where appropriate and compliant.
*   **Dispensing Workflow:**
    *   Customizable workflow stages (e.g., received, verified, filled, checked, dispensed).
    *   Task assignment and tracking for pharmacists and technicians.
    *   Pharmacist verification queues.
    *   **AI Feature:** Prioritization of urgent prescriptions and workload balancing suggestions for staff.
*   **Labeling & Packaging:**
    *   Automated generation of compliant prescription labels with patient name, drug name, dosage, instructions, warnings, and pharmacy details.
    *   Integration with automated dispensing and packaging systems (if applicable).
    *   Support for custom instructions and patient-specific notes.

### 3. Inventory & Supply Chain Management

*   **Real-time Inventory Tracking:**
    *   Barcode and RFID integration for accurate tracking of all stock items.
    *   Tracking of stock movements: receiving, dispensing, returns, inter-branch transfers, breakages, expired goods.
    *   Multi-location inventory management (for pharmacies with multiple branches).
*   **Demand Forecasting & Stock Optimization:**
    *   **AI Feature:** Predictive analytics based on historical sales, seasonal trends, local disease patterns, and supplier lead times to forecast demand.
    *   **AI Feature:** Automated reorder point and quantity suggestions to minimize stockouts and reduce carrying costs.
    *   Automated generation of purchase orders based on optimized stock levels.
*   **Expiry Date Management:**
    *   Automated tracking of expiry dates for all medications.
    *   Proactive alerts and notifications for soon-to-expire stock, facilitating timely rotation or disposal.
    *   **AI Feature:** Predictive analysis of potential waste due to expiry.
*   **Supplier Management:**
    *   Database of suppliers with contact information, pricing, and order history.
    *   Automated communication with suppliers for order placement and tracking.
*   **Cold Chain Management:**
    *   Monitoring and logging of temperature for temperature-sensitive medications.
    *   Alerts for temperature excursions to ensure product integrity and regulatory compliance.

### 4. Reporting & Analytics

*   **Comprehensive Dashboards:**
    *   Real-time dashboards for key performance indicators (KPIs) such as sales, inventory turnover, prescription volume, and staff productivity.
    *   Customizable reports for various operational and financial aspects.
*   **Regulatory Compliance Reporting:**
    *   Automated generation of reports required by the Medicines Control Authority of Zimbabwe (MCAZ), including dispensing records, controlled substance logs, and stock audits.
    *   Ensuring all reports meet the format and content requirements specified by Zimbabwean regulations.
*   **Financial Reporting:**
    *   Sales reports (daily, weekly, monthly, yearly).
    *   Profit and loss statements.
    *   Integration with accounting software for seamless financial reconciliation.
*   **AI-Powered Insights:**
    *   **AI Feature:** Predictive sales trends and revenue forecasting.
    *   **AI Feature:** Identification of patient adherence risks and intervention opportunities.
    *   **AI Feature:** Optimization recommendations for pricing and promotions.

### 5. Regulatory Compliance & Security

*   **Zimbabwean Legal Framework Integration:**
    *   Built-in rules and checks derived from the Medicines and Allied Substances Control Act [Chapter 15:03] and its regulations (e.g., dispensing limits, controlled substance handling, advertising restrictions).
    *   Digital record-keeping compliant with MCAZ requirements.
*   **Data Security & Privacy:**
    *   End-to-end encryption for data in transit and at rest.
    *   Role-based access control (RBAC) to ensure staff only access necessary information.
    *   Comprehensive audit trails and logging of all system activities.
    *   Compliance with general data protection principles.
*   **User Authentication:** Secure login mechanisms, multi-factor authentication (MFA).

### 6. Staff Management & Communication

*   **User Accounts & Roles:**
    *   Creation and management of staff accounts with defined roles (e.g., Pharmacist, Pharmacy Technician, Administrator, Store Manager).
    *   Granular permissions tied to each role.
*   **Internal Communication:**
    *   Secure in-system messaging for staff collaboration.
    *   Task management and assignment features.
*   **Training & Knowledge Base:**
    *   Access to internal training materials and regulatory updates.

## Workflow (Building upon DispenseWare structure)

The system will follow a logical workflow, enhancing the DispenseWare model with automation and intelligence:

1.  **System Setup & Configuration:**
    *   Define departments, categories, suppliers, manufacturers, and drug forms.
    *   Configure regulatory parameters and compliance rules specific to Zimbabwe.
2.  **Product Creation & Management:**
    *   Register new products (drugs) with unique IDs, pack sizes, strength, markup, and VAT codes.
    *   **AI Feature:** Suggest optimal initial pricing and stock levels based on market data and similar products.
3.  **Stock Operations:**
    *   **Receiving Stock (GRN):** Record incoming stock from suppliers. **AI Feature:** Automated verification against purchase orders, flagging discrepancies.
    *   **Returning Stock (GRV):** Process returns to suppliers.
    *   **Inter-Branch Transfers (IBT):** Manage stock movement between pharmacy branches.
    *   **Breakages & Expired Drugs:** Record and manage disposal of damaged or expired stock, with automated inventory adjustments.
    *   **Stocktake & Cycle Counts:** Tools for physical inventory verification and adjustments. **AI Feature:** Identify discrepancies and suggest root causes.
4.  **Patient & Prescription Workflow:**
    *   **Patient Search/Selection:** Identify existing patients or register new ones.
    *   **Prescription Entry/Reception:** Receive e-prescriptions or manually enter details.
    *   **AI-Powered Verification:** System automatically checks for drug interactions, allergies, and regulatory compliance.
    *   **Drug Selection & Dispensing:** Pharmacist selects drugs, enters quantity, dosage instructions, and repeats. **AI Feature:** Suggest optimal dosage based on patient profile and drug guidelines.
    *   **Label Printing:** Generate compliant labels.
    *   **Save Prescription:** Record the completed prescription, updating patient history and stock levels.
5.  **Point of Sale (POS) Integration:**
    *   Seamless transfer of dispensed prescriptions to a dedicated POS module (or integrated third-party POS) for payment processing.
6.  **Script Maintenance:**
    *   Edit, delete, or resume script lines (with appropriate audit trails and restrictions).
    *   Add new drugs to existing scripts (within regulatory limits).
7.  **Reporting & Analytics:**
    *   Access to various reports (Dispensing, Stocks, Stocktake, Medical Aid, Sales, Financial).
    *   Interactive dashboards for real-time insights.
    *   **AI Feature:** Generate predictive reports and actionable insights for business optimization.

## Implementation Notes for Replit Agent

*   **Modular Development:** The system should be built with a modular approach, allowing for independent development and deployment of components.
*   **API-First Design:** All frontend-backend communication should be via well-defined APIs, leveraging Supabase's auto-generated APIs where possible.
*   **Database Schema:** Design a robust PostgreSQL schema within Supabase to support all data requirements, including patient records, drug inventory, prescriptions, transactions, and audit logs.
*   **Authentication & Authorization:** Implement Supabase's authentication for user management and Row Level Security (RLS) for fine-grained access control.
*   **Realtime Functionality:** Utilize Supabase Realtime for instant updates in inventory, prescription status, and notifications.
*   **Scalability:** Consider scalability from the outset, given the potential for growth in pharmacy operations.
*   **Testing:** Implement comprehensive unit and integration tests for all modules.
*   **Documentation:** Provide clear and concise documentation for the codebase, API endpoints, and deployment process.

This detailed prompt should guide the Replit Agent in developing a robust, intelligent, and compliant Pharma Care system.
