// AI Engine - Mock AI algorithms for KryVia AI Marathon Demo

export interface TrustScore {
  score: number; // 0-100
  rating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  badges: string[];
  factors: {
    orderHistory: number;
    paymentReliability: number;
    communication: number;
    reviews: number;
  };
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface CropDemand {
  cropType: string;
  demandLevel: 'Very High' | 'High' | 'Moderate' | 'Low';
  demandScore: number; // 0-100
  trend: 'rising' | 'stable' | 'falling';
  predictedPrice: number;
  confidence: number; // 0-100
  reasons: string[];
}

export interface PriceSuggestion {
  recommended: number;
  min: number;
  max: number;
  marketAverage: number;
  confidence: number;
  factors: string[];
  competitorPrices: number[];
}

export interface SaleAdvice {
  bestTimeToSell: string;
  expectedRevenue: number;
  marketCondition: 'Favorable' | 'Moderate' | 'Challenging';
  recommendations: string[];
  opportunities: string[];
  risks: string[];
}

export interface SeasonalRecommendation {
  cropType: string;
  season: string;
  plantingWindow: string;
  harvestWindow: string;
  expectedYield: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  profitPotential: number;
}

export interface MatchedUser {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
  location: string;
  district: string;
  state: string;
  distance: number; // in km
  matchScore: number; // 0-100
  coordinates: { lat: number; lng: number };
  // For farmers
  crops?: string[];
  totalListings?: number;
  avgPrice?: number;
  rating?: number;
  // For buyers
  ordersCompleted?: number;
  trustScore?: number;
  preferredCrops?: string[];
  avgOrderSize?: number;
  // Matching reasons
  matchReasons: string[];
}

export interface CropKnowledge {
  cropType: string;
  bestPractices: string[];
  diseases: {
    name: string;
    symptoms: string;
    treatment: string;
    prevention: string;
  }[];
  fertilizer: {
    npkRatio: string;
    timing: string[];
    organicAlternatives: string[];
  };
  watering: {
    frequency: string;
    amount: string;
    criticalStages: string[];
  };
  pestControl: {
    commonPests: string[];
    naturalSolutions: string[];
    chemicalOptions: string[];
  };
  harvesting: {
    maturityIndicators: string[];
    method: string;
    postHarvestCare: string[];
  };
  storage: {
    conditions: string;
    shelfLife: string;
    packagingTips: string[];
  };
  marketInsights: {
    priceVolatility: 'Low' | 'Medium' | 'High';
    demandPattern: string;
    exportPotential: 'Low' | 'Medium' | 'High';
  };
}

// AI Engine Class
export class AIEngine {
  // Calculate Buyer Trust Score
  static calculateTrustScore(buyerData: {
    ordersCompleted: number;
    totalOrders: number;
    avgResponseTime: number;
    disputes: number;
    accountAge: number;
  }): TrustScore {
    const { ordersCompleted, totalOrders, avgResponseTime, disputes, accountAge } = buyerData;

    // Calculate individual factors
    const orderHistory = Math.min(100, (ordersCompleted / Math.max(totalOrders, 1)) * 100);
    const paymentReliability = Math.max(0, 100 - (disputes * 10));
    const communication = Math.max(0, 100 - (avgResponseTime / 60)); // Assume minutes
    const reviews = Math.min(100, accountAge * 10); // Account age in months

    // Weighted average
    const score = Math.round(
      (orderHistory * 0.35 + paymentReliability * 0.35 + communication * 0.15 + reviews * 0.15)
    );

    // Determine rating
    let rating: TrustScore['rating'];
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Average';
    else rating = 'Poor';

    // Assign badges
    const badges: string[] = [];
    if (ordersCompleted >= 10) badges.push('Verified Buyer');
    if (paymentReliability >= 95) badges.push('Reliable Payment');
    if (disputes === 0) badges.push('Zero Disputes');
    if (communication >= 90) badges.push('Quick Responder');
    if (accountAge >= 12) badges.push('Trusted Member');

    // Risk level
    let riskLevel: TrustScore['riskLevel'];
    if (score >= 70) riskLevel = 'Low';
    else if (score >= 40) riskLevel = 'Medium';
    else riskLevel = 'High';

    return {
      score,
      rating,
      badges,
      factors: {
        orderHistory: Math.round(orderHistory),
        paymentReliability: Math.round(paymentReliability),
        communication: Math.round(communication),
        reviews: Math.round(reviews),
      },
      riskLevel,
    };
  }

  // Predict Crop Demand
  static predictCropDemand(cropType: string, region: string, currentMonth: number): CropDemand {
    // Mock demand prediction based on crop type and season
    const demandPatterns: { [key: string]: number[] } = {
      rice: [70, 65, 60, 55, 50, 55, 70, 85, 90, 95, 90, 80],
      wheat: [85, 90, 85, 75, 60, 50, 45, 50, 60, 70, 80, 85],
      cotton: [60, 65, 70, 75, 80, 85, 90, 85, 75, 65, 60, 55],
      tomato: [80, 85, 75, 70, 85, 90, 85, 80, 75, 70, 75, 80],
      onion: [90, 85, 80, 75, 70, 75, 80, 85, 90, 95, 90, 85],
      potato: [75, 80, 85, 90, 85, 75, 70, 65, 70, 75, 80, 85],
      maize: [65, 70, 75, 80, 85, 90, 85, 80, 75, 70, 65, 60],
      chili: [70, 75, 80, 85, 80, 75, 70, 65, 70, 75, 80, 85],
      turmeric: [80, 85, 90, 85, 80, 75, 70, 75, 80, 85, 90, 85],
      soybean: [60, 65, 70, 75, 80, 85, 90, 95, 90, 80, 70, 65],
      sugarcane: [85, 80, 75, 70, 65, 70, 75, 80, 85, 90, 95, 90],
    };

    const demandScore = demandPatterns[cropType.toLowerCase()]?.[currentMonth] || 70;
    const previousScore = demandPatterns[cropType.toLowerCase()]?.[(currentMonth - 1 + 12) % 12] || 70;

    let demandLevel: CropDemand['demandLevel'];
    if (demandScore >= 85) demandLevel = 'Very High';
    else if (demandScore >= 70) demandLevel = 'High';
    else if (demandScore >= 50) demandLevel = 'Moderate';
    else demandLevel = 'Low';

    const trend: CropDemand['trend'] = 
      demandScore > previousScore + 5 ? 'rising' : 
      demandScore < previousScore - 5 ? 'falling' : 
      'stable';

    // Price prediction based on demand
    const basePrices: { [key: string]: number } = {
      rice: 45, wheat: 35, cotton: 90, tomato: 25, onion: 30,
      potato: 20, maize: 28, chili: 100, turmeric: 150, soybean: 55, sugarcane: 35,
    };
    const basePrice = basePrices[cropType.toLowerCase()] || 50;
    const predictedPrice = Math.round(basePrice * (demandScore / 70));

    const reasons: string[] = [];
    if (demandScore >= 80) reasons.push('Peak seasonal demand');
    if (trend === 'rising') reasons.push('Growing market interest');
    if (region.toLowerCase().includes('punjab') || region.toLowerCase().includes('haryana')) {
      reasons.push('High production region - steady demand');
    }
    if ([3, 4, 5, 9, 10, 11].includes(currentMonth)) {
      reasons.push('Festival season approaching');
    }
    if (reasons.length === 0) reasons.push('Stable market conditions');

    return {
      cropType,
      demandLevel,
      demandScore,
      trend,
      predictedPrice,
      confidence: Math.round(75 + Math.random() * 20),
      reasons,
    };
  }

