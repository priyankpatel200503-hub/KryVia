Design a Farmer Dashboard web application with REAL-TIME APMC MARKET PRICES integration. The system must show ACCURATE, LIVE prices that change based on the selected crop.

---

## CRITICAL REQUIREMENT: DYNAMIC PRICE DISPLAY

The prices shown MUST be:
1. DIFFERENT for each crop (Rice prices ≠ Wheat prices ≠ Cotton prices)
2. SPECIFIC to each APMC Mandi in each city
3. LIVE prices with real-time updates (fetched from government APMC APIs)
4. Show ACTUAL market names, not just city names

---

## SECTION 1: CROP SELECTION DROPDOWN/GRID

Create dropdown with 20 crops. When user selects different crop, ALL PRICES MUST CHANGE accordingly:

**Crop List with Typical Price Ranges (₹/Quintal):**

| Crop | Hindi Name | Typical Price Range |
|------|------------|---------------------|
| 1. Rice (Paddy) | धान | ₹1,800 - ₹2,500 |
| 2. Wheat | गेहूं | ₹2,000 - ₹2,800 |
| 3. Maize | मक्का | ₹1,400 - ₹2,100 |
| 4. Bajra | बाजरा | ₹1,800 - ₹2,400 |
| 5. Jowar | ज्वार | ₹2,200 - ₹3,500 |
| 6. Barley | जौ | ₹1,500 - ₹2,200 |
| 7. Ragi | रागी | ₹2,800 - ₹3,800 |
| 8. Chickpea (Chana) | चना | ₹4,200 - ₹5,500 |
| 9. Tur Dal | तूर/अरहर | ₹5,500 - ₹8,000 |
| 10. Moong Dal | मूंग | ₹6,000 - ₹8,500 |
| 11. Urad Dal | उड़द | ₹5,000 - ₹7,500 |
| 12. Masoor Dal | मसूर | ₹4,500 - ₹6,500 |
| 13. Soybean | सोयाबीन | ₹3,800 - ₹5,200 |
| 14. Groundnut | मूंगफली | ₹4,500 - ₹6,500 |
| 15. Mustard | सरसों | ₹4,000 - ₹5,800 |
| 16. Sunflower | सूरजमुखी | ₹5,000 - ₹6,500 |
| 17. Cotton | कपास | ₹5,500 - ₹7,200 |
| 18. Sugarcane | गन्ना | ₹280 - ₹350 |
| 19. Onion | प्याज | ₹800 - ₹2,500 |
| 20. Potato | आलू | ₹600 - ₹1,800 |

---

## SECTION 2: LIVE APMC MANDI PRICES TABLE

### IMPORTANT: Show EXACT APMC MANDI NAMES (Not just city names)

When user clicks "Analyze Live Prices" button, show this table with REAL APMC NAMES:

**Table Structure:**

| State | City | APMC Mandi Name | Arrival (Tonnes) | Min ₹/Q | Max ₹/Q | Modal ₹/Q | Live Status |

---

### 10 REAL APMC MANDIS WITH EXACT NAMES:

**1. Maharashtra - Mumbai**
- APMC Name: "Vashi Agricultural Produce Market Committee"
- Market Code: MH-VASHI-001
- Address: Sector 19, Vashi, Navi Mumbai

**2. Maharashtra - Pune**  
- APMC Name: "Pune Market Yard (Gultekdi)"
- Market Code: MH-PUNE-002
- Address: Market Yard, Gultekdi, Pune

**3. Delhi**
- APMC Name: "Azadpur Mandi (Asia's Largest)"
- Market Code: DL-AZAD-001
- Address: Azadpur, North Delhi

**4. Karnataka - Bangalore**
- APMC Name: "Yeshwanthpur APMC Market"
- Market Code: KA-YESH-001
- Address: Yeshwanthpur, Bangalore

**5. Tamil Nadu - Chennai**
- APMC Name: "Koyambedu Wholesale Market Complex"
- Market Code: TN-KOYA-001
- Address: Koyambedu, Chennai

**6. West Bengal - Kolkata**
- APMC Name: "Howrah Wholesale Market"
- Market Code: WB-HOWR-001
- Address: Howrah, Kolkata

**7. Telangana - Hyderabad**
- APMC Name: "Bowenpally Agricultural Market"
- Market Code: TS-BOWN-001
- Address: Bowenpally, Secunderabad

**8. Gujarat - Ahmedabad**
- APMC Name: "Jamalpur Grain Market APMC"
- Market Code: GJ-JAMA-001
- Address: Jamalpur, Ahmedabad

**9. Rajasthan - Jaipur**
- APMC Name: "Muhana Mandi APMC"
- Market Code: RJ-MUHA-001
- Address: Muhana, Jaipur

**10. Uttar Pradesh - Lucknow**
- APMC Name: "Alambagh Mandi APMC"
- Market Code: UP-ALAM-001
- Address: Alambagh, Lucknow

---

## SECTION 3: EXAMPLE - PRICES CHANGE PER CROP

### EXAMPLE 1: When User Selects "RICE (धान)"

Show this data in table:

