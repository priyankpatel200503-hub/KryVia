import { ArrowLeft, MapPin, TrendingUp, BarChart3, IndianRupee, Users, Package, Star, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTranslation } from '../translations';
import { useState } from 'react';

interface MarketData {
  city: string;
  state: string;
  distance: string;
  demand: 'High' | 'Medium' | 'Low';
  avgPrice: number;
  priceChange: number;
  buyers: number;
  profit: string;
  score: number;
}

export function MarketLocationsScreen() {
  const { setCurrentScreen, user, language, listings } = useApp();
  const t = useTranslation(language);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  // Get farmer's crop types
  const farmerCrops = [...new Set(listings.filter(l => l.farmerId === user?.id).map(l => l.cropType))];

  const handleAnalyze = () => {
    if (!selectedCrop) return;
    
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setMarketData([
        {
          city: 'Delhi',
          state: 'Delhi',
          distance: '285 km',
          demand: 'High',
          avgPrice: 2850,
          priceChange: 12.5,
          buyers: 145,
          profit: '₹1,25,000',
          score: 95
        },
        {
          city: 'Mumbai',
          state: 'Maharashtra',
          distance: '1,420 km',
          demand: 'High',
          avgPrice: 3200,
          priceChange: 18.3,
          buyers: 230,
          profit: '₹1,85,000',
          score: 92
        },
        {
          city: 'Jaipur',
          state: 'Rajasthan',
          distance: '245 km',
          demand: 'Medium',
          avgPrice: 2450,
          priceChange: 8.2,
          buyers: 89,
          profit: '₹95,000',
          score: 88
        },
        {
          city: 'Ahmedabad',
          state: 'Gujarat',
          distance: '658 km',
          demand: 'High',
          avgPrice: 2950,
          priceChange: 15.7,
          buyers: 167,
          profit: '₹1,45,000',
          score: 90
        },
        {
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          distance: '512 km',
          demand: 'Medium',
          avgPrice: 2350,
          priceChange: 5.4,
          buyers: 76,
          profit: '₹82,000',
          score: 82
        },
        {
          city: 'Pune',
          state: 'Maharashtra',
          distance: '1,456 km',
          demand: 'Medium',
          avgPrice: 2750,
          priceChange: 9.8,
          buyers: 112,
          profit: '₹1,15,000',
          score: 85
        },
        {
          city: 'Chandigarh',
          state: 'Punjab/Haryana',
          distance: '225 km',
          demand: 'High',
          avgPrice: 2650,
          priceChange: 11.2,
          buyers: 94,
          profit: '₹1,05,000',
          score: 89
        },
        {
          city: 'Kolkata',
          state: 'West Bengal',
          distance: '1,485 km',
          demand: 'Low',
          avgPrice: 2200,
          priceChange: 3.1,
          buyers: 45,
          profit: '₹68,000',
          score: 75
        }
      ].sort((a, b) => b.score - a.score));
      setAnalyzing(false);
    }, 2000);
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDemandIcon = (demand: string) => {
    switch (demand) {
      case 'High': return '🔥';
      case 'Medium': return '⚡';
      case 'Low': return '📊';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => setCurrentScreen('farmer-home')} className="p-1 hover:bg-white/10 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t.marketLocations}</h1>
            <p className="text-xs text-green-50">{t.higherProfits}</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
            AI
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Crop Selection */}
        <Card>
          <CardContent className="p-4">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Select Your Crop
              </h3>
              
              <div className="space-y-3">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-input-background"
                >
                  <option value="">Choose a crop to analyze</option>
                  {farmerCrops.length > 0 ? (
                    farmerCrops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))
                  ) : (
                    <>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                    </>
                  )}
                </select>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!selectedCrop || analyzing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Analyzing Markets...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analyze Best Markets
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Results */}
        {marketData.length > 0 && (
          <>
            {/* Summary Stats */}
            <Card className="border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Market Analysis for {selectedCrop}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{marketData.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cities</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {marketData.filter(m => m.demand === 'High').length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">High Demand</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600">₹{Math.max(...marketData.map(m => m.avgPrice))}</p>
                    <p className="text-xs text-muted-foreground mt-1">Max Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Recommended Markets */}
            <div className="space-y-3">
              {marketData.map((market, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    index === 0 ? 'border-2 border-green-500/40' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{market.city}</h3>
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Best Choice
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{market.state}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <span className="text-xl">{getDemandIcon(market.demand)}</span>
                          <Badge variant="outline" className={getDemandColor(market.demand)}>
                            {market.demand}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{market.distance}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-background rounded border">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <IndianRupee className="h-3 w-3" />
                          Avg Price/Quintal
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="font-semibold text-sm">₹{market.avgPrice}</p>
                          <span className={`text-xs ${market.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {market.priceChange >= 0 ? '↑' : '↓'} {Math.abs(market.priceChange)}%
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-background rounded border">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <Users className="h-3 w-3" />
                          Active Buyers
                        </div>
                        <p className="font-semibold text-sm">{market.buyers}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Est. Monthly Profit</p>
                          <p className="text-lg font-bold text-green-600">{market.profit}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">{market.score}/100</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      className="w-full mt-3 text-xs"
                      onClick={() => {}}
                    >
                      View Detailed Analysis
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={() => {
                setMarketData([]);
                setSelectedCrop('');
              }}
              variant="outline"
              className="w-full"
            >
              Analyze Different Crop
            </Button>
          </>
        )}

        {/* Info Card */}
        {marketData.length === 0 && (
          <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                AI-Powered Market Intelligence
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time demand analysis across major Indian cities</span>
                </li>
                <li className="flex gap-2">
                  <IndianRupee className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Compare prices and profit potential</span>
                </li>
                <li className="flex gap-2">
                  <MapPin className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Distance-optimized recommendations</span>
                </li>
                <li className="flex gap-2">
                  <Users className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Active buyer count and engagement metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
