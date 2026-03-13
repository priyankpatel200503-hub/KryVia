import { useState, useMemo } from 'react';
import {
  ArrowLeft, Truck, MapPin, Clock, Route, TrendingDown, CheckCircle2, AlertCircle,
  Navigation, Bike, Package, Container, ChevronDown, ChevronUp, Calendar,
  RotateCcw, Share2, Bookmark, Fuel, Gauge, IndianRupee, BarChart3, PieChart as PieChartIcon,
  Search, Zap, Shield, ArrowRight, Info, Percent, Weight
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslation } from '../translations';
import { calculateRoute, RouteCalculationResult, VEHICLE_FUEL_EFFICIENCY } from '../../lib/google-maps-service';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// ─── Vehicle Data ─────────────────────────────────────────────────
interface VehicleInfo {
  id: string;
  name: string;
  icon: any;
  capacity: string;
  mileage: number;
  baseRate: number;
  description: string;
}

const VEHICLES: VehicleInfo[] = [
  { id: 'bike', name: 'Bike', icon: Bike, capacity: '20 kg', mileage: 40, baseRate: 3, description: 'Small parcels' },
  { id: 'tempo', name: 'Tempo', icon: Truck, capacity: '500 kg', mileage: 14, baseRate: 8, description: '3-wheeler cargo' },
  { id: 'pickup', name: 'Pickup', icon: Truck, capacity: '1 ton', mileage: 12, baseRate: 10, description: 'Light cargo' },
  { id: 'mini-truck', name: 'Mini Truck', icon: Truck, capacity: '2.5 tons', mileage: 10, baseRate: 12, description: '10ft closed body' },
  { id: 'truck', name: 'Medium Truck', icon: Truck, capacity: '7 tons', mileage: 8, baseRate: 15, description: '14ft open/closed' },
  { id: 'container', name: 'Container', icon: Container, capacity: '15 tons', mileage: 5, baseRate: 20, description: '20ft container' },
];

// ─── Popular Routes ───────────────────────────────────────────────
interface PopularRoute {
  from: string;
  to: string;
  distance: number;
  miniTruck: number;
  mediumTruck: number;
  largeTruck: number;
}

const POPULAR_ROUTES: PopularRoute[] = [
  { from: 'Mumbai', to: 'Delhi', distance: 1400, miniTruck: 18200, mediumTruck: 25200, largeTruck: 42000 },
  { from: 'Delhi', to: 'Jaipur', distance: 280, miniTruck: 3640, mediumTruck: 5040, largeTruck: 8400 },
  { from: 'Ahmedabad', to: 'Mumbai', distance: 524, miniTruck: 6812, mediumTruck: 9432, largeTruck: 15720 },
  { from: 'Pune', to: 'Bangalore', distance: 840, miniTruck: 10920, mediumTruck: 15120, largeTruck: 25200 },
  { from: 'Lucknow', to: 'Delhi', distance: 555, miniTruck: 7215, mediumTruck: 9990, largeTruck: 16650 },
  { from: 'Hyderabad', to: 'Chennai', distance: 625, miniTruck: 8125, mediumTruck: 11250, largeTruck: 18750 },
  { from: 'Kolkata', to: 'Patna', distance: 590, miniTruck: 7670, mediumTruck: 10620, largeTruck: 17700 },
  { from: 'Nashik', to: 'Nagpur', distance: 580, miniTruck: 7540, mediumTruck: 10440, largeTruck: 17400 },
];

// ─── Fuel Price ───────────────────────────────────────────────────
const CURRENT_FUEL_PRICE = 95; // ₹/liter diesel
const GST_RATE = 5; // 5% GST on transport

// ─── Component ────────────────────────────────────────────────────
export function TransportOptimizationScreen() {
  const { setCurrentScreen, user, language, orders } = useApp();
  const t = useTranslation(language);

  // Route inputs
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('truck');
  const [cargoWeight, setCargoWeight] = useState([2000]); // kg
  const [includeReturn, setIncludeReturn] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [compareMode, setCompareMode] = useState(false);

  // State management
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Collapsible sections
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showCharts, setShowCharts] = useState(false);
  const [routeSearch, setRouteSearch] = useState('');

  // City suggestions
  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow',
    'Nagpur', 'Indore', 'Surat', 'Hyderabad', 'Kolkata', 'Chennai', 'Chandigarh',
    'Nashik', 'Patna', 'Agra', 'Varanasi', 'Ludhiana', 'Rajkot', 'Vadodara'
  ];
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromSuggestions = fromCity.length > 0
    ? cities.filter(c => c.toLowerCase().includes(fromCity.toLowerCase()))
    : [];
  const toSuggestions = toCity.length > 0
    ? cities.filter(c => c.toLowerCase().includes(toCity.toLowerCase()))
    : [];

  // Get active vehicle info
  const activeVehicle = VEHICLES.find(v => v.id === selectedVehicle) || VEHICLES[4];

  // ─── Charge Calculation ───────────────────────────────────────
  const chargeBreakdown = useMemo(() => {
    if (!optimizedRoute) return null;
    const distanceKm = optimizedRoute.distanceValue;
    const mileage = activeVehicle.mileage;
    const fuelRequired = Math.round((distanceKm / mileage) * 10) / 10;
    const fuelCost = Math.round(fuelRequired * CURRENT_FUEL_PRICE);
    const baseDistanceCharge = Math.round(activeVehicle.baseRate * distanceKm);
    const driverAllowance = Math.round(optimizedRoute.estimatedTimeValue * 5);
    const tollCharges = Math.round(distanceKm * 2);
    const subtotal = fuelCost + baseDistanceCharge + driverAllowance + tollCharges;
    const gst = Math.round(subtotal * GST_RATE / 100);
    const total = subtotal + gst;
    const returnTotal = includeReturn ? total * 2 : total;

    return {
      distanceKm: Math.round(distanceKm),
      vehicleName: activeVehicle.name,
      mileage,
      fuelRequired,
      fuelPricePerLiter: CURRENT_FUEL_PRICE,
      fuelCost,
      baseRate: activeVehicle.baseRate,
      baseDistanceCharge,
      driverAllowance,
      tollCharges,
      subtotal,
      gstRate: GST_RATE,
      gst,
      total,
      returnTotal,
      includeReturn,
    };
  }, [optimizedRoute, activeVehicle, includeReturn]);

  // ─── Vehicle Comparison Data ──────────────────────────────────
  const vehicleComparisonData = useMemo(() => {
    if (!optimizedRoute) return [];
    const distanceKm = optimizedRoute.distanceValue;
    return VEHICLES.map(v => {
      const fuel = Math.round(distanceKm / v.mileage * CURRENT_FUEL_PRICE);
      const base = Math.round(v.baseRate * distanceKm);
      const toll = Math.round(distanceKm * 2);
      const driver = Math.round(optimizedRoute.estimatedTimeValue * 5);
      const sub = fuel + base + toll + driver;
      const gst = Math.round(sub * GST_RATE / 100);
      return { name: v.name, cost: sub + gst, capacity: v.capacity, id: v.id };
    });
  }, [optimizedRoute]);

  // Pie chart data
  const pieData = useMemo(() => {
    if (!chargeBreakdown) return [];
    return [
      { name: 'Fuel', value: chargeBreakdown.fuelCost, color: '#2563EB' },
      { name: 'Transport', value: chargeBreakdown.baseDistanceCharge, color: '#10B981' },
      { name: 'Driver', value: chargeBreakdown.driverAllowance, color: '#F59E0B' },
      { name: 'Toll', value: chargeBreakdown.tollCharges, color: '#8B5CF6' },
      { name: 'GST', value: chargeBreakdown.gst, color: '#EF4444' },
    ];
  }, [chargeBreakdown]);

  // Route efficiency score
  const efficiencyScore = useMemo(() => {
    if (!optimizedRoute) return 0;
    const d = optimizedRoute.distanceValue;
    if (d < 200) return 92;
    if (d < 500) return 85;
    if (d < 1000) return 78;
    return 70;
  }, [optimizedRoute]);

  // Filtered popular routes
  const filteredPopularRoutes = POPULAR_ROUTES.filter(r =>
    r.from.toLowerCase().includes(routeSearch.toLowerCase()) ||
    r.to.toLowerCase().includes(routeSearch.toLowerCase())
  );

  // ─── Handlers ─────────────────────────────────────────────────
  const handleOptimize = async () => {
    if (!fromCity || !toCity) return;
    setOptimizing(true);
    setError(null);
    try {
      const result = await calculateRoute(fromCity, toCity, selectedVehicle);
      setOptimizedRoute(result);
      setActiveTab('calculator');
    } catch (err) {
      setError('Unable to calculate route. Please check your locations and try again.');
    } finally {
      setOptimizing(false);
    }
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    setActiveTab('calculator');
  };

  const resetCalculator = () => {
    setOptimizedRoute(null);
    setFromCity('');
    setToCity('');
    setError(null);
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-lg">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => setCurrentScreen('buyer-home')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg">{t.transportOptimization}</h1>
            <p className="text-xs text-blue-100">{t.fasterDelivery}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white border-0 text-[10px] px-2 py-0.5">
              <Zap className="h-3 w-3 mr-1" />AI
            </Badge>
          </div>
        </div>
        {/* Real-time fuel indicator */}
        <div className="flex items-center justify-between px-4 pb-3 text-xs text-blue-100">
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span>Diesel: ₹{CURRENT_FUEL_PRICE}/L</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>FASTag Ready</span>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-[104px] z-10 bg-white border-b shadow-sm">
          <TabsList className="grid w-full grid-cols-3 rounded-none h-11 bg-white p-0">
            <TabsTrigger value="calculator" className="text-xs rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:shadow-none data-[state=active]:text-[#2563EB]">
              <Route className="h-3.5 w-3.5 mr-1" />Calculator
            </TabsTrigger>
            <TabsTrigger value="routes" className="text-xs rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:shadow-none data-[state=active]:text-[#2563EB]">
              <MapPin className="h-3.5 w-3.5 mr-1" />Routes
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="text-xs rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:shadow-none data-[state=active]:text-[#2563EB]">
              <Truck className="h-3.5 w-3.5 mr-1" />Vehicles
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TAB 1 — ROUTE CALCULATOR
           ══════════════════════════════════════════════════════════ */}
        <TabsContent value="calculator" className="mt-0 p-4 space-y-4 pb-28">
          {/* Section 1: Route Input */}
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <h3 className="flex items-center gap-2 text-[#2563EB]">
                <Route className="h-5 w-5" />
                <span>Route Calculator</span>
              </h3>

              {/* From City */}
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">From City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#10B981]" />
                  <Input
                    placeholder="Enter pickup city..."
                    value={fromCity}
                    onChange={(e) => { setFromCity(e.target.value); setShowFromSuggestions(true); }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                    className="pl-10 rounded-lg border-gray-200"
                  />
                </div>
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute z-30 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {fromSuggestions.map(city => (
                      <button key={city} className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                        onMouseDown={() => { setFromCity(city); setShowFromSuggestions(false); }}>
                        <MapPin className="h-3 w-3 inline mr-2 text-gray-400" />{city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap button */}
              <div className="flex justify-center -my-1">
                <button onClick={() => { const tmp = fromCity; setFromCity(toCity); setToCity(tmp); }}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <RotateCcw className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* To City */}
              <div className="relative">
                <label className="text-xs text-muted-foreground mb-1 block">To City</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EF4444]" />
                  <Input
                    placeholder="Enter delivery city..."
                    value={toCity}
                    onChange={(e) => { setToCity(e.target.value); setShowToSuggestions(true); }}
                    onFocus={() => setShowToSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    className="pl-10 rounded-lg border-gray-200"
                  />
                </div>
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute z-30 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {toSuggestions.map(city => (
                      <button key={city} className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                        onMouseDown={() => { setToCity(city); setShowToSuggestions(false); }}>
                        <Navigation className="h-3 w-3 inline mr-2 text-gray-400" />{city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Controls */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {/* Cargo Weight Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Weight className="h-3 w-3" /> Cargo Weight
                    </label>
                    <span className="text-xs bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full">{cargoWeight[0].toLocaleString()} kg</span>
                  </div>
                  <Slider
                    value={cargoWeight}
                    onValueChange={setCargoWeight}
                    min={10}
                    max={15000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10 kg</span>
                    <span>15,000 kg</span>
                  </div>
                </div>

                {/* Return Trip & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={includeReturn} onCheckedChange={setIncludeReturn} />
                    <Label className="text-xs">Include Return Trip</Label>
                  </div>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="text-xs border rounded-lg px-2 py-1.5 bg-white"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{error}</p>
                </div>
              )}

              {/* Calculate Button */}
              <Button
                onClick={handleOptimize}
                disabled={!fromCity || !toCity || optimizing}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] rounded-lg h-11 shadow-md"
              >
                {optimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Calculating Route...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Calculate Route
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ── Section 2: Vehicle Selection (Collapsible) ─────── */}
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <button onClick={() => setShowVehicles(!showVehicles)}
                className="w-full flex items-center justify-between p-4">
                <h3 className="flex items-center gap-2 text-[#2563EB]">
                  <Truck className="h-5 w-5" />
                  <span>Select Vehicle</span>
                </h3>
                {showVehicles ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              {showVehicles && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {VEHICLES.map(v => {
                      const VIcon = v.icon;
                      const isSelected = selectedVehicle === v.id;
                      return (
                        <button key={v.id}
                          onClick={() => setSelectedVehicle(v.id)}
                          className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? 'border-[#2563EB] bg-blue-50 shadow-md'
                              : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <VIcon className={`h-6 w-6 mx-auto mb-1 ${isSelected ? 'text-[#2563EB]' : 'text-gray-500'}`} />
                          <p className={`text-[10px] ${isSelected ? 'text-[#2563EB]' : 'text-gray-700'}`}>{v.name}</p>
                          <p className="text-[9px] text-gray-400">{v.capacity}</p>
                          <p className="text-[9px] text-gray-400">{v.mileage} km/L</p>
                          <p className="text-[10px] text-[#10B981] mt-0.5">₹{v.baseRate}/km</p>
                        </button>
                      );
                    })}
                  </div>
                  {optimizedRoute && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <label className="text-xs text-gray-500">Compare Vehicles</label>
                      <Switch checked={compareMode} onCheckedChange={setCompareMode} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Results Section ─────────────────────────────────── */}
          {optimizedRoute && chargeBreakdown && (
            <>
              {/* Route Efficiency Score */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-[#2563EB]" />
                      <span className="text-sm">Route Efficiency</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full border-3 flex items-center justify-center text-xs ${
                        efficiencyScore >= 85 ? 'border-[#10B981] text-[#10B981]' :
                        efficiencyScore >= 75 ? 'border-[#F59E0B] text-[#F59E0B]' :
                        'border-[#EF4444] text-[#EF4444]'
                      }`} style={{ borderWidth: '3px' }}>
                        {efficiencyScore}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <MapPin className="h-3.5 w-3.5 mx-auto mb-1 text-[#2563EB]" />
                      <p className="text-xs">{optimizedRoute.distance}</p>
                      <p className="text-[10px] text-gray-400">Distance</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-[#F59E0B]" />
                      <p className="text-xs">{optimizedRoute.estimatedTime}</p>
                      <p className="text-[10px] text-gray-400">Time</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <Fuel className="h-3.5 w-3.5 mx-auto mb-1 text-[#8B5CF6]" />
                      <p className="text-xs">{chargeBreakdown.fuelRequired}L</p>
                      <p className="text-[10px] text-gray-400">Fuel</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <TrendingDown className="h-3.5 w-3.5 mx-auto mb-1 text-[#10B981]" />
                      <p className="text-xs">{optimizedRoute.savings}</p>
                      <p className="text-[10px] text-gray-400">Savings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Charge Breakdown */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <button onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full flex items-center justify-between p-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-[#2563EB]">
                        <IndianRupee className="h-5 w-5" />
                        <span>Charge Breakdown</span>
                      </h3>
                      <p className="text-xl mt-1 text-left">₹{chargeBreakdown.returnTotal.toLocaleString()}
                        {includeReturn && <span className="text-[10px] text-gray-400 ml-1">(round trip)</span>}
                      </p>
                    </div>
                    {showBreakdown ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </button>

                  {showBreakdown && (
                    <div className="px-4 pb-4 space-y-3">
                      {/* Formula */}
                      <div className="bg-gray-50 rounded-lg p-3 text-[10px] text-gray-600 space-y-0.5 border border-dashed border-gray-200">
                        <p className="text-[11px] text-gray-700 mb-1">Calculation Formula:</p>
                        <p>Total = (Distance ÷ Mileage) × Fuel Price</p>
                        <p className="ml-8">+ Base Rate × Distance</p>
                        <p className="ml-8">+ Driver Allowance + Tolls + GST</p>
                      </div>

                      {/* Itemized Table */}
                      <div className="space-y-2">
                        {[
                          { label: 'Distance', value: `${chargeBreakdown.distanceKm} km`, icon: MapPin },
                          { label: 'Vehicle', value: chargeBreakdown.vehicleName, icon: Truck },
                          { label: 'Mileage', value: `${chargeBreakdown.mileage} km/L`, icon: Gauge },
                          { label: 'Fuel Required', value: `${chargeBreakdown.fuelRequired} L`, icon: Fuel },
                          { label: `Fuel Price`, value: `₹${chargeBreakdown.fuelPricePerLiter}/L`, icon: Fuel },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1">
                            <span className="flex items-center gap-2 text-gray-500">
                              <item.icon className="h-3 w-3" />{item.label}
                            </span>
                            <span>{item.value}</span>
                          </div>
                        ))}

                        <div className="border-t border-gray-100 pt-2 space-y-1.5">
                          {[
                            { label: 'Fuel Cost', amount: chargeBreakdown.fuelCost },
                            { label: `Distance Charge (₹${chargeBreakdown.baseRate}/km)`, amount: chargeBreakdown.baseDistanceCharge },
                            { label: 'Driver Allowance', amount: chargeBreakdown.driverAllowance },
                            { label: 'Toll Charges', amount: chargeBreakdown.tollCharges },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{item.label}</span>
                              <span>₹{item.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Percent className="h-3 w-3" />GST ({chargeBreakdown.gstRate}%)</span>
                            <span>₹{chargeBreakdown.gst.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="border-t-2 border-[#2563EB] pt-2 flex items-center justify-between">
                          <span className="text-[#2563EB]">TOTAL ESTIMATED</span>
                          <span className="text-lg text-[#2563EB]">₹{chargeBreakdown.returnTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Visualizations */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <button onClick={() => setShowCharts(!showCharts)}
                    className="w-full flex items-center justify-between p-4">
                    <h3 className="flex items-center gap-2 text-[#2563EB]">
                      <BarChart3 className="h-5 w-5" />
                      <span>Cost Analytics</span>
                    </h3>
                    {showCharts ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </button>
                  {showCharts && (
                    <div className="px-4 pb-4 space-y-4">
                      {/* Bar Chart: Vehicle Cost Comparison */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Cost by Vehicle Type</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vehicleComparisonData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                              <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                              <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Cost']} />
                              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                                {vehicleComparisonData.map((entry) => (
                                  <Cell key={entry.id} fill={entry.id === selectedVehicle ? '#2563EB' : '#CBD5E1'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Pie Chart: Charge Breakdown */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Charge Distribution</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                                paddingAngle={3} dataKey="value">
                                {pieData.map((entry, i) => (
                                  <Cell key={i} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                              <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Comparison Mode */}
              {compareMode && (
                <Card className="border-0 shadow-md rounded-xl overflow-hidden border-l-4 border-l-[#F59E0B]">
                  <CardContent className="p-4">
                    <h3 className="flex items-center gap-2 text-[#F59E0B] mb-3">
                      <BarChart3 className="h-5 w-5" />
                      <span>Vehicle Comparison</span>
                    </h3>
                    <div className="space-y-2">
                      {vehicleComparisonData.map((v) => (
                        <div key={v.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg ${
                            v.id === selectedVehicle ? 'bg-blue-50 border border-[#2563EB]' : 'bg-gray-50'
                          }`}>
                          <div>
                            <p className={`text-sm ${v.id === selectedVehicle ? 'text-[#2563EB]' : ''}`}>{v.name}</p>
                            <p className="text-[10px] text-gray-400">{v.capacity}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm ${v.id === selectedVehicle ? 'text-[#2563EB]' : ''}`}>₹{v.cost.toLocaleString()}</p>
                            {v.id === selectedVehicle && <Badge className="text-[9px] bg-[#2563EB] mt-0.5">Selected</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Route Steps */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="flex items-center gap-2 text-[#2563EB] mb-3">
                    <Route className="h-5 w-5" />
                    <span>Step-by-Step Route</span>
                  </h3>
                  <div className="space-y-0">
                    {optimizedRoute.route.map((step: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${
                            step.action === 'Pickup' ? 'bg-[#10B981]' :
                            step.action === 'Delivery' ? 'bg-[#2563EB]' :
                            step.action === 'Rest Stop' ? 'bg-[#F59E0B]' : 'bg-gray-400'
                          }`}>
                            {step.step}
                          </div>
                          {index < optimizedRoute.route.length - 1 && (
                            <div className="w-0.5 h-10 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm">{step.location}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">{step.action}</span>
                            <span className="text-[10px] text-[#2563EB]">⏱️ {step.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Routes */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="flex items-center gap-2 text-[#2563EB] mb-3">
                    <Navigation className="h-5 w-5" />
                    <span>Alternative Routes</span>
                  </h3>
                  <div className="space-y-2">
                    {optimizedRoute.alternativeRoutes.map((route: any, index: number) => (
                      <div key={index}
                        className={`p-3 rounded-lg border transition-all ${
                          index === 0 ? 'border-[#2563EB] bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">{route.name}</p>
                          <Badge variant={index === 0 ? 'default' : 'outline'} className={`text-[10px] ${index === 0 ? 'bg-[#2563EB]' : ''}`}>
                            {route.cost}
                          </Badge>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-400">
                          <span>{route.distance}</span>
                          <span>•</span>
                          <span>{route.time}</span>
                          {route.savings && (
                            <>
                              <span>•</span>
                              <span className="text-[#10B981]">Save {route.savings}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Tips */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-4">
                  <h3 className="flex items-center gap-2 text-[#F59E0B] mb-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>AI-Powered Tips</span>
                  </h3>
                  <ul className="space-y-2">
                    {optimizedRoute.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Reset */}
              <Button onClick={resetCalculator} variant="outline" className="w-full rounded-lg h-10 border-gray-200">
                <RotateCcw className="h-4 w-4 mr-2" /> Calculate Another Route
              </Button>
            </>
          )}

          {/* ── Empty State (no results yet) ───────────────────── */}
          {!optimizedRoute && !optimizing && (
            <Card className="border-0 shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-[#2563EB] mb-3">
                  <Info className="h-5 w-5" />
                  <span>How It Works</span>
                </h3>
                <ul className="space-y-2.5">
                  {[
                    { step: '1', text: 'Enter pickup and delivery cities', color: 'bg-[#2563EB]' },
                    { step: '2', text: 'Select vehicle type and cargo weight', color: 'bg-[#10B981]' },
                    { step: '3', text: 'AI analyzes traffic, weather & road conditions', color: 'bg-[#F59E0B]' },
                    { step: '4', text: 'Get optimized routes with detailed cost breakdown', color: 'bg-[#8B5CF6]' },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3 items-start text-xs text-gray-700">
                      <div className={`w-5 h-5 rounded-full ${item.color} text-white flex items-center justify-center text-[10px] flex-shrink-0`}>
                        {item.step}
                      </div>
                      <span className="pt-0.5">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════
            TAB 2 — CITY-TO-CITY ROUTES
           ══════════════════════════════════════════════════════════ */}
        <TabsContent value="routes" className="mt-0 p-4 space-y-4 pb-28">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <h3 className="flex items-center gap-2 text-[#2563EB]">
                <MapPin className="h-5 w-5" />
                <span>City-to-City Delivery Charges</span>
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cities..."
                  value={routeSearch}
                  onChange={(e) => setRouteSearch(e.target.value)}
                  className="pl-9 rounded-lg border-gray-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Popular Route Cards */}
          <div className="space-y-3">
            {filteredPopularRoutes.map((route, i) => (
              <Card key={i} className="border-0 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{route.from}</span>
                      <ArrowRight className="h-4 w-4 text-[#2563EB]" />
                      <span className="text-sm">{route.to}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{route.distance} km</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500">Mini Truck</p>
                      <p className="text-xs text-[#2563EB]">₹{route.miniTruck.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500">Medium</p>
                      <p className="text-xs text-[#10B981]">₹{route.mediumTruck.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-[10px] text-gray-500">Large</p>
                      <p className="text-xs text-[#8B5CF6]">₹{route.largeTruck.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button size="sm" variant="outline"
                    onClick={() => handleQuickRoute(route.from, route.to)}
                    className="w-full mt-3 text-xs rounded-lg border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
                    <Navigation className="h-3 w-3 mr-1" /> Get Detailed Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rate Chart Table */}
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="flex items-center gap-2 text-[#2563EB] mb-3">
                <BarChart3 className="h-5 w-5" />
                <span>Rate Chart</span>
              </h3>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 rounded-tl-lg">Route</th>
                      <th className="text-right p-2">Km</th>
                      <th className="text-right p-2">Mini</th>
                      <th className="text-right p-2">Med</th>
                      <th className="text-right p-2 rounded-tr-lg">Large</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPopularRoutes.map((r, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="p-2 whitespace-nowrap">{r.from}→{r.to}</td>
                        <td className="text-right p-2">{r.distance}</td>
                        <td className="text-right p-2 text-[#2563EB]">₹{(r.miniTruck / 1000).toFixed(1)}k</td>
                        <td className="text-right p-2 text-[#10B981]">₹{(r.mediumTruck / 1000).toFixed(1)}k</td>
                        <td className="text-right p-2 text-[#8B5CF6]">₹{(r.largeTruck / 1000).toFixed(1)}k</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════
            TAB 3 — VEHICLE INFO
           ══════════════════════════════════════════════════════════ */}
        <TabsContent value="vehicles" className="mt-0 p-4 space-y-4 pb-28">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <h3 className="flex items-center gap-2 text-[#2563EB] mb-3">
                <Truck className="h-5 w-5" />
                <span>Vehicle Fleet</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">Choose the right vehicle for your cargo needs</p>

              <div className="space-y-3">
                {VEHICLES.map(v => {
                  const VIcon = v.icon;
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <button key={v.id}
                      onClick={() => { setSelectedVehicle(v.id); setActiveTab('calculator'); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#2563EB]' : 'bg-gray-100'
                      }`}>
                        <VIcon className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm ${isSelected ? 'text-[#2563EB]' : ''}`}>{v.name}</p>
                          {isSelected && <Badge className="bg-[#2563EB] text-[9px]">Selected</Badge>}
                        </div>
                        <p className="text-[10px] text-gray-400">{v.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                            <Package className="h-3 w-3" />{v.capacity}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                            <Fuel className="h-3 w-3" />{v.mileage} km/L
                          </span>
                          <span className="text-[10px] text-[#10B981] flex items-center gap-0.5">
                            <IndianRupee className="h-3 w-3" />{v.baseRate}/km
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Recommendation based on cargo weight */}
          <Card className="border-0 shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <h3 className="flex items-center gap-2 text-[#10B981] mb-3">
                <Zap className="h-5 w-5" />
                <span>AI Recommendation</span>
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Based on your cargo weight of <span className="text-[#2563EB]">{cargoWeight[0].toLocaleString()} kg</span>, we recommend:
              </p>
              {(() => {
                const w = cargoWeight[0];
                const rec = w <= 20 ? VEHICLES[0] : w <= 500 ? VEHICLES[1] : w <= 1000 ? VEHICLES[2] : w <= 2500 ? VEHICLES[3] : w <= 7000 ? VEHICLES[4] : VEHICLES[5];
                const RecIcon = rec.icon;
                return (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#10B981]">
                    <div className="w-10 h-10 rounded-lg bg-[#10B981] flex items-center justify-center">
                      <RecIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#10B981]">{rec.name}</p>
                      <p className="text-[10px] text-gray-400">Capacity: {rec.capacity} · ₹{rec.baseRate}/km</p>
                    </div>
                    <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-xs rounded-lg h-8"
                      onClick={() => { setSelectedVehicle(rec.id); setActiveTab('calculator'); }}>
                      Select
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Sticky Bottom Summary (when results available) ─────── */}
      {optimizedRoute && chargeBreakdown && activeTab === 'calculator' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          <div className="p-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[10px] text-gray-400">{fromCity} → {toCity} · {activeVehicle.name}</p>
                <p className="text-lg text-[#2563EB]">₹{chargeBreakdown.returnTotal.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-lg border-gray-200">
                  <Bookmark className="h-4 w-4 text-gray-500" />
                </Button>
                <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-lg border-gray-200">
                  <Share2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] rounded-lg h-11 shadow-md">
              <Truck className="h-4 w-4 mr-2" /> Book Transport Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