| State | APMC Mandi | Min Price | Max Price | Modal Price | Arrivals | Updated |
|-------|------------|-----------|-----------|-------------|----------|---------|
| Maharashtra | Vashi APMC, Mumbai | ₹2,180 | ₹2,450 | ₹2,320 | 245 T | 🟢 Live |
| Maharashtra | Market Yard, Pune | ₹2,050 | ₹2,380 | ₹2,210 | 180 T | 🟢 Live |
| Delhi | Azadpur Mandi | ₹2,220 | ₹2,520 | ₹2,380 | 520 T | 🟢 Live |
| Karnataka | Yeshwanthpur APMC | ₹2,100 | ₹2,400 | ₹2,250 | 310 T | 🟢 Live |
| Tamil Nadu | Koyambedu Market | ₹2,280 | ₹2,580 | ₹2,420 | 425 T | 🟢 Live |
| West Bengal | Howrah Market | ₹1,980 | ₹2,280 | ₹2,120 | 380 T | 🟢 Live |
| Telangana | Bowenpally APMC | ₹2,150 | ₹2,450 | ₹2,300 | 290 T | 🟢 Live |
| Gujarat | Jamalpur APMC | ₹2,080 | ₹2,350 | ₹2,200 | 195 T | 🟢 Live |
| Rajasthan | Muhana Mandi | ₹2,000 | ₹2,300 | ₹2,150 | 165 T | 🟢 Live |
| UP | Alambagh Mandi | ₹1,950 | ₹2,250 | ₹2,080 | 275 T | 🟢 Live |

**Stats Cards for Rice:**
- Highest: ₹2,580 (Koyambedu, Chennai)
- Lowest: ₹1,950 (Alambagh, Lucknow)
- Average: ₹2,243
- MSP: ₹2,183/Quintal

---

### EXAMPLE 2: When User Selects "COTTON (कपास)"

PRICES COMPLETELY CHANGE - Show this data:

| State | APMC Mandi | Min Price | Max Price | Modal Price | Arrivals | Updated |
|-------|------------|-----------|-----------|-------------|----------|---------|
| Maharashtra | Vashi APMC, Mumbai | ₹6,200 | ₹7,100 | ₹6,650 | 85 T | 🟢 Live |
| Maharashtra | Market Yard, Pune | ₹6,050 | ₹6,900 | ₹6,480 | 62 T | 🟢 Live |
| Delhi | Azadpur Mandi | ₹6,300 | ₹7,200 | ₹6,750 | 45 T | 🟢 Live |
| Karnataka | Yeshwanthpur APMC | ₹6,100 | ₹6,950 | ₹6,520 | 78 T | 🟢 Live |
| Tamil Nadu | Koyambedu Market | ₹6,400 | ₹7,300 | ₹6,850 | 55 T | 🟢 Live |
| West Bengal | Howrah Market | ₹5,800 | ₹6,600 | ₹6,200 | 38 T | 🟢 Live |
| Telangana | Bowenpally APMC | ₹6,250 | ₹7,150 | ₹6,700 | 92 T | 🟢 Live |
| Gujarat | Jamalpur APMC | ₹6,500 | ₹7,400 | ₹6,950 | 125 T | 🟢 Live |
| Rajasthan | Muhana Mandi | ₹6,150 | ₹7,000 | ₹6,580 | 70 T | 🟢 Live |
| UP | Alambagh Mandi | ₹5,900 | ₹6,750 | ₹6,320 | 48 T | 🟢 Live |

**Stats Cards for Cotton:**
- Highest: ₹7,400 (Jamalpur, Gujarat)
- Lowest: ₹5,800 (Howrah, Kolkata)
- Average: ₹6,600
- MSP: ₹6,620/Quintal

---

### EXAMPLE 3: When User Selects "ONION (प्याज)"

PRICES COMPLETELY DIFFERENT - Show this data:

| State | APMC Mandi | Min Price | Max Price | Modal Price | Arrivals | Updated |
|-------|------------|-----------|-----------|-------------|----------|---------|
| Maharashtra | Vashi APMC, Mumbai | ₹1,200 | ₹1,850 | ₹1,520 | 1250 T | 🟢 Live |
| Maharashtra | Market Yard, Pune | ₹1,100 | ₹1,700 | ₹1,380 | 980 T | 🟢 Live |
| Delhi | Azadpur Mandi | ₹1,350 | ₹2,000 | ₹1,680 | 1850 T | 🟢 Live |
| Karnataka | Yeshwanthpur APMC | ₹1,150 | ₹1,750 | ₹1,450 | 720 T | 🟢 Live |
| Tamil Nadu | Koyambedu Market | ₹1,400 | ₹2,100 | ₹1,750 | 650 T | 🟢 Live |
| West Bengal | Howrah Market | ₹1,050 | ₹1,600 | ₹1,320 | 580 T | 🟢 Live |
| Telangana | Bowenpally APMC | ₹1,250 | ₹1,900 | ₹1,580 | 490 T | 🟢 Live |
| Gujarat | Jamalpur APMC | ₹1,180 | ₹1,780 | ₹1,480 | 850 T | 🟢 Live |
| Rajasthan | Muhana Mandi | ₹1,080 | ₹1,650 | ₹1,360 | 420 T | 🟢 Live |
| UP | Alambagh Mandi | ₹1,000 | ₹1,550 | ₹1,280 | 680 T | 🟢 Live |

**Stats Cards for Onion:**
- Highest: ₹2,100 (Koyambedu, Chennai)
- Lowest: ₹1,000 (Alambagh, Lucknow)
- Average: ₹1,480
- MSP: No MSP for Onion

---

## SECTION 4: LIVE DATA INTEGRATION UI ELEMENTS

### Real-Time Indicators:
1. **Live Pulse Animation**: Green dot that pulses every 2 seconds
2. **Last Updated Timer**: "Updated 30 seconds ago" (auto-refreshes)
3. **Data Source Badge**: "Source: eNAM Portal / Agmarknet"
4. **Auto-Refresh Toggle**: "Auto-refresh every 5 minutes" switch

### API Connection Status Bar: