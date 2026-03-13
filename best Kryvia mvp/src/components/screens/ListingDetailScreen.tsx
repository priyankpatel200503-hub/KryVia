import { useState } from 'react';
import { useApp } from '../AppContext';
import { useTranslation } from '../translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Package, User } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function ListingDetailScreen() {
  const { user, addOrder, setCurrentScreen, language } = useApp();
  const t = useTranslation(language);
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Get listing from session storage
  const listing = JSON.parse(sessionStorage.getItem('selectedListing') || '{}');

  const handleBack = () => {
    setCurrentScreen('buyer-home');
  };

  const calculateTotal = () => {
    const qty = parseInt(quantity || '0');
    return qty * listing.pricePerUnit;
  };

  const handlePlaceOrder = () => {
    if (!user?.isVerified) {
      alert('Please complete KYC verification to place orders');
      return;
    }

    const orderQuantity = parseInt(quantity);
    if (orderQuantity < listing.minOrderQty) {
      alert(`Minimum order quantity is ${listing.minOrderQty} kg`);
      return;
    }

    if (orderQuantity > listing.totalAvailableQty) {
      alert(`Only ${listing.totalAvailableQty} kg available`);
      return;
    }

    // Create new order
    const newOrder = {
      id: Date.now().toString(),
      listingId: listing.id,
      buyerId: user!.id,
      farmerId: listing.farmerId,
      buyerName: user!.name,
      farmerName: listing.farmerName,
      cropType: listing.cropType,
      quantity: orderQuantity,
      pricePerUnit: listing.pricePerUnit,
      totalAmount: calculateTotal(),
      status: 'requested' as const,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    
    // Store order for order summary screen
    sessionStorage.setItem('currentOrder', JSON.stringify(newOrder));
    setCurrentScreen('order-summary');
  };

  const isQuantityValid = () => {
    const qty = parseInt(quantity || '0');
    return qty >= listing.minOrderQty && qty <= listing.totalAvailableQty;
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
            <h1 className="font-medium">Crop Details</h1>
            <p className="text-sm text-muted-foreground">Review before placing order</p>
          </div>
        </div>

        {/* Image Gallery */}
        <Card>
          <CardContent className="p-0">
            <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
              {listing.images && listing.images[0] ? (
                <ImageWithFallback
                  src={listing.images[0]}
                  alt={listing.cropType}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🌾
                </div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {listing.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={image}
                        alt={`${listing.cropType} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crop Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{listing.cropType} - {listing.variety}</CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Verified Farmer</span>
                </CardDescription>
              </div>
              <Badge variant="outline">{listing.grade}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price and Availability */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price per kg</p>
                <p className="text-2xl font-bold text-primary">₹{listing.pricePerUnit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-medium">{listing.totalAvailableQty} kg</p>
              </div>
            </div>

            <Separator />

            {/* Farmer Information */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Farmer Details</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{listing.farmerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{listing.location}</span>
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Crop Information */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Crop Information</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Harvest Date</p>
                  <p className="font-medium flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(listing.harvestDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Min Order</p>
                  <p className="font-medium">{listing.minOrderQty} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Grade</p>
                  <p className="font-medium">{listing.grade}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expires</p>
                  <p className="font-medium">{new Date(listing.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        {showOrderForm ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.placeOrder}</CardTitle>
              <CardDescription>Enter quantity and submit your order request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quantity Input */}
              <div className="space-y-2">
                <Label htmlFor="quantity">{t.quantity} (kg)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Min: ${listing.minOrderQty} kg`}
                  min={listing.minOrderQty}
                  max={listing.totalAvailableQty}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum order: {listing.minOrderQty} kg | Available: {listing.totalAvailableQty} kg
                </p>
              </div>

              {/* Total Calculation */}
              {quantity && (
                <div className="p-3 bg-accent rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-bold text-primary">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {quantity} kg × ₹{listing.pricePerUnit} per kg
                  </p>
                </div>
              )}

              {/* Message to Farmer */}
              <div className="space-y-2">
                <Label htmlFor="message">{t.messageToFarmer}</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={!isQuantityValid() || !user?.isVerified}
                  className="flex-1"
                >
                  {t.sendRequest}
                </Button>
              </div>

              {!user?.isVerified && (
                <p className="text-xs text-center text-muted-foreground">
                  Complete KYC verification to place orders
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Place Order Button */
          <Button 
            onClick={() => setShowOrderForm(true)}
            disabled={!user?.isVerified}
            className="w-full h-12"
            size="lg"
          >
            {t.placeOrder}
          </Button>
        )}

        {/* Verification Notice */}
        {!user?.isVerified && (
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm">
                Complete your KYC verification to place orders and contact farmers directly.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}