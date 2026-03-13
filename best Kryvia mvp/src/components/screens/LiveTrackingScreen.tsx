import { ArrowLeft, Truck, MapPin, Clock, Navigation, Phone, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { useApp } from '../AppContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTranslation } from '../translations';
import { useState, useEffect } from 'react';
import { getLiveTrackingData, ShipmentTrackingData } from '../../lib/google-maps-service';
import { Progress } from '../ui/progress';

export function LiveTrackingScreen() {
  const { setCurrentScreen, user, language, orders } = useApp();
  const t = useTranslation(language);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<ShipmentTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Get farmer's shipping orders
  const shippingOrders = orders.filter(o => 
    o.farmerId === user?.id && o.status === 'shipping'
  );

  // Load tracking data for selected order
  const loadTrackingData = async (orderId: string) => {
    setLoading(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Simulate origin and destination
      const origin = user?.village || 'Farm Location';
      const destination = order.buyerName + "'s Warehouse";

      const data = await getLiveTrackingData(orderId, origin, destination);
      setTrackingData(data);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh tracking data every 30 seconds
  useEffect(() => {
    if (!selectedOrder || !autoRefresh) return;

    const interval = setInterval(() => {
      loadTrackingData(selectedOrder);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedOrder, autoRefresh]);

  // Handle order selection
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(orderId);
    loadTrackingData(orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-500';
      case 'at_rest':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'In Transit';
      case 'at_rest':
        return 'At Rest Stop';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => setCurrentScreen('farmer-home')} className="p-1 hover:bg-white/10 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Live Shipment Tracking</h1>
            <p className="text-xs text-orange-50">Track your crops in real-time</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
            LIVE
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Active Shipments List */}
        {shippingOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-4xl">🚚</div>
              <div>
                <h3 className="font-medium">No Active Shipments</h3>
                <p className="text-sm text-muted-foreground">
                  Confirmed orders in transit will appear here
                </p>
              </div>
              <Button 
                onClick={() => setCurrentScreen('farmer-home')}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Order Selection */}
            {!selectedOrder && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Select Shipment to Track
                  </h3>
                  <div className="space-y-2">
                    {shippingOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => handleSelectOrder(order.id)}
                        className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{order.cropType}</p>
                            <p className="text-xs text-muted-foreground">
                              To: {order.buyerName} • {order.quantity} kg
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Order #{order.id.slice(-6)}
                            </p>
                          </div>
                          <Badge className="bg-blue-500">
                            <Truck className="h-3 w-3 mr-1" />
                            Shipping
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tracking Details */}
            {selectedOrder && trackingData && (
              <>
                {/* Change Shipment Button */}
                <Button
                  onClick={() => {
                    setSelectedOrder(null);
                    setTrackingData(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  ← Change Shipment
                </Button>

                {/* Status Card */}
                <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-blue-600" />
                        Live Status
                      </h3>
                      <Badge className={getStatusColor(trackingData.status)}>
                        {getStatusText(trackingData.status)}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold text-blue-600">{trackingData.progress}%</span>
                      </div>
                      <Progress value={trackingData.progress} className="h-2" />
                    </div>

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Distance Left
                        </div>
                        <p className="font-semibold">{trackingData.distanceRemaining}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Clock className="h-3.5 w-3.5" />
                          Time Left
                        </div>
                        <p className="font-semibold">{trackingData.timeRemaining}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg col-span-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Estimated Arrival
                        </div>
                        <p className="font-semibold text-green-600">{trackingData.estimatedArrival}</p>
                      </div>
                    </div>

                    {/* Current Location */}
                    <div className="mt-3 p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Current Location</p>
                      <p className="font-medium">{trackingData.currentLocationName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {trackingData.lastUpdated}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-orange-600" />
                      Vehicle Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Vehicle Number</span>
                        <span className="font-medium">{trackingData.vehicleNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Speed</span>
                        <span className="font-medium">
                          {trackingData.currentSpeed > 0 
                            ? `${Math.round(trackingData.currentSpeed)} km/h` 
                            : 'Stopped'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Driver</span>
                        <span className="font-medium">{trackingData.driverName}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Driver: {trackingData.driverPhone}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Map Placeholder */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Route Map</h3>
                    <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Simple route visualization */}
                      <div className="absolute inset-0 p-4">
                        {/* Origin */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                          <span className="text-xs mt-1 bg-white px-2 py-0.5 rounded shadow">Origin</span>
                        </div>
                        
                        {/* Route line */}
                        <div className="absolute left-8 top-1/2 right-8 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500" />
                        
                        {/* Current position */}
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000"
                          style={{ left: `${20 + (trackingData.progress * 0.6)}%` }}
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                          <Truck className="h-5 w-5 text-blue-600 mt-1" />
                        </div>
                        
                        {/* Destination */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg" />
                          <span className="text-xs mt-1 bg-white px-2 py-0.5 rounded shadow">Destination</span>
                        </div>
                      </div>
                      
                      <div className="text-center z-10 mt-20">
                        <p className="text-sm text-muted-foreground">
                          Real-time GPS tracking
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updates every 30 seconds
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Details */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Journey Details</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Origin</p>
                          <p className="text-xs text-muted-foreground">{trackingData.originName}</p>
                        </div>
                      </div>
                      
                      <div className="ml-4 border-l-2 border-dashed border-border h-8" />
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Destination</p>
                          <p className="text-xs text-muted-foreground">{trackingData.destinationName}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Auto-refresh toggle */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Auto-refresh</p>
                        <p className="text-xs text-muted-foreground">Updates every 30 seconds</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <Button
                      onClick={() => loadTrackingData(selectedOrder)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      disabled={loading}
                    >
                      {loading ? 'Refreshing...' : 'Refresh Now'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Tracking Tips
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Location updates automatically every 30 seconds</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Call driver for urgent queries or updates</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Buyer will be notified upon delivery completion</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Loading state */}
            {loading && selectedOrder && !trackingData && (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading tracking data...</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Info Card */}
        {shippingOrders.length > 0 && !selectedOrder && (
          <Card className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-orange-600" />
                About Live Tracking
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Real-time GPS tracking powered by Google Maps
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Live distance and time calculations
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Direct contact with driver available
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Automatic updates every 30 seconds
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
