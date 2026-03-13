import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, Calendar, Sparkles, TrendingUp, TrendingDown,
  Droplet, Sun, Cloud, CloudRain, Leaf, Target, AlertCircle,
  CheckCircle, DollarSign, BarChart3, MapPin, Thermometer
} from 'lucide-react';
import { AIEngine } from '../ai/AIEngine';

export function SeasonalCalendarScreen() {
  const { user, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const currentMonth = new Date().getMonth();
  const [selectedSeason, setSelectedSeason] = useState<string>('current');

  const isFarmer = user?.role === 'farmer';

  // Get seasonal recommendations
  const seasonalRecs = AIEngine.getSeasonalRecommendations(user?.state || 'Gujarat', currentMonth);

  // Get current season name
  const getCurrentSeason = () => {
    if (currentMonth >= 9 || currentMonth <= 2) return t.rabiWinter;
    if (currentMonth >= 6 && currentMonth <= 9) return t.kharifMonsoon;
    return t.zaidSummer;
  };

  // Get all seasons with their months
  const seasons = [
    {
      name: 'Rabi',
      displayName: t.rabiWinter,
      months: 'October - March',
      icon: CloudRain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'Winter crops sown in Oct-Nov, harvested in Mar-Apr',
      weather: 'Cool climate, moderate rainfall',
      crops: ['Wheat', 'Mustard', 'Potato', 'Peas', 'Chickpea', 'Barley']
    },
    {
      name: 'Kharif',
      displayName: t.kharifMonsoon,
      months: 'June - October',
      icon: CloudRain,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      description: 'Monsoon crops sown in Jun-Jul, harvested in Sep-Oct',
      weather: 'Warm and humid, heavy rainfall',
      crops: ['Rice', 'Cotton', 'Maize', 'Soybean', 'Sugarcane', 'Bajra']
    },
    {
      name: 'Zaid',
      displayName: t.zaidSummer,
      months: 'March - June',
      icon: Sun,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      description: 'Short duration summer crops between Rabi and Kharif',
      weather: 'Hot and dry, irrigation required',
      crops: ['Tomato', 'Cucumber', 'Watermelon', 'Muskmelon', 'Vegetables']
    }
  ];

  const currentSeasonData = seasons.find(s => getCurrentSeason().includes(s.name)) || seasons[0];

  const handleBack = () => {
    setCurrentScreen(isFarmer ? 'farmer-home' : 'buyer-home');
  };

  // Get crop emoji
  const getCropEmoji = (cropType: string) => {
    const emojiMap: { [key: string]: string } = {
      wheat: '🌾', rice: '🌾', cotton: '🌸', tomato: '🍅',
      onion: '🧅', potato: '🥔', maize: '🌽', mustard: '🌼',
      peas: '🫛', chickpea: '🫘', soybean: '🫘', sugarcane: '🎋',
      cucumber: '🥒', watermelon: '🍉', muskmelon: '🍈', barley: '🌾',
      bajra: '🌾', vegetables: '🥬'
    };
    return emojiMap[cropType.toLowerCase()] || '🌱';
  };

  // Get additional crop details
  const getCropDetails = (cropType: string) => {
    const details: { [key: string]: any } = {
      'Wheat': { 
        duration: '120-150 days', 
        water: 'Moderate (4-5 irrigations)',
        soil: 'Loamy, well-drained',
        temp: '10-25°C',
        spacing: '20-25 cm rows'
      },
      'Rice': { 
        duration: '90-150 days', 
        water: 'High (flooded fields)',
        soil: 'Clay loam, water retention',
        temp: '20-35°C',
        spacing: '15-20 cm'
      },
      'Cotton': { 
        duration: '180-210 days', 
        water: 'Moderate to high',
        soil: 'Deep black soil',
        temp: '21-30°C',
        spacing: '60-90 cm'
      },
      'Tomato': { 
        duration: '60-90 days', 
        water: 'Regular drip irrigation',
        soil: 'Sandy loam, well-drained',
        temp: '15-30°C',
        spacing: '45-60 cm'
      },
      'Potato': { 
        duration: '90-120 days', 
        water: 'Moderate, avoid waterlogging',
        soil: 'Sandy loam, loose',
        temp: '15-25°C',
        spacing: '20-30 cm'
      },
      'Mustard': { 
        duration: '90-120 days', 
        water: 'Low to moderate',
        soil: 'Sandy loam to clay',
        temp: '10-25°C',
        spacing: '30 cm rows'
      }
    };
    return details[cropType] || {
      duration: '90-120 days',
      water: 'Moderate',
      soil: 'Well-drained loamy',
      temp: '15-30°C',
      spacing: 'Standard'
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">{t.seasonalCropCalendar}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{t.aiPoweredPlantingGuide} {user?.state}</p>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
            <Sparkles className="h-3 w-3 mr-1" />
            {t.aiGuide}
          </Badge>
        </div>

        {/* Current Season Highlight */}
        <Card className={`border-2 ${currentSeasonData.borderColor} ${currentSeasonData.bgColor}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${currentSeasonData.bgColor} flex items-center justify-center`}>
                  <currentSeasonData.icon className={`h-6 w-6 ${currentSeasonData.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.currentSeason}: {currentSeasonData.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{currentSeasonData.months}</p>
                </div>
              </div>
              <Badge className="bg-primary">{t.active}</Badge>
            </div>
            <p className="text-sm mb-2">{currentSeasonData.description}</p>
            <div className="flex items-center space-x-2 text-sm">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{currentSeasonData.weather}</span>
            </div>
          </CardContent>
        </Card>

        {/* Season Tabs */}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">{t.currentSeason}</TabsTrigger>
            <TabsTrigger value="all-seasons">{t.allSeasons}</TabsTrigger>
            <TabsTrigger value="tips">{t.growingTips}</TabsTrigger>
          </TabsList>

          {/* Current Season Crops */}
          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.recommendedCrops} {currentSeasonData.displayName}</CardTitle>
                <CardDescription>{isFarmer ? t.bestCropsToPlant : t.bestCropsToBuy}</CardDescription>
              </CardHeader>
            </Card>

            {seasonalRecs.map((rec, idx) => {
              const details = getCropDetails(rec.cropType);
              return (
                <Card key={idx} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getCropEmoji(rec.cropType)}</div>
                        <div>
                          <h3 className="font-bold text-lg">{rec.cropType}</h3>
                          <Badge variant="outline" className="mt-1">{rec.season}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          rec.marketDemand === 'High' ? 'bg-success' :
                          rec.marketDemand === 'Medium' ? 'bg-warning' :
                          'bg-muted-foreground'
                        }`}>
                          {rec.marketDemand} Demand
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Profit: {rec.profitPotential}%</p>
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Leaf className="h-3 w-3 text-green-600" />
                          <p className="text-xs font-medium">{t.plantingWindow}</p>
                        </div>
                        <p className="text-sm font-bold">{rec.plantingWindow}</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Target className="h-3 w-3 text-orange-600" />
                          <p className="text-xs font-medium">{t.harvestWindow}</p>
                        </div>
                        <p className="text-sm font-bold">{rec.harvestWindow}</p>
                      </div>
                    </div>

                    {/* Crop Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-start space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t.duration}</p>
                          <p className="text-sm font-medium">{details.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Droplet className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t.waterNeed}</p>
                          <p className="text-sm font-medium">{details.water}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t.temperature}</p>
                          <p className="text-sm font-medium">{details.temp}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t.expectedYield}</p>
                          <p className="text-sm font-medium">{rec.expectedYield}</p>
                        </div>
                      </div>
                    </div>

                    {/* Profit Potential */}
                    <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium">{t.profitPotential}</span>
                        </span>
                        <span className="font-bold text-primary">{rec.profitPotential}%</span>
                      </div>
                      <Progress value={rec.profitPotential} className="h-2" />
                    </div>

                    {/* Soil Type */}
                    <div className="mt-3 p-2 bg-accent/30 rounded-md">
                      <p className="text-xs font-medium mb-1">{t.idealSoilType}</p>
                      <p className="text-sm text-muted-foreground">{details.soil}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* All Seasons Overview */}
          <TabsContent value="all-seasons" className="space-y-4">
            {seasons.map((season, idx) => (
              <Card key={idx} className={`border-2 ${season.borderColor}`}>
                <CardHeader className={season.bgColor}>
                  <div className="flex items-center space-x-3">
                    <season.icon className={`h-6 w-6 ${season.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-base">{season.displayName}</CardTitle>
                      <CardDescription>{season.months}</CardDescription>
                    </div>
                    {getCurrentSeason().includes(season.name) && (
                      <Badge className="bg-primary">{t.active}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="text-sm mb-2">{season.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Cloud className="h-4 w-4" />
                      <span>{season.weather}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium mb-2">Main Crops:</p>
                    <div className="flex flex-wrap gap-2">
                      {season.crops.map((crop, cropIdx) => (
                        <Badge key={cropIdx} variant="outline" className="text-xs">
                          {getCropEmoji(crop)} {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Growing Tips */}
          <TabsContent value="tips" className="space-y-4">
            <Card className="border-success/30 bg-success/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>{t.bestPractices}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Soil Testing</p>
                    <p className="text-sm text-muted-foreground">Test soil pH and nutrients before planting for optimal crop selection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Certified Seeds</p>
                    <p className="text-sm text-muted-foreground">Use high-quality certified seeds for better germination and yield</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Crop Rotation</p>
                    <p className="text-sm text-muted-foreground">Rotate crops seasonally to maintain soil health and reduce pests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Weather Monitoring</p>
                    <p className="text-sm text-muted-foreground">Track local weather forecasts for timely irrigation and pest control</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Market Research</p>
                    <p className="text-sm text-muted-foreground">Check demand predictions and pricing before selecting crops to plant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning/30 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span>{t.commonMistakes}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Late Planting</p>
                    <p className="text-sm text-muted-foreground">Stick to recommended planting windows to avoid reduced yields</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Over-irrigation</p>
                    <p className="text-sm text-muted-foreground">Excess water can damage roots and reduce crop quality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Ignoring Soil Health</p>
                    <p className="text-sm text-muted-foreground">Poor soil preparation leads to weak crops and low yields</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Wrong Crop for Season</p>
                    <p className="text-sm text-muted-foreground">Planting off-season crops without proper setup leads to failure</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>{t.maximizeReturns}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use KryVia's AI features to optimize your farming:
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentScreen('ai-features')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Check Demand Prediction
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentScreen('ai-features')}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Get Smart Price Suggestions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentScreen('ai-features')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    View Sale Adviser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}