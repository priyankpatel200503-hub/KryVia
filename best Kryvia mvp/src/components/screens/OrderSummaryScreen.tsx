import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { ArrowLeft, CheckCircle, Clock, CreditCard, Package, User, MapPin, Calendar } from 'lucide-react';

export function OrderSummaryScreen() {
  const { user, updateOrder, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);

  // Get order from session storage
  const order = JSON.parse(sessionStorage.getItem('currentOrder') || '{}');

  const handleBack = () => {
    if (user?.role === 'farmer') {
      setCurrentScreen('farmer-home');
    } else {
      setCurrentScreen('buyer-home');
    }
  };

  const handleConfirmOrder = () => {
    // Farmer confirms the order
    updateOrder(order.id, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    });
    
    // Update session storage
    const updatedOrder = { ...order, status: 'confirmed', confirmedAt: new Date().toISOString() };
    sessionStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
  };

  const handlePayment = () => {
    // Navigate to payment screen
    setCurrentScreen('payment');
  };

  const getStatusProgress = () => {
    switch (order.status) {
      case 'requested':
        return 20;
      case 'confirmed':
        return 40;
      case 'payment_pending':
        return 60;
      case 'paid':
        return 80;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusIcon = (status: string, isActive: boolean) => {
    const className = `h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`;
    
    switch (status) {
      case 'requested':
        return <Clock className={className} />;
      case 'confirmed':
        return <CheckCircle className={className} />;
      case 'payment_pending':
        return <CreditCard className={className} />;
      case 'paid':
        return <Package className={className} />;
      case 'completed':
        return <CheckCircle className={className} />;
      default:
        return <Clock className={className} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="status-pending">Requested</Badge>;
      case 'confirmed':
        return <Badge className="status-verified">Confirmed</Badge>;
      case 'payment_pending':
        return <Badge className="status-warning">Payment Pending</Badge>;
      case 'paid':
        return <Badge className="status-verified">Paid</Badge>;
      case 'completed':
        return <Badge className="status-verified">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const orderSteps = [
    { key: 'requested', label: t.requested, description: 'Order placed by buyer' },
    { key: 'confirmed', label: t.confirmed, description: 'Farmer confirmed order' },
    { key: 'payment_pending', label: t.paymentPending, description: 'Waiting for payment' },
    { key: 'paid', label: t.paid, description: 'Payment completed' },
    { key: 'completed', label: t.completed, description: 'Order delivered' },
  ];

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.key === order.status);
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
            <h1 className="font-medium">{t.orderSummary}</h1>
            <p className="text-sm text-muted-foreground">Order #{order.id?.slice(-6)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Order Progress */}
        <Card>
          <CardHeader>
            <CardTitle>{t.orderTracking}</CardTitle>
            <CardDescription>Track your order status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={getStatusProgress()} className="w-full" />
            
            <div className="space-y-3">
              {orderSteps.map((step, index) => {
                const currentIndex = getCurrentStepIndex();
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isPending = index > currentIndex;

                return (
                  <div key={step.key} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-1 ${isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                      {getStatusIcon(step.key, isCurrent || isCompleted)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.key === 'confirmed' && order.confirmedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.confirmedAt).toLocaleString()}
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
            {/* Crop Information */}
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🌾
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{order.cropType}</h3>
                <p className="text-sm text-muted-foreground">Quantity: {order.quantity} kg</p>
                <p className="text-sm text-muted-foreground">Price: ₹{order.pricePerUnit}/kg</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
            </div>

            <Separator />

            {/* Participants */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Farmer</span>
                </p>
                <p className="font-medium">{order.farmerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Buyer</span>
                </p>
                <p className="font-medium">{order.buyerName}</p>
              </div>
            </div>

            <Separator />

            {/* Order Information */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span>#{order.id?.slice(-6)}</span>
              </div>
              {order.message && (
                <div>
                  <p className="text-muted-foreground">Message:</p>
                  <p className="text-sm bg-muted p-2 rounded mt-1">{order.message}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Farmer Actions */}
          {user?.role === 'farmer' && order.status === 'requested' && (
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                Decline
              </Button>
              <Button onClick={handleConfirmOrder} className="flex-1">
                {t.confirm} Order
              </Button>
            </div>
          )}

          {/* Buyer Actions */}
          {user?.role === 'buyer' && order.status === 'payment_pending' && (
            <Button onClick={handlePayment} className="w-full h-12" size="lg">
              {t.payNow} - ₹{order.totalAmount?.toLocaleString()}
            </Button>
          )}

          {/* Chat Button (for both roles when order is active) */}
          {['confirmed', 'payment_pending', 'paid'].includes(order.status) && (
            <Button variant="outline" className="w-full">
              💬 Chat with {user?.role === 'farmer' ? 'Buyer' : 'Farmer'}
            </Button>
          )}
        </div>

        {/* Contact Information */}
        {order.status !== 'requested' && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-center text-muted-foreground">
                Need help? Contact our support team or use the in-app chat feature.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}