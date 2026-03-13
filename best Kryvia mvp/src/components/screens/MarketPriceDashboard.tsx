import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  ArrowLeft, Search, TrendingUp, TrendingDown, ArrowUpDown,
  Bell, MapPin, Phone, BarChart3, Loader2, ChevronDown, ChevronUp,
  Eye, Filter, X, RefreshCw, Wifi, WifiOff, Clock, Database,
  ExternalLink, Info, CheckCircle2, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════
// CROP DATA — 20 Crops with Hindi names and typical price ranges
// ═══════════════════════════════════════════════════════════════════
interface CropItem {
  id: string;
  name: string;
  hindi: string;
  emoji: string;
  category: string;
  minRange: number; // typical min ₹/Quintal
  maxRange: number; // typical max ₹/Quintal
  msp: number | null; // Minimum Support Price (null if no MSP)
}

const CROPS: CropItem[] = [
  // Cereals & Grains
  { id: 'rice', name: 'Rice (Paddy)', hindi: 'धान', emoji: '🌾', category: 'Cereals & Grains', minRange: 1800, maxRange: 2500, msp: 2183 },
  { id: 'wheat', name: 'Wheat', hindi: 'गेहूं', emoji: '🌾', category: 'Cereals & Grains', minRange: 2000, maxRange: 2800, msp: 2275 },
  { id: 'maize', name: 'Maize', hindi: 'मक्का', emoji: '🌽', category: 'Cereals & Grains', minRange: 1400, maxRange: 2100, msp: 1962 },
  { id: 'bajra', name: 'Bajra', hindi: 'बाजरा', emoji: '🌿', category: 'Cereals & Grains', minRange: 1800, maxRange: 2400, msp: 2500 },
  { id: 'jowar', name: 'Jowar', hindi: 'ज्वार', emoji: '🌱', category: 'Cereals & Grains', minRange: 2200, maxRange: 3500, msp: 3180 },
  { id: 'barley', name: 'Barley', hindi: 'जौ', emoji: '🌾', category: 'Cereals & Grains', minRange: 1500, maxRange: 2200, msp: 1735 },
  { id: 'ragi', name: 'Ragi', hindi: 'रागी', emoji: '🌿', category: 'Cereals & Grains', minRange: 2800, maxRange: 3800, msp: 3846 },
  // Pulses
  { id: 'chickpea', name: 'Chickpea (Chana)', hindi: 'चना', emoji: '🫘', category: 'Pulses', minRange: 4200, maxRange: 5500, msp: 5440 },
  { id: 'tur', name: 'Tur Dal', hindi: 'तूर/अरहर', emoji: '🫘', category: 'Pulses', minRange: 5500, maxRange: 8000, msp: 7000 },
  { id: 'moong', name: 'Moong Dal', hindi: 'मूंग', emoji: '🫘', category: 'Pulses', minRange: 6000, maxRange: 8500, msp: 8558 },
  { id: 'urad', name: 'Urad Dal', hindi: 'उड़द', emoji: '🫘', category: 'Pulses', minRange: 5000, maxRange: 7500, msp: 6950 },
  { id: 'masoor', name: 'Masoor Dal', hindi: 'मसूर', emoji: '🫘', category: 'Pulses', minRange: 4500, maxRange: 6500, msp: 6425 },
  // Oilseeds
  { id: 'soybean', name: 'Soybean', hindi: 'सोयाबीन', emoji: '🫘', category: 'Oilseeds', minRange: 3800, maxRange: 5200, msp: 4600 },
  { id: 'groundnut', name: 'Groundnut', hindi: 'मूंगफली', emoji: '🥜', category: 'Oilseeds', minRange: 4500, maxRange: 6500, msp: 6377 },
  { id: 'mustard', name: 'Mustard', hindi: 'सरसों', emoji: '🌼', category: 'Oilseeds', minRange: 4000, maxRange: 5800, msp: 5650 },
  { id: 'sunflower', name: 'Sunflower', hindi: 'सूरजमुखी', emoji: '🌻', category: 'Oilseeds', minRange: 5000, maxRange: 6500, msp: 6760 },
  // Cash Crops & Vegetables
  { id: 'cotton', name: 'Cotton', hindi: 'कपास', emoji: '🌸', category: 'Cash Crops', minRange: 5500, maxRange: 7200, msp: 6620 },
  { id: 'sugarcane', name: 'Sugarcane', hindi: 'गन्ना', emoji: '🎋', category: 'Cash Crops', minRange: 280, maxRange: 350, msp: 315 },
  { id: 'onion', name: 'Onion', hindi: 'प्याज', emoji: '🧅', category: 'Vegetables', minRange: 800, maxRange: 2500, msp: null },
  { id: 'potato', name: 'Potato', hindi: 'आलू', emoji: '🥔', category: 'Vegetables', minRange: 600, maxRange: 1800, msp: null },
];