  // Smart Price Suggestion
  static suggestPrice(cropData: {
    cropType: string;
    grade: string;
    region: string;
    quantity: number;
    harvestDate: string;
  }): PriceSuggestion {
    const basePrices: { [key: string]: number } = {
      rice: 45, wheat: 35, cotton: 90, tomato: 25, onion: 30,
      potato: 20, maize: 28, chili: 100, turmeric: 150, soybean: 55, sugarcane: 35,
    };

    const basePrice = basePrices[cropData.cropType.toLowerCase()] || 50;

    // Grade multiplier
    const gradeMultipliers: { [key: string]: number } = {
      premium: 1.3,
      'grade-a': 1.15,
      'grade-b': 1.0,
      standard: 0.9,
    };
    const gradeMultiplier = gradeMultipliers[cropData.grade.toLowerCase()] || 1.0;

    // Quantity discount (bulk orders)
    const quantityMultiplier = cropData.quantity > 1000 ? 0.95 : 
                              cropData.quantity > 500 ? 0.98 : 1.0;

    // Freshness factor
    const harvestAge = Math.floor((Date.now() - new Date(cropData.harvestDate).getTime()) / (1000 * 60 * 60 * 24));
    const freshnessMultiplier = harvestAge <= 7 ? 1.1 : harvestAge <= 30 ? 1.0 : 0.9;

    const marketAverage = Math.round(basePrice * gradeMultiplier);
    const recommended = Math.round(marketAverage * quantityMultiplier * freshnessMultiplier);
    const min = Math.round(recommended * 0.85);
    const max = Math.round(recommended * 1.15);

    // Generate competitor prices
    const competitorPrices = [
      Math.round(recommended * (0.95 + Math.random() * 0.1)),
      Math.round(recommended * (0.90 + Math.random() * 0.15)),
      Math.round(recommended * (0.92 + Math.random() * 0.12)),
    ];

    const factors: string[] = [];
    if (gradeMultiplier > 1.1) factors.push(`Premium quality (+${Math.round((gradeMultiplier - 1) * 100)}%)`);
    if (freshnessMultiplier > 1) factors.push('Freshly harvested');
    if (quantityMultiplier < 1) factors.push('Bulk pricing advantage');
    factors.push('Based on current market trends');
    factors.push(`${cropData.region} regional demand`);

    return {
      recommended,
      min,
      max,
      marketAverage,
      confidence: Math.round(80 + Math.random() * 15),
      factors,
      competitorPrices,
    };
  }

  // Smart Sale Adviser
  static generateSaleAdvice(farmerData: {
    cropType: string;
    quantity: number;
    currentPrice: number;
    region: string;
  }): SaleAdvice {
    const currentMonth = new Date().getMonth();
    const demand = this.predictCropDemand(farmerData.cropType, farmerData.region, currentMonth);

    let bestTimeToSell = '';
    if (demand.trend === 'rising') {
      bestTimeToSell = 'Next 1-2 weeks (demand increasing)';
    } else if (demand.demandScore >= 80) {
      bestTimeToSell = 'Immediately (peak demand)';
    } else {
      bestTimeToSell = 'Wait 2-4 weeks (off-peak)';
    }

    const expectedRevenue = Math.round(
      farmerData.quantity * demand.predictedPrice * (0.9 + Math.random() * 0.2)
    );

    const marketCondition: SaleAdvice['marketCondition'] = 
      demand.demandScore >= 75 ? 'Favorable' :
      demand.demandScore >= 50 ? 'Moderate' : 'Challenging';

    const recommendations: string[] = [];
    const opportunities: string[] = [];
    const risks: string[] = [];

    // Generate recommendations
    if (demand.trend === 'rising') {
      recommendations.push('Hold inventory for 1-2 weeks to maximize price');
      opportunities.push('Demand trending upward - price increase expected');
    } else {
      recommendations.push('Sell current stock to avoid price drop');
    }

    if (farmerData.quantity > 500) {
      recommendations.push('Consider splitting into smaller lots for better prices');
      opportunities.push('Large inventory - leverage for bulk deals');
    }

    if (demand.demandScore >= 80) {
      opportunities.push('Peak demand season - premium prices possible');
      recommendations.push('Focus on quality grading to command top prices');
    }

    // Generate risks
    if (demand.trend === 'falling') {
      risks.push('Demand declining - prices may decrease');
    }
    if (currentMonth >= 6 && currentMonth <= 8) {
      risks.push('Monsoon season - transportation delays possible');
    }
    if (farmerData.quantity < 100) {
      risks.push('Small quantity - limited negotiation power');
    }

    if (recommendations.length === 0) {
      recommendations.push('Monitor market daily for price changes');
      recommendations.push('Consider pre-booking with trusted buyers');
    }

    return {
      bestTimeToSell,
      expectedRevenue,
      marketCondition,
      recommendations,
      opportunities,
      risks,
    };
  }

