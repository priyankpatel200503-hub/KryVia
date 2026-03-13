import { useEffect } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { Header } from './components/Header';
import { SplashScreen } from './components/screens/SplashScreen';
import { RoleSelectionScreen } from './components/screens/RoleSelectionScreen';
import { SignupScreen } from './components/screens/SignupScreen';
import { OTPVerificationScreen } from './components/screens/OTPVerificationScreen';
import { ProfileSetupScreen } from './components/screens/ProfileSetupScreen';
import { KYCUploadScreen } from './components/screens/KYCUploadScreen';
import { KYCStatusScreen } from './components/screens/KYCStatusScreen';
import { FarmerHomeScreen } from './components/screens/FarmerHomeScreen';
import { BuyerHomeScreen } from './components/screens/BuyerHomeScreen';
import { CreateListingScreen } from './components/screens/CreateListingScreen';
import { ListingDetailScreen } from './components/screens/ListingDetailScreen';
import { OrderSummaryScreen } from './components/screens/OrderSummaryScreen';
import { FarmerOrderManagementScreen } from './components/screens/FarmerOrderManagementScreen';
import { BuyerOrderDetailScreen } from './components/screens/BuyerOrderDetailScreen';
import { MessagingScreen } from './components/screens/MessagingScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { AIFeaturesScreen } from './components/screens/AIFeaturesScreen';
import { SmartMatchingScreen } from './components/screens/SmartMatchingScreen';
import { SeasonalCalendarScreen } from './components/screens/SeasonalCalendarScreen';
import { AIAssistant } from './components/ai/AIAssistant';
import { TransportOptimizationScreen } from './components/screens/TransportOptimizationScreen';
import { MarketLocationsScreen } from './components/screens/MarketLocationsScreen';
import { LiveTrackingScreen } from './components/screens/LiveTrackingScreen';
import { MarketPriceDashboard } from './components/screens/MarketPriceDashboard';
import { KisanAIScreen } from './components/screens/KisanAIScreen';

