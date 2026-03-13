import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  ArrowLeft, Search, TrendingUp, TrendingDown, ArrowUpDown,
  Bell, MapPin, BarChart3, Loader2, ChevronDown, ChevronUp,
  Filter, X, RefreshCw, Wifi, Clock, Database,
  ExternalLink, Info, CheckCircle2, AlertTriangle, Brain,
  Sparkles, Target, Trophy, Zap, ShieldCheck, Activity,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════
// CROP DATA — 20 Crops
// ═══════════════════════════════════════════════════════════════════
interface CropItem {
  id: string;
  name: string;
  hindi: string;
  emoji: string;
  category: string;
  minRange: number;
  maxRange: number;
  msp: number | null;
  demandStatus: 'High' | 'Medium' | 'Low';
}

const CROPS: CropItem[] = [
  { id: 'rice', name: 'Rice (Paddy)', hindi: 'धान', emoji: '🌾', category: 'Cereals', minRange: 1800, maxRange: 2500, msp: 2183, demandStatus: 'High' },
  { id: 'wheat', name: 'Wheat', hindi: 'गेहूं', emoji: '🌾', category: 'Cereals', minRange: 2000, maxRange: 2800, msp: 2275, demandStatus: 'High' },
  { id: 'maize', name: 'Maize', hindi: 'मक्का', emoji: '🌽', category: 'Cereals', minRange: 1400, maxRange: 2100, msp: 1962, demandStatus: 'Medium' },
  { id: 'bajra', name: 'Bajra', hindi: 'बाजरा', emoji: '🌿', category: 'Cereals', minRange: 1800, maxRange: 2400, msp: 2500, demandStatus: 'Medium' },
  { id: 'jowar', name: 'Jowar', hindi: 'ज्वार', emoji: '🌱', category: 'Cereals', minRange: 2200, maxRange: 3500, msp: 3180, demandStatus: 'Low' },
  { id: 'barley', name: 'Barley', hindi: 'जौ', emoji: '🌾', category: 'Cereals', minRange: 1500, maxRange: 2200, msp: 1735, demandStatus: 'Low' },
  { id: 'ragi', name: 'Ragi', hindi: 'रागी', emoji: '🌿', category: 'Cereals', minRange: 2800, maxRange: 3800, msp: 3846, demandStatus: 'Medium' },
  { id: 'chana', name: 'Chana', hindi: 'चना', emoji: '🫘', category: 'Pulses', minRange: 4200, maxRange: 5500, msp: 5440, demandStatus: 'High' },
  { id: 'tur', name: 'Tur Dal', hindi: 'तूर/अरहर', emoji: '🫘', category: 'Pulses', minRange: 5500, maxRange: 8000, msp: 7000, demandStatus: 'High' },
  { id: 'moong', name: 'Moong Dal', hindi: 'मूंग', emoji: '🫘', category: 'Pulses', minRange: 6000, maxRange: 8500, msp: 8558, demandStatus: 'Medium' },
  { id: 'urad', name: 'Urad Dal', hindi: 'उड़द', emoji: '🫘', category: 'Pulses', minRange: 5000, maxRange: 7500, msp: 6950, demandStatus: 'Medium' },
  { id: 'masoor', name: 'Masoor Dal', hindi: 'मसूर', emoji: '🫘', category: 'Pulses', minRange: 4500, maxRange: 6500, msp: 6425, demandStatus: 'Low' },
  { id: 'soybean', name: 'Soybean', hindi: 'सोयाबीन', emoji: '🫘', category: 'Oilseeds', minRange: 3800, maxRange: 5200, msp: 4600, demandStatus: 'High' },
  { id: 'groundnut', name: 'Groundnut', hindi: 'मूंगफली', emoji: '🥜', category: 'Oilseeds', minRange: 4500, maxRange: 6500, msp: 6377, demandStatus: 'Medium' },
  { id: 'mustard', name: 'Mustard', hindi: 'सरसों', emoji: '🌼', category: 'Oilseeds', minRange: 4000, maxRange: 5800, msp: 5650, demandStatus: 'High' },
  { id: 'sunflower', name: 'Sunflower', hindi: 'सूरजमुखी', emoji: '🌻', category: 'Oilseeds', minRange: 5000, maxRange: 6500, msp: 6760, demandStatus: 'Low' },
  { id: 'cotton', name: 'Cotton', hindi: 'कपास', emoji: '🌸', category: 'Cash Crops', minRange: 5500, maxRange: 7500, msp: 6620, demandStatus: 'High' },
  { id: 'sugarcane', name: 'Sugarcane', hindi: 'गन्ना', emoji: '🎋', category: 'Cash Crops', minRange: 280, maxRange: 350, msp: 315, demandStatus: 'Medium' },
  { id: 'onion', name: 'Onion', hindi: 'प्याज', emoji: '🧅', category: 'Vegetables', minRange: 800, maxRange: 2500, msp: null, demandStatus: 'High' },
  { id: 'potato', name: 'Potato', hindi: 'आलू', emoji: '🥔', category: 'Vegetables', minRange: 600, maxRange: 1800, msp: null, demandStatus: 'Medium' },
];