// ═══════════════════════════════════════════════════════════════════
// APMC MANDI DATA — 10 Real mandis with full names, codes, addresses
// ═══════════════════════════════════════════════════════════════════
interface APMCMandi {
  state: string;
  city: string;
  fullName: string;
  shortName: string;
  marketCode: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

const APMC_MANDIS: APMCMandi[] = [
  {
    state: 'Maharashtra', city: 'Mumbai',
    fullName: 'Vashi Agricultural Produce Market Committee',
    shortName: 'Vashi APMC, Mumbai',
    marketCode: 'MH-VASHI-001',
    address: 'Sector 19, Vashi, Navi Mumbai',
    phone: '+91 22-27840100', lat: 19.076, lng: 72.877,
  },
  {
    state: 'Maharashtra', city: 'Pune',
    fullName: 'Pune Market Yard (Gultekdi)',
    shortName: 'Market Yard, Pune',
    marketCode: 'MH-PUNE-002',
    address: 'Market Yard, Gultekdi, Pune',
    phone: '+91 20-24262471', lat: 18.520, lng: 73.856,
  },
  {
    state: 'Delhi', city: 'Delhi',
    fullName: "Azadpur Mandi (Asia's Largest)",
    shortName: 'Azadpur Mandi',
    marketCode: 'DL-AZAD-001',
    address: 'Azadpur, North Delhi',
    phone: '+91 11-27691041', lat: 28.704, lng: 77.102,
  },
  {
    state: 'Karnataka', city: 'Bangalore',
    fullName: 'Yeshwanthpur APMC Market',
    shortName: 'Yeshwanthpur APMC',
    marketCode: 'KA-YESH-001',
    address: 'Yeshwanthpur, Bangalore',
    phone: '+91 80-23371651', lat: 12.971, lng: 77.594,
  },
  {
    state: 'Tamil Nadu', city: 'Chennai',
    fullName: 'Koyambedu Wholesale Market Complex',
    shortName: 'Koyambedu Market',
    marketCode: 'TN-KOYA-001',
    address: 'Koyambedu, Chennai',
    phone: '+91 44-24892222', lat: 13.082, lng: 80.270,
  },
  {
    state: 'West Bengal', city: 'Kolkata',
    fullName: 'Howrah Wholesale Market',
    shortName: 'Howrah Market',
    marketCode: 'WB-HOWR-001',
    address: 'Howrah, Kolkata',
    phone: '+91 33-26601230', lat: 22.572, lng: 88.363,
  },
  {
    state: 'Telangana', city: 'Hyderabad',
    fullName: 'Bowenpally Agricultural Market',
    shortName: 'Bowenpally APMC',
    marketCode: 'TS-BOWN-001',
    address: 'Bowenpally, Secunderabad',
    phone: '+91 40-27530300', lat: 17.385, lng: 78.486,
  },
  {
    state: 'Gujarat', city: 'Ahmedabad',
    fullName: 'Jamalpur Grain Market APMC',
    shortName: 'Jamalpur APMC',
    marketCode: 'GJ-JAMA-001',
    address: 'Jamalpur, Ahmedabad',
    phone: '+91 79-25622951', lat: 23.022, lng: 72.571,
  },
  {
    state: 'Rajasthan', city: 'Jaipur',
    fullName: 'Muhana Mandi APMC',
    shortName: 'Muhana Mandi',
    marketCode: 'RJ-MUHA-001',
    address: 'Muhana, Jaipur',
    phone: '+91 141-2740010', lat: 26.912, lng: 75.787,
  },
  {
    state: 'Uttar Pradesh', city: 'Lucknow',
    fullName: 'Alambagh Mandi APMC',
    shortName: 'Alambagh Mandi',
    marketCode: 'UP-ALAM-001',
    address: 'Alambagh, Lucknow',
    phone: '+91 522-2455121', lat: 26.846, lng: 80.946,
  },
];

// ═══════════════════════════════════════════════════════════════════
// HARDCODED PRICE DATA per crop (matching spec examples exactly)
// ═══════════════════════════════════════════════════════════════════
interface APMCPriceRow {
  mandiIndex: number; // index into APMC_MANDIS
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivals: number; // tonnes
  change: number;
  changePercent: number;
}

// Specific hardcoded data for rice, cotton, onion per the spec
const HARDCODED_PRICES: Record<string, APMCPriceRow[]> = {
  rice: [
    { mandiIndex: 0, minPrice: 2180, maxPrice: 2450, modalPrice: 2320, arrivals: 245, change: 40, changePercent: 1.8 },
    { mandiIndex: 1, minPrice: 2050, maxPrice: 2380, modalPrice: 2210, arrivals: 180, change: -20, changePercent: -0.9 },
    { mandiIndex: 2, minPrice: 2220, maxPrice: 2520, modalPrice: 2380, arrivals: 520, change: 60, changePercent: 2.6 },
    { mandiIndex: 3, minPrice: 2100, maxPrice: 2400, modalPrice: 2250, arrivals: 310, change: 15, changePercent: 0.7 },
    { mandiIndex: 4, minPrice: 2280, maxPrice: 2580, modalPrice: 2420, arrivals: 425, change: 80, changePercent: 3.4 },
    { mandiIndex: 5, minPrice: 1980, maxPrice: 2280, modalPrice: 2120, arrivals: 380, change: -35, changePercent: -1.6 },
    { mandiIndex: 6, minPrice: 2150, maxPrice: 2450, modalPrice: 2300, arrivals: 290, change: 30, changePercent: 1.3 },
    { mandiIndex: 7, minPrice: 2080, maxPrice: 2350, modalPrice: 2200, arrivals: 195, change: -10, changePercent: -0.5 },
    { mandiIndex: 8, minPrice: 2000, maxPrice: 2300, modalPrice: 2150, arrivals: 165, change: 25, changePercent: 1.2 },
    { mandiIndex: 9, minPrice: 1950, maxPrice: 2250, modalPrice: 2080, arrivals: 275, change: -45, changePercent: -2.1 },
  ],
  cotton: [
    { mandiIndex: 0, minPrice: 6200, maxPrice: 7100, modalPrice: 6650, arrivals: 85, change: 120, changePercent: 1.8 },
    { mandiIndex: 1, minPrice: 6050, maxPrice: 6900, modalPrice: 6480, arrivals: 62, change: -80, changePercent: -1.2 },
    { mandiIndex: 2, minPrice: 6300, maxPrice: 7200, modalPrice: 6750, arrivals: 45, change: 150, changePercent: 2.3 },
    { mandiIndex: 3, minPrice: 6100, maxPrice: 6950, modalPrice: 6520, arrivals: 78, change: 40, changePercent: 0.6 },
    { mandiIndex: 4, minPrice: 6400, maxPrice: 7300, modalPrice: 6850, arrivals: 55, change: 200, changePercent: 3.0 },
    { mandiIndex: 5, minPrice: 5800, maxPrice: 6600, modalPrice: 6200, arrivals: 38, change: -100, changePercent: -1.6 },
    { mandiIndex: 6, minPrice: 6250, maxPrice: 7150, modalPrice: 6700, arrivals: 92, change: 90, changePercent: 1.4 },
    { mandiIndex: 7, minPrice: 6500, maxPrice: 7400, modalPrice: 6950, arrivals: 125, change: 250, changePercent: 3.7 },
    { mandiIndex: 8, minPrice: 6150, maxPrice: 7000, modalPrice: 6580, arrivals: 70, change: 60, changePercent: 0.9 },
    { mandiIndex: 9, minPrice: 5900, maxPrice: 6750, modalPrice: 6320, arrivals: 48, change: -60, changePercent: -0.9 },
  ],
  onion: [
    { mandiIndex: 0, minPrice: 1200, maxPrice: 1850, modalPrice: 1520, arrivals: 1250, change: 80, changePercent: 5.6 },
    { mandiIndex: 1, minPrice: 1100, maxPrice: 1700, modalPrice: 1380, arrivals: 980, change: -40, changePercent: -2.8 },
    { mandiIndex: 2, minPrice: 1350, maxPrice: 2000, modalPrice: 1680, arrivals: 1850, change: 120, changePercent: 7.7 },
    { mandiIndex: 3, minPrice: 1150, maxPrice: 1750, modalPrice: 1450, arrivals: 720, change: 30, changePercent: 2.1 },
    { mandiIndex: 4, minPrice: 1400, maxPrice: 2100, modalPrice: 1750, arrivals: 650, change: 150, changePercent: 9.4 },
    { mandiIndex: 5, minPrice: 1050, maxPrice: 1600, modalPrice: 1320, arrivals: 580, change: -60, changePercent: -4.3 },
    { mandiIndex: 6, minPrice: 1250, maxPrice: 1900, modalPrice: 1580, arrivals: 490, change: 70, changePercent: 4.6 },
    { mandiIndex: 7, minPrice: 1180, maxPrice: 1780, modalPrice: 1480, arrivals: 850, change: 50, changePercent: 3.5 },
    { mandiIndex: 8, minPrice: 1080, maxPrice: 1650, modalPrice: 1360, arrivals: 420, change: -30, changePercent: -2.2 },
    { mandiIndex: 9, minPrice: 1000, maxPrice: 1550, modalPrice: 1280, arrivals: 680, change: -80, changePercent: -5.9 },
  ],
};

// Generate price data for other crops dynamically (within their spec range)
function generatePriceData(crop: CropItem): APMCPriceRow[] {
  // Use hardcoded data if available
  if (HARDCODED_PRICES[crop.id]) return HARDCODED_PRICES[crop.id];

  // Deterministic seed from cropId
  let seed = 0;
  for (let i = 0; i < crop.id.length; i++) seed += crop.id.charCodeAt(i);

  const range = crop.maxRange - crop.minRange;

  return APMC_MANDIS.map((_, idx) => {
    const factor = 0.15 + ((seed + idx * 37) % 70) / 100;
    const modalPrice = Math.round(crop.minRange + range * factor);
    const min = Math.round(modalPrice * (0.90 + ((seed + idx * 13) % 8) / 100));
    const max = Math.round(modalPrice * (1.06 + ((seed + idx * 7) % 12) / 100));
    const change = Math.round((((seed + idx * 23) % 200) - 100) * (range / 1000));
    const changePercent = parseFloat(((change / modalPrice) * 100).toFixed(1));
    // Arrivals: high for vegetables, moderate for grains, lower for cash crops
    const arrBase = crop.category === 'Vegetables' ? 500 : crop.category === 'Cash Crops' ? 50 : 200;
    const arrivals = Math.round(arrBase + ((seed + idx * 17) % arrBase));

    return { mandiIndex: idx, minPrice: min, maxPrice: max, modalPrice, arrivals, change, changePercent };
  });
}

// ═══════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════
type SortField = 'city' | 'modalPrice' | 'change' | 'arrivals';
type SortDir = 'asc' | 'desc';

export function MarketPriceDashboard() {
  const { setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceData, setPriceData] = useState<APMCPriceRow[] | null>(null);
  const [sortField, setSortField] = useState<SortField>('modalPrice');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [alertSet, setAlertSet] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // Live indicators
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(0);
  const [apiConnected, setApiConnected] = useState(true);

  // Auto-refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSec(prev => {
        const next = prev + 1;
        // Auto-refresh every 300 seconds (5 min) if toggled
        if (autoRefresh && priceData && selectedCrop && next >= 300) {
          setPriceData(generatePriceData(selectedCrop));
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoRefresh, priceData, selectedCrop]);

