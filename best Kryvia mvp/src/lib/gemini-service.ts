// Gemini API Service for KryVia Chatbot
// This is a client-side implementation for the Figma prototype

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export class GeminiService {
  private static API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
  private static API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  // System prompt for agricultural context
  private static SYSTEM_CONTEXT = `You are an AI assistant for KryVia, an agricultural marketplace connecting farmers and buyers in India. 

Your role is to help users with:
- Agricultural advice and crop information
- Platform features (registration, KYC, orders, payments)
- Market insights and pricing strategies
- Seasonal crop recommendations
- Buyer-farmer interactions

Keep responses concise, practical, and relevant to Indian agriculture. Use simple language and provide actionable advice. When discussing crops, consider Indian growing conditions, seasons (Rabi, Kharif, Zaid), and regional variations.

Available platform features:
- Trust Score system for buyers
- Crop Demand Prediction
- Smart Price Suggestions
- Sale Adviser for optimal selling times
- Seasonal Crop Calendar
- Smart Matching (finding nearby buyers/farmers)
- KYC verification
- Order tracking and management

Always be helpful, professional, and supportive.`;

  /**
   * Send a message to Gemini API and get response
   */
  static async sendMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    userRole: 'farmer' | 'buyer',
    userContext?: {
      name?: string;
      state?: string;
      district?: string;
      crops?: string[];
    }
  ): Promise<string> {
    try {
      // If API key is available, use real Gemini API
      if (this.API_KEY && this.API_KEY !== 'YOUR_API_KEY_HERE') {
        return await this.callRealGeminiAPI(userMessage, conversationHistory, userRole, userContext);
      } else {
        // Fallback to enhanced AI simulation for demo
        return this.simulateGeminiResponse(userMessage, conversationHistory, userRole, userContext);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI is temporarily unavailable, please try again later');
    }
  }

  /**
   * Call the real Gemini API
   */
  private static async callRealGeminiAPI(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    userRole: 'farmer' | 'buyer',
    userContext?: any
  ): Promise<string> {
    // Build context-aware prompt
    const contextInfo = this.buildContextPrompt(userRole, userContext);
    const fullPrompt = `${this.SYSTEM_CONTEXT}\n\n${contextInfo}\n\nUser: ${userMessage}`;

    // Convert conversation history to Gemini format
    const contents = conversationHistory.slice(-5).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: fullPrompt }]
    });

    const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('No response from Gemini API');
  }

  /**
   * Enhanced AI simulation for demo purposes
   */
  private static simulateGeminiResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    userRole: 'farmer' | 'buyer',
    userContext?: any
  ): string {
    const message = userMessage.toLowerCase();
    const userName = userContext?.name || (userRole === 'farmer' ? 'Farmer' : 'Buyer');
    const state = userContext?.state || 'India';

    // Seasonal Crop Calendar queries
    if (message.includes('season') || message.includes('plant') || message.includes('grow') || 
        message.includes('calendar') || message.includes('when to')) {
      return this.getSeasonalAdvice(userRole, state, userContext);
    }

    // Crop-specific queries
    if (message.includes('rice')) return this.getCropAdvice('rice', userRole, state);
    if (message.includes('wheat')) return this.getCropAdvice('wheat', userRole, state);
    if (message.includes('cotton')) return this.getCropAdvice('cotton', userRole, state);
    if (message.includes('tomato')) return this.getCropAdvice('tomato', userRole, state);
    if (message.includes('onion')) return this.getCropAdvice('onion', userRole, state);
    if (message.includes('potato')) return this.getCropAdvice('potato', userRole, state);

    // Platform features
    if (message.includes('register') || message.includes('sign up') || message.includes('account')) {
      return `Welcome ${userName}! To register on KryVia:\n\n1. Select your role (${userRole === 'farmer' ? 'Farmer - you can list and sell crops' : 'Buyer - you can purchase crops from farmers'})\n2. Enter your phone number for verification\n3. Complete your profile with location details\n4. Upload KYC documents (Aadhaar card required)\n5. Wait for verification (usually 24-48 hours)\n\nYou can skip KYC for demo purposes. Need help with any specific step?`;
    }

    if (message.includes('kyc') || message.includes('verify') || message.includes('document')) {
      return `KYC verification helps build trust in our marketplace. Here's what you need:\n\n📄 Required Documents:\n• Aadhaar Card (both sides)\n• ${userRole === 'farmer' ? 'Land ownership documents\n• Bank account details' : 'Business registration certificate\n• GST certificate (if applicable)\n• Bank account details'}\n\n⏱️ Verification typically takes 24-48 hours\n✅ KYC verified users get priority in orders\n🛡️ All documents are encrypted and secure\n\nYou can browse listings without KYC but need verification to place/accept orders.`;
    }

    if (message.includes('price') || message.includes('pricing') || message.includes('cost')) {
      if (userRole === 'farmer') {
        return `Smart Pricing Tips for Farmers:\n\n💡 Use our AI-powered Smart Price Suggestion feature:\n• Based on real-time market data\n• Considers your crop quality grade\n• Factors in seasonal demand\n• Compares with competitor prices\n\n📊 Pricing Strategy:\n• Premium grade: 15-30% above base price\n• Grade A: 10-15% above base price\n• Fresh crops (< 7 days): +10% premium\n• Bulk orders: 2-5% discount\n\nCheck the Demand Prediction tab to see if it's a good time to sell!`;
      } else {
        return `Finding the Best Prices:\n\n🔍 Use our advanced filters:\n• Filter by price range (Under ₹50, ₹50-100, etc.)\n• Compare prices across different farmers\n• Check crop grade and quality\n• Consider location for transport costs\n\n💰 Smart Buying Tips:\n• Use Smart Matching to find nearby farmers (save on transport)\n• Buy in bulk for better rates\n• Check seasonal demand - off-season = lower prices\n• Verify farmer ratings before ordering\n\nCurrent market trends available in AI Intelligence Hub!`;
      }
    }

    if (message.includes('trust') || message.includes('score') || message.includes('rating')) {
      return `Trust Score System 🛡️\n\nTrust scores help ${userRole === 'farmer' ? 'farmers assess buyer reliability' : 'buyers find reliable farmers'}.\n\n📊 Score Calculation:\n• Order completion history (35%)\n• Payment reliability (35%)\n• Response time (15%)\n• Account age (15%)\n\n⭐ Rating Levels:\n• 80-100: Excellent ⭐⭐⭐⭐⭐\n• 60-79: Good ⭐⭐⭐⭐\n• 40-59: Average ⭐⭐⭐\n• Below 40: Needs improvement\n\n🎖️ Earn Badges:\n• Verified ${userRole === 'farmer' ? 'Farmer' : 'Buyer'}\n• Reliable Payment\n• Zero Disputes\n• Quick Responder\n\nBuild your score by completing orders successfully!`;
    }

    if (message.includes('order') || message.includes('buy') || message.includes('sell') || message.includes('purchase')) {
      if (userRole === 'farmer') {
        return `Managing Orders as a Farmer:\n\n📦 When you receive an order:\n1. Review buyer's Trust Score\n2. Check order quantity and price\n3. Accept or reject within 24 hours\n4. Once accepted, prepare the crop\n5. Mark as "Shipping" when dispatched\n6. Buyer confirms "Received" after delivery\n\n✅ Order Statuses:\n• Requested - New order from buyer\n• Confirmed - You accepted the order\n• Shipping - In transit\n• Received - Delivered & payment released\n\n💰 Payment is released after buyer confirms receipt!`;
      } else {
        return `Placing Orders as a Buyer:\n\n🛒 How to order:\n1. Browse available crop listings\n2. Check farmer ratings and crop quality\n3. Select quantity (meet minimum order)\n4. Add message with any special requirements\n5. Place order and make payment\n6. Track order status in real-time\n\n📍 Use Smart Matching to find nearby farmers and reduce transport costs!\n\n📊 Order Tracking:\n• Requested → Confirmed → Shipping → Received\n\nYou can contact farmers directly through our messaging system.`;
      }
    }

    if (message.includes('payment') || message.includes('money') || message.includes('pay')) {
      return `💳 Payment System:\n\n${userRole === 'farmer' ? 
        '💰 For Farmers:\n• Buyers pay when placing order\n• Funds held securely in escrow\n• Released to you after delivery confirmation\n• Money deposited to your bank account\n• 2-3 business days for processing' :
        '💳 For Buyers:\n• Pay securely when placing order\n• Funds held safely until delivery\n• Payment released to farmer after you confirm receipt\n• Refund available if order cancelled\n• UPI, Cards, Net Banking accepted'
      }\n\n🔒 All transactions are secure and encrypted!\n✅ Dispute resolution available if needed`;
    }

    if (message.includes('smart matching') || message.includes('nearby') || message.includes('distance')) {
      return `Smart Matching Feature 📍\n\n${userRole === 'buyer' ? 
        'Find nearby farmers to reduce transportation costs!\n\n🎯 How it works:\n• Set your distance range (0-100 km)\n• AI matches you with farmers in range\n• See their crops, prices, and ratings\n• Filter by crop type you need\n• Get match score based on distance, crops, and reliability\n\n💰 Benefits:\n• Lower transport costs\n• Faster delivery\n• Support local farmers\n• Fresh produce\n\nAccess from your dashboard!' :
        'Connect with nearby buyers interested in your crops!\n\n🎯 Features:\n• Find buyers within your preferred distance\n• See their purchase history\n• View trust scores\n• Match based on crops they buy\n• Direct contact options\n\nGreat for regular bulk orders and building relationships!'
      }`;
    }

    if (message.includes('demand') || message.includes('market') || message.includes('trend')) {
      return `📊 Crop Demand Prediction\n\nOur AI analyzes market trends to predict demand:\n\n🌾 Current Insights for ${state}:\n• Peak season crops: ${this.getCurrentSeasonCrops()}\n• Rising demand: Cotton, Rice, Turmeric\n• Stable prices: Wheat, Potato, Onion\n• Festival season affecting: All vegetables\n\n${userRole === 'farmer' ? 
        '💡 Farmer Tips:\n• Plant high-demand crops next season\n• Check Sale Adviser for best selling time\n• Monitor weekly price trends\n• Consider crop rotation for soil health' :
        '💡 Buyer Tips:\n• Buy off-season for lower prices\n• Stock up during harvest season\n• Use demand predictions for planning\n• Book in advance for peak-demand crops'
      }\n\nCheck AI Intelligence Hub for detailed analysis!`;
    }

    if (message.includes('help') || message.includes('how') || message.includes('what')) {
      return `Hello ${userName}! I'm your KryVia AI Assistant 🤖\n\nI can help you with:\n\n🌾 Agricultural Advice:\n• Seasonal crop recommendations\n• Best planting & harvest times\n• Crop-specific guidance\n• Yield optimization tips\n\n📱 Platform Features:\n• Registration & KYC\n• Order management\n• Pricing strategies\n• Smart Matching\n• Trust Scores\n\n📊 AI Features:\n• Demand Prediction\n• Price Suggestions\n• Sale Adviser\n• Market Insights\n\nWhat would you like to know more about?`;
    }

    // Default intelligent response
    const context = userRole === 'farmer' ? 'farming and selling crops' : 'buying quality produce';
    return `I understand you're asking about "${userMessage}". As a ${userRole} in ${state}, I'm here to help with ${context}!\n\n🤖 I can assist you with:\n• Crop recommendations and seasonal advice\n• Platform features (orders, payments, KYC)\n• Market insights and pricing\n• Finding ${userRole === 'farmer' ? 'buyers' : 'farmers'} nearby\n\nCould you please be more specific? For example:\n• "What crops should I ${userRole === 'farmer' ? 'plant' : 'buy'} this season?"\n• "How do I ${userRole === 'farmer' ? 'create a listing' : 'place an order'}?"\n• "What's the best price for ${userContext?.crops?.[0] || 'rice'}?"\n\nI'm here to help! 🌾`;
  }

  private static buildContextPrompt(userRole: 'farmer' | 'buyer', userContext?: any): string {
    let context = `Current user is a ${userRole}`;
    if (userContext?.name) context += ` named ${userContext.name}`;
    if (userContext?.state) context += ` from ${userContext.state}`;
    if (userContext?.crops?.length) context += ` growing ${userContext.crops.join(', ')}`;
    return context + '.';
  }

  private static getSeasonalAdvice(userRole: string, state: string, userContext?: any): string {
    const month = new Date().getMonth();
    let season = '';
    let crops = '';

    if (month >= 9 || month <= 2) {
      season = 'Rabi (Winter)';
      crops = 'Wheat, Mustard, Potato, Peas, Chickpea';
    } else if (month >= 6 && month <= 9) {
      season = 'Kharif (Summer/Monsoon)';
      crops = 'Rice, Cotton, Maize, Soybean, Sugarcane';
    } else {
      season = 'Zaid (Spring/Summer)';
      crops = 'Tomato, Cucumber, Watermelon, Muskmelon';
    }

    return `🌾 Seasonal Crop Calendar for ${state}\n\nCurrent Season: ${season}\n\n${userRole === 'farmer' ? 
      `📅 Best Crops to Plant Now:\n${crops}\n\n🌱 Planting Tips:\n• Prepare soil with organic matter\n• Check local weather forecasts\n• Use certified seeds\n• Plan irrigation schedule\n• Consider crop rotation\n\n💰 Market Outlook:\n• High demand expected during harvest\n• Use Smart Price Suggestion for optimal pricing\n• Check Demand Prediction regularly\n\n📊 Access full Seasonal Calendar in AI Features!` :
      `📅 Crops in Season Now:\n${crops}\n\n🛒 Buying Tips:\n• Best prices during peak harvest\n• Stock up for off-season premium\n• Check freshness and grade\n• Use Smart Matching for local farmers\n\n💡 These crops are fresh and abundant now - great time to buy!\n\nAccess detailed seasonal insights in AI Intelligence Hub!`}`;
  }

  private static getCropAdvice(crop: string, userRole: string, state: string): string {
    const cropInfo: { [key: string]: any } = {
      rice: {
        season: 'Kharif (Jun-Nov)',
        avgPrice: '₹40-50/kg',
        yield: '30-35 quintals/acre',
        tips: 'Requires plenty of water, grows well in alluvial soil'
      },
      wheat: {
        season: 'Rabi (Oct-Apr)',
        avgPrice: '₹30-40/kg',
        yield: '25-30 quintals/acre',
        tips: 'Needs moderate irrigation, ideal for north India'
      },
      cotton: {
        season: 'Kharif (May-Dec)',
        avgPrice: '₹80-100/kg',
        yield: '15-20 quintals/acre',
        tips: 'Needs warm climate, popular in Gujarat and Maharashtra'
      },
      tomato: {
        season: 'Year-round',
        avgPrice: '₹20-30/kg',
        yield: '200-250 quintals/acre',
        tips: 'Short duration crop, high demand year-round'
      },
      onion: {
        season: 'Rabi & Kharif',
        avgPrice: '₹25-35/kg',
        yield: '120-150 quintals/acre',
        tips: 'Store well, price varies seasonally'
      },
      potato: {
        season: 'Rabi (Oct-Feb)',
        avgPrice: '₹15-25/kg',
        yield: '150-200 quintals/acre',
        tips: 'Cool climate preferred, stores well'
      }
    };

    const info = cropInfo[crop.toLowerCase()] || cropInfo.rice;

    return `${crop.charAt(0).toUpperCase() + crop.slice(1)} Information 🌾\n\n📅 Season: ${info.season}\n💰 Current Market: ${info.avgPrice}\n📊 Avg Yield: ${info.yield}\n\n${userRole === 'farmer' ?
      `🌱 Growing Tips:\n${info.tips}\n\n💡 Maximize Profit:\n• Use our Smart Price Suggestion\n• Check Demand Prediction\n• Grade your crop properly\n• List when demand is high\n\nCheck Sale Adviser for best selling time!` :
      `🛒 Buying Guide:\n${info.tips}\n\n💡 Smart Buying:\n• Check multiple listings\n• Verify grade certification\n• Use Smart Matching for local farmers\n• Consider bulk discounts\n• Peak season = lower prices\n\nCurrent listings available in marketplace!`
    }`;
  }

  private static getCurrentSeasonCrops(): string {
    const month = new Date().getMonth();
    if (month >= 9 || month <= 2) return 'Wheat, Mustard, Potato';
    if (month >= 6 && month <= 9) return 'Rice, Cotton, Maize';
    return 'Tomato, Cucumber, Watermelon';
  }
}
