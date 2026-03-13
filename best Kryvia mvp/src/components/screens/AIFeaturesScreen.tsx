import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { 
  ArrowLeft, Brain, TrendingUp, TrendingDown, Sparkles, 
  Calendar, Target, AlertCircle, CheckCircle, BarChart3,
  Lightbulb, DollarSign, Package, ChevronRight, Shield,
  Star, Award, Activity, MapPin, Navigation, Users
} from 'lucide-react';
import { AIEngine } from '../ai/AIEngine';

export function AIFeaturesScreen() {
  const { user, orders, listings, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');

  const currentMonth = new Date().getMonth();
  const isFarmer = user?.role === 'farmer';

  // Get AI insights
  const cropDemand = AIEngine.predictCropDemand(selectedCrop, user?.state || 'Gujarat', currentMonth);
  const seasonalRecs = AIEngine.getSeasonalRecommendations(user?.state || 'Gujarat', currentMonth);

  // Sample data for price suggestion
  const priceSuggestion = AIEngine.suggestPrice({
    cropType: selectedCrop,
    grade: 'premium',
    region: user?.state || 'Gujarat',
    quantity: 500,
    harvestDate: new Date().toISOString(),
  });

  // Sample data for sale advice
  const saleAdvice = AIEngine.generateSaleAdvice({
    cropType: selectedCrop,
    quantity: 500,
    currentPrice: priceSuggestion.recommended,
    region: user?.state || 'Gujarat',
  });

  // Sample trust scores for demonstration
  const buyerScores = [
    { name: 'Arjun Sharma', score: 92, orders: 15, badge: 'Excellent' },
    { name: 'Priya Patel', score: 85, orders: 12, badge: 'Excellent' },
    { name: 'Vikram Singh', score: 78, orders: 8, badge: 'Good' },
    { name: 'Neha Gupta', score: 65, orders: 5, badge: 'Good' },
    { name: 'Raj Kumar', score: 45, orders: 3, badge: 'Average' },
  ];

  const handleBack = () => {
    setCurrentScreen(isFarmer ? 'farmer-home' : 'buyer-home');
  };

  const crops = ['rice', 'wheat', 'cotton', 'tomato', 'onion', 'potato', 'maize'];

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'falling') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Activity className="h-4 w-4 text-warning" />;
  };

  const getDemandColor = (level: string) => {
    if (level === 'Very High' || level === 'High') return 'text-success';
    if (level === 'Moderate') return 'text-warning';
    return 'text-muted-foreground';
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
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{t.aiIntelligenceHub}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{t.poweredByAI}</p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Sparkles className="h-3 w-3 mr-1" />
            {t.aiPowered}
          </Badge>
        </div>

        <Tabs defaultValue={isFarmer ? "demand" : "trust"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {isFarmer ? (
              <>
                <TabsTrigger value="demand">{t.demandLevel}</TabsTrigger>
                <TabsTrigger value="pricing">{t.pricingHelp}</TabsTrigger>
                <TabsTrigger value="adviser">Adviser</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="trust">Trust</TabsTrigger>
                <TabsTrigger value="demand">Market</TabsTrigger>
                <TabsTrigger value="calendar">{t.seasonalCalendar}</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Crop Demand Prediction */}
          <TabsContent value="demand" className="space-y-4">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>{t.cropDemandPrediction}</span>
                    </CardTitle>
                    <CardDescription>{t.marketDemandForecasting}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {cropDemand.confidence}% {t.confidence}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Crop Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.selectCrop}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {crops.map((crop) => (
                      <Button
                        key={crop}
                        variant={selectedCrop === crop ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCrop(crop)}
                        className="capitalize"
                      >
                        {crop}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Demand Overview */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium capitalize">{cropDemand.cropType}</h3>
                        <p className={`text-2xl font-bold ${getDemandColor(cropDemand.demandLevel)}`}>
                          {cropDemand.demandLevel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{t.predictedPrice}</p>
                        <p className="text-2xl font-bold text-primary">₹{cropDemand.predictedPrice}{t.perKg}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.demandScore}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{cropDemand.demandScore}/100</span>
                          {getTrendIcon(cropDemand.trend)}
                        </div>
                      </div>
                      <Progress value={cropDemand.demandScore} className="h-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={cropDemand.trend === 'rising' ? 'default' : cropDemand.trend === 'falling' ? 'destructive' : 'secondary'}>
                        {cropDemand.trend === 'rising' ? '↗️' : cropDemand.trend === 'falling' ? '↘️' : '→'} {cropDemand.trend}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t.nextDaysForecast}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>{t.aiInsights}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {cropDemand.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{reason}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Pricing Engine */}
          {isFarmer && (
            <TabsContent value="pricing" className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-green-500/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>{t.smartPriceSuggestion}</span>
                  </CardTitle>
                  <CardDescription>{t.aiOptimizedPricing}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Recommendations */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t.minimum}</p>
                        <p className="text-xl font-bold text-destructive">₹{priceSuggestion.min}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary">
                      <CardContent className="p-4 text-center bg-primary/5">
                        <p className="text-xs text-muted-foreground mb-1">{t.recommended}</p>
                        <p className="text-2xl font-bold text-primary">₹{priceSuggestion.recommended}</p>
                        <Badge className="mt-1 text-xs">{t.bestValue}</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t.maximum}</p>
                        <p className="text-xl font-bold text-success">₹{priceSuggestion.max}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Confidence & Market Average */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground mb-2">{t.aiConfidence}</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={priceSuggestion.confidence} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{priceSuggestion.confidence}%</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground mb-2">{t.marketAverage}</p>
                        <p className="text-xl font-bold">₹{priceSuggestion.marketAverage}{t.perKg}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Factors */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pricing Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {priceSuggestion.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{factor}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Competitor Analysis */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Competitor Prices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {priceSuggestion.competitorPrices.map((price, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">Competitor {idx + 1}</span>
                          <span className="font-medium">₹{price}/kg</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Smart Sale Adviser */}
          {isFarmer && (
            <TabsContent value="adviser" className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-orange-500/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>{t.smartSaleAdviser}</span>
                  </CardTitle>
                  <CardDescription>{t.optimalTimingStrategy}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Best Time to Sell */}
                  <Card className="border-primary">
                    <CardContent className="p-4 bg-primary/5">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t.bestTimeToSell}</p>
                        <p className="text-2xl font-bold text-primary mt-2">{saleAdvice.bestTimeToSell}</p>
                        <Badge className="mt-2">{saleAdvice.marketCondition}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expected Revenue */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.expectedRevenue}</p>
                          <p className="text-2xl font-bold text-success mt-1">₹{saleAdvice.expectedRevenue.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-success" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Recommendations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span>{t.aiRecommendations}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {saleAdvice.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-2 p-2 bg-success/5 rounded">
                          <ChevronRight className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Opportunities */}
                  {saleAdvice.opportunities.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span>{t.marketOpportunities}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {saleAdvice.opportunities.map((opp, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{opp}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Risks */}
                  {saleAdvice.risks.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span>{t.riskFactors}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {saleAdvice.risks.map((risk, idx) => (
                          <div key={idx} className="flex items-start space-x-2 p-2 bg-destructive/5 rounded">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{risk}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Buyer Trust Score */}
          {!isFarmer && (
            <TabsContent value="trust" className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span>{t.buyerTrustScores}</span>
                  </CardTitle>
                  <CardDescription>{t.aiCalculatedRatings}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {buyerScores.map((buyer, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                              {buyer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{buyer.name}</p>
                              <p className="text-xs text-muted-foreground">{buyer.orders} {t.completedOrders}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{buyer.score}</p>
                            <Badge variant={
                              buyer.badge === 'Excellent' ? 'default' :
                              buyer.badge === 'Good' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {buyer.badge}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={buyer.score} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Seasonal Calendar */}
          <TabsContent value="calendar" className="space-y-4">
            <Card className="border-primary/20 bg-gradient-to-br from-green-500/5 to-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span>{t.seasonalCropCalendar}</span>
                    </CardTitle>
                    <CardDescription>{t.aiPoweredPlantingGuide}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentScreen('seasonal-calendar')}
                  >
                    {t.viewFullCalendar}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {seasonalRecs.map((rec, idx) => (
                  <Card key={idx} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{rec.cropType}</h3>
                          <Badge variant="outline" className="mt-1">{rec.season}</Badge>
                        </div>
                        <Badge className={`${
                          rec.marketDemand === 'High' ? 'bg-success' :
                          rec.marketDemand === 'Medium' ? 'bg-warning' :
                          'bg-muted-foreground'
                        }`}>
                          {rec.marketDemand} Demand
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">{t.plantingWindow}</p>
                          <p className="text-sm font-medium">{rec.plantingWindow}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t.harvestWindow}</p>
                          <p className="text-sm font-medium">{rec.harvestWindow}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t.expectedYield}</span>
                          <span className="font-medium">{rec.expectedYield}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t.profitPotential}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={rec.profitPotential} className="w-20 h-2" />
                            <span className="font-medium">{rec.profitPotential}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}