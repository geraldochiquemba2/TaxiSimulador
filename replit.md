# Taxi Price Simulator

## Overview

A web-based taxi price simulator that allows users to explore how different factors affect ride pricing in real-time. Users can adjust parameters like distance, time of day, weather conditions, traffic intensity, and special events to see immediate price calculations and breakdowns. The application provides visual comparisons across scenarios and detailed cost breakdowns to understand the impact of each pricing factor.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing

**UI Component Strategy:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles enhanced with ride-sharing app patterns (Uber, Lyft visual language)
- Responsive design with mobile-first approach (768px breakpoint)

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Local component state for UI interactions
- Real-time reactive updates when simulation parameters change

**Data Visualization:**
- Recharts library for price comparison charts and breakdowns
- Custom Progress components for impact visualization
- Color-coded badges for visual impact indicators (low/medium/high)

**Design System:**
- Custom color palette using HSL color space with CSS variables
- Consistent spacing using Tailwind units (2, 4, 6, 8)
- Typography hierarchy: Inter font family with weight variations (400-900)
- Two-column desktop layout (40% controls, 60% results), single column mobile stack

### Backend Architecture

**Server Framework:**
- Express.js HTTP server with TypeScript
- Custom middleware for request logging and JSON parsing
- Vite middleware integration for development hot-reload

**API Design:**
- RESTful endpoint pattern (`/api/calculate-price`)
- POST-based price calculation with JSON request/response
- Zod schema validation for request parameters
- In-memory calculation engine (stateless)

**Price Calculation Engine:**
- Base fare system with vehicle type multipliers (economy, comfort, premium, xl)
- Per-kilometer pricing with vehicle-specific rates
- Dynamic surge pricing based on multiple factors:
  - Rush hour multipliers (35% surcharge)
  - Weather conditions with severity scaling
  - Traffic intensity impact
  - Special event zones with tiered surge levels
  - Holiday pricing adjustments
- Breakdown generation showing individual cost components with impact levels

**Data Models:**
- `SimulationParams`: Comprehensive input schema with 10+ parameters
- `PriceResult`: Calculated output with total price, breakdown array, and surge multiplier
- `PriceBreakdownItem`: Individual cost factor with label, value, optional multiplier, and impact level
- `ScenarioPreset`: Pre-configured simulation scenarios for quick testing

### External Dependencies

**Database:**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver (@neondatabase/serverless)
- Schema location: `shared/schema.ts`
- Migration management via drizzle-kit
- Note: Database infrastructure provisioned but not actively used in current implementation

**Third-Party UI Libraries:**
- Radix UI: 20+ primitive components for accessible UI patterns
- Recharts: Chart rendering and data visualization
- Embla Carousel: Touch-friendly carousel component
- cmdk: Command palette interface component
- class-variance-authority: Type-safe component variant management
- date-fns: Date manipulation and formatting

**Development Tools:**
- Replit-specific plugins for runtime error overlay and dev tooling
- esbuild for production server bundling
- tsx for TypeScript execution in development
- PostCSS with Autoprefixer for CSS processing

**Session Management:**
- connect-pg-simple for PostgreSQL-backed session storage (configured but optional)

**Type Safety:**
- Zod for runtime type validation and schema generation
- drizzle-zod for database schema to Zod type conversion
- Shared type definitions between client and server via `/shared` directory