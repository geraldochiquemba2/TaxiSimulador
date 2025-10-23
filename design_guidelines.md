# Design Guidelines: Taxi Price Simulator

## Design Approach

**Hybrid Approach**: Material Design system enhanced with visual patterns from ride-sharing applications (Uber, Lyft, Didi) for familiarity and trust.

**Core Principles**:
- **Clarity First**: All controls and outputs must be immediately understandable
- **Real-time Feedback**: Price updates instantly as users adjust parameters
- **Data Transparency**: Clear breakdown showing how each factor affects the final price
- **Playful Professionalism**: Engaging enough to encourage exploration while maintaining credibility

## Typography System

**Font Stack**: Inter (primary), SF Pro Display (fallback) via Google Fonts

**Hierarchy**:
- **Price Display**: 3xl to 5xl, bold (700-900) - Hero element
- **Section Headers**: xl to 2xl, semibold (600)
- **Control Labels**: base to lg, medium (500)
- **Data Values**: sm to base, regular (400)
- **Helper Text**: xs to sm, regular (400)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-8
- Section margins: mb-6 to mb-8
- Element gaps: gap-4 to gap-6

**Container Strategy**:
- Max width: max-w-7xl for main container
- Two-column desktop layout: Control panel (40%) + Results panel (60%)
- Single column mobile stack

**Grid Pattern**:
- Scenario controls in card-based layout
- Factor breakdown in 2-3 column grid (desktop)
- Responsive collapse to single column (mobile)

## Component Library

### Core Interactive Controls

**Slider Controls** (for continuous variables):
- Distance slider (0-50km)
- Time of day slider (24-hour)
- Traffic intensity slider (0-100%)
- Weather severity slider
- Include value labels with units
- Show tick marks for key thresholds

**Toggle Switches** (for binary scenarios):
- Rain/No Rain
- Rush Hour/Normal
- Special Event/Regular Day
- Holiday/Weekday

**Dropdown Selects**:
- Vehicle type (Economy, Comfort, Premium, XL)
- City/Region selection
- Surge pricing zones

### Display Components

**Price Card** (Primary focal point):
- Large, prominent price display at top
- Currency symbol and decimal precision
- Comparison indicator showing % change from base price
- Visual badge system for surge levels (1.2x, 1.5x, 2x, etc.)

**Factor Breakdown Panel**:
- List showing each contributing factor
- Individual cost additions with +/- indicators
- Visual weight indicators (small bars or dots) showing impact
- Base fare + modifiers structure

**Comparison Chart**:
- Bar chart or line graph showing price variations
- X-axis: Different scenario combinations
- Y-axis: Price range
- Interactive data points on hover
- Legend explaining factors

**Scenario Preset Cards**:
- Pre-configured common scenarios (e.g., "Friday Night Rain", "Monday Morning Rush")
- Quick-select buttons
- Visual icons representing scenario type

### Navigation & Layout

**Header**:
- App title/logo
- Brief tagline explaining the simulator
- Reset button to clear all adjustments

**Control Panel Section**:
- Grouped controls by category (Time, Weather, Traffic, Trip Details)
- Category headers with icons
- Collapsible sections for advanced options

**Results Section**:
- Sticky price card that remains visible during scroll
- Expandable breakdown details
- Export/share functionality for scenarios

**Footer**:
- Methodology explanation link
- Disclaimer about simulation vs. real pricing
- Data source attribution

## Images

**No hero image required** - This is a utility-focused application. Instead:
- Use illustrative icons throughout (car, clock, weather symbols, traffic lights)
- Consider a small header illustration showing a simplified city map or taxi icon
- Graph/chart visualizations are the primary visual elements

## Component Specifications

### Cards
- Rounded corners (rounded-lg to rounded-xl)
- Subtle elevation with shadows
- Clear internal padding (p-6)
- Hover states for interactive cards

### Buttons
- Primary action: Prominent styling for "Calculate" or "Reset"
- Secondary actions: Subtle styling for presets
- Icon buttons for additional functions
- Full-width on mobile for primary actions

### Form Elements
- Clear labels above inputs
- Helper text below when needed
- Error states with inline validation
- Disabled states visually distinct

### Data Visualization
- Use chart library (Chart.js or Recharts)
- Responsive sizing
- Tooltips on hover
- Clear axis labels and legends

## Accessibility Requirements

- All sliders have keyboard navigation
- ARIA labels for all interactive controls
- Sufficient contrast ratios for all text
- Focus indicators on all interactive elements
- Screen reader announcements for price updates

## Animation Guidelines

**Minimal, purposeful animations only**:
- Price number counter animation when value changes (0.3s)
- Smooth slider handle movement
- Subtle card elevation on hover
- Chart rendering animation on load (once only)

**No**:
- Background animations
- Parallax effects
- Complex transitions between states
- Decorative animations

## Responsive Behavior

**Desktop (lg+)**: Two-column layout with controls on left, results on right
**Tablet (md)**: Stacked layout with controls above, larger touch targets
**Mobile (base)**: Full-width cards, simplified chart views, larger interactive elements