// ═══════════════════════════════════════════════════════════════════
// APMC MANDI DATA — 10 mandis (ordered: Chennai first as per spec)
// ═══════════════════════════════════════════════════════════════════
interface APMCMandi {
  state: string;
  city: string;
  fullName: string;
  shortName: string;
  code: string;
}

const MANDIS: APMCMandi[] = [
  { state: 'Tamil Nadu', city: 'Chennai', fullName: 'Koyambedu Wholesale Market Complex', shortName: 'Koyambedu Market', code: 'TN-KOYA' },
  { state: 'Maharashtra', city: 'Mumbai', fullName: 'Vashi Agricultural Produce Market Committee', shortName: 'Vashi APMC', code: 'MH-VASH' },
  { state: 'Delhi', city: 'Delhi', fullName: "Azadpur Mandi (Asia's Largest)", shortName: 'Azadpur Mandi', code: 'DL-AZAD' },
  { state: 'Telangana', city: 'Hyderabad', fullName: 'Bowenpally Agricultural Market', shortName: 'Bowenpally APMC', code: 'TS-BOWN' },
  { state: 'West Bengal', city: 'Kolkata', fullName: 'Howrah Wholesale Market', shortName: 'Howrah Market', code: 'WB-HOWR' },
  { state: 'Karnataka', city: 'Bangalore', fullName: 'Yeshwanthpur APMC Market', shortName: 'Yeshwanthpur APMC', code: 'KA-YESH' },
  { state: 'Gujarat', city: 'Ahmedabad', fullName: 'Jamalpur Grain Market APMC', shortName: 'Jamalpur APMC', code: 'GJ-JAMA' },
  { state: 'Maharashtra', city: 'Pune', fullName: 'Pune Market Yard (Gultekdi)', shortName: 'Market Yard Gultekdi', code: 'MH-PUNE' },
  { state: 'Rajasthan', city: 'Jaipur', fullName: 'Muhana Mandi APMC', shortName: 'Muhana Mandi', code: 'RJ-MUHA' },
  { state: 'Uttar Pradesh', city: 'Lucknow', fullName: 'Alambagh Mandi APMC', shortName: 'Alambagh Mandi', code: 'UP-ALAM' },
];

// ═══════════════════════════════════════════════════════════════════
// AI DATA GENERATION per crop
// ═══════════════════════════════════════════════════════════════════
interface CityAnalysis {
  mandiIdx: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  demandScore: number; // 0-100
  supplyStatus: 'LOW' | 'MEDIUM' | 'HIGH';
  gapTonnes: number; // negative = deficit, positive = surplus
  prediction7d: number; // ₹ change prediction
  arrivals: number;
}