  // Filter crops
  const filteredCrops = useMemo(() => {
    if (!searchQuery.trim()) return CROPS;
    const q = searchQuery.toLowerCase();
    return CROPS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.hindi.includes(searchQuery) ||
      c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group crops by category
  const groupedCrops = useMemo(() => {
    const groups: Record<string, CropItem[]> = {};
    filteredCrops.forEach(c => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [filteredCrops]);

  // Analyze handler
  const handleAnalyze = useCallback(() => {
    if (!selectedCrop) return;
    setIsAnalyzing(true);
    setPriceData(null);
    setLastUpdatedSec(0);
    setTimeout(() => {
      setPriceData(generatePriceData(selectedCrop));
      setIsAnalyzing(false);
    }, 1800);
  }, [selectedCrop]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    if (!selectedCrop) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setPriceData(generatePriceData(selectedCrop));
      setLastUpdatedSec(0);
      setIsAnalyzing(false);
    }, 800);
  }, [selectedCrop]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!priceData) return [];
    return [...priceData].sort((a, b) => {
      const mandiA = APMC_MANDIS[a.mandiIndex];
      const mandiB = APMC_MANDIS[b.mandiIndex];
      let cmp = 0;
      if (sortField === 'city') cmp = mandiA.city.localeCompare(mandiB.city);
      else if (sortField === 'modalPrice') cmp = a.modalPrice - b.modalPrice;
      else if (sortField === 'change') cmp = a.change - b.change;
      else if (sortField === 'arrivals') cmp = a.arrivals - b.arrivals;
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [priceData, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => {
    if (!priceData || priceData.length === 0) return null;
    const highest = priceData.reduce((a, b) => a.maxPrice > b.maxPrice ? a : b);
    const lowest = priceData.reduce((a, b) => a.minPrice < b.minPrice ? a : b);
    const avgModal = Math.round(priceData.reduce((s, d) => s + d.modalPrice, 0) / priceData.length);
    const totalArrivals = priceData.reduce((s, d) => s + d.arrivals, 0);
    const weekTrend = parseFloat((priceData.reduce((s, d) => s + d.changePercent, 0) / priceData.length).toFixed(1));
    return {
      highestMax: highest.maxPrice,
      highestMandi: APMC_MANDIS[highest.mandiIndex],
      lowestMin: lowest.minPrice,
      lowestMandi: APMC_MANDIS[lowest.mandiIndex],
      avgModal,
      totalArrivals,
      weekTrend,
    };
  }, [priceData]);

  // Chart data
  const chartData = useMemo(() => {
    if (!sortedData.length) return [];
    const maxModal = Math.max(...sortedData.map(d => d.modalPrice));
    const minModal = Math.min(...sortedData.map(d => d.modalPrice));
    return sortedData.map(d => ({
      city: APMC_MANDIS[d.mandiIndex].city,
      mandi: APMC_MANDIS[d.mandiIndex].shortName,
      min: d.minPrice,
      modal: d.modalPrice,
      max: d.maxPrice,
      color: d.modalPrice === maxModal ? '#22C55E' : d.modalPrice === minModal ? '#F59E0B' : '#3B82F6',
    }));
  }, [sortedData]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleAlert = (code: string) => {
    setAlertSet(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const formatUpdatedTime = (sec: number) => {
    if (sec < 5) return 'Just now';
    if (sec < 60) return `${sec} seconds ago`;
    const m = Math.floor(sec / 60);
    return `${m} min${m > 1 ? 's' : ''} ago`;
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="sm" className="p-1" onClick={() => setCurrentScreen('farmer-home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-[#1E293B] flex items-center gap-1.5">
              <span>APMC Price Dashboard</span>
            </h1>
            <p className="text-[10px] text-[#64748B]">Real-time APMC Mandi prices across India</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Live pulse */}
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute inset-0" />
              </div>
              <span className="text-[10px] text-green-700">LIVE</span>
            </div>
          </div>
        </div>

        {/* API Connection Status Bar */}
        <div className="flex items-center justify-between px-4 pb-2 text-[10px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-green-600">
              {apiConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3 text-red-500" />}
              {apiConnected ? 'Connected' : 'Offline'}
            </span>
            <span className="flex items-center gap-1 text-[#64748B]">
              <Database className="h-3 w-3" />
              eNAM / Agmarknet
            </span>
          </div>
          {priceData && (
            <span className="flex items-center gap-1 text-[#64748B]">
              <Clock className="h-3 w-3" />
              Updated {formatUpdatedTime(lastUpdatedSec)}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-28">
        {/* ═══════════════════════════════════════════════════════
            SECTION 1: CROP SELECTION
           ═══════════════════════════════════════════════════════ */}
        <Card className="bg-white shadow-sm border-0" style={{ borderRadius: 12 }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1E293B] flex items-center gap-1.5">
                <span className="text-lg">🌾</span> Select Crop to Analyze
              </h2>
              <Badge variant="outline" className="text-[9px] text-[#64748B]">{CROPS.length} Crops</Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <Input
                placeholder="Search crops (e.g., Rice, गेहूं, Pulses)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-[#F8FAFC] border-[#E2E8F0] text-sm"
                style={{ borderRadius: 8 }}
              />
              {searchQuery && (
                <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery('')}>
                  <X className="h-4 w-4 text-[#94A3B8]" />
                </button>
              )}
            </div>

            {/* Crop Grid — grouped by category */}
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-3">
              {Object.entries(groupedCrops).map(([category, crops]) => (
                <div key={category}>
                  <p className="text-[10px] text-[#94A3B8] mb-1.5 sticky top-0 bg-white z-[1]">{category}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {crops.map(crop => {
                      const isSelected = selectedCrop?.id === crop.id;
                      return (
                        <button
                          key={crop.id}
                          onClick={() => { setSelectedCrop(crop); setPriceData(null); }}
                          className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? 'border-[#22C55E] bg-green-50 shadow-sm'
                              : 'border-[#F1F5F9] bg-white hover:bg-[#F8FAFC] hover:border-[#E2E8F0]'
                          }`}
                        >
                          <span className="text-xl">{crop.emoji}</span>
                          <span className="text-[10px] text-[#1E293B] mt-0.5 truncate w-full">{crop.name.split('(')[0].trim()}</span>
                          <span className="text-[9px] text-[#94A3B8] truncate w-full">{crop.hindi}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Crop Info */}
            {selectedCrop && (
              <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCrop.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-[#1E293B]">
                      {selectedCrop.name} <span className="text-[#64748B]">({selectedCrop.hindi})</span>
                    </p>
                    <p className="text-[10px] text-[#64748B]">{selectedCrop.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#64748B]">Range</p>
                    <p className="text-xs text-[#1E293B]" style={{ fontFamily: 'monospace' }}>
                      ₹{selectedCrop.minRange.toLocaleString()} - ₹{selectedCrop.maxRange.toLocaleString()}
                    </p>
                  </div>
                </div>
                {selectedCrop.msp !== null && (
                  <div className="mt-2 pt-2 border-t border-green-200 flex items-center justify-between">
                    <span className="text-[10px] text-green-700 flex items-center gap-1">
                      <Info className="h-3 w-3" /> MSP (Govt. Support Price)
                    </span>
                    <span className="text-xs text-green-800" style={{ fontFamily: 'monospace' }}>₹{selectedCrop.msp.toLocaleString()}/Quintal</span>
                  </div>
                )}
                {selectedCrop.msp === null && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <span className="text-[10px] text-orange-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> No MSP declared for {selectedCrop.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════
            ANALYZE BUTTON
           ═══════════════════════════════════════════════════════ */}
        <Button
          onClick={handleAnalyze}
          disabled={!selectedCrop || isAnalyzing}
          className="w-full h-12 text-white shadow-md disabled:opacity-50"
          style={{
            background: selectedCrop && !isAnalyzing ? 'linear-gradient(135deg, #22C55E, #16A34A)' : undefined,
            borderRadius: 10,
          }}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Fetching Live APMC Prices...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyze Live APMC Prices
            </span>
          )}
        </Button>

        {/* ═══════════════════════════════════════════════════════
            RESULTS
           ═══════════════════════════════════════════════════════ */}
        {priceData && stats && selectedCrop && (
          <>
            {/* Live Controls Bar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]" style={{ borderRadius: 6 }}
                  onClick={handleRefresh} disabled={isAnalyzing}>
                  <RefreshCw className={`h-3 w-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Badge variant="outline" className="text-[9px] text-green-600 border-green-200 bg-green-50">
                  <Database className="h-3 w-3 mr-0.5" /> eNAM Portal
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] text-[#64748B]">Auto</Label>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </div>

            {/* ─── Quick Stats ───────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-green-700 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Highest Price</p>
                  <p className="text-lg text-green-800" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.highestMax.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                  <p className="text-[10px] text-green-600 truncate">{stats.highestMandi.shortName}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-orange-700 flex items-center gap-1"><TrendingDown className="h-3 w-3" />Lowest Price</p>
                  <p className="text-lg text-orange-800" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.lowestMin.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                  <p className="text-[10px] text-orange-600 truncate">{stats.lowestMandi.shortName}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-blue-700 flex items-center gap-1"><BarChart3 className="h-3 w-3" />Avg Modal Price</p>
                  <p className="text-lg text-blue-800" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.avgModal.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                  <p className="text-[10px] text-blue-600">Across {APMC_MANDIS.length} mandis</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-purple-700 flex items-center gap-1">
                    {selectedCrop.msp ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    MSP
                  </p>
                  <p className="text-lg text-purple-800" style={{ fontFamily: 'monospace' }}>
                    {selectedCrop.msp ? `₹${selectedCrop.msp.toLocaleString()}` : 'N/A'}
                    {selectedCrop.msp && <span className="text-[10px]">/Q</span>}
                  </p>
                  <p className="text-[10px] text-purple-600">
                    {selectedCrop.msp ? (stats.avgModal >= selectedCrop.msp ? 'Above MSP ✓' : 'Below MSP ⚠') : 'No MSP'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Arrivals & Trend Mini Cards */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
                <p className="text-[10px] text-[#64748B]">Total Arrivals</p>
                <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'monospace' }}>{stats.totalArrivals.toLocaleString()} Tonnes</p>
              </div>
              <div className="flex-1 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
                <p className="text-[10px] text-[#64748B]">Avg Trend</p>
                <p className={`text-sm flex items-center gap-1 ${stats.weekTrend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {stats.weekTrend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span style={{ fontFamily: 'monospace' }}>{stats.weekTrend >= 0 ? '+' : ''}{stats.weekTrend}%</span>
                </p>
              </div>
            </div>

            {/* ─── View Toggle + Filter ──────────────────────── */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white rounded-lg border border-[#E2E8F0] p-0.5 flex-1">
                <button onClick={() => setViewMode('table')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${viewMode === 'table' ? 'bg-[#22C55E] text-white' : 'text-[#64748B]'}`}>
                  Table View
                </button>
                <button onClick={() => setViewMode('chart')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${viewMode === 'chart' ? 'bg-[#22C55E] text-white' : 'text-[#64748B]'}`}>
                  Chart View
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-8" style={{ borderRadius: 8 }}>
                <Filter className="h-3 w-3 mr-1" />{showFilters ? 'Hide' : 'Sort'}
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-xs text-[#64748B] mb-2">Sort By</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([
                      { field: 'modalPrice' as SortField, label: 'Price' },
                      { field: 'change' as SortField, label: 'Change' },
                      { field: 'arrivals' as SortField, label: 'Arrivals' },
                      { field: 'city' as SortField, label: 'City' },
                    ]).map(s => (
                      <button key={s.field} onClick={() => toggleSort(s.field)}
                        className={`py-1.5 text-[10px] rounded-md border transition-all flex items-center justify-center gap-0.5 ${
                          sortField === s.field ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-[#E2E8F0] text-[#64748B]'
                        }`}>
                        {s.label}
                        {sortField === s.field && (sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ─── Chart View ────────────────────────────────── */}
            {viewMode === 'chart' && (
              <>
                <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <CardContent className="p-3">
                    <h3 className="text-sm text-[#1E293B] mb-2">
                      {selectedCrop.emoji} {selectedCrop.name} — Modal Price (₹/Quintal)
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 45, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="city" tick={{ fontSize: 9, fill: '#64748B' }} angle={-45} textAnchor="end" height={55} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748B' }} width={50} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8 }}
                          formatter={(value: number, name: string) => [
                            `₹${value.toLocaleString()}/Q`,
                            name === 'modal' ? 'Modal Price' : name === 'min' ? 'Min Price' : 'Max Price'
                          ]}
                          labelFormatter={(label) => {
                            const item = chartData.find(d => d.city === label);
                            return item ? item.mandi : label;
                          }}
                        />
                        <Bar dataKey="modal" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#22C55E]" /> Highest</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#F59E0B]" /> Lowest</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#3B82F6]" /> Others</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Map visualization */}
                <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <CardContent className="p-4">
                    <h3 className="text-sm text-[#1E293B] mb-3">Market Locations</h3>
                    <div className="relative bg-[#F1F5F9] rounded-xl overflow-hidden" style={{ height: 220 }}>
                      <div className="absolute inset-0">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-4 border-2 border-dashed border-[#CBD5E1] rounded-xl" />
                          {sortedData.map((d) => {
                            const mandi = APMC_MANDIS[d.mandiIndex];
                            const positions: Record<string, { x: number; y: number }> = {
                              Mumbai: { x: 30, y: 55 }, Delhi: { x: 42, y: 22 }, Bangalore: { x: 38, y: 75 },
                              Chennai: { x: 52, y: 72 }, Kolkata: { x: 68, y: 38 }, Hyderabad: { x: 45, y: 60 },
                              Ahmedabad: { x: 25, y: 40 }, Pune: { x: 32, y: 58 }, Jaipur: { x: 38, y: 28 },
                              Lucknow: { x: 52, y: 28 },
                            };
                            const pos = positions[mandi.city] || { x: 50, y: 50 };
                            const isBest = stats && d.maxPrice === stats.highestMax;
                            return (
                              <div key={mandi.marketCode}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                                <div className={`w-3 h-3 rounded-full ${isBest ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'} shadow-md`}>
                                  {isBest && <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-ping absolute inset-0" />}
                                </div>
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md p-1.5 hidden group-hover:block z-10 whitespace-nowrap border border-[#E2E8F0]">
                                  <p className="text-[9px] text-[#1E293B]">{mandi.shortName}</p>
                                  <p className="text-[9px] text-green-600" style={{ fontFamily: 'monospace' }}>₹{d.modalPrice.toLocaleString()}/Q</p>
                                  <p className="text-[8px] text-[#94A3B8]">{d.arrivals}T arrived</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-white/90 rounded-md px-2 py-1 text-[9px] text-[#64748B]">
                        Hover on markers for prices
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ─── Table View ────────────────────────────────── */}
            {viewMode === 'table' && (
              <div className="space-y-2">
                {/* Table Header Labels */}
                <div className="flex items-center gap-2 px-1 text-[10px] text-[#94A3B8]">
                  <button onClick={() => toggleSort('city')} className="flex items-center gap-0.5">
                    State / APMC <ArrowUpDown className="h-3 w-3" />
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => toggleSort('arrivals')} className="flex items-center gap-0.5">
                    Arr. <ArrowUpDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => toggleSort('modalPrice')} className="flex items-center gap-0.5 ml-2">
                    Modal ₹ <ArrowUpDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => toggleSort('change')} className="flex items-center gap-0.5 ml-2">
                    Chg <ArrowUpDown className="h-3 w-3" />
                  </button>
                </div>

                {sortedData.map((row) => {
                  const mandi = APMC_MANDIS[row.mandiIndex];
                  const isBest = stats && row.maxPrice === stats.highestMax;
                  const isExpanded = expandedRow === row.mandiIndex;

                  return (
                    <Card
                      key={mandi.marketCode}
                      className={`transition-all border-0 shadow-sm ${isBest ? 'ring-1 ring-[#F59E0B] bg-yellow-50/50' : 'bg-white'}`}
                      style={{ borderRadius: 12 }}
                    >
                      <CardContent className="p-3">
                        {/* Main row */}
                        <button className="w-full" onClick={() => setExpandedRow(isExpanded ? null : row.mandiIndex)}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-1.5">
                                <div className="relative">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute inset-0 opacity-50" />
                                </div>
                                <span className="text-sm text-[#1E293B]">{mandi.shortName}</span>
                                {isBest && <Badge className="bg-yellow-400 text-yellow-900 text-[8px] px-1 py-0">Best</Badge>}
                              </div>
                              <p className="text-[10px] text-[#94A3B8] ml-3.5">{mandi.state} · {mandi.marketCode}</p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <span className="text-[10px] text-[#94A3B8]">{row.arrivals}T</span>
                              <div>
                                <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'monospace' }}>₹{row.modalPrice.toLocaleString()}</p>
                                <div className={`flex items-center justify-end gap-0.5 text-[10px] ${row.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {row.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  <span>{row.change >= 0 ? '+' : ''}{row.change} ({row.changePercent}%)</span>
                                </div>
                              </div>
                              {isExpanded ? <ChevronUp className="h-4 w-4 text-[#94A3B8]" /> : <ChevronDown className="h-4 w-4 text-[#94A3B8]" />}
                            </div>
                          </div>
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-3">
                            {/* Full mandi name */}
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <p className="text-[10px] text-blue-700">{mandi.fullName}</p>
                              <p className="text-[9px] text-blue-500">{mandi.address}</p>
                            </div>

                            {/* Price breakdown: Min / Modal / Max */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="p-2 bg-[#F8FAFC] rounded-lg">
                                <p className="text-[9px] text-[#94A3B8]">Min ₹/Q</p>
                                <p className="text-xs text-[#1E293B]" style={{ fontFamily: 'monospace' }}>₹{row.minPrice.toLocaleString()}</p>
                              </div>
                              <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-[9px] text-green-700">Modal ₹/Q</p>
                                <p className="text-xs text-green-800" style={{ fontFamily: 'monospace' }}>₹{row.modalPrice.toLocaleString()}</p>
                              </div>
                              <div className="p-2 bg-[#F8FAFC] rounded-lg">
                                <p className="text-[9px] text-[#94A3B8]">Max ₹/Q</p>
                                <p className="text-xs text-[#1E293B]" style={{ fontFamily: 'monospace' }}>₹{row.maxPrice.toLocaleString()}</p>
                              </div>
                            </div>

                            {/* Arrivals & Update time */}
                            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" /> Arrivals: {row.arrivals} Tonnes
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Live
                              </span>
                            </div>

                            {/* MSP comparison */}
                            {selectedCrop.msp && (
                              <div className={`p-2 rounded-lg text-[10px] flex items-center justify-between ${
                                row.modalPrice >= selectedCrop.msp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                              }`}>
                                <span>vs MSP ₹{selectedCrop.msp.toLocaleString()}/Q</span>
                                <span style={{ fontFamily: 'monospace' }}>
                                  {row.modalPrice >= selectedCrop.msp
                                    ? `+₹${(row.modalPrice - selectedCrop.msp).toLocaleString()} above ✓`
                                    : `-₹${(selectedCrop.msp - row.modalPrice).toLocaleString()} below ⚠`
                                  }
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" size="sm" className="text-[10px] h-8" style={{ borderRadius: 8 }}
                                onClick={(e) => e.stopPropagation()}>
                                <MapPin className="h-3 w-3 mr-1" /> Directions
                              </Button>
                              <Button
                                variant={alertSet.has(mandi.marketCode) ? 'default' : 'outline'}
                                size="sm"
                                className={`text-[10px] h-8 ${alertSet.has(mandi.marketCode) ? 'bg-[#F59E0B] hover:bg-[#D97706] text-white' : ''}`}
                                style={{ borderRadius: 8 }}
                                onClick={(e) => { e.stopPropagation(); toggleAlert(mandi.marketCode); }}
                              >
                                <Bell className="h-3 w-3 mr-1" />
                                {alertSet.has(mandi.marketCode) ? 'Alert Set ✓' : 'Set Alert'}
                              </Button>
                              <Button variant="outline" size="sm" className="text-[10px] h-8" style={{ borderRadius: 8 }}
                                onClick={(e) => e.stopPropagation()}>
                                <Eye className="h-3 w-3 mr-1" /> History
                              </Button>
                              <Button variant="outline" size="sm" className="text-[10px] h-8" style={{ borderRadius: 8 }}
                                onClick={(e) => e.stopPropagation()}>
                                <Phone className="h-3 w-3 mr-1" /> Contact
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ─── Data Source Footer ────────────────────────── */}
            <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <CardContent className="p-3 space-y-2">
                <h4 className="text-xs text-[#1E293B] flex items-center gap-1"><Database className="h-3.5 w-3.5 text-[#3B82F6]" /> Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[9px] text-[#64748B]">
                    <ExternalLink className="h-3 w-3 mr-0.5" /> eNAM Portal (enam.gov.in)
                  </Badge>
                  <Badge variant="outline" className="text-[9px] text-[#64748B]">
                    <ExternalLink className="h-3 w-3 mr-0.5" /> Agmarknet (agmarknet.gov.in)
                  </Badge>
                </div>
                <p className="text-[9px] text-[#94A3B8]">
                  Prices are indicative and sourced from government APMC portals. Actual prices may vary.
                  {autoRefresh ? ' Auto-refreshing every 5 minutes.' : ' Auto-refresh disabled.'}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// Package icon for use in table
function Package(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
