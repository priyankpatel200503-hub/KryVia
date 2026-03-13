import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Package, Clock, CheckCircle, XCircle, Eye, Edit, TrendingUp, IndianRupee, Users, Brain, Sparkles, Calendar, MapPin, Navigation, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function FarmerHomeScreen() {
  const { user, listings, orders, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  // Filter data for current farmer - if demo farmer, show all listings
  const myListings = user?.id === 'farmer1' ? listings : listings.filter(listing => listing.farmerId === user?.id);
  const incomingOrders = user?.id === 'farmer1' ? orders.filter(order => order.status === 'requested') : orders.filter(order => order.farmerId === user?.id && order.status === 'requested');
  const activeOrders = user?.id === 'farmer1' ? orders.filter(order => ['confirmed', 'shipping'].includes(order.status)) : orders.filter(order => order.farmerId === user?.id && ['confirmed', 'shipping'].includes(order.status));

  // Calculate dashboard statistics
  const totalRevenue = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalQuantitySold = activeOrders.reduce((sum, order) => sum + order.quantity, 0);
  const avgPrice = myListings.length > 0 ? myListings.reduce((sum, listing) => sum + listing.pricePerUnit, 0) / myListings.length : 0;

  // Get shipping orders for live tracking
  const shippingOrders = user?.id === 'farmer1' ? orders.filter(order => order.status === 'shipping') : orders.filter(order => order.farmerId === user?.id && order.status === 'shipping');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="status-verified text-xs">Live</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-xs">Expired</Badge>;
      case 'sold_out':
        return <Badge variant="secondary" className="text-xs">Sold Out</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="status-pending text-xs">New Request</Badge>;
      case 'confirmed':
        return <Badge className="status-verified text-xs">Confirmed</Badge>;
      case 'shipping':
        return <Badge className="status-warning text-xs">Shipping</Badge>;
      case 'received':
        return <Badge className="status-verified text-xs">Delivered</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getCropEmoji = (cropType: string) => {
    const emojiMap: { [key: string]: string } = {
      rice: '🌾',
      wheat: '🌾',
      cotton: '🌸',
      tomato: '🍅',
      onion: '🧅',
      potato: '🥔',
      maize: '🌽',
      chili: '🌶️',
      turmeric: '🟡',
      soybean: '🫘',
      sugarcane: '🎋'
    };
    return emojiMap[cropType] || '🌱';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">🌾 {t.farmer} Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
          {user?.village && (
            <p className="text-sm text-muted-foreground">{user.village}, {user.district}, {user.state}</p>
          )}
        </div>

        {/* KYC Warning */}
        {!user?.isVerified && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <p className="text-sm">
                {t.canBrowseOnly}
              </p>
            </CardContent>
          </Card>
        )}



        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 text-center">
              <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-crop-green/10 to-crop-green/5">
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-crop-green" />
              <p className="text-lg font-bold">{totalQuantitySold}</p>
              <p className="text-xs text-muted-foreground">Qty Sold (kg)</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-harvest-gold/10 to-harvest-gold/5">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-harvest-gold" />
              <p className="text-lg font-bold">₹{Math.round(avgPrice)}</p>
              <p className="text-xs text-muted-foreground">Avg Price/kg</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setCurrentScreen('create-listing')}
            className="h-20 flex flex-col items-center space-y-2 bg-primary hover:bg-primary/90"
            disabled={!user?.isVerified}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">{t.addNewCrop}</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentScreen('farmer-orders')}
            className="h-20 flex flex-col items-center space-y-2 relative"
          >
            <Users className="h-6 w-6" />
            <span className="text-sm">Order Management</span>
            {incomingOrders.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-warning-foreground">
                {incomingOrders.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* AI Features Card */}
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-primary/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('ai-features')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium flex items-center space-x-2">
                    <span>AI Intelligence Hub</span>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </h3>
                  <p className="text-sm text-muted-foreground">Smart predictions & insights</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                NEW
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Calendar Card */}
        <Card className="border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('seasonal-calendar')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{t.seasonalCalendar}</h3>
                  <p className="text-sm text-muted-foreground">{t.knowWhatToPlant}</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                {t.aiGuide}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Market Locations Card */}
        <Card className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('market-locations')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{t.bestMarkets}</h3>
                  <p className="text-sm text-muted-foreground">{t.higherProfits}</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                AI
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* APMC Market Price Dashboard Card */}
        <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('market-price-dashboard')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">APMC Price Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Live prices across 10 cities</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">
                LIVE
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">20+</p>
                <p className="text-xs text-muted-foreground">Crops</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">10</p>
                <p className="text-xs text-muted-foreground">Cities</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">Real-time</p>
                <p className="text-xs text-muted-foreground">Prices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KisanAI Intelligence Hub Card */}
        <Card className="border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('kisan-ai')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-1.5">
                    KisanAI Hub
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </h3>
                  <p className="text-sm text-muted-foreground">AI Demand & Price Analyzer</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-500 to-violet-600">
                AI
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              <div className="text-center p-1.5 bg-background/50 rounded">
                <p className="text-[10px] font-medium">Demand</p>
                <p className="text-[10px] text-muted-foreground">Score</p>
              </div>
              <div className="text-center p-1.5 bg-background/50 rounded">
                <p className="text-[10px] font-medium">Supply</p>
                <p className="text-[10px] text-muted-foreground">Gap</p>
              </div>
              <div className="text-center p-1.5 bg-background/50 rounded">
                <p className="text-[10px] font-medium">7-Day</p>
                <p className="text-[10px] text-muted-foreground">Predict</p>
              </div>
              <div className="text-center p-1.5 bg-background/50 rounded">
                <p className="text-[10px] font-medium">Best</p>
                <p className="text-[10px] text-muted-foreground">City</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Tracking Card */}
        <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 cursor-pointer hover:shadow-lg transition-all relative"
          onClick={() => setCurrentScreen('live-tracking')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative">
                  <Navigation className="h-6 w-6 text-white" />
                  {shippingOrders.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Live Shipment Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingOrders.length > 0 
                      ? `${shippingOrders.length} shipment${shippingOrders.length > 1 ? 's' : ''} in transit`
                      : 'Track your orders in real-time'}
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                LIVE
              </Badge>
            </div>
            {shippingOrders.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Real-time GPS tracking</span>
                  <span className="font-medium text-blue-600">View Details →</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings" className="text-xs">My Crops ({myListings.length})</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">
              Orders
              {incomingOrders.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {incomingOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            {myListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">🌱</div>
                  <div>
                    <h3 className="font-medium">{t.noCropsYet}</h3>
                    <p className="text-sm text-muted-foreground">Start by adding your first crop listing</p>
                  </div>
                  <Button 
                    onClick={() => setCurrentScreen('create-listing')}
                    disabled={!user?.isVerified}
                  >
                    {t.addNewCrop}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myListings.map((listing) => (
                  <Card key={listing.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {listing.images[0] ? (
                            <ImageWithFallback
                              src={listing.images[0]}
                              alt={listing.cropType}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {getCropEmoji(listing.cropType)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium truncate text-sm">{listing.cropType.charAt(0).toUpperCase() + listing.cropType.slice(1)} - {listing.variety}</h3>
                              <p className="text-lg font-bold text-primary">₹{listing.pricePerUnit}/kg</p>
                              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <span>{listing.totalAvailableQty} kg available</span>
                                <span>•</span>
                                <span>Min: {listing.minOrderQty} kg</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(listing.status)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>Grade: {listing.grade}</span>
                              <span>•</span>
                              <span>Expires: {new Date(listing.expiryDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-accent/30 rounded-md">
                            <p className="text-xs text-muted-foreground">
                              📍 {listing.location} • Harvested: {new Date(listing.harvestDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Incoming Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {incomingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">📦</div>
                  <div>
                    <h3 className="font-medium">No new orders</h3>
                    <p className="text-sm text-muted-foreground">New order requests will appear here</p>
                  </div>
                  <Button 
                    onClick={() => setCurrentScreen('farmer-orders')}
                    variant="outline"
                  >
                    View Order Management
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {incomingOrders.slice(0, 3).map((order) => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-warning">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-sm">{order.cropType}</h3>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">{order.buyerName}</span> wants to buy
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">{order.quantity} kg</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Requested: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                            {order.message && (
                              <div className="mt-2 p-2 bg-muted rounded-md">
                                <p className="text-xs italic">"{order.message}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-3">
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {incomingOrders.length > 3 && (
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        +{incomingOrders.length - 3} more order requests
                      </p>
                      <Button 
                        onClick={() => setCurrentScreen('farmer-orders')}
                        variant="outline"
                        size="sm"
                      >
                        View All Orders
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="font-medium">{t.noOrdersYet}</h3>
                    <p className="text-sm text-muted-foreground">Confirmed orders will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-success/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-sm">{order.cropType}</h3>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{order.buyerName}</span> • {order.quantity} kg • ₹{order.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Order #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}