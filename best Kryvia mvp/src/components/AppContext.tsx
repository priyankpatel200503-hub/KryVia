import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'gu';
export type UserRole = 'farmer' | 'buyer' | null;
export type KYCStatus = 'pending' | 'under_review' | 'verified' | 'rejected';
export type OrderStatus = 'requested' | 'confirmed' | 'shipping' | 'received';
export type ListingStatus = 'live' | 'expired' | 'sold_out';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  kycStatus: KYCStatus;
  isVerified: boolean;
  state: string;
  district: string;
  village?: string; // For farmers
  businessName?: string; // For buyers
  businessType?: string; // For buyers
}

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropType: string;
  variety: string;
  grade: string;
  harvestDate: string;
  location: string;
  pricePerUnit: number;
  minOrderQty: number;
  totalAvailableQty: number;
  images: string[];
  video?: string;
  expiryDate: string;
  status: ListingStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  farmerId: string;
  buyerName: string;
  farmerName: string;
  cropType: string;
  variety?: string;
  grade?: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  status: OrderStatus;
  message?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  receivedAt?: string;
}

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  switchRole: () => void; // For MVP testing
  
  // App State
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  
  // Listings
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  
  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = (userData: User) => {
    setUser(userData);
    // Navigate to appropriate home based on role and KYC status
    if (userData.kycStatus === 'verified') {
      setCurrentScreen(userData.role === 'farmer' ? 'farmer-home' : 'buyer-home');
    } else {
      setCurrentScreen('kyc-status');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('splash');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const switchRole = () => {
    if (user) {
      const newRole = user.role === 'farmer' ? 'buyer' : 'farmer';
      setUser({ ...user, role: newRole });
      setCurrentScreen(newRole === 'farmer' ? 'farmer-home' : 'buyer-home');
    }
  };

  const addListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      user,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
      switchRole,
      currentScreen,
      setCurrentScreen,
      listings,
      setListings,
      addListing,
      updateListing,
      orders,
      setOrders,
      addOrder,
      updateOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}