import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Bell, Package, Crop, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'listing' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  relatedId?: string; // order ID or listing ID
}

export function NotificationsScreen() {
  const { user, orders, listings, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'listings'>('all');

  useEffect(() => {
    // Generate notifications based on user role and current orders/listings
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      if (user?.role === 'farmer') {
        // Notifications for farmers
        const incomingOrders = orders.filter(order => order.farmerId === user.id && order.status === 'requested');
        
        incomingOrders.forEach(order => {
          newNotifications.push({
            id: `order-${order.id}`,
            type: 'order',
            title: 'New Order Request',
            message: `${order.buyerName} wants to buy ${order.quantity} kg of ${order.cropType}`,
            timestamp: order.createdAt,
            isRead: false,
            priority: 'high',
            relatedId: order.id
          });
        });

        // Payment notifications
        const paidOrders = orders.filter(order => order.farmerId === user.id && order.status === 'paid');
        paidOrders.forEach(order => {
          newNotifications.push({
            id: `payment-${order.id}`,
            type: 'payment',
            title: 'Payment Received',
            message: `Payment of ₹${order.totalAmount.toLocaleString()} received for ${order.cropType} order`,
            timestamp: order.paidAt || order.createdAt,
            isRead: Math.random() > 0.5,
            priority: 'medium',
            relatedId: order.id
          });
        });
      } else if (user?.role === 'buyer') {
        // Notifications for buyers
        const myOrders = orders.filter(order => order.buyerId === user.id);
        
        // Order status updates
        myOrders.forEach(order => {
          if (order.status === 'confirmed') {
            newNotifications.push({
              id: `confirmed-${order.id}`,
              type: 'order',
              title: 'Order Confirmed',
              message: `${order.farmerName} confirmed your order for ${order.cropType}`,
              timestamp: order.confirmedAt || order.createdAt,
              isRead: Math.random() > 0.3,
              priority: 'high',
              relatedId: order.id
            });
          }
          if (order.status === 'payment_pending') {
            newNotifications.push({
              id: `payment-pending-${order.id}`,
              type: 'payment',
              title: 'Payment Required',
              message: `Payment of ₹${order.totalAmount.toLocaleString()} required for ${order.cropType} order`,
              timestamp: order.paymentRequestedAt || order.createdAt,
              isRead: false,
              priority: 'high',
              relatedId: order.id
            });
          }
        });

        // New listings notifications
        const recentListings = listings.filter(listing => {
          const listingDate = new Date(listing.createdAt);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return listingDate > dayAgo;
        });

        recentListings.slice(0, 5).forEach(listing => {
          newNotifications.push({
            id: `listing-${listing.id}`,
            type: 'listing',
            title: 'New Crop Available',
            message: `${listing.farmerName} listed ${listing.cropType} - ${listing.variety} at ₹${listing.pricePerUnit}/kg`,
            timestamp: listing.createdAt,
            isRead: Math.random() > 0.7,
            priority: 'low',
            relatedId: listing.id
          });
        });
      }

      // System notifications for all users
      newNotifications.push({
        id: 'system-1',
        type: 'system',
        title: 'Market Prices Updated',
        message: 'Latest mandi prices are now available. Check market rates for better pricing.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low'
      });

      newNotifications.push({
        id: 'system-2',
        type: 'system',
        title: 'Welcome to KryVia',
        message: 'Complete your profile setup to unlock all features and start trading.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium'
      });

      return newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    setNotifications(generateNotifications());
  }, [user, orders, listings]);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'orders':
        return notification.type === 'order' || notification.type === 'payment';
      case 'listings':
        return notification.type === 'listing';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to relevant screen
    if (notification.relatedId) {
      if (notification.type === 'order' || notification.type === 'payment') {
        sessionStorage.setItem('selectedOrderId', notification.relatedId);
        if (user?.role === 'farmer') {
          setCurrentScreen('farmer-orders');
        } else {
          setCurrentScreen('buyer-order-detail');
        }
      } else if (notification.type === 'listing') {
        const listing = listings.find(l => l.id === notification.relatedId);
        if (listing) {
          sessionStorage.setItem('selectedListing', JSON.stringify(listing));
          setCurrentScreen('listing-detail');
        }
      }
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'order':
        return <Package className={`h-5 w-5 ${priority === 'high' ? 'text-warning' : 'text-primary'}`} />;
      case 'listing':
        return <Crop className="h-5 w-5 text-crop-green" />;
      case 'payment':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'system':
        return <Bell className="h-5 w-5 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string, isRead: boolean) => {
    if (isRead) return null;
    
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 bg-destructive rounded-full"></div>;
      case 'medium':
        return <div className="w-2 h-2 bg-warning rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-primary rounded-full"></div>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen(user?.role === 'farmer' ? 'farmer-home' : 'buyer-home')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-medium flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="listings" className="text-xs">Listings</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="text-4xl">🔔</div>
                  <div>
                    <h3 className="font-medium">No notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      {filter === 'unread' ? 'All caught up!' : 'New notifications will appear here'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-primary bg-accent/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-medium text-sm ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </h3>
                              {getPriorityBadge(notification.priority, notification.isRead)}
                            </div>
                            <p className={`text-sm mt-1 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}