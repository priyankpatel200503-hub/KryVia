Design a comprehensive Farmer Dashboard web application with the following specifications:

## SECTION 1: CROP SELECTION PANEL

Create a modern, clean dropdown/grid selection interface for "Choose a Crop to Analyze" featuring these 20 crops with their icons:

**Cereals & Grains:**
1. Rice (धान)
2. Wheat (गेहूं)
3. Maize/Corn (मक्का)
4. Bajra/Pearl Millet (बाजरा)
5. Jowar/Sorghum (ज्वार)
6. Barley (जौ)
7. Ragi/Finger Millet (रागी)

**Pulses:**
8. Chickpea/Chana (चना)
9. Tur/Arhar Dal (तूर दाल)
10. Moong Dal (मूंग दाल)
11. Urad Dal (उड़द दाल)
12. Masoor Dal (मसूर दाल)

**Oilseeds:**
13. Soybean (सोयाबीन)
14. Groundnut (मूंगफली)
15. Mustard (सरसों)
16. Sunflower (सूरजमुखी)

**Cash Crops:**
17. Cotton (कपास)
18. Sugarcane (गन्ना)
19. Jute (जूट)
20. Tobacco (तंबाकू)

**Design Requirements:**
- Grid layout with 4-5 crops per row
- Each crop card shows: crop icon, English name, Hindi name
- Hover effect with subtle elevation
- Selected crop highlighted with green border/background
- Search filter option at top

---

## SECTION 2: ANALYZE BUTTON

Create a prominent "Analyze Market Prices" button:
- Large, centered CTA button
- Green gradient (#22C55E to #16A34A)
- Icon: chart/graph icon + location pin
- Text: "🔍 Analyze Live APMC Prices"
- Loading state with spinner animation
- Disabled state when no crop selected

---

## SECTION 3: LIVE APMC PRICE RESULTS TABLE

After button click, display a real-time price comparison table for 10 major Indian cities:

**Table Header:**
| City | APMC Market | Min Price (₹/Quintal) | Max Price (₹/Quintal) | Modal Price | Today's Change | Last Updated |

**10 Cities to Include:**
1. Mumbai - Vashi APMC
2. Delhi - Azadpur APMC
3. Bangalore - Yeshwanthpur APMC
4. Chennai - Koyambedu APMC
5. Kolkata - Howrah APMC
6. Hyderabad - Bowenpally APMC
7. Ahmedabad - Jamalpur APMC
8. Pune - Market Yard APMC
9. Jaipur - Muhana APMC
10. Lucknow - Alambagh APMC

**Table Design Features:**
- Alternating row colors (white/#F8FAFC)
- Live indicator: Green pulsing dot with "LIVE" badge
- Price change column: Green ↑ for increase, Red ↓ for decrease
- Sortable columns (click header to sort)
- "Last Updated" shows: "2 mins ago", "Just now", etc.
- Highlight best price row with golden/yellow background
- Each row has "View Details" and "Set Alert" action buttons

---

## SECTION 4: VISUAL ENHANCEMENTS

**Price Comparison Chart:**
- Bar chart showing all 10 cities side by side
- X-axis: City names
- Y-axis: Price in ₹/Quintal
- Tooltip on hover showing exact values
- Highest price bar in green, lowest in orange

**Quick Stats Cards (above table):**
4 cards showing:
1. "Highest Price" - ₹2,450/Q - Mumbai Vashi (green card)
2. "Lowest Price" - ₹2,180/Q - Lucknow (orange card)
3. "Average Price" - ₹2,315/Q (blue card)
4. "Price Trend" - ↑ 2.3% This Week (purple card)

---

## SECTION 5: ADDITIONAL FEATURES

**Filter Options:**
- Date range selector (Today, Last 7 days, Last 30 days)
- State filter dropdown
- Price range slider (Min-Max)
- Sort by: Price High→Low, Low→High, City A-Z

**Action Buttons per City Row:**
- "📍 Get Directions" - Opens map
- "🔔 Set Price Alert" - Notification when price changes
- "📊 View History" - Shows price trend chart
- "📞 Contact APMC" - Shows phone number

**Map View Toggle:**
- Switch between Table View and Map View
- Map shows all 10 cities with price markers
- Click marker to see price details popup

---

## DESIGN STYLE SPECIFICATIONS:

**Color Palette:**
- Primary: #22C55E (Green - agriculture theme)
- Secondary: #3B82F6 (Blue - data/charts)
- Accent: #F59E0B (Orange/Yellow - highlights)
- Background: #F1F5F9 (Light gray)
- Cards: #FFFFFF
- Text Primary: #1E293B
- Text Secondary: #64748B

**Typography:**
- Headings: Inter Bold/Semibold
- Body: Inter Regular
- Numbers/Prices: Roboto Mono (for alignment)
- Hindi text: Noto Sans Devanagari

**Components Style:**
- Border radius: 12px for cards, 8px for buttons
- Shadows: Subtle elevation (0 4px 6px rgba(0,0,0,0.1))
- Icons: Lucide or Phosphor icon set
- Responsive: Desktop, Tablet, Mobile layouts

**Dashboard Header:**
- Logo: "KisanMandi" or "AgriPrice" with leaf icon
- Navigation: Dashboard, My Crops, Price Alerts, Market News, Profile
- Language toggle: English/Hindi
- Notification bell with badge count

**Mobile Responsive:**
- Crop grid becomes 2 columns
- Table becomes card-based list view
- Sticky analyze button at bottom
- Collapsible filters