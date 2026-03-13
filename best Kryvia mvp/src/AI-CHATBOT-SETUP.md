# AI Chatbot Setup Guide

## Overview

KryVia's AI chatbot is powered by Google's Gemini API and provides intelligent agricultural assistance to farmers and buyers. The chatbot can answer questions about:

- Agricultural advice and crop information
- Platform features (registration, KYC, orders)
- Market insights and pricing strategies
- Seasonal crop recommendations
- Buyer-farmer interactions

## Setup Instructions

### Option 1: Using Real Gemini API (Recommended for Production)

1. **Get Your Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API key
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart Your Development Server**
   ```bash
   # The chatbot will now use the real Gemini API
   ```

### Option 2: Using AI Simulation (Demo Mode)

If you don't have a Gemini API key, the chatbot will automatically use an intelligent AI simulation:

1. **No Configuration Needed**
   - The chatbot works out of the box with realistic responses
   - Responses are generated using agricultural knowledge base
   - Perfect for demos and testing

2. **Features in Demo Mode**
   - Context-aware responses based on user role (farmer/buyer)
   - Agricultural advice for different crops
   - Platform feature explanations
   - Seasonal recommendations
   - Market insights

## Features

### 🤖 Intelligent Responses

The chatbot provides context-aware responses based on:
- User role (Farmer or Buyer)
- User location (State/District)
- Crops being grown or preferred crops
- Conversation history

### 🌾 Agricultural Knowledge

- **Crop Information**: Rice, Wheat, Cotton, Tomato, Onion, Potato, and more
- **Seasonal Guidance**: Rabi, Kharif, and Zaid season recommendations
- **Regional Advice**: Tailored to Indian agricultural conditions

### 📊 Platform Integration

- Registration and KYC assistance
- Order management guidance
- Pricing strategies
- Trust score explanations
- Smart matching features

### 🎯 Smart Features

- **Typing Indicator**: Shows when AI is thinking
- **Error Handling**: Graceful fallback if API is unavailable
- **Quick Questions**: Pre-filled common queries
- **Conversation History**: Maintains context across messages
- **Mobile Optimized**: Responsive design for all devices

## Usage

### Opening the Chatbot

1. Look for the floating AI assistant button (bottom-right corner)
2. Click to open the chat interface
3. Type your question or select a quick question

### Example Questions

**For Farmers:**
- "What crops should I plant this season?"
- "How do I price my wheat?"
- "When is the best time to sell cotton?"
- "How do I create a listing?"
- "What is the demand for rice?"

**For Buyers:**
- "How do I find nearby farmers?"
- "What's the best price for onions?"
- "How does the trust score work?"
- "How do I place an order?"
- "Which crops are in season now?"

**General:**
- "Help me with KYC verification"
- "How do payments work?"
- "What is Smart Matching?"
- "Explain the seasonal crop calendar"

## API Rate Limits

### Free Tier (Gemini API)
- 60 requests per minute
- Suitable for demos and small deployments

### Production Considerations
- Monitor API usage in Google Cloud Console
- Implement caching for common questions
- Add rate limiting on client side

## Troubleshooting

### "AI is temporarily unavailable" Error

**Possible Causes:**
1. Invalid or expired API key
2. Network connectivity issues
3. API rate limit exceeded
4. CORS or security restrictions

**Solutions:**
1. Verify your API key in `.env` file
2. Check your internet connection
3. Wait a few minutes if rate limited
4. Check browser console for detailed errors

### Chatbot Not Responding

1. **Check Environment Variable**
   ```bash
   # Make sure .env file exists and contains:
   VITE_GEMINI_API_KEY=your_key_here
   ```

2. **Restart Development Server**
   ```bash
   # Stop the server and restart
   ```

3. **Clear Browser Cache**
   - Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error messages
   - Check Network tab for failed requests

### Demo Mode Not Working

- The AI simulation will work even without an API key
- Check browser console for JavaScript errors
- Ensure `gemini-service.ts` is properly imported

## Security Best Practices

### API Key Protection

1. **Never Commit API Keys**
   ```bash
   # .env is already in .gitignore
   # Double-check before committing
   git status
   ```

2. **Use Environment Variables**
   ```javascript
   // ✅ Good
   const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
   
   // ❌ Bad
   const API_KEY = "AIzaSy..."; // Never hardcode
   ```

3. **Rotate Keys Regularly**
   - Generate new API keys periodically
   - Revoke old keys in Google Cloud Console

### Production Deployment

For production, consider:

1. **Backend Proxy**
   - Move API calls to a backend server
   - Keep API keys server-side only
   - Add authentication and rate limiting

2. **Environment-Specific Keys**
   - Use different keys for dev, staging, production
   - Set up proper environment management

3. **Monitoring**
   - Track API usage and costs
   - Set up alerts for unusual activity
   - Monitor error rates

## Advanced Configuration

### Customizing AI Responses

Edit `lib/gemini-service.ts` to customize:

```typescript
// Modify system context
private static SYSTEM_CONTEXT = `Your custom context...`;

// Add custom response patterns
if (message.includes('custom_keyword')) {
  return 'Custom response';
}
```

### Adjusting AI Parameters

```typescript
generationConfig: {
  temperature: 0.7,    // Lower = more focused, Higher = more creative
  topK: 40,            // Token sampling diversity
  topP: 0.95,          // Nucleus sampling threshold
  maxOutputTokens: 500 // Maximum response length
}
```

## Support

For issues or questions:
1. Check this documentation
2. Review browser console errors
3. Test with AI simulation mode
4. Verify API key validity

## Updates and Maintenance

### Keeping Current

- Monitor Gemini API updates
- Check for new features and capabilities
- Update safety settings as needed
- Test regularly with real users

### Version History

- **v1.0**: Initial implementation with Gemini Pro
- Seasonal crop calendar integration
- Enhanced error handling
- Demo mode with agricultural knowledge base

---

**Note**: This chatbot is designed for the KryVia agricultural marketplace MVP. For production use, implement additional security measures, backend API proxy, and comprehensive error handling.