  // Seasonal Crop Calendar
  static getSeasonalRecommendations(region: string, currentMonth: number): SeasonalRecommendation[] {
    const seasons = ['Winter', 'Spring', 'Summer', 'Monsoon', 'Autumn'];
    const currentSeason = seasons[Math.floor(currentMonth / 2.4)];

    const recommendations: { [key: string]: SeasonalRecommendation[] } = {
      Winter: [
        {
          cropType: 'Wheat',
          season: 'Rabi (Winter)',
          plantingWindow: 'Oct - Dec',
          harvestWindow: 'Mar - Apr',
          expectedYield: '25-30 quintals/acre',
          marketDemand: 'High',
          profitPotential: 85,
        },
        {
          cropType: 'Mustard',
          season: 'Rabi (Winter)',
          plantingWindow: 'Oct - Nov',
          harvestWindow: 'Feb - Mar',
          expectedYield: '8-12 quintals/acre',
          marketDemand: 'High',
          profitPotential: 75,
        },
        {
          cropType: 'Potato',
          season: 'Rabi (Winter)',
          plantingWindow: 'Oct - Nov',
          harvestWindow: 'Jan - Feb',
          expectedYield: '150-200 quintals/acre',
          marketDemand: 'Medium',
          profitPotential: 70,
        },
      ],
      Summer: [
        {
          cropType: 'Rice',
          season: 'Kharif (Summer)',
          plantingWindow: 'Jun - Jul',
          harvestWindow: 'Oct - Nov',
          expectedYield: '30-35 quintals/acre',
          marketDemand: 'High',
          profitPotential: 90,
        },
        {
          cropType: 'Cotton',
          season: 'Kharif (Summer)',
          plantingWindow: 'May - Jun',
          harvestWindow: 'Oct - Dec',
          expectedYield: '15-20 quintals/acre',
          marketDemand: 'High',
          profitPotential: 85,
        },
        {
          cropType: 'Maize',
          season: 'Kharif (Summer)',
          plantingWindow: 'Jun - Jul',
          harvestWindow: 'Sep - Oct',
          expectedYield: '20-25 quintals/acre',
          marketDemand: 'Medium',
          profitPotential: 75,
        },
      ],
      Spring: [
        {
          cropType: 'Tomato',
          season: 'Spring',
          plantingWindow: 'Feb - Mar',
          harvestWindow: 'May - Jun',
          expectedYield: '200-250 quintals/acre',
          marketDemand: 'High',
          profitPotential: 80,
        },
        {
          cropType: 'Onion',
          season: 'Spring',
          plantingWindow: 'Jan - Feb',
          harvestWindow: 'Apr - May',
          expectedYield: '120-150 quintals/acre',
          marketDemand: 'High',
          profitPotential: 85,
        },
      ],
    };

    return recommendations[currentSeason] || recommendations.Summer;
  }

