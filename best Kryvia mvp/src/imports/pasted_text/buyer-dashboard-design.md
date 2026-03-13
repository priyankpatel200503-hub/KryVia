Design a comprehensive Buyer Dashboard for "Optimized Transport Route" feature with the following detailed specifications:

**MAIN DASHBOARD LAYOUT:**
Create a modern, clean dashboard interface with a left sidebar navigation and main content area. Use a professional color scheme (primary: #2563EB blue, secondary: #10B981 green for savings, accent: #F59E0B orange for alerts).

**SECTION 1: ROUTE CALCULATOR PANEL**
Design an interactive route input section containing:
- "From City" dropdown/search field with auto-complete (pin icon)
- "To City" dropdown/search field with auto-complete (destination flag icon)
- "Calculate Route" primary button
- Interactive map preview showing the route with distance markers
- Display calculated distance in KM with route visualization
- Show estimated travel time
- Alternative routes option with distance comparison

**SECTION 2: VEHICLE SELECTION PANEL**
Create a vehicle selection grid/cards showing:
- Vehicle Type Cards (Bike, Mini Truck, Pickup, Medium Truck, Large Truck, Container)
- Each card displays:
  • Vehicle illustration/icon
  • Vehicle name and capacity (kg/tons)
  • Mileage (km per liter)
  • Base rate per km
  • Selected state indicator (highlighted border)
- Filter options: By capacity, By vehicle type, By price range
- "Compare Vehicles" toggle button

**SECTION 3: CHARGE CALCULATION ENGINE**
Design a detailed pricing breakdown panel showing:

CALCULATION FORMULA DISPLAY:
┌─────────────────────────────────────────────┐
│ Total Charge = (Distance ÷ Mileage) × Fuel │
│              + Base Rate × Distance         │
│              + Service Charges              │
│              + Toll Charges (if applicable) │
└─────────────────────────────────────────────┘

ITEMIZED CHARGES TABLE:
- Distance: [XXX] KM
- Selected Vehicle: [Vehicle Name]
- Vehicle Mileage: [XX] km/liter
- Fuel Required: [XX] liters
- Current Fuel Price: ₹[XX]/liter
- Fuel Cost: ₹[XXXX]
- Base Transportation Rate: ₹[XX]/km
- Distance Charge: ₹[XXXX]
- Driver Allowance: ₹[XXX]
- Toll Charges: ₹[XXX]
- GST (X%): ₹[XXX]
- TOTAL ESTIMATED CHARGE: ₹[XXXXX] (highlighted, large font)

**SECTION 4: CITY-TO-CITY DELIVERY CHARGES**
Create a quick lookup feature:
- Popular routes grid with pre-calculated charges
- City pair cards showing: "Mumbai → Delhi: ₹12,500 (1,400 km)"
- Search functionality for specific city pairs
- Rate chart table with columns: From, To, Distance, Mini Truck, Medium Truck, Large Truck
- "Get Quote" button for each route

**SECTION 5: SUMMARY & BOOKING PANEL**
Design a sticky right sidebar containing:
- Route Summary Card
- Selected Vehicle Preview
- Total Distance
- Estimated Delivery Time
- Final Price (prominent display)
- Price breakdown toggle
- "Book Now" CTA button (primary, large)
- "Save Quote" secondary button
- "Share Quote" option
- Terms and conditions link

**ADDITIONAL UI ELEMENTS:**

1. TOP HEADER:
- Dashboard title: "Transport Route Optimizer"
- User profile dropdown
- Notifications bell icon
- Help/Support icon

2. INTERACTIVE FEATURES:
- Slider for adjusting cargo weight (affects vehicle recommendation)
- Toggle for "Include Return Trip"
- Date picker for delivery scheduling
- Real-time fuel price indicator
- Savings comparison (vs other vehicles)

3. DATA VISUALIZATION:
- Bar chart comparing costs across different vehicles
- Pie chart showing charge breakdown
- Route efficiency score meter

4. MOBILE RESPONSIVE INDICATORS:
- Show how components stack on mobile
- Collapsible sections for mobile view

**VISUAL STYLE GUIDE:**
- Border radius: 12px for cards, 8px for buttons
- Shadows: Subtle drop shadows (0 4px 6px rgba(0,0,0,0.1))
- Typography: Inter or Poppins font family
- Icons: Lucide or Phosphor icon set
- Spacing: 8px grid system
- Cards: White background with subtle borders

**STATES TO DESIGN:**
1. Empty state (no route selected)
2. Loading state (calculating route)
3. Results state (full calculation display)
4. Error state (route not available)
5. Comparison mode (multiple vehicles selected)

Create all screens at 1440px desktop width with a clean, professional SaaS aesthetic suitable for a logistics/transportation platform.