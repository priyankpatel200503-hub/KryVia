import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, User, Calendar, MapPin, MessageSquare, IndianRupee, Truck } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function FarmerOrderManagementScreen() {
  const { user, orders, updateOrder, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  // Filter orders for current farmer - if demo farmer, show relevant orders
  const myOrders = user?.id === 'farmer1' ? orders : orders.filter(order => order.farmerId === user?.id);
  const incomingOrders = myOrders.filter(order => order.status === 'requested');
  const activeOrders = myOrders.filter(order => ['confirmed', 'shipping'].includes(order.status));
  const completedOrders = myOrders.filter(order => order.status === 'received');

  const handleBack = () => {
    setCurrentScreen('farmer-home');
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrder(orderId, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    });
  };

  const handleDeclineOrder = (orderId: string) => {
    // For now, we'll remove the order or mark it as cancelled
    // In a real app, you might want to add a 'cancelled' status
    updateOrder(orderId, {
      status: 'received', // Using received as a way to remove from active lists
      receivedAt: new Date().toISOString(),
    });
  };

  const handleMarkShipping = (orderId: string) => {
    updateOrder(orderId, {
      status: 'shipping',
      shippedAt: new Date().toISOString(),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="status-pending">New Request</Badge>;
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
            <h1 className="font-medium">Order Management</h1>
            <p className="text-sm text-muted-foreground">Manage your incoming and active orders</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
              <p className="text-lg font-bold">{incomingOrders.length}</p>
              <p className="text-xs text-muted-foreground">New Requests</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">{activeOrders.length}</p>
              <p className="text-xs text-muted-foreground">Active Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-lg font-bold">{completedOrders.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Tabs */}
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incoming" className="text-xs">
              New Requests ({incomingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          {/* Incoming Orders Tab */}
          <TabsContent value="incoming" className="space-y-4">
            {incomingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">📥</div>
                  <div>
                    <h3 className="font-medium">No new order requests</h3>
                    <p className="text-sm text-muted-foreground">New order requests from buyers will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {incomingOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-warning">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getCropEmoji(order.cropType)}</div>
                          <div>
                            <CardTitle className="text-base">{order.cropType}</CardTitle>
                            <CardDescription>Order #{order.id.slice(-6)}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Buyer Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4" />
                          <span>Buyer Details</span>
                        </h4>
                        <div className="pl-6 space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Company:</span> {order.buyerName}</p>
                          <p className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Requested: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price per kg</p>
                          <p className="font-medium">₹{order.pricePerUnit}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold text-primary flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Buyer Message */}
                      {order.message && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center space-x-2 text-sm">
                              <MessageSquare className="h-4 w-4" />
                              <span>Buyer's Message</span>
                            </h4>
                            <div className="pl-6 p-3 bg-muted rounded-lg">
                              <p className="text-sm italic">"{order.message}"</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDeclineOrder(order.id)}
                          className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Orders Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">📦</div>
                  <div>
                    <h3 className="font-medium">No active orders</h3>
                    <p className="text-sm text-muted-foreground">Accepted orders will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getCropEmoji(order.cropType)}</div>
                          <div>
                            <CardTitle className="text-base">{order.cropType}</CardTitle>
                            <CardDescription>Order #{order.id.slice(-6)} • {order.buyerName}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Summary */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rate</p>
                          <p className="font-medium">₹{order.pricePerUnit}/kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>Confirmed on {new Date(order.confirmedAt!).toLocaleDateString()}</span>
                        </div>
                        {order.shippedAt && (
                          <div className="flex items-center space-x-2">
                            <Truck className="h-3 w-3 text-warning" />
                            <span>Shipped on {new Date(order.shippedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => handleMarkShipping(order.id)}
                          className="w-full"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Mark as Shipping
                        </Button>
                      )}

                      {order.status === 'shipping' && (
                        <div className="p-3 bg-warning/10 rounded-lg text-center">
                          <p className="text-sm text-warning-foreground">
                            🚛 Order is on the way to buyer
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Completed Orders Tab */}
          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">✅</div>
                  <div>
                    <h3 className="font-medium">No completed orders</h3>
                    <p className="text-sm text-muted-foreground">Completed orders will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-success">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{getCropEmoji(order.cropType)}</div>
                          <div>
                            <h3 className="font-medium text-sm">{order.cropType}</h3>
                            <p className="text-sm text-muted-foreground">
                              {order.buyerName} • {order.quantity} kg • ₹{order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Delivered: {order.receivedAt ? new Date(order.receivedAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
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