  // Chatbot Responses
  static getChatbotResponse(userMessage: string, context: 'farmer' | 'buyer'): string {
    const message = userMessage.toLowerCase();

    // FAQ responses
    const faqResponses: { [key: string]: string } = {
      'how to register': 'To register, click "Get Started" on splash screen, select your role (Farmer/Buyer), enter your phone number, complete profile setup, and upload KYC documents.',
      'kyc': 'KYC verification usually takes 24-48 hours. You need to upload Aadhaar card (both sides) and additional documents based on your role. You can skip KYC for demo purposes.',
      'payment': 'Payments are processed securely through our platform. Buyers pay upon confirming order, and farmers receive payment after delivery confirmation.',
      'price': 'Use our Smart Price Suggestion feature when creating listings to get AI-powered pricing recommendations based on market trends.',
      'demand': 'Check the Crop Demand Prediction in your dashboard to see which crops are in high demand currently.',
      'order': context === 'farmer' 
        ? 'You can view incoming orders in the Orders tab. Accept/reject requests, update order status, and track deliveries.'
        : 'Browse available crops, select quantity, and place your order. Track order status in My Orders section.',
      'shipping': 'Farmers mark orders as "Shipping" when dispatched. Buyers receive tracking updates and can mark as "Received" upon delivery.',
      'trust score': 'Trust Score is calculated based on your order history, payment reliability, communication response time, and account standing. Build trust by completing orders successfully.',
      'help': 'I can help you with registration, KYC, orders, pricing, payments, and platform features. What would you like to know?',
    };

    // Find matching FAQ
    for (const [key, response] of Object.entries(faqResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Context-specific responses
    if (context === 'farmer') {
      if (message.includes('sell') || message.includes('crop')) {
        return 'To sell your crops: 1) Create a listing with crop details, 2) Set competitive prices using our Smart Price Suggestion, 3) Wait for buyer requests, 4) Accept orders and manage delivery. Check Sale Adviser for best selling strategies!';
      }
      if (message.includes('buyer')) {
        return 'View buyer Trust Scores in order requests to assess reliability. Higher scores indicate trustworthy buyers with good payment history.';
      }
    } else {
      if (message.includes('buy') || message.includes('crop')) {
        return 'To buy crops: 1) Browse available listings, 2) Use filters to find what you need, 3) Check crop quality and farmer ratings, 4) Place order with quantity and message, 5) Make payment and track delivery.';
      }
      if (message.includes('farmer') || message.includes('seller')) {
        return 'All farmers are verified through KYC. Check their ratings, reviews, and crop quality before placing orders. Communicate directly via chat for any questions.';
      }
    }

    // Default responses
    const defaultResponses = [
      'I\'m here to help! Could you please be more specific about what you need assistance with? Try asking about registration, orders, pricing, or KYC.',
      'That\'s a great question! For detailed assistance, you can ask me about: Orders, Payments, KYC verification, Pricing, Trust Scores, or Platform features.',
      'I can help you with that! Please provide more details or try asking: "How to register?", "What is Trust Score?", "How to place order?", etc.',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Get mock coordinates for Indian cities/districts
  static getCityCoordinates(city: string, state: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'karnal-haryana': { lat: 29.6857, lng: 76.9905 },
      'ludhiana-punjab': { lat: 30.9010, lng: 75.8573 },
      'ahmedabad-gujarat': { lat: 23.0225, lng: 72.5714 },
      'nashik-maharashtra': { lat: 19.9975, lng: 73.7898 },
      'guntur-andhra pradesh': { lat: 16.3067, lng: 80.4365 },
      'muzaffarnagar-uttar pradesh': { lat: 29.4727, lng: 77.7085 },
      'agra-uttar pradesh': { lat: 27.1767, lng: 78.0081 },
      'davangere-karnataka': { lat: 14.4644, lng: 75.9218 },
      'sangli-maharashtra': { lat: 16.8524, lng: 74.5815 },
      'indore-madhya pradesh': { lat: 22.7196, lng: 75.8577 },
      'surat-gujarat': { lat: 21.1702, lng: 72.8311 },
      'rajkot-gujarat': { lat: 22.3039, lng: 70.8022 },
      'vadodara-gujarat': { lat: 22.3072, lng: 73.1812 },
      'mumbai-maharashtra': { lat: 19.0760, lng: 72.8777 },
      'pune-maharashtra': { lat: 18.5204, lng: 73.8567 },
      'jaipur-rajasthan': { lat: 26.9124, lng: 75.7873 },
      'delhi-delhi': { lat: 28.7041, lng: 77.1025 },
    };

    const key = `${city.toLowerCase()}-${state.toLowerCase()}`;
    return coordinates[key] || { lat: 23.0 + Math.random() * 10, lng: 72.0 + Math.random() * 10 };
  }

  // Smart Buyer-Farmer Matching Algorithm
  static findNearbyMatches(
    currentUser: {
      role: 'farmer' | 'buyer';
      location: string;
      district: string;
      state: string;
      crops?: string[];
      preferredCrops?: string[];
    },
    maxDistance: number // in km
  ): MatchedUser[] {
    // Get current user coordinates
    const userCoords = this.getCityCoordinates(currentUser.district, currentUser.state);

    // Mock users database
    const mockUsers: Array<{
      id: string;
      name: string;
      role: 'farmer' | 'buyer';
      location: string;
      district: string;
      state: string;
      crops?: string[];
      totalListings?: number;
      avgPrice?: number;
      rating?: number;
      ordersCompleted?: number;
      trustScore?: number;
      preferredCrops?: string[];
      avgOrderSize?: number;
    }> = [];

    if (currentUser.role === 'buyer') {
      // Return nearby farmers
      mockUsers.push(
        {
          id: 'farmer1',
          name: 'Rajesh Kumar Patel',
          role: 'farmer',
          location: 'Karnal, Haryana',
          district: 'Karnal',
          state: 'Haryana',
          crops: ['rice', 'wheat', 'sugarcane'],
          totalListings: 5,
          avgPrice: 65,
          rating: 4.8,
        },
        {
          id: 'farmer2',
          name: 'Sita Devi Sharma',
          role: 'farmer',
          location: 'Ludhiana, Punjab',
          district: 'Ludhiana',
          state: 'Punjab',
          crops: ['wheat', 'maize', 'rice'],
          totalListings: 3,
          avgPrice: 52,
          rating: 4.6,
        },
        {
          id: 'farmer3',
          name: 'Mukesh Singh Rathore',
          role: 'farmer',
          location: 'Ahmedabad, Gujarat',
          district: 'Ahmedabad',
          state: 'Gujarat',
          crops: ['cotton', 'groundnut'],
          totalListings: 4,
          avgPrice: 135,
          rating: 4.9,
        },
        {
          id: 'farmer4',
          name: 'Priya Joshi',
          role: 'farmer',
          location: 'Nashik, Maharashtra',
          district: 'Nashik',
          state: 'Maharashtra',
          crops: ['tomato', 'onion', 'grapes'],
          totalListings: 6,
          avgPrice: 42,
          rating: 4.7,
        },
        {
          id: 'farmer5',
          name: 'Arjun Patel',
          role: 'farmer',
          location: 'Surat, Gujarat',
          district: 'Surat',
          state: 'Gujarat',
          crops: ['onion', 'potato', 'sugarcane'],
          totalListings: 4,
          avgPrice: 38,
          rating: 4.5,
        },
        {
          id: 'farmer6',
          name: 'Lakshmi Reddy',
          role: 'farmer',
          location: 'Guntur, Andhra Pradesh',
          district: 'Guntur',
          state: 'Andhra Pradesh',
          crops: ['rice', 'chili', 'turmeric'],
          totalListings: 5,
          avgPrice: 88,
          rating: 4.8,
        },
        {
          id: 'farmer7',
          name: 'Kavita Singh',
          role: 'farmer',
          location: 'Rajkot, Gujarat',
          district: 'Rajkot',
          state: 'Gujarat',
          crops: ['cotton', 'groundnut', 'wheat'],
          totalListings: 3,
          avgPrice: 75,
          rating: 4.4,
        },
        {
          id: 'farmer8',
          name: 'Suresh Chandra',
          role: 'farmer',
          location: 'Vadodara, Gujarat',
          district: 'Vadodara',
          state: 'Gujarat',
          crops: ['rice', 'wheat', 'cotton'],
          totalListings: 4,
          avgPrice: 62,
          rating: 4.6,
        }
      );
    } else {
      // Return nearby buyers
      mockUsers.push(
        {
          id: 'buyer1',
          name: 'Premium Rice Exporters Ltd',
          role: 'buyer',
          location: 'Mumbai, Maharashtra',
          district: 'Mumbai',
          state: 'Maharashtra',
          ordersCompleted: 25,
          trustScore: 92,
          preferredCrops: ['rice', 'wheat'],
          avgOrderSize: 1000,
        },
        {
          id: 'buyer2',
          name: 'Fresh Foods Distribution',
          role: 'buyer',
          location: 'Pune, Maharashtra',
          district: 'Pune',
          state: 'Maharashtra',
          ordersCompleted: 18,
          trustScore: 88,
          preferredCrops: ['tomato', 'onion', 'potato'],
          avgOrderSize: 500,
        },
        {
          id: 'buyer3',
          name: 'Gujarat Agro Traders',
          role: 'buyer',
          location: 'Ahmedabad, Gujarat',
          district: 'Ahmedabad',
          state: 'Gujarat',
          ordersCompleted: 32,
          trustScore: 95,
          preferredCrops: ['cotton', 'groundnut', 'wheat'],
          avgOrderSize: 2000,
        },
        {
          id: 'buyer4',
          name: 'Spice Masters Inc',
          role: 'buyer',
          location: 'Guntur, Andhra Pradesh',
          district: 'Guntur',
          state: 'Andhra Pradesh',
          ordersCompleted: 15,
          trustScore: 85,
          preferredCrops: ['chili', 'turmeric'],
          avgOrderSize: 300,
        },
        {
          id: 'buyer5',
          name: 'North India Mills',
          role: 'buyer',
          location: 'Ludhiana, Punjab',
          district: 'Ludhiana',
          state: 'Punjab',
          ordersCompleted: 28,
          trustScore: 90,
          preferredCrops: ['wheat', 'rice', 'maize'],
          avgOrderSize: 1500,
        },
        {
          id: 'buyer6',
          name: 'Rajasthan Food Corp',
          role: 'buyer',
          location: 'Jaipur, Rajasthan',
          district: 'Jaipur',
          state: 'Rajasthan',
          ordersCompleted: 12,
          trustScore: 78,
          preferredCrops: ['wheat', 'mustard'],
          avgOrderSize: 800,
        },
        {
          id: 'buyer7',
          name: 'Surat Vegetable Market',
          role: 'buyer',
          location: 'Surat, Gujarat',
          district: 'Surat',
          state: 'Gujarat',
          ordersCompleted: 22,
          trustScore: 87,
          preferredCrops: ['onion', 'potato', 'tomato'],
          avgOrderSize: 600,
        }
      );
    }

    // Calculate distances and match scores
    const matches: MatchedUser[] = mockUsers
      .map((user) => {
        const userLocation = this.getCityCoordinates(user.district, user.state);
        const distance = Math.round(
          this.calculateDistance(userCoords.lat, userCoords.lng, userLocation.lat, userLocation.lng)
        );

        // Calculate match score based on multiple factors
        let matchScore = 100;

        // Distance factor (closer is better)
        const distanceFactor = Math.max(0, 100 - (distance / maxDistance) * 50);
        matchScore = distanceFactor;

        // Crop matching factor
        if (currentUser.role === 'buyer' && currentUser.preferredCrops && user.crops) {
          const cropMatch = currentUser.preferredCrops.some((crop) =>
            user.crops!.includes(crop)
          );
          if (cropMatch) matchScore += 20;
        } else if (currentUser.role === 'farmer' && currentUser.crops && user.preferredCrops) {
          const cropMatch = currentUser.crops.some((crop) =>
            user.preferredCrops!.includes(crop)
          );
          if (cropMatch) matchScore += 20;
        }

        // Rating/Trust score factor
        if (user.rating) {
          matchScore += (user.rating / 5) * 15;
        } else if (user.trustScore) {
          matchScore += (user.trustScore / 100) * 15;
        }

        // Experience factor
        if (user.totalListings && user.totalListings >= 5) {
          matchScore += 10;
        } else if (user.ordersCompleted && user.ordersCompleted >= 20) {
          matchScore += 10;
        }

        matchScore = Math.min(100, Math.round(matchScore));

        // Generate match reasons
        const matchReasons: string[] = [];
        if (distance <= 20) matchReasons.push('Very close proximity');
        else if (distance <= 50) matchReasons.push('Nearby location');
        else matchReasons.push('Within delivery range');

        if (currentUser.role === 'buyer' && currentUser.preferredCrops && user.crops) {
          const matchingCrops = currentUser.preferredCrops.filter((crop) =>
            user.crops!.includes(crop)
          );
          if (matchingCrops.length > 0) {
            matchReasons.push(`Sells ${matchingCrops.join(', ')}`);
          }
        } else if (currentUser.role === 'farmer' && currentUser.crops && user.preferredCrops) {
          const matchingCrops = currentUser.crops.filter((crop) =>
            user.preferredCrops!.includes(crop)
          );
          if (matchingCrops.length > 0) {
            matchReasons.push(`Buys ${matchingCrops.join(', ')}`);
          }
        }

        if (user.rating && user.rating >= 4.5) {
          matchReasons.push(`High rating: ${user.rating}⭐`);
        } else if (user.trustScore && user.trustScore >= 85) {
          matchReasons.push(`High trust score: ${user.trustScore}%`);
        }

        if (user.totalListings && user.totalListings >= 5) {
          matchReasons.push('Experienced seller');
        } else if (user.ordersCompleted && user.ordersCompleted >= 20) {
          matchReasons.push('Regular buyer');
        }

        return {
          ...user,
          distance,
          matchScore,
          coordinates: userLocation,
          matchReasons,
        };
      })
      .filter((match) => match.distance <= maxDistance)
      .sort((a, b) => b.matchScore - a.matchScore);

    return matches;
  }

  // Knowledge Recommendation Engine - Get crop-specific expert knowledge
  static getCropKnowledge(cropType: string): CropKnowledge {
    const cropDatabase: { [key: string]: CropKnowledge } = {
      rice: {
        cropType: 'Rice',
        bestPractices: [
          'Ensure proper land leveling for uniform water distribution',
          'Use SRI (System of Rice Intensification) method for higher yields',
          'Transplant 2-3 seedlings per hill at 20x20 cm spacing',
          'Maintain 2-3 cm water level during vegetative stage',
          'Apply organic matter before final plowing',
        ],
        diseases: [
          {
            name: 'Brown Spot',
            symptoms: 'Circular brown spots on leaves, stunted growth, reduced grain quality',
            treatment: 'Spray Mancozeb 75% WP @ 2g/L or Copper oxychloride @ 3g/L',
            prevention: 'Use certified disease-free seeds, ensure balanced fertilization',
          },
          {
            name: 'Bacterial Leaf Blight',
            symptoms: 'Water-soaked lesions on leaves, yellowing of leaves, wilting',
            treatment: 'Spray Streptocycline @ 0.25g + Copper oxychloride @ 2.5g per litre',
            prevention: 'Use resistant varieties, avoid excessive nitrogen fertilization',
          },
        ],
        fertilizer: {
          npkRatio: '120:60:40 (N:P:K) kg/hectare',
          timing: [
            'Basal dose: 50% N + 100% P + 100% K at transplanting',
            'Top dressing 1: 25% N at 21 days after transplanting',
            'Top dressing 2: 25% N at panicle initiation stage',
          ],
          organicAlternatives: [
            'FYM 10-12 tonnes/hectare as basal',
            'Vermicompost 5 tonnes/hectare',
            'Green manure (Dhaincha) before transplanting',
          ],
        },
        watering: {
          frequency: 'Continuous flooding with 5-10 cm standing water',
          amount: '1200-1500 mm total water requirement',
          criticalStages: [
            'Transplanting to tillering (keep 2-3 cm water)',
            'Panicle initiation to flowering (maintain 5 cm water)',
            'Grain filling stage (alternate wetting and drying)',
          ],
        },
        pestControl: {
          commonPests: ['Stem Borer', 'Brown Plant Hopper', 'Leaf Folder', 'Gall Midge'],
          naturalSolutions: [
            'Install pheromone traps @ 20/hectare',
            'Encourage natural predators (spiders, dragonflies)',
            'Use neem oil @ 5 ml/litre spray',
            'Release egg parasitoid Trichogramma @ 1 lakh/hectare',
          ],
          chemicalOptions: [
            'Chlorpyriphos 20 EC @ 2 ml/litre for stem borer',
            'Imidacloprid 17.8 SL @ 0.3 ml/litre for BPH',
          ],
        },
        harvesting: {
          maturityIndicators: [
            '80% grains turn golden yellow',
            'Moisture content drops to 20-22%',
            'Grain becomes hard when pressed between fingers',
            'Lower leaves turn yellow',
          ],
          method: 'Harvest using combine harvester or manual sickle cutting. Thresh within 2-3 days',
          postHarvestCare: [
            'Dry to 12-14% moisture content immediately',
            'Clean and grade to remove impurities',
            'Store in moisture-proof containers',
          ],
        },
        storage: {
          conditions: 'Cool, dry place with 12-14% moisture content and 25-30°C temperature',
          shelfLife: '12-18 months under proper storage conditions',
          packagingTips: [
            'Use jute bags or HDPE bags for bulk storage',
            'Store on wooden pallets, not directly on floor',
            'Maintain proper ventilation in storage area',
            'Check regularly for pest infestation',
          ],
        },
        marketInsights: {
          priceVolatility: 'Low',
          demandPattern: 'Steady year-round demand with peak during festival season (Oct-Dec)',
          exportPotential: 'High',
        },
      },
      wheat: {
        cropType: 'Wheat',
        bestPractices: [
          'Sow at optimum time (Oct 25 - Nov 15 for timely sowing)',
          'Use certified seeds @ 100 kg/hectare',
          'Maintain row spacing of 20-22.5 cm',
          'Ensure proper seed-bed preparation with fine tilth',
          'Practice crop rotation to prevent soil degradation',
        ],
        diseases: [
          {
            name: 'Yellow Rust',
            symptoms: 'Yellow pustules arranged in stripes on leaves, reduced grain weight',
            treatment: 'Spray Propiconazole 25% EC @ 1ml/L or Tebuconazole @ 0.1%',
            prevention: 'Use rust-resistant varieties, avoid excessive nitrogen',
          },
          {
            name: 'Leaf Blight',
            symptoms: 'Brown spots on leaves progressing to complete blighting',
            treatment: 'Spray Mancozeb @ 2.5g/L or Carbendazim @ 1g/L',
            prevention: 'Crop rotation, removal of infected crop debris',
          },
        ],
        fertilizer: {
          npkRatio: '120:60:40 (N:P:K) kg/hectare for irrigated conditions',
          timing: [
            'Basal: 60 kg N + 60 kg P2O5 + 40 kg K2O at sowing',
            '1st Irrigation: 30 kg N (21 days after sowing)',
            '2nd Irrigation: 30 kg N at tillering/jointing stage',
          ],
          organicAlternatives: [
            'FYM 15-20 tonnes/hectare as basal',
            'Vermicompost 6-8 tonnes/hectare',
            'Biofertilizers: Azotobacter + PSB @ 5 kg each/hectare',
          ],
        },
        watering: {
          frequency: '5-6 irrigations for good yield',
          amount: '400-450 mm total water requirement',
          criticalStages: [
            'Crown root initiation (21 DAS)',
            'Tillering stage (40-45 DAS)',
            'Jointing stage (60-65 DAS)',
            'Flowering (85-90 DAS)',
            'Milking stage (100-105 DAS)',
            'Dough stage (115-120 DAS)',
          ],
        },
        pestControl: {
          commonPests: ['Aphids', 'Termites', 'Army Worm', 'Pink Borer'],
          naturalSolutions: [
            'Encourage lady bird beetles for aphid control',
            'Use light traps for adult moths',
            'Spray neem seed kernel extract @ 5%',
            'Deep summer plowing to expose termites',
          ],
          chemicalOptions: [
            'Dimethoate 30% EC @ 2ml/L for aphids',
            'Chlorpyriphos 20% EC @ 2.5ml/L for termites',
          ],
        },
        harvesting: {
          maturityIndicators: [
            'Grains turn hard and lose green color',
            'Moisture content 20-25%',
            'Stem and leaves turn golden yellow',
            'Peduncle turns yellow',
          ],
          method: 'Harvest using combine harvester when grains have 20-25% moisture',
          postHarvestCare: [
            'Thresh and clean immediately',
            'Sun dry to reduce moisture to 12%',
            'Grade and store in clean, dry gunny bags',
          ],
        },
        storage: {
          conditions: 'Dry, cool place with 10-12% moisture and below 25°C temperature',
          shelfLife: '12 months under proper storage',
          packagingTips: [
            'Use gunny bags or polypropylene bags',
            'Store in well-ventilated godowns',
            'Regular fumigation for pest control',
            'Stack bags on wooden pallets',
          ],
        },
        marketInsights: {
          priceVolatility: 'Low',
          demandPattern: 'Stable demand throughout year with government procurement support',
          exportPotential: 'Medium',
        },
      },
      tomato: {
        cropType: 'Tomato',
        bestPractices: [
          'Choose hybrid varieties for better disease resistance',
          'Transplant 4-5 week old seedlings',
          'Maintain plant spacing of 60x45 cm',
          'Provide staking support for indeterminate varieties',
          'Mulching helps conserve moisture and control weeds',
        ],
        diseases: [
          {
            name: 'Early Blight',
            symptoms: 'Dark concentric rings on lower leaves, yellowing and defoliation',
            treatment: 'Spray Mancozeb @ 2.5g/L or Azoxystrobin @ 1ml/L',
            prevention: 'Crop rotation, avoid overhead irrigation, remove infected leaves',
          },
          {
            name: 'Tomato Leaf Curl Virus',
            symptoms: 'Leaf curling, stunted growth, yellowing, reduced fruit set',
            treatment: 'No direct treatment; control whitefly vector with Imidacloprid',
            prevention: 'Use virus-free seedlings, control whitefly population',
          },
        ],
        fertilizer: {
          npkRatio: '150:100:80 (N:P:K) kg/hectare',
          timing: [
            'Basal: 50 kg N + 100 kg P2O5 + 40 kg K2O at transplanting',
            '1st dose: 50 kg N + 40 kg K2O at 30 days after transplanting',
            '2nd dose: 50 kg N at flowering stage',
          ],
          organicAlternatives: [
            'FYM 25-30 tonnes/hectare',
            'Vermicompost 8-10 tonnes/hectare',
            'Neem cake @ 500 kg/hectare',
          ],
        },
        watering: {
          frequency: 'Daily to every 2-3 days depending on season',
          amount: '600-800 mm total water requirement',
          criticalStages: [
            'Transplanting stage',
            'Flowering and fruit set',
            'Fruit development stage',
          ],
        },
        pestControl: {
          commonPests: ['Fruit Borer', 'Whitefly', 'Aphids', 'Leaf Miner'],
          naturalSolutions: [
            'Install yellow sticky traps @ 15-20/hectare',
            'Spray NSKE @ 5% at weekly intervals',
            'Release Trichogramma @ 50,000/hectare',
            'Use pheromone traps for fruit borer',
          ],
          chemicalOptions: [
            'Emamectin benzoate @ 0.5g/L for fruit borer',
            'Imidacloprid @ 0.3ml/L for whitefly',
          ],
        },
        harvesting: {
          maturityIndicators: [
            'Fruits develop characteristic color (red/pink)',
            'Firm texture with slight softness',
            'Glossy appearance',
            'Full size development',
          ],
          method: 'Hand-pick fruits with a small portion of stem attached',
          postHarvestCare: [
            'Handle gently to avoid bruising',
            'Grade based on size and quality',
            'Pre-cool to remove field heat',
            'Pack in ventilated crates',
          ],
        },
        storage: {
          conditions: '10-12°C temperature with 90-95% relative humidity',
          shelfLife: '7-15 days depending on maturity stage',
          packagingTips: [
            'Use plastic crates with proper ventilation',
            'Pack single layer to avoid crushing',
            'Use newspaper/tissue paper between layers',
            'Transport in refrigerated vehicles',
          ],
        },
        marketInsights: {
          priceVolatility: 'High',
          demandPattern: 'Peak demand during winter, lower in monsoon due to oversupply',
          exportPotential: 'Low',
        },
      },
      onion: {
        cropType: 'Onion',
        bestPractices: [
          'Select suitable variety based on season (Kharif/Rabi)',
          'Transplant 6-8 week old seedlings at 15x10 cm spacing',
          'Ensure good drainage to prevent bulb rot',
          'Stop irrigation 15-20 days before harvesting',
          'Cure bulbs properly after harvest for better storage',
        ],
        diseases: [
          {
            name: 'Purple Blotch',
            symptoms: 'Purple lesions on leaves and stems, sunken dark spots',
            treatment: 'Spray Mancozeb @ 2.5g/L + Carbendazim @ 1g/L',
            prevention: 'Crop rotation, avoid excessive nitrogen, ensure proper spacing',
          },
          {
            name: 'Stemphylium Blight',
            symptoms: 'Small yellow to orange spots on leaves, rapid defoliation',
            treatment: 'Spray Tebuconazole @ 1ml/L or Azoxystrobin @ 1ml/L',
            prevention: 'Use disease-free seeds, maintain field sanitation',
          },
        ],
        fertilizer: {
          npkRatio: '100:50:50 (N:P:K) kg/hectare',
          timing: [
            'Basal: 50% N + 100% P + 50% K at transplanting',
            'Top dress 1: 25% N at 30 days after transplanting',
            'Top dress 2: 25% N at 45 days after transplanting',
            'Final dose: 50% K at bulb initiation',
          ],
          organicAlternatives: [
            'FYM 20-25 tonnes/hectare',
            'Vermicompost 5-7 tonnes/hectare',
            'Biofertilizers: Azospirillum + PSB @ 5 kg each',
          ],
        },
        watering: {
          frequency: 'Every 5-7 days depending on soil and weather',
          amount: '600-750 mm total water requirement',
          criticalStages: [
            'Seedling establishment',
            'Active vegetative growth',
            'Bulb initiation and development',
            'Stop 15-20 days before harvest',
          ],
        },
        pestControl: {
          commonPests: ['Thrips', 'Onion Maggot', 'Cut Worm', 'Aphids'],
          naturalSolutions: [
            'Use blue sticky traps for thrips monitoring',
            'Spray neem oil @ 3-5 ml/L',
            'Install light traps for moths',
            'Encourage predatory mites',
          ],
          chemicalOptions: [
            'Fipronil @ 2ml/L for thrips',
            'Dimethoate @ 2ml/L for aphids',
          ],
        },
        harvesting: {
          maturityIndicators: [
            'Neck becomes soft and top falls over',
            '50-70% tops have fallen',
            'Outer scales turn papery',
            'Bulbs attain full size',
          ],
          method: 'Lift bulbs manually when soil is moist, avoid bruising',
          postHarvestCare: [
            'Cure in field for 3-7 days',
            'Remove tops after proper curing',
            'Grade based on size (Small/Medium/Large)',
            'Store in well-ventilated shed',
          ],
        },
        storage: {
          conditions: '25-30°C with 65-70% relative humidity, good ventilation',
          shelfLife: '6-8 months for Rabi crop, 2-3 months for Kharif',
          packagingTips: [
            'Store in netted bags or crates',
            'Keep in layers not exceeding 3 meters height',
            'Ensure cross ventilation',
            'Regular inspection to remove sprouted/rotten bulbs',
          ],
        },
        marketInsights: {
          priceVolatility: 'Very High',
          demandPattern: 'Year-round demand, prices peak during lean season (Jun-Aug)',
          exportPotential: 'High',
        },
      },
      potato: {
        cropType: 'Potato',
        bestPractices: [
          'Use certified disease-free seed tubers',
          'Cut large tubers into 30-40g pieces with 2-3 eyes',
          'Plant at 60x20 cm spacing with 5-7 cm depth',
          'Earth up 2-3 times to prevent greening',
          'Dehaulm 15 days before harvest for better skin set',
        ],
        diseases: [
          {
            name: 'Late Blight',
            symptoms: 'Water-soaked lesions on leaves, white fungal growth, tuber rot',
            treatment: 'Spray Metalaxyl + Mancozeb @ 2.5g/L or Cymoxanil + Mancozeb',
            prevention: 'Use resistant varieties, prophylactic spray before disease onset',
          },
          {
            name: 'Early Blight',
            symptoms: 'Target-like concentric rings on older leaves, defoliation',
            treatment: 'Spray Mancozeb @ 2.5g/L or Azoxystrobin @ 1ml/L',
            prevention: 'Balanced fertilization, avoid water stress',
          },
        ],
        fertilizer: {
          npkRatio: '180:80:100 (N:P:K) kg/hectare',
          timing: [
            'Basal: 90 kg N + 80 kg P2O5 + 60 kg K2O at planting',
            '1st earth up: 45 kg N + 20 kg K2O at 30 days',
            '2nd earth up: 45 kg N + 20 kg K2O at 45 days',
          ],
          organicAlternatives: [
            'FYM 25-30 tonnes/hectare as basal',
            'Vermicompost 8-10 tonnes/hectare',
            'Green manuring with cowpea/dhaincha',
          ],
        },
        watering: {
          frequency: 'Light irrigation every 7-10 days',
          amount: '500-700 mm total water requirement',
          criticalStages: [
            'Tuber initiation (30-35 days)',
            'Tuber bulking (45-70 days)',
            'Stop irrigation 10-15 days before harvest',
          ],
        },
        pestControl: {
          commonPests: ['Aphids', 'Tuber Moth', 'Cut Worm', 'White Grub'],
          naturalSolutions: [
            'Use pheromone traps @ 15-20/hectare for tuber moth',
            'Mulching with crop residues to reduce moth infestation',
            'Spray neem oil @ 5ml/L',
            'Deep summer plowing to expose grubs',
          ],
          chemicalOptions: [
            'Imidacloprid @ 0.3ml/L for aphids',
            'Chlorpyriphos @ 2.5ml/L for cut worm',
          ],
        },
        harvesting: {
          maturityIndicators: [
            'Plant tops turn yellow and dry up',
            'Tuber skin is firm and does not peel off easily',
            '90-120 days after planting depending on variety',
            'Tubers have reached marketable size',
          ],
          method: 'Dehaulm 10-15 days before harvest, dig carefully to avoid injury',
          postHarvestCare: [
            'Cure for 10-15 days in shade',
            'Sort and grade by size',
            'Remove damaged and diseased tubers',
            'Pre-cool if storing for long period',
          ],
        },
        storage: {
          conditions: '2-4°C temperature with 90-95% RH for long-term storage',
          shelfLife: '4-6 months in cold storage, 1-2 months at ambient',
          packagingTips: [
            'Use ventilated jute bags or crates',
            'Store in dark, cool place to prevent greening',
            'Use CIPC spray to inhibit sprouting',
            'Regular inspection and removal of rotten tubers',
          ],
        },
        marketInsights: {
          priceVolatility: 'High',
          demandPattern: 'Steady demand, prices vary with storage and new crop arrival',
          exportPotential: 'Medium',
        },
      },
    };

    // Return crop knowledge or a default template
    return cropDatabase[cropType.toLowerCase()] || {
      cropType: cropType,
      bestPractices: [
        'Use certified quality seeds/planting material',
        'Ensure proper soil preparation and nutrient management',
        'Follow recommended spacing and planting depth',
        'Implement integrated pest management practices',
        'Maintain proper irrigation schedule',
      ],
      diseases: [
        {
          name: 'Common Fungal Disease',
          symptoms: 'Consult local agricultural extension officer for specific symptoms',
          treatment: 'Use recommended fungicides after proper identification',
          prevention: 'Maintain field hygiene and use disease-resistant varieties',
        },
      ],
      fertilizer: {
        npkRatio: 'Consult soil test report for specific recommendations',
        timing: ['Basal application', 'Top dressing at critical growth stages'],
        organicAlternatives: ['FYM', 'Vermicompost', 'Green manuring'],
      },
      watering: {
        frequency: 'Based on soil type and weather conditions',
        amount: 'Maintain adequate soil moisture',
        criticalStages: ['Germination', 'Flowering', 'Fruit development'],
      },
      pestControl: {
        commonPests: ['Consult local experts for region-specific pests'],
        naturalSolutions: ['IPM practices', 'Biological control', 'Neem-based products'],
        chemicalOptions: ['Use as last resort with expert guidance'],
      },
      harvesting: {
        maturityIndicators: ['Follow variety-specific maturity indicators'],
        method: 'Handle carefully to minimize damage',
        postHarvestCare: ['Clean, grade, and store properly'],
      },
      storage: {
        conditions: 'Cool, dry, well-ventilated storage',
        shelfLife: 'Varies by crop type',
        packagingTips: ['Use appropriate packaging materials', 'Regular inspection'],
      },
      marketInsights: {
        priceVolatility: 'Medium' as const,
        demandPattern: 'Consult local market for demand patterns',
        exportPotential: 'Medium' as const,
      },
    };
  }
}