function AppContent() {
  const { currentScreen, user, setListings, setOrders } = useApp();

  // Initialize with comprehensive mock data for demonstration
  useEffect(() => {
    // Enhanced mock listings with diverse Indian agricultural products
    const mockListings = [
      {
        id: '1',
        farmerId: 'farmer1',
        farmerName: 'Rajesh Kumar Patel',
        cropType: 'rice',
        variety: 'Basmati-1121',
        grade: 'premium',
        harvestDate: '2024-11-10',
        location: 'Karnal, Haryana',
        pricePerUnit: 95,
        minOrderQty: 100,
        totalAvailableQty: 8000,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-31',
        status: 'live' as const,
        createdAt: '2024-11-20T10:00:00Z',
      },
      {
        id: '2',
        farmerId: 'farmer2',
        farmerName: 'Sita Devi Sharma',
        cropType: 'wheat',
        variety: 'HD-3086 (Pusa Wheat)',
        grade: 'grade-a',
        harvestDate: '2024-11-15',
        location: 'Ludhiana, Punjab',
        pricePerUnit: 52,
        minOrderQty: 200,
        totalAvailableQty: 12000,
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-28',
        status: 'live' as const,
        createdAt: '2024-11-18T14:30:00Z',
      },
      {
        id: '3',
        farmerId: 'farmer3',
        farmerName: 'Mukesh Singh Rathore',
        cropType: 'cotton',
        variety: 'Bt-Cotton (Bollgard II)',
        grade: 'premium',
        harvestDate: '2024-10-25',
        location: 'Ahmedabad, Gujarat',
        pricePerUnit: 135,
        minOrderQty: 50,
        totalAvailableQty: 3500,
        images: ['https://images.unsplash.com/photo-1602543213717-73b2b537b957?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-20',
        status: 'live' as const,
        createdAt: '2024-11-22T09:15:00Z',
      },
      {
        id: '4',
        farmerId: 'farmer4',
        farmerName: 'Priya Joshi',
        cropType: 'tomato',
        variety: 'Hybrid Determinate',
        grade: 'grade-a',
        harvestDate: '2024-11-25',
        location: 'Nashik, Maharashtra',
        pricePerUnit: 42,
        minOrderQty: 25,
        totalAvailableQty: 1200,
        images: ['https://images.unsplash.com/photo-1546470427-227e0b0f4acd?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-05',
        status: 'live' as const,
        createdAt: '2024-11-23T16:45:00Z',
      },
      {
        id: '5',
        farmerId: 'farmer5',
        farmerName: 'Arjun Patel',
        cropType: 'onion',
        variety: 'Nashik Red',
        grade: 'premium',
        harvestDate: '2024-11-20',
        location: 'Nashik, Maharashtra',
        pricePerUnit: 38,
        minOrderQty: 100,
        totalAvailableQty: 5000,
        images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-25',
        status: 'live' as const,
        createdAt: '2024-11-21T11:20:00Z',
      },
      {
        id: '6',
        farmerId: 'farmer6',
        farmerName: 'Lakshmi Reddy',
        cropType: 'rice',
        variety: 'Sona Masuri',
        grade: 'grade-a',
        harvestDate: '2024-11-05',
        location: 'Guntur, Andhra Pradesh',
        pricePerUnit: 68,
        minOrderQty: 150,
        totalAvailableQty: 6000,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-30',
        status: 'live' as const,
        createdAt: '2024-11-19T08:30:00Z',
      },
      {
        id: '7',
        farmerId: 'farmer7',
        farmerName: 'Ramesh Yadav',
        cropType: 'sugarcane',
        variety: 'Co-238',
        grade: 'premium',
        harvestDate: '2024-11-12',
        location: 'Muzaffarnagar, Uttar Pradesh',
        pricePerUnit: 32,
        minOrderQty: 500,
        totalAvailableQty: 25000,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-15',
        status: 'live' as const,
        createdAt: '2024-11-20T13:45:00Z',
      },
      {
        id: '8',
        farmerId: 'farmer8',
        farmerName: 'Kavita Kumari',
        cropType: 'potato',
        variety: 'Kufri Jyoti',
        grade: 'grade-a',
        harvestDate: '2024-11-18',
        location: 'Agra, Uttar Pradesh',
        pricePerUnit: 28,
        minOrderQty: 200,
        totalAvailableQty: 8000,
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-20',
        status: 'live' as const,
        createdAt: '2024-11-22T15:30:00Z',
      },
      {
        id: '9',
        farmerId: 'farmer9',
        farmerName: 'Suresh Chandra',
        cropType: 'maize',
        variety: 'Hybrid DMH-849',
        grade: 'premium',
        harvestDate: '2024-11-08',
        location: 'Davangere, Karnataka',
        pricePerUnit: 45,
        minOrderQty: 100,
        totalAvailableQty: 4500,
        images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-22',
        status: 'live' as const,
        createdAt: '2024-11-21T09:10:00Z',
      },
      {
        id: '10',
        farmerId: 'farmer10',
        farmerName: 'Meera Ben Patel',
        cropType: 'chili',
        variety: 'Guntur Sannam',
        grade: 'premium',
        harvestDate: '2024-11-22',
        location: 'Guntur, Andhra Pradesh',
        pricePerUnit: 185,
        minOrderQty: 10,
        totalAvailableQty: 800,
        images: ['https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-18',
        status: 'live' as const,
        createdAt: '2024-11-23T12:00:00Z',
      },
      {
        id: '11',
        farmerId: 'farmer11',
        farmerName: 'Ashok Kumar Singh',
        cropType: 'turmeric',
        variety: 'Curcuma Longa',
        grade: 'premium',
        harvestDate: '2024-11-14',
        location: 'Sangli, Maharashtra',
        pricePerUnit: 125,
        minOrderQty: 25,
        totalAvailableQty: 1500,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-28',
        status: 'live' as const,
        createdAt: '2024-11-20T16:20:00Z',
      },
      {
        id: '12',
        farmerId: 'farmer12',
        farmerName: 'Ravi Shankar',
        cropType: 'soybean',
        variety: 'JS-335',
        grade: 'grade-a',
        harvestDate: '2024-10-30',
        location: 'Indore, Madhya Pradesh',
        pricePerUnit: 75,
        minOrderQty: 100,
        totalAvailableQty: 7000,
        images: ['https://images.unsplash.com/photo-1591714332651-a3bbfdd6ed7c?w=400&h=300&fit=crop&auto=format'],
        expiryDate: '2024-12-25',
        status: 'live' as const,
        createdAt: '2024-11-19T14:15:00Z',
      }
    ];

    // Enhanced mock orders with simplified status system
    const mockOrders = [
      {
        id: 'order1',
        listingId: '1',
        buyerId: 'buyer1',
        farmerId: 'farmer1',
        buyerName: 'Premium Rice Exporters Ltd',
        farmerName: 'Rajesh Kumar Patel',
        cropType: 'Basmati-1121 Rice',
        variety: 'Basmati-1121',
        grade: 'premium',
        quantity: 500,
        pricePerUnit: 95,
        totalAmount: 47500,
        status: 'requested' as const,
        message: 'Need premium quality for export. Can you provide quality certificate?',
        createdAt: '2024-11-24T10:30:00Z',
      },
      {
        id: 'order2',
        listingId: '2',
        buyerId: 'buyer2',
        farmerId: 'farmer2',
        buyerName: 'Fresh Foods Distribution',
        farmerName: 'Sita Devi Sharma',
        cropType: 'HD-3086 Wheat',
        variety: 'HD-3086 (Pusa Wheat)',
        grade: 'grade-a',
        quantity: 1000,
        pricePerUnit: 52,
        totalAmount: 52000,
        status: 'confirmed' as const,
        createdAt: '2024-11-23T14:20:00Z',
        confirmedAt: '2024-11-23T15:30:00Z',
      },
      {
        id: 'order3',
        listingId: '4',
        buyerId: 'buyer3',
        farmerId: 'farmer4',
        buyerName: 'Vegetable Market Co-op',
        farmerName: 'Priya Joshi',
        cropType: 'Hybrid Tomato',
        variety: 'Hybrid Determinate',
        grade: 'grade-a',
        quantity: 200,
        pricePerUnit: 42,
        totalAmount: 8400,
        status: 'shipping' as const,
        createdAt: '2024-11-22T11:45:00Z',
        confirmedAt: '2024-11-22T12:30:00Z',
        shippedAt: '2024-11-23T09:00:00Z',
      },
      {
        id: 'order4',
        listingId: '10',
        buyerId: 'buyer4',
        farmerId: 'farmer10',
        buyerName: 'Spice Masters Inc',
        farmerName: 'Meera Ben Patel',
        cropType: 'Guntur Sannam Chili',
        variety: 'Guntur Sannam',
        grade: 'premium',
        quantity: 50,
        pricePerUnit: 185,
        totalAmount: 9250,
        status: 'received' as const,
        message: 'Premium grade required for export market',
        createdAt: '2024-11-21T09:15:00Z',
        confirmedAt: '2024-11-21T10:00:00Z',
        shippedAt: '2024-11-21T14:20:00Z',
        receivedAt: '2024-11-22T11:30:00Z',
      },
      {
        id: 'order5',
        listingId: '5',
        buyerId: 'buyer5',
        farmerId: 'farmer5',
        buyerName: 'Maharashtra Vegetables Ltd',
        farmerName: 'Arjun Patel',
        cropType: 'Nashik Red Onion',
        variety: 'Nashik Red',
        grade: 'premium',
        quantity: 800,
        pricePerUnit: 38,
        totalAmount: 30400,
        status: 'received' as const,
        createdAt: '2024-11-18T16:30:00Z',
        confirmedAt: '2024-11-18T17:15:00Z',
        shippedAt: '2024-11-19T09:20:00Z',
        receivedAt: '2024-11-20T11:00:00Z',
      },
      {
        id: 'order6',
        listingId: '11',
        buyerId: 'buyer6',
        farmerId: 'farmer11',
        buyerName: 'Ayurvedic Herbs Co',
        farmerName: 'Ashok Kumar Singh',
        cropType: 'Curcuma Longa Turmeric',
        variety: 'Curcuma Longa',
        grade: 'premium',
        quantity: 100,
        pricePerUnit: 125,
        totalAmount: 12500,
        status: 'requested' as const,
        message: 'Need organic certification for Ayurvedic products',
        createdAt: '2024-11-24T08:45:00Z',
      },
      {
        id: 'order7',
        listingId: '7',
        buyerId: 'buyer7',
        farmerId: 'farmer7',
        buyerName: 'Sugar Mills Cooperative',
        farmerName: 'Ramesh Yadav',
        cropType: 'Co-238 Sugarcane',
        variety: 'Co-238',
        grade: 'premium',
        quantity: 5000,
        pricePerUnit: 32,
        totalAmount: 160000,
        status: 'confirmed' as const,
        message: 'Bulk order for sugar processing. Can arrange transport.',
        createdAt: '2024-11-23T07:30:00Z',
        confirmedAt: '2024-11-23T09:45:00Z',
      },
      {
        id: 'order8',
        listingId: '9',
        buyerId: 'buyer8',
        farmerId: 'farmer9',
        buyerName: 'Animal Feed Industries',
        farmerName: 'Suresh Chandra',
        cropType: 'DMH-849 Maize',
        variety: 'Hybrid DMH-849',
        grade: 'premium',
        quantity: 2000,
        pricePerUnit: 45,
        totalAmount: 90000,
        status: 'shipping' as const,
        createdAt: '2024-11-22T13:20:00Z',
        confirmedAt: '2024-11-22T14:00:00Z',
        shippedAt: '2024-11-23T08:30:00Z',
      }
    ];

    setListings(mockListings);
    setOrders(mockOrders);
  }, [setListings, setOrders]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'role-selection':
        return <RoleSelectionScreen />;
      case 'signup':
        return <SignupScreen />;
      case 'otp-verification':
        return <OTPVerificationScreen />;
      case 'profile-setup':
        return <ProfileSetupScreen />;
      case 'kyc-upload':
        return <KYCUploadScreen />;
      case 'kyc-status':
        return <KYCStatusScreen />;
      case 'farmer-home':
        return <FarmerHomeScreen />;
      case 'buyer-home':
        return <BuyerHomeScreen />;
      case 'create-listing':
        return <CreateListingScreen />;
      case 'listing-detail':
        return <ListingDetailScreen />;
      case 'order-summary':
        return <OrderSummaryScreen />;
      case 'farmer-orders':
        return <FarmerOrderManagementScreen />;
      case 'buyer-order-detail':
        return <BuyerOrderDetailScreen />;
      case 'messaging':
        return <MessagingScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'ai-features':
        return <AIFeaturesScreen />;
      case 'smart-matching':
        return <SmartMatchingScreen />;
      case 'seasonal-calendar':
        return <SeasonalCalendarScreen />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'transport-optimization':
        return <TransportOptimizationScreen />;
      case 'market-locations':
        return <MarketLocationsScreen />;
      case 'live-tracking':
        return <LiveTrackingScreen />;
      case 'market-price-dashboard':
        return <MarketPriceDashboard />;
      case 'kisan-ai':
        return <KisanAIScreen />;
      default:
        return <SplashScreen />;
    }
  };

  const shouldShowHeader = [
    'farmer-home',
    'buyer-home',
    'create-listing',
    'listing-detail',
    'order-summary',
    'farmer-orders',
    'buyer-order-detail',
    'messaging',
    'notifications',
    'ai-features',
    'smart-matching',
    'seasonal-calendar',
    'ai-assistant',
    'transport-optimization',
    'market-locations',
    'live-tracking'
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background">
      {shouldShowHeader && <Header />}
      {renderScreen()}
      {user && <AIAssistant />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}