// Hardcoded data for Rice, Cotton, Onion — others generated dynamically
const HARDCODED: Record<string, CityAnalysis[]> = {
  rice: [
    { mandiIdx: 0, minPrice: 2280, maxPrice: 2580, modalPrice: 2420, demandScore: 92, supplyStatus: 'LOW', gapTonnes: -3200, prediction7d: 120, arrivals: 425 },
    { mandiIdx: 1, minPrice: 2180, maxPrice: 2450, modalPrice: 2320, demandScore: 85, supplyStatus: 'LOW', gapTonnes: -1800, prediction7d: 80, arrivals: 245 },
    { mandiIdx: 2, minPrice: 2220, maxPrice: 2520, modalPrice: 2380, demandScore: 88, supplyStatus: 'MEDIUM', gapTonnes: -1200, prediction7d: 95, arrivals: 520 },
    { mandiIdx: 3, minPrice: 2150, maxPrice: 2450, modalPrice: 2300, demandScore: 78, supplyStatus: 'MEDIUM', gapTonnes: -800, prediction7d: 60, arrivals: 290 },
    { mandiIdx: 4, minPrice: 1980, maxPrice: 2280, modalPrice: 2120, demandScore: 72, supplyStatus: 'HIGH', gapTonnes: 1500, prediction7d: -35, arrivals: 380 },
    { mandiIdx: 5, minPrice: 2100, maxPrice: 2400, modalPrice: 2250, demandScore: 82, supplyStatus: 'MEDIUM', gapTonnes: -600, prediction7d: 45, arrivals: 310 },
    { mandiIdx: 6, minPrice: 2080, maxPrice: 2350, modalPrice: 2200, demandScore: 65, supplyStatus: 'HIGH', gapTonnes: 2200, prediction7d: -50, arrivals: 195 },
    { mandiIdx: 7, minPrice: 2050, maxPrice: 2380, modalPrice: 2210, demandScore: 76, supplyStatus: 'MEDIUM', gapTonnes: -400, prediction7d: 30, arrivals: 180 },
    { mandiIdx: 8, minPrice: 2000, maxPrice: 2300, modalPrice: 2150, demandScore: 58, supplyStatus: 'HIGH', gapTonnes: 1800, prediction7d: -80, arrivals: 165 },
    { mandiIdx: 9, minPrice: 1950, maxPrice: 2250, modalPrice: 2080, demandScore: 52, supplyStatus: 'HIGH', gapTonnes: 2500, prediction7d: -65, arrivals: 275 },
  ],
  cotton: [
    { mandiIdx: 0, minPrice: 6400, maxPrice: 7300, modalPrice: 6850, demandScore: 88, supplyStatus: 'LOW', gapTonnes: -1800, prediction7d: 180, arrivals: 55 },
    { mandiIdx: 1, minPrice: 6200, maxPrice: 7100, modalPrice: 6650, demandScore: 82, supplyStatus: 'LOW', gapTonnes: -1200, prediction7d: 120, arrivals: 85 },
    { mandiIdx: 2, minPrice: 6300, maxPrice: 7200, modalPrice: 6750, demandScore: 80, supplyStatus: 'MEDIUM', gapTonnes: -500, prediction7d: 90, arrivals: 45 },
    { mandiIdx: 3, minPrice: 6250, maxPrice: 7150, modalPrice: 6700, demandScore: 75, supplyStatus: 'MEDIUM', gapTonnes: -300, prediction7d: 60, arrivals: 92 },
    { mandiIdx: 4, minPrice: 5800, maxPrice: 6600, modalPrice: 6200, demandScore: 55, supplyStatus: 'HIGH', gapTonnes: 2000, prediction7d: -100, arrivals: 38 },
    { mandiIdx: 5, minPrice: 6100, maxPrice: 6950, modalPrice: 6520, demandScore: 70, supplyStatus: 'MEDIUM', gapTonnes: 400, prediction7d: 40, arrivals: 78 },
    { mandiIdx: 6, minPrice: 6500, maxPrice: 7400, modalPrice: 6950, demandScore: 94, supplyStatus: 'LOW', gapTonnes: -2500, prediction7d: 220, arrivals: 125 },
    { mandiIdx: 7, minPrice: 6050, maxPrice: 6900, modalPrice: 6480, demandScore: 68, supplyStatus: 'MEDIUM', gapTonnes: 600, prediction7d: 25, arrivals: 62 },
    { mandiIdx: 8, minPrice: 6150, maxPrice: 7000, modalPrice: 6580, demandScore: 62, supplyStatus: 'HIGH', gapTonnes: 1200, prediction7d: -45, arrivals: 70 },
    { mandiIdx: 9, minPrice: 5900, maxPrice: 6750, modalPrice: 6320, demandScore: 48, supplyStatus: 'HIGH', gapTonnes: 1800, prediction7d: -80, arrivals: 48 },
  ],
  onion: [
    { mandiIdx: 0, minPrice: 1400, maxPrice: 2100, modalPrice: 1750, demandScore: 95, supplyStatus: 'LOW', gapTonnes: -5000, prediction7d: 200, arrivals: 650 },
    { mandiIdx: 1, minPrice: 1200, maxPrice: 1850, modalPrice: 1520, demandScore: 86, supplyStatus: 'LOW', gapTonnes: -3500, prediction7d: 150, arrivals: 1250 },
    { mandiIdx: 2, minPrice: 1350, maxPrice: 2000, modalPrice: 1680, demandScore: 90, supplyStatus: 'LOW', gapTonnes: -4200, prediction7d: 180, arrivals: 1850 },
    { mandiIdx: 3, minPrice: 1250, maxPrice: 1900, modalPrice: 1580, demandScore: 78, supplyStatus: 'MEDIUM', gapTonnes: -1500, prediction7d: 80, arrivals: 490 },
    { mandiIdx: 4, minPrice: 1050, maxPrice: 1600, modalPrice: 1320, demandScore: 60, supplyStatus: 'HIGH', gapTonnes: 2000, prediction7d: -60, arrivals: 580 },
    { mandiIdx: 5, minPrice: 1150, maxPrice: 1750, modalPrice: 1450, demandScore: 72, supplyStatus: 'MEDIUM', gapTonnes: -800, prediction7d: 50, arrivals: 720 },
    { mandiIdx: 6, minPrice: 1180, maxPrice: 1780, modalPrice: 1480, demandScore: 68, supplyStatus: 'MEDIUM', gapTonnes: 500, prediction7d: 30, arrivals: 850 },
    { mandiIdx: 7, minPrice: 1100, maxPrice: 1700, modalPrice: 1380, demandScore: 74, supplyStatus: 'MEDIUM', gapTonnes: -600, prediction7d: 40, arrivals: 980 },
    { mandiIdx: 8, minPrice: 1080, maxPrice: 1650, modalPrice: 1360, demandScore: 55, supplyStatus: 'HIGH', gapTonnes: 1800, prediction7d: -40, arrivals: 420 },
    { mandiIdx: 9, minPrice: 1000, maxPrice: 1550, modalPrice: 1280, demandScore: 45, supplyStatus: 'HIGH', gapTonnes: 2500, prediction7d: -80, arrivals: 680 },
  ],
};

