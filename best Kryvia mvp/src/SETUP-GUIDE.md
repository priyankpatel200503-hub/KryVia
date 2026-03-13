# KryVia Setup Guide

## Quick Start

### 1. Environment Setup

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Paste it in your `.env` file

### 3. Restart Development Server

After adding the API key, restart your development server for changes to take effect.

## Features Overview

### 🤖 AI Chatbot Assistant

The AI chatbot is powered by Google's Gemini API and provides intelligent agricultural assistance.

**Features:**
- Context-aware responses based on user role (Farmer/Buyer)
- Agricultural advice and crop information
- Platform feature explanations
- Market insights and pricing strategies
- Seasonal crop recommendations
- Real-time conversation with AI
- Typing indicators and error handling

**How it works:**
1. Click the floating AI button (bottom-right corner)
2. Type your question or select a quick question
3. Press Enter or click Send
4. The chatbot sends your message to Gemini API
5. AI response appears in the chat

**Demo Mode:**
If no API key is configured, the chatbot automatically uses an intelligent simulation with agricultural knowledge base - perfect for testing and demos!

**Error Handling:**
- If API fails, shows friendly error message
- Automatic fallback to demo mode
- Network issues handled gracefully

### 🌾 Seasonal Crop Calendar

An AI-powered guide that helps farmers decide which crops to plant for maximum yield.

**Features:**
- **Season-specific recommendations** (Rabi, Kharif, Zaid)
- **Detailed crop information**:
  - Planting and harvest windows
  - Expected yield per acre
  - Water and soil requirements
  - Temperature ranges
  - Profit potential analysis
- **Market demand indicators**
- **Growing tips and best practices**
- **Common mistakes to avoid**

**How to access:**
1. From Farmer Dashboard → Click "Seasonal Calendar" card
2. From Buyer Dashboard → Click "Seasonal Calendar" card
3. From AI Features Hub → Click "View Full Calendar" in Calendar tab

**Benefits for Farmers:**
- ✅ Know what to plant in current season
- ✅ Maximize profit potential
- ✅ Reduce crop failure risks
- ✅ Plan ahead for next season
- ✅ Optimize resource usage

**Benefits for Buyers:**
- ✅ Understand seasonal availability
- ✅ Plan purchases in advance
- ✅ Buy crops during peak harvest
- ✅ Get better prices during season

## AI Features Integration

### 1. AI Chatbot
**Location:** Floating button on all screens (after login)
**API:** Google Gemini Pro
**Fallback:** Intelligent simulation

### 2. Seasonal Calendar
**Location:** 
- Farmer Dashboard
- Buyer Dashboard
- AI Features Hub
**Data:** AI-powered seasonal recommendations
**Updates:** Based on current month and region

### 3. Other AI Features
- Crop Demand Prediction
- Smart Price Suggestion
- Sale Adviser
- Trust Score System
- Smart Matching (Distance-based)

## Environment Variables

```env
# Required for AI Chatbot
VITE_GEMINI_API_KEY=your_gemini_api_key

# Future expansion
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Security Best Practices

### ⚠️ Important

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Double-check before pushing

2. **Use environment variables**
   ```javascript
   // ✅ Good
   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   
   // ❌ Bad - Never hardcode
   const API_KEY = "AIzaSy...";
   ```

3. **Rotate keys regularly**
   - Generate new API keys periodically
   - Revoke old keys in Google Cloud Console

## Troubleshooting

### Chatbot Not Responding

**Check:**
1. API key in `.env` file
2. Development server restarted
3. Browser console for errors
4. Internet connection

**Solution:**
- Verify `.env` file exists and contains key
- Restart dev server
- Check for typos in API key
- Demo mode works without API key

### "AI is temporarily unavailable" Error

**Possible Causes:**
- Invalid or expired API key
- Network connectivity issues
- API rate limit exceeded

**Solutions:**
1. Verify API key in Google Cloud Console
2. Check internet connection
3. Wait a few minutes if rate limited
4. Chatbot will fallback to demo mode

### Seasonal Calendar Not Showing Data

**Check:**
- User location (state) is set
- Current month is valid
- Browser console for errors

**Solution:**
- Calendar uses current month automatically
- Recommendations based on region
- Contact support if issue persists

## API Rate Limits

### Gemini API (Free Tier)
- **60 requests per minute**
- Suitable for demos and small deployments
- Monitor usage in Google Cloud Console

### Production Recommendations
1. Implement caching for common questions
2. Add rate limiting on client side
3. Consider backend proxy for API calls
4. Use different keys for dev/staging/prod

## Support & Documentation

For more information:
- [AI Chatbot Setup Guide](/AI-CHATBOT-SETUP.md)
- [AI Features Documentation](/AI-FEATURES-DOCUMENTATION.md)
- [MVP Testing Guide](/MVP-TESTING-GUIDE.md)

## Version History

- **v1.2**: Added Seasonal Crop Calendar
- **v1.1**: Integrated Gemini API for chatbot
- **v1.0**: Initial AI features implementation

---

**Note**: This is a demo/MVP application. For production use, implement additional security measures, backend API proxy, and comprehensive error handling.
