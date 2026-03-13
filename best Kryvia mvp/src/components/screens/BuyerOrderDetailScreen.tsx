import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { ArrowLeft, CheckCircle, Clock, Package, User, MapPin, Calendar, MessageCircle, Phone, RotateCcw, FileText, Truck } from 'lucide-react';

export function BuyerOrderDetailScreen() {
  const { user, orders, listings, updateOrder, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  // Get order from session storage
  const orderId = sessionStorage.getItem('selectedOrderId');
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="font-medium">Order not found</h3>
            <Button onClick={() => setCurrentScreen('buyer-home')} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBack = () => {
    setCurrentScreen('buyer-home');
  };

  const handleMarkAsReceived = () => {
    // Update order status to received
    updateOrder(order.id, {
      status: 'received',
      receivedAt: new Date().toISOString()
    });
    
    // Show confirmation
    alert('Order marked as received! The farmer has been notified.');
  };

  const handleReorder = () => {
    // Find the original listing by matching order details
    const originalListing = listings.find(listing => 
      listing.id === order.listingId || 
      (listing.cropType === order.cropType.toLowerCase() && 
       listing.farmerName === order.farmerName)
    );
    
    if (originalListing) {
      // Store the complete listing data for reorder
      sessionStorage.setItem('selectedListing', JSON.stringify(originalListing));
      sessionStorage.setItem('previousScreen', 'buyer-order-detail');
      setCurrentScreen('listing-detail');
    } else {
      // Create a synthetic listing object if original not found
      const syntheticListing = {
        id: order.listingId,
        farmerId: order.farmerId,
        farmerName: order.farmerName,
        cropType: order.cropType.toLowerCase().split(' ')[0], // Extract base crop name
        variety: order.variety || 'Premium',
        grade: order.grade || 'premium',
        harvestDate: new Date().toISOString(),
        location: 'Available on request',
        pricePerUnit: order.pricePerUnit,
        minOrderQty: Math.min(order.quantity, 50),
        totalAvailableQty: order.quantity * 2,
        images: [],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'live' as const,
        createdAt: new Date().toISOString(),
      };
      
      sessionStorage.setItem('selectedListing', JSON.stringify(syntheticListing));
      sessionStorage.setItem('previousScreen', 'buyer-order-detail');
      setCurrentScreen('listing-detail');
    }
  };

  const handleOpenChat = () => {
    // Store chat context and navigate to messaging
    sessionStorage.setItem('chatContext', JSON.stringify({
      orderId: order.id,
      otherParty: {
        id: order.farmerId,
        name: order.farmerName,
        role: 'farmer'
      }
    }));
    sessionStorage.setItem('previousScreen', 'buyer-order-detail');
    setCurrentScreen('messaging');
  };

  const handleCall = () => {
    // In a real app, this would initiate a call
    alert(`Calling ${order.farmerName}...`);
  };

  const getStatusProgress = () => {
    switch (order.status) {
      case 'requested':
        return 25;
      case 'confirmed':
        return 50;
      case 'shipping':
        return 75;
      case 'received':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="status-pending">Requested</Badge>;
      case 'confirmed':
        return <Badge className="status-verified">Confirmed</Badge>;
      case 'shipping':
        return <Badge className="status-warning">Shipping</Badge>;
      case 'received':
        return <Badge className="status-verified">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const orderSteps = [
    { key: 'requested', label: 'Requested', description: 'Order placed by you', icon: Package },
    { key: 'confirmed', label: 'Confirmed', description: 'Farmer accepted order', icon: CheckCircle },
    { key: 'shipping', label: 'Shipping', description: 'Order is on the way', icon: Truck },
    { key: 'received', label: 'Received', description: 'Order delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.key === order.status);
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
    const baseCropType = cropType.toLowerCase().split(' ')[0];
    return emojiMap[baseCropType] || '🌱';
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
            <h1 className="font-medium">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order #{order.id.slice(-6)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Order Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
            <CardDescription>Track your order status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={getStatusProgress()} className="w-full" />
            
            <div className="space-y-3">
              {orderSteps.map((step, index) => {
                const currentIndex = getCurrentStepIndex();
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-1 ${isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.key === 'confirmed' && order.confirmedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.confirmedAt).toLocaleString()}
                        </p>
                      )}
                      {step.key === 'shipping' && order.shippedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.shippedAt).toLocaleString()}
                        </p>
                      )}
                      {step.key === 'received' && order.receivedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.receivedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                {getCropEmoji(order.cropType)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{order.cropType}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {order.quantity} kg</p>
                <p className="text-sm text-muted-foreground">Price: ₹{order.pricePerUnit}/kg</p>
                {order.variety && (
                  <p className="text-sm text-muted-foreground">Variety: {order.variety}</p>
                )}
                {order.grade && (
                  <p className="text-sm text-muted-foreground">Grade: {order.grade}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farmer:</span>
                <span className="font-medium">{order.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span>#{order.id.slice(-6)}</span>
              </div>
              {order.message && (
                <div>
                  <p className="text-muted-foreground mb-1">Your Message:</p>
                  <p className="text-sm bg-muted p-2 rounded">{order.message}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleOpenChat}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Farmer
          </Button>
          <Button variant="outline" onClick={handleCall}>
            <Phone className="h-4 w-4 mr-2" />
            Call Farmer
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="space-y-2">
          {/* Mark as Received Button - Show when order is in shipping status */}
          {order.status === 'shipping' && (
            <Button className="w-full bg-success hover:bg-success/90" onClick={handleMarkAsReceived}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Received
            </Button>
          )}
          
          <Button variant="outline" className="w-full" onClick={handleReorder}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reorder This Item
          </Button>
          
          {order.status === 'received' && (
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}