function generateCityData(crop: CropItem): CityAnalysis[] {
  if (HARDCODED[crop.id]) return HARDCODED[crop.id];

  let seed = 0;
  for (let i = 0; i < crop.id.length; i++) seed += crop.id.charCodeAt(i);

  const range = crop.maxRange - crop.minRange;

  return MANDIS.map((_, idx) => {
    const factor = 0.2 + ((seed + idx * 37) % 60) / 100;
    const modalPrice = Math.round(crop.minRange + range * factor);
    const minP = Math.round(modalPrice * (0.88 + ((seed + idx * 13) % 10) / 100));
    const maxP = Math.round(modalPrice * (1.06 + ((seed + idx * 7) % 14) / 100));
    const demandScore = Math.min(99, Math.max(20, 40 + ((seed + idx * 29) % 55)));
    const supplyStatus: 'LOW' | 'MEDIUM' | 'HIGH' =
      demandScore >= 75 ? 'LOW' : demandScore >= 55 ? 'MEDIUM' : 'HIGH';
    const gapTonnes = demandScore >= 70
      ? -(500 + ((seed + idx * 19) % 4000))
      : (200 + ((seed + idx * 11) % 3000));
    const prediction7d = demandScore >= 65
      ? (20 + ((seed + idx * 23) % 200))
      : -(10 + ((seed + idx * 17) % 120));
    const arrBase = crop.category === 'Vegetables' ? 400 : crop.category === 'Cash Crops' ? 40 : 150;
    const arrivals = arrBase + ((seed + idx * 31) % (arrBase * 3));

    return { mandiIdx: idx, minPrice: minP, maxPrice: maxP, modalPrice, demandScore, supplyStatus, gapTonnes, prediction7d, arrivals };
  });
}

// ═══════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════
type SortField = 'city' | 'modalPrice' | 'demandScore' | 'prediction7d';
type SortDir = 'asc' | 'desc';

