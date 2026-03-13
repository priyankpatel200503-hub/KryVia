import { useState } from 'react';
import { useApp } from '../AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, Brain, Sparkles, MapPin, Navigation, 
  Users, Star, Award, Package, ShoppingBag, TrendingUp
} from 'lucide-react';
import { AIEngine, type MatchedUser } from '../ai/AIEngine';

export function SmartMatchingScreen() {
  const { user, setCurrentScreen } = useApp();
  const [maxDistance, setMaxDistance] = useState(50); // Default 50km
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFarmer = user?.role === 'farmer';

  const handleFindMatches = () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const results = AIEngine.findNearbyMatches(
        {
          role: user?.role || 'buyer',
          location: user?.village || 'Unknown',
          district: user?.district || 'Ahmedabad',
          state: user?.state || 'Gujarat',
          crops: isFarmer ? ['rice', 'wheat', 'cotton'] : undefined,
          preferredCrops: !isFarmer ? ['rice', 'wheat', 'onion'] : undefined,
        },
        maxDistance
      );
      setMatches(results);
      setIsLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setCurrentScreen(isFarmer ? 'farmer-home' : 'buyer-home');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getMatchScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent Match', variant: 'default' as const };
    if (score >= 60) return { label: 'Good Match', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Fair Match', variant: 'outline' as const };
    return { label: 'Low Match', variant: 'outline' as const };
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
              <Navigation className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Smart Matching</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Find nearby {isFarmer ? 'buyers' : 'farmers'} using AI
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        {/* Distance Filter Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Smart Buyer-Farmer Matching</span>
                </CardTitle>
                <CardDescription>
                  AI algorithm finds the best {isFarmer ? 'buyers' : 'farmers'} within your range
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distance Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Maximum Distance</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-primary">{maxDistance} km</span>
                </div>
              </div>
              
              <Slider
                value={[maxDistance]}
                onValueChange={(value) => setMaxDistance(value[0])}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 km (Very Close)</span>
                <span>50 km (Nearby)</span>
                <span>100 km (Extended)</span>
              </div>
            </div>

            {/* Your Location Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Your Location</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.village || user?.district || 'Unknown'}, {user?.district}, {user?.state}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Searching within {maxDistance}km radius
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Find Matches Button */}
            <Button 
              onClick={handleFindMatches}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Find Best Matches
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                Found {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
              </h2>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                AI Ranked
              </Badge>
            </div>

            {matches.map((match, idx) => {
              const scoreBadge = getMatchScoreBadge(match.matchScore);
              
              return (
                <Card 
                  key={match.id}
                  className="border-l-4 border-l-primary hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-lg">
                          #{idx + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{match.name}</h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{match.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={scoreBadge.variant}>
                        {scoreBadge.label}
                      </Badge>
                    </div>

                    {/* Match Score */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">AI Match Score</span>
                        <span className={`font-bold text-lg ${getMatchScoreColor(match.matchScore)}`}>
                          {match.matchScore}/100
                        </span>
                      </div>
                      <Progress value={match.matchScore} className="h-2" />
                    </div>

                    {/* Distance */}
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded mb-3">
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Distance</span>
                      </div>
                      <span className="font-bold text-primary">{match.distance} km away</span>
                    </div>

                    {/* Details based on role */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {match.role === 'farmer' && (
                        <>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Crops Available</p>
                            <div className="flex flex-wrap gap-1">
                              {match.crops?.slice(0, 3).map((crop) => (
                                <Badge key={crop} variant="outline" className="text-xs capitalize">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Rating</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{match.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({match.totalListings} listings)
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {match.role === 'buyer' && (
                        <>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Buys</p>
                            <div className="flex flex-wrap gap-1">
                              {match.preferredCrops?.slice(0, 3).map((crop) => (
                                <Badge key={crop} variant="outline" className="text-xs capitalize">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Trust Score</p>
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4 text-primary" />
                              <span className="font-medium">{match.trustScore}%</span>
                              <span className="text-xs text-muted-foreground">
                                ({match.ordersCompleted} orders)
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Why this match?</p>
                      <div className="space-y-1">
                        {match.matchReasons.map((reason, reasonIdx) => (
                          <div key={reasonIdx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <p className="text-xs">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button size="sm" className="bg-primary">
                        <Users className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!isLoading && matches.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Navigation className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium mb-1">No matches yet</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Find Best Matches" to discover nearby {isFarmer ? 'buyers' : 'farmers'}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>AI will analyze location, crops, ratings & more</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
