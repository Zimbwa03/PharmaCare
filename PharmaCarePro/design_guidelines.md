# Pharma Care Design Guidelines

## Design Approach: Enterprise Healthcare Design System

**Selected Approach**: Design System-Based (Material Design 3 adapted for healthcare enterprise)

**Justification**: Pharma Care is a utility-focused, data-intensive healthcare application where efficiency, accuracy, and regulatory compliance are paramount. The system prioritizes:
- Information clarity over visual experimentation
- Consistent patterns for rapid task completion
- Accessibility and error prevention in medical contexts
- Professional trustworthiness appropriate for healthcare
- Stable, learnable interfaces for diverse user skill levels

## Core Design Principles

1. **Safety First**: Critical actions (dispensing, patient alerts) use high-contrast warning colors
2. **Information Hierarchy**: Dense data organized through clear visual weight and spacing
3. **Efficiency**: Minimize clicks, maximize scannable information density
4. **Accessibility**: WCAG 2.1 AA compliance minimum, support for screen readers
5. **Professional Trust**: Clean, medical-grade aesthetic without unnecessary decoration

## Color Palette

### Light Mode
- **Primary**: 200 80% 45% (Deep medical blue - trust, professionalism)
- **Primary Variant**: 200 70% 35% (Darker blue for emphasis)
- **Secondary**: 160 45% 50% (Teal - healthcare association, calmness)
- **Background**: 0 0% 98% (Off-white, reduces eye strain)
- **Surface**: 0 0% 100% (Pure white cards/panels)
- **Error/Alert**: 0 85% 60% (Critical warnings, drug interactions)
- **Warning**: 35 100% 50% (Expiry alerts, caution states)
- **Success**: 145 65% 45% (Completed actions, stock adequate)
- **Text Primary**: 220 20% 15% (High contrast readable text)
- **Text Secondary**: 220 15% 45% (Supporting information)

### Dark Mode
- **Primary**: 200 75% 55% (Brighter blue for dark backgrounds)
- **Primary Variant**: 200 80% 65%
- **Secondary**: 160 40% 55%
- **Background**: 220 15% 12% (Deep blue-gray)
- **Surface**: 220 12% 16% (Elevated cards)
- **Surface Variant**: 220 10% 20% (Nested panels)
- **Error/Alert**: 0 75% 65%
- **Warning**: 35 90% 60%
- **Success**: 145 55% 55%
- **Text Primary**: 0 0% 95%
- **Text Secondary**: 220 10% 70%

## Typography

**Font Families**:
- **Primary (Interface)**: Inter (Google Fonts) - Excellent readability for data-dense interfaces
- **Monospace (Data/Codes)**: JetBrains Mono (Google Fonts) - For prescription codes, batch numbers, IDs

**Type Scale**:
- **Display (Dashboard Headers)**: text-3xl font-semibold (30px)
- **Heading 1 (Module Titles)**: text-2xl font-semibold (24px)
- **Heading 2 (Section Headers)**: text-xl font-semibold (20px)
- **Heading 3 (Card Titles)**: text-lg font-medium (18px)
- **Body (Default)**: text-base font-normal (16px)
- **Body Small (Labels)**: text-sm font-normal (14px)
- **Caption (Metadata)**: text-xs font-normal (12px)
- **Code/Data**: font-mono text-sm (14px monospace)

**Line Heights**: Use relaxed leading (leading-relaxed) for body text to improve readability in dense interfaces

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8
- Card gaps: gap-4, gap-6
- Icon-text pairing: gap-2, gap-3

**Grid System**:
- **Dashboard**: 12-column grid with responsive breakpoints
- **Forms**: 2-column layout on desktop (lg:grid-cols-2), single column mobile
- **Data Tables**: Full-width with horizontal scroll on mobile
- **Sidebar Navigation**: Fixed 240px on desktop, collapsible to 64px icon-only, drawer on mobile

**Container Max-Widths**:
- Dashboard content: max-w-7xl mx-auto
- Forms: max-w-4xl
- Modal dialogs: max-w-2xl
- Narrow content (settings): max-w-3xl

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo, global search, notifications, user menu (h-16, shadow-sm)
- **Sidebar**: Collapsible navigation with icons and labels, active state with primary color left border (border-l-4)
- **Breadcrumbs**: Show hierarchy with chevron separators for deep navigation

### Data Display
- **Tables**: Striped rows (odd:bg-surface), sticky headers, row hover states, sortable columns with arrow indicators
- **Cards**: Elevated surface (shadow-md), rounded corners (rounded-lg), organized sections with dividers
- **Stats Cards**: Large number display, trend indicators (up/down arrows), sparkline charts
- **List Items**: Checkbox selection, avatar/icon prefix, metadata suffix, hover elevation

### Forms & Inputs
- **Text Inputs**: Outlined style with floating labels, clear error states (red border + helper text), consistent height (h-12)
- **Select Dropdowns**: Searchable for drug databases, multi-select for allergies, clear selected state
- **Date/Time Pickers**: Calendar overlay, time selection for prescriptions
- **Autocomplete**: Drug name search with debounce, highlighted matching text
- **File Upload**: Drag-and-drop area for prescription scans, preview thumbnails

### Actions
- **Primary Buttons**: Solid fill primary color, medium size (px-6 py-3), rounded-md
- **Secondary Buttons**: Outlined with hover fill, same sizing
- **Danger Buttons**: Red fill for delete/critical actions, confirmation dialogs required
- **Icon Buttons**: 40x40px touch targets, subtle hover background
- **Floating Action Button (FAB)**: Primary action (New Prescription), bottom-right position

### Feedback
- **Alerts**: Color-coded banners (info/warning/error/success), dismissible, icon prefixes
- **Toasts**: Bottom-right notifications, auto-dismiss in 4-6 seconds, action buttons for undo
- **Modals**: Centered overlay with backdrop blur, clear header/body/footer structure, escape to close
- **Progress Indicators**: Linear for processes, circular for loading states, determinate when possible
- **Badges**: Small count indicators (notifications, pending scripts), status pills (Active/Expired)

### Specialized Components
- **Patient Card**: Avatar, name prominently, allergies in red badges, quick-access buttons
- **Prescription Form**: Multi-step wizard, drug search autocomplete, dosage calculator, interaction warnings panel
- **Inventory Widget**: Stock level bar chart, color-coded (green/yellow/red), expiry countdown
- **Dashboard Charts**: Line graphs for sales trends, bar charts for product performance, donut charts for category breakdown

## Visual Treatments

**Elevation**: 
- Base level: shadow-sm (subtle card separation)
- Elevated: shadow-md (modals, dropdowns)
- Floating: shadow-lg (FAB, tooltips)

**Borders**:
- Subtle dividers: border-gray-200 (light) / border-gray-700 (dark)
- Input focus: 2px primary color ring (ring-2 ring-primary)

**States**:
- Hover: Slight background tint, elevation increase
- Active: Primary color background or border
- Disabled: 50% opacity, cursor-not-allowed
- Focus: Visible ring outline for keyboard navigation

## Animations (Minimal)

- **Page Transitions**: None (instant for productivity)
- **Micro-interactions**: 150ms ease-in-out for hover states, button presses
- **Loading States**: Skeleton screens with subtle pulse, spinners for async actions
- **Alerts/Toasts**: Slide-in from position (200ms), fade-out on dismiss
- **Avoid**: Parallax, scroll-triggered animations, decorative motion

## Dashboard Layout Structure

**Main Dashboard**:
- KPI cards row (4 columns): Total Sales, Prescriptions Today, Low Stock Items, Expiring Soon
- Charts section (2 columns): Sales trend line chart, Top products bar chart
- Recent activity feed (1 column): Latest prescriptions, stock movements
- Quick actions: Floating buttons for New Patient, New Prescription

**Module Pages** (Inventory, Patients, Prescriptions, Reports):
- Filter toolbar at top (search, date range, status filters)
- Data table or card grid as main content
- Pagination controls at bottom
- Action buttons in table rows or card overlays

## Accessibility Requirements

- All interactive elements minimum 44x44px touch targets
- Form labels always visible (no placeholder-only inputs)
- Error messages linked to inputs via aria-describedby
- Color never sole indicator (use icons + text)
- Skip navigation link for keyboard users
- Sufficient color contrast ratios (4.5:1 minimum for text)
- Focus visible on all interactive elements
- Screen reader announcements for dynamic content updates