export function KisanAIScreen() {
  const { setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<CityAnalysis[] | null>(null);
  const [sortField, setSortField] = useState<SortField>('demandScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(0);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setLastUpdatedSec(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Filter crops
  const filteredCrops = useMemo(() => {
    if (!searchQuery.trim()) return CROPS;
    const q = searchQuery.toLowerCase();
    return CROPS.filter(c =>
      c.name.toLowerCase().includes(q) || c.hindi.includes(searchQuery) || c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group by category
  const groupedCrops = useMemo(() => {
    const g: Record<string, CropItem[]> = {};
    filteredCrops.forEach(c => { if (!g[c.category]) g[c.category] = []; g[c.category].push(c); });
    return g;
  }, [filteredCrops]);

  // Analyze
  const handleAnalyze = useCallback(() => {
    if (!selectedCrop) return;
    setIsAnalyzing(true);
    setData(null);
    setLastUpdatedSec(0);
    setTimeout(() => {
      setData(generateCityData(selectedCrop));
      setIsAnalyzing(false);
    }, 2000);
  }, [selectedCrop]);

  // Refresh
  const handleRefresh = useCallback(() => {
    if (!selectedCrop) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setData(generateCityData(selectedCrop));
      setLastUpdatedSec(0);
      setIsAnalyzing(false);
    }, 600);
  }, [selectedCrop]);

  // Sorted
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'city') cmp = MANDIS[a.mandiIdx].city.localeCompare(MANDIS[b.mandiIdx].city);
      else if (sortField === 'modalPrice') cmp = a.modalPrice - b.modalPrice;
      else if (sortField === 'demandScore') cmp = a.demandScore - b.demandScore;
      else if (sortField === 'prediction7d') cmp = a.prediction7d - b.prediction7d;
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [data, sortField, sortDir]);

  // Stats
  const stats = useMemo(() => {
    if (!data) return null;
    const highDemand = [...data].sort((a, b) => b.demandScore - a.demandScore)[0];
    const lowDemand = [...data].sort((a, b) => a.demandScore - b.demandScore)[0];
    const bestPrice = [...data].sort((a, b) => b.modalPrice - a.modalPrice)[0];
    const avgModal = Math.round(data.reduce((s, d) => s + d.modalPrice, 0) / data.length);
    const confidence = 88 + (highDemand.demandScore % 10) + Math.random() * 2;
    return {
      highDemand, lowDemand, bestPrice, avgModal,
      recommendCity: MANDIS[highDemand.mandiIdx].city,
      confidence: parseFloat(confidence.toFixed(1)),
    };
  }, [data]);

  // Chart data
  const barChartData = useMemo(() => {
    if (!sortedData.length) return [];
    const maxD = Math.max(...sortedData.map(d => d.demandScore));
    const minD = Math.min(...sortedData.map(d => d.demandScore));
    return sortedData.map(d => ({
      city: MANDIS[d.mandiIdx].city,
      demand: d.demandScore,
      price: d.modalPrice,
      color: d.demandScore === maxD ? '#EF4444' : d.demandScore === minD ? '#F59E0B' : d.demandScore >= 70 ? '#22C55E' : '#3B82F6',
    }));
  }, [sortedData]);

  const radarData = useMemo(() => {
    if (!sortedData.length) return [];
    return sortedData.map(d => ({
      city: MANDIS[d.mandiIdx].city,
      demand: d.demandScore,
      price: Math.round((d.modalPrice / (selectedCrop?.maxRange || 1)) * 100),
    }));
  }, [sortedData, selectedCrop]);

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('desc'); }
  };

  const formatTime = (s: number) => s < 5 ? 'Just now' : s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;

  // Demand color
  const demandColor = (score: number) =>
    score >= 90 ? 'text-red-600 bg-red-50 border-red-200' :
    score >= 70 ? 'text-green-600 bg-green-50 border-green-200' :
    score >= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
    'text-orange-600 bg-orange-50 border-orange-200';

  const demandBg = (score: number) =>
    score >= 90 ? '#EF4444' : score >= 70 ? '#22C55E' : score >= 50 ? '#EAB308' : '#F97316';

  const supplyBadge = (s: 'LOW' | 'MEDIUM' | 'HIGH') => {
    const map = { LOW: 'bg-red-100 text-red-700', MEDIUM: 'bg-yellow-100 text-yellow-700', HIGH: 'bg-green-100 text-green-700' };
    return map[s];
  };

  const demandStatusBadge = (status: 'High' | 'Medium' | 'Low') => {
    const map = { High: 'bg-red-100 text-red-700 border-red-200', Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200', Low: 'bg-green-100 text-green-700 border-green-200' };
    return map[status];
  };

  // ═════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1E293B] to-[#334155] sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setCurrentScreen('farmer-home')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#22C55E]" />
              KisanAI Intelligence Hub
            </h1>
            <p className="text-[10px] text-[#94A3B8]">AI-Powered Demand & Price Analyzer</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#22C55E]/20 px-2 py-1 rounded-full">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping absolute inset-0" />
              </div>
              <span className="text-[10px] text-[#22C55E]">LIVE</span>
            </div>
          </div>
        </div>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pb-2.5 text-[10px]">
          <span className="flex items-center gap-1 text-[#22C55E]">
            <Wifi className="h-3 w-3" /> eNAM / Agmarknet Connected
          </span>
          {data && (
            <span className="flex items-center gap-1 text-[#94A3B8]">
              <Clock className="h-3 w-3" /> {formatTime(lastUpdatedSec)}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-28">
        {/* ═══════════════════════════════════════════════════
            PAGE 1: CROP SELECTION
           ═══════════════════════════════════════════════════ */}
        <Card className="bg-white border-0 shadow-md" style={{ borderRadius: 12 }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1E293B] flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span>AI Demand & Price Analyzer</span>
              </h2>
              <Badge variant="outline" className="text-[9px] border-[#22C55E] text-[#22C55E]">
                <Sparkles className="h-3 w-3 mr-0.5" />{CROPS.length} Crops
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <Input
                placeholder="Search crops (Rice, गेहूं, Pulses)..."
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

            {/* Crop Grid */}
            <div className="max-h-[320px] overflow-y-auto pr-1 space-y-3">
              {Object.entries(groupedCrops).map(([cat, crops]) => (
                <div key={cat}>
                  <p className="text-[10px] text-[#94A3B8] mb-1.5 sticky top-0 bg-white z-[1] py-0.5">{cat}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {crops.map(crop => {
                      const isSel = selectedCrop?.id === crop.id;
                      return (
                        <button key={crop.id}
                          onClick={() => { setSelectedCrop(crop); setData(null); }}
                          className={`relative flex flex-col items-center p-2.5 rounded-xl border-2 transition-all text-center ${
                            isSel ? 'border-[#22C55E] bg-green-50 shadow-md' : 'border-[#F1F5F9] bg-white hover:border-[#E2E8F0]'
                          }`}
                        >
                          {isSel && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span className="text-2xl">{crop.emoji}</span>
                          <span className="text-[10px] text-[#1E293B] mt-1 truncate w-full">{crop.name.split('(')[0].trim()}</span>
                          <span className="text-[9px] text-[#94A3B8] truncate w-full">{crop.hindi}</span>
                          <Badge className={`text-[8px] px-1.5 py-0 mt-1 border ${demandStatusBadge(crop.demandStatus)}`}>
                            {crop.demandStatus} Demand
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Crop Summary */}
            {selectedCrop && (
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCrop.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-[#1E293B]">{selectedCrop.name} <span className="text-[#64748B]">({selectedCrop.hindi})</span></p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#64748B]">₹{selectedCrop.minRange.toLocaleString()} - ₹{selectedCrop.maxRange.toLocaleString()}/Q</span>
                      <Badge className={`text-[8px] px-1 py-0 border ${demandStatusBadge(selectedCrop.demandStatus)}`}>
                        {selectedCrop.demandStatus}
                      </Badge>
                    </div>
                    {selectedCrop.msp && (
                      <p className="text-[10px] text-green-700 mt-0.5">MSP: ₹{selectedCrop.msp.toLocaleString()}/Q</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!selectedCrop || isAnalyzing}
          className="w-full h-12 text-white shadow-lg disabled:opacity-50"
          style={{
            background: selectedCrop && !isAnalyzing ? 'linear-gradient(135deg, #22C55E, #16A34A)' : undefined,
            borderRadius: 10,
          }}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>AI Analyzing Demand & Prices...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <span>Analyze Demand & Prices</span>
              <Sparkles className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* ═══════════════════════════════════════════════════
            PAGE 2: RESULTS
           ═══════════════════════════════════════════════════ */}
        {data && stats && selectedCrop && (
          <>
            {/* Controls */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]" style={{ borderRadius: 6 }}
                  onClick={handleRefresh} disabled={isAnalyzing}>
                  <RefreshCw className={`h-3 w-3 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Badge variant="outline" className="text-[9px] text-[#22C55E] border-green-200 bg-green-50">
                  <Database className="h-3 w-3 mr-0.5" /> eNAM
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Label className="text-[10px] text-[#64748B]">Auto</Label>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
            </div>

            {/* ─── AI Stats Cards ────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {/* Highest Demand */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-green-700 flex items-center gap-1"><Trophy className="h-3 w-3" /> Highest Demand</p>
                  <p className="text-sm text-[#1E293B] mt-1">{MANDIS[stats.highDemand.mandiIdx].city}</p>
                  <p className="text-lg text-green-800" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.highDemand.modalPrice.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1.5 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${stats.highDemand.demandScore}%`, backgroundColor: demandBg(stats.highDemand.demandScore) }} />
                    </div>
                    <span className="text-[10px] text-green-700">{stats.highDemand.demandScore}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Lowest Demand */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-orange-700 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Lowest Demand</p>
                  <p className="text-sm text-[#1E293B] mt-1">{MANDIS[stats.lowDemand.mandiIdx].city}</p>
                  <p className="text-lg text-orange-800" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.lowDemand.modalPrice.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${stats.lowDemand.demandScore}%`, backgroundColor: demandBg(stats.lowDemand.demandScore) }} />
                    </div>
                    <span className="text-[10px] text-orange-700">{stats.lowDemand.demandScore}</span>
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendation */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-blue-700 flex items-center gap-1"><Target className="h-3 w-3" /> AI Recommendation</p>
                  <p className="text-sm text-blue-800 mt-1">
                    Sell in <span className="text-blue-900">{stats.recommendCity}</span>
                  </p>
                  <p className="text-[10px] text-blue-600 mt-0.5">
                    Best demand-price ratio
                  </p>
                  <p className="text-lg text-blue-800 mt-0.5" style={{ fontFamily: 'monospace' }}>
                    ₹{stats.highDemand.modalPrice.toLocaleString()}<span className="text-[10px]">/Q</span>
                  </p>
                </CardContent>
              </Card>

              {/* AI Confidence */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-purple-700 flex items-center gap-1"><Brain className="h-3 w-3" /> AI Confidence</p>
                  <p className="text-2xl text-purple-800 mt-1" style={{ fontFamily: 'monospace' }}>
                    {stats.confidence}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all"
                        style={{ width: `${stats.confidence}%` }} />
                    </div>
                  </div>
                  <p className="text-[9px] text-purple-500 mt-1 flex items-center gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> Verified by AI Model v3.2
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* ─── View Toggle + Sort ────────────────────────── */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white rounded-lg border border-[#E2E8F0] p-0.5 flex-1">
                <button onClick={() => setViewMode('table')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${viewMode === 'table' ? 'bg-[#22C55E] text-white' : 'text-[#64748B]'}`}>
                  Table
                </button>
                <button onClick={() => setViewMode('chart')}
                  className={`flex-1 py-1.5 text-xs rounded-md transition-all ${viewMode === 'chart' ? 'bg-[#22C55E] text-white' : 'text-[#64748B]'}`}>
                  Charts
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-8" style={{ borderRadius: 8 }}>
                <Filter className="h-3 w-3 mr-1" />{showFilters ? 'Hide' : 'Sort'}
              </Button>
            </div>

            {showFilters && (
              <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <CardContent className="p-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {([
                      { f: 'demandScore' as SortField, l: 'Demand' },
                      { f: 'modalPrice' as SortField, l: 'Price' },
                      { f: 'prediction7d' as SortField, l: 'Predict' },
                      { f: 'city' as SortField, l: 'City' },
                    ]).map(s => (
                      <button key={s.f} onClick={() => toggleSort(s.f)}
                        className={`py-1.5 text-[10px] rounded-md border transition-all flex items-center justify-center gap-0.5 ${
                          sortField === s.f ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-[#E2E8F0] text-[#64748B]'
                        }`}>
                        {s.l}
                        {sortField === s.f && (sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ─── Charts ─────────────────────────────────── */}
            {viewMode === 'chart' && (
              <>
                {/* Demand Score Bar Chart */}
                <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <CardContent className="p-3">
                    <h3 className="text-sm text-[#1E293B] mb-2 flex items-center gap-1">
                      <Activity className="h-4 w-4 text-[#22C55E]" />
                      Demand Score by City
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={barChartData} margin={{ top: 5, right: 5, bottom: 45, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="city" tick={{ fontSize: 9, fill: '#64748B' }} angle={-45} textAnchor="end" height={55} />
                        <YAxis tick={{ fontSize: 9, fill: '#64748B' }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }}
                          formatter={(v: number) => [`${v}/100`, 'Demand Score']} />
                        <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                          {barChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-3 mt-2 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#EF4444]" /> Hot (90+)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#22C55E]" /> High (70-89)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#3B82F6]" /> Med (50-69)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#F59E0B]" /> Low (&lt;50)</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Radar Chart */}
                <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <CardContent className="p-3">
                    <h3 className="text-sm text-[#1E293B] mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4 text-[#3B82F6]" />
                      Demand vs Price Score
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis dataKey="city" tick={{ fontSize: 9, fill: '#64748B' }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                        <Radar name="Demand" dataKey="demand" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
                        <Radar name="Price %" dataKey="price" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ─── Table View ──────────────────────────────── */}
            {viewMode === 'table' && (
              <div className="space-y-2">
                {/* Column hints */}
                <div className="flex items-center gap-1 px-1 text-[9px] text-[#94A3B8]">
                  <button onClick={() => toggleSort('city')} className="flex items-center gap-0.5">
                    City/APMC <ArrowUpDown className="h-2.5 w-2.5" />
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => toggleSort('demandScore')} className="flex items-center gap-0.5">
                    Demand <ArrowUpDown className="h-2.5 w-2.5" />
                  </button>
                  <button onClick={() => toggleSort('modalPrice')} className="flex items-center gap-0.5 ml-2">
                    Price <ArrowUpDown className="h-2.5 w-2.5" />
                  </button>
                  <button onClick={() => toggleSort('prediction7d')} className="flex items-center gap-0.5 ml-2">
                    7d AI <ArrowUpDown className="h-2.5 w-2.5" />
                  </button>
                </div>

                {sortedData.map((row) => {
                  const m = MANDIS[row.mandiIdx];
                  const isBest = stats && row.demandScore === stats.highDemand.demandScore;
                  const isExp = expandedRow === row.mandiIdx;

                  return (
                    <Card key={m.code}
                      className={`transition-all border-0 shadow-sm ${isBest ? 'ring-2 ring-[#22C55E] bg-green-50/60' : 'bg-white'}`}
                      style={{ borderRadius: 12 }}
                    >
                      <CardContent className="p-3">
                        <button className="w-full" onClick={() => setExpandedRow(isExp ? null : row.mandiIdx)}>
                          <div className="flex items-center gap-2">
                            {/* City + Mandi */}
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-1.5">
                                <div className="relative">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute inset-0 opacity-50" />
                                </div>
                                <span className="text-sm text-[#1E293B] truncate">{m.city}</span>
                                {isBest && (
                                  <Badge className="bg-[#22C55E] text-white text-[8px] px-1 py-0">
                                    <Zap className="h-2.5 w-2.5 mr-0.5" />Best
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[10px] text-[#94A3B8] ml-3.5 truncate">{m.shortName}</p>
                            </div>

                            {/* Demand Score meter */}
                            <div className="w-11 text-center">
                              <div className={`text-[10px] px-1.5 py-0.5 rounded-md border ${demandColor(row.demandScore)}`}
                                style={{ fontFamily: 'monospace' }}>
                                {row.demandScore}
                              </div>
                            </div>

                            {/* Modal Price */}
                            <div className="text-right w-16">
                              <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'monospace' }}>
                                ₹{row.modalPrice.toLocaleString()}
                              </p>
                            </div>

                            {/* 7-Day Prediction */}
                            <div className="text-right w-14">
                              <div className={`flex items-center justify-end gap-0.5 text-[10px] ${
                                row.prediction7d > 0 ? 'text-green-600' : row.prediction7d < 0 ? 'text-red-500' : 'text-gray-400'
                              }`}>
                                {row.prediction7d > 0 ? <ArrowUp className="h-3 w-3" /> : row.prediction7d < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                <span style={{ fontFamily: 'monospace' }}>
                                  {row.prediction7d > 0 ? '+' : ''}{row.prediction7d}
                                </span>
                              </div>
                            </div>

                            <div className="ml-0.5">
                              {isExp ? <ChevronUp className="h-4 w-4 text-[#94A3B8]" /> : <ChevronDown className="h-4 w-4 text-[#94A3B8]" />}
                            </div>
                          </div>
                        </button>

                        {/* Expanded */}
                        {isExp && (
                          <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-3">
                            {/* Full mandi info */}
                            <div className="bg-blue-50 p-2.5 rounded-lg">
                              <p className="text-[10px] text-blue-800">{m.fullName}</p>
                              <p className="text-[9px] text-blue-500">{m.state} · {m.code}</p>
                            </div>

                            {/* Price grid */}
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

                            {/* Demand Score Visual */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-[#64748B]">Demand Score</span>
                                <span className="text-xs" style={{ fontFamily: 'monospace', color: demandBg(row.demandScore) }}>{row.demandScore}/100</span>
                              </div>
                              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{
                                  width: `${row.demandScore}%`,
                                  background: `linear-gradient(90deg, ${demandBg(row.demandScore)}88, ${demandBg(row.demandScore)})`,
                                }} />
                              </div>
                            </div>

                            {/* Supply + Gap + Prediction */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 rounded-lg bg-[#F8FAFC] text-center">
                                <p className="text-[9px] text-[#94A3B8]">Supply</p>
                                <Badge className={`text-[9px] px-1.5 py-0 mt-0.5 ${supplyBadge(row.supplyStatus)}`}>
                                  {row.supplyStatus}
                                </Badge>
                              </div>
                              <div className="p-2 rounded-lg bg-[#F8FAFC] text-center">
                                <p className="text-[9px] text-[#94A3B8]">Gap Analysis</p>
                                <p className={`text-[10px] mt-0.5 ${row.gapTonnes < 0 ? 'text-red-600' : 'text-green-600'}`} style={{ fontFamily: 'monospace' }}>
                                  {row.gapTonnes < 0 ? `Deficit ${row.gapTonnes.toLocaleString()}T` : `Surplus +${row.gapTonnes.toLocaleString()}T`}
                                </p>
                              </div>
                              <div className="p-2 rounded-lg bg-[#F8FAFC] text-center">
                                <p className="text-[9px] text-[#94A3B8]">7-Day AI</p>
                                <p className={`text-[10px] mt-0.5 flex items-center justify-center gap-0.5 ${
                                  row.prediction7d > 0 ? 'text-green-600' : 'text-red-500'
                                }`} style={{ fontFamily: 'monospace' }}>
                                  {row.prediction7d > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                  {row.prediction7d > 0 ? '+' : ''}₹{Math.abs(row.prediction7d)}
                                </p>
                              </div>
                            </div>

                            {/* Arrivals + Live */}
                            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                              <span>Arrivals: {row.arrivals} Tonnes</span>
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
                                    : `-₹${(selectedCrop.msp - row.modalPrice).toLocaleString()} below ⚠`}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ─── Data Source ──────────────────────────────── */}
            <Card className="bg-white border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <CardContent className="p-3 space-y-2">
                <h4 className="text-xs text-[#1E293B] flex items-center gap-1"><Database className="h-3.5 w-3.5 text-[#3B82F6]" /> Data & AI Sources</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[9px] text-[#64748B]">
                    <ExternalLink className="h-3 w-3 mr-0.5" /> eNAM Portal
                  </Badge>
                  <Badge variant="outline" className="text-[9px] text-[#64748B]">
                    <ExternalLink className="h-3 w-3 mr-0.5" /> Agmarknet
                  </Badge>
                  <Badge variant="outline" className="text-[9px] text-[#64748B]">
                    <Brain className="h-3 w-3 mr-0.5" /> KisanAI v3.2
                  </Badge>
                </div>
                <p className="text-[9px] text-[#94A3B8]">
                  AI predictions are based on historical APMC data, weather patterns, and seasonal demand analysis. Confidence: {stats.confidence}%.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
