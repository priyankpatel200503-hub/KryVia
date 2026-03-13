import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Filter, MapPin, Calendar, CheckCircle, Package, Clock, TrendingDown, TrendingUp, IndianRupee, ShoppingCart, Bell, Brain, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function BuyerHomeScreen() {
  const { user, listings, orders, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Filter data for current buyer - if demo buyer, show all orders
  const myOrders = user?.id === 'buyer1' ? orders : orders.filter(order => order.buyerId === user?.id);
  const activeOrders = myOrders.filter(order => ['requested', 'confirmed', 'shipping'].includes(order.status));
  const completedOrders = myOrders.filter(order => order.status === 'received');

  // Calculate dashboard statistics
  const totalSpent = myOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalQuantityBought = myOrders.reduce((sum, order) => sum + order.quantity, 0);
  const avgPrice = myOrders.length > 0 ? myOrders.reduce((sum, order) => sum + order.pricePerUnit, 0) / myOrders.length : 0;

  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = !selectedCrop || listing.cropType === selectedCrop;
    const matchesState = !selectedState || listing.location.toLowerCase().includes(selectedState.toLowerCase());
    const matchesGrade = !selectedGrade || listing.grade === selectedGrade;
    
    let matchesPrice = true;
    if (priceRange) {
      const price = listing.pricePerUnit;
      switch (priceRange) {
        case 'under-50':
          matchesPrice = price < 50;
          break;
        case '50-100':
          matchesPrice = price >= 50 && price <= 100;
          break;
        case '100-200':
          matchesPrice = price > 100 && price <= 200;
          break;
        case 'over-200':
          matchesPrice = price > 200;
          break;
      }
    }

    return matchesSearch && matchesCrop && matchesState && matchesGrade && matchesPrice && listing.status === 'live';
  });

  const handleListingClick = (listing: any) => {
    // Store selected listing and navigate to detail screen
    sessionStorage.setItem('selectedListing', JSON.stringify(listing));
    setCurrentScreen('listing-detail');
  };

  const handleOrderClick = (orderId: string) => {
    // Store selected order ID and navigate to order detail screen
    sessionStorage.setItem('selectedOrderId', orderId);
    sessionStorage.setItem('previousScreen', 'buyer-home');
    setCurrentScreen('buyer-order-detail');
  };

  const clearFilters = () => {
    setSelectedCrop(null);
    setSelectedState(null);
    setPriceRange(null);
    setSelectedGrade(null);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="status-pending text-xs">Requested</Badge>;
      case 'confirmed':
        return <Badge className="status-verified text-xs">Confirmed</Badge>;
      case 'shipping':
        return <Badge className="status-warning text-xs">Shipping</Badge>;
      case 'received':
        return <Badge className="status-verified text-xs">Received</Badge>;
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

  const getPriceIndicator = (price: number) => {
    if (price < 50) return { icon: TrendingDown, color: 'text-green-600', label: 'Low' };
    if (price > 100) return { icon: TrendingUp, color: 'text-red-600', label: 'High' };
    return { icon: TrendingUp, color: 'text-yellow-600', label: 'Moderate' };
  };

  // Group listings by crop type for better organization
  const groupedListings = filteredListings.reduce((acc, listing) => {
    if (!acc[listing.cropType]) {
      acc[listing.cropType] = [];
    }
    acc[listing.cropType].push(listing);
    return acc;
  }, {} as { [key: string]: any[] });

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">🏭 {t.buyer} Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
          {user?.businessName && (
            <p className="text-sm text-muted-foreground">{user.businessName}</p>
          )}
          <p className="text-xs text-muted-foreground">{user?.district}, {user?.state}</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentScreen('notifications')}
            className="h-16 flex flex-col items-center space-y-1"
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 text-center">
              <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-crop-green/10 to-crop-green/5">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-crop-green" />
              <p className="text-lg font-bold">{totalQuantityBought}</p>
              <p className="text-xs text-muted-foreground">Qty Bought (kg)</p>
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
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">Trust</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">Crop</p>
                <p className="text-xs text-muted-foreground">Calendar</p>
              </div>
              <div className="text-center p-2 bg-background/50 rounded">
                <p className="text-xs font-medium">Market</p>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Matching Card */}
        <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('smart-matching')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Matching</h3>
                  <p className="text-sm text-muted-foreground">Find nearby farmers (0-100km)</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                AI
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Transport Route Optimization Card */}
        <Card className="border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setCurrentScreen('transport-optimization')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{t.optimizeRoutes}</h3>
                  <p className="text-sm text-muted-foreground">{t.fasterDelivery}</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                AI
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops, varieties, farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCrop('rice')} 
                className={selectedCrop === 'rice' ? 'bg-primary text-primary-foreground' : ''}>
                🌾 Rice
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedCrop('wheat')}
                className={selectedCrop === 'wheat' ? 'bg-primary text-primary-foreground' : ''}>
                🌾 Wheat
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedCrop('cotton')}
                className={selectedCrop === 'cotton' ? 'bg-primary text-primary-foreground' : ''}>
                🌸 Cotton
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPriceRange('under-50')}
                className={priceRange === 'under-50' ? 'bg-primary text-primary-foreground' : ''}>
                💰 Under ₹50
              </Button>
            </div>

            {/* Advanced Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced {t.filter}
                  {(selectedCrop || selectedState || priceRange || selectedGrade) && (
                    <Badge className="ml-2" variant="secondary">Active</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter Listings</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crop Type</label>
                    <Select value={selectedCrop || "all-crops"} onValueChange={(value) => setSelectedCrop(value === "all-crops" ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All crops" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-crops">All crops</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="onion">Onion</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="maize">Maize</SelectItem>
                        <SelectItem value="chili">Chili</SelectItem>
                        <SelectItem value="turmeric">Turmeric</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Select value={selectedState || "all-states"} onValueChange={(value) => setSelectedState(value === "all-states" ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-states">All states</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="andhra pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="madhya pradesh">Madhya Pradesh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <Select value={priceRange || "all-prices"} onValueChange={(value) => setPriceRange(value === "all-prices" ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-prices">All prices</SelectItem>
                        <SelectItem value="under-50">Under ₹50</SelectItem>
                        <SelectItem value="50-100">₹50 - ₹100</SelectItem>
                        <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                        <SelectItem value="over-200">Over ₹200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade</label>
                    <Select value={selectedGrade || "all-grades"} onValueChange={(value) => setSelectedGrade(value === "all-grades" ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All grades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-grades">All grades</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="grade-a">Grade A</SelectItem>
                        <SelectItem value="grade-b">Grade B</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-2 mt-6">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear All
                  </Button>
                  <SheetTrigger asChild>
                    <Button className="flex-1">Apply Filters</Button>
                  </SheetTrigger>
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="text-xs">Browse ({filteredListings.length})</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">
              My Orders
              {activeOrders.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          {/* Browse Listings Tab */}
          <TabsContent value="browse" className="space-y-4">
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">🔍</div>
                  <div>
                    <h3 className="font-medium">No crops found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                  {(searchTerm || selectedCrop || selectedState || priceRange || selectedGrade) && (
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      clearFilters();
                    }}>
                      Clear Search & Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedListings).map(([cropType, cropListings]) => (
                  <div key={cropType}>
                    <h3 className="font-medium mb-3 flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{getCropEmoji(cropType)}</span>
                      <span className="capitalize">{cropType} ({cropListings.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {cropListings.map((listing) => {
                        const priceInfo = getPriceIndicator(listing.pricePerUnit);
                        return (
                          <Card 
                            key={listing.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary/60"
                            onClick={() => handleListingClick(listing)}
                          >
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
                                      <h3 className="font-medium truncate text-sm">
                                        {listing.cropType.charAt(0).toUpperCase() + listing.cropType.slice(1)} - {listing.variety}
                                      </h3>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-lg font-bold text-primary">₹{listing.pricePerUnit}/kg</p>
                                        <priceInfo.icon className={`h-4 w-4 ${priceInfo.color}`} />
                                      </div>
                                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                        <span>{listing.totalAvailableQty} kg available</span>
                                        <span>•</span>
                                        <span>Min: {listing.minOrderQty} kg</span>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {listing.grade}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{listing.location}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3 text-success" />
                                        <span>{listing.farmerName}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 p-2 bg-accent/30 rounded-md">
                                    <p className="text-xs text-muted-foreground">
                                      🗓️ Harvested: {new Date(listing.harvestDate).toLocaleDateString()} • 
                                      ⏰ Expires: {new Date(listing.expiryDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">🛒</div>
                  <div>
                    <h3 className="font-medium">{t.noOrdersYet}</h3>
                    <p className="text-sm text-muted-foreground">Your active orders will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-warning/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-sm">{order.cropType}</h3>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              From: <span className="font-medium text-foreground">{order.farmerName}</span>
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">{order.quantity} kg</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Order #{order.id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.message && (
                              <div className="mt-2 p-2 bg-muted rounded-md">
                                <p className="text-xs italic">Note: "{order.message}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" className="space-y-4">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="font-medium">No completed orders</h3>
                    <p className="text-sm text-muted-foreground">Your purchase history will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-success/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-sm">{order.cropType}</h3>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            From: <span className="font-medium text-foreground">{order.farmerName}</span> • {order.quantity} kg • ₹{order.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Completed on {order.receivedAt ? new Date(order.receivedAt).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          📄 Receipt
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