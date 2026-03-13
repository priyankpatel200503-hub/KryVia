# KryVia MVP Testing Guide

## Recent Updates

### 1. **Skip for Now Button in KYC Upload** ✅
- Added a "Skip for Now" button on the KYC upload screen
- Users can bypass document upload to quickly test the app
- Skipping KYC sets the user status to "pending"
- Users can still browse with limited access or simulate verification for testing

### 2. **Switch Role Button** ✅
- Added a **Switch Role** button (🔄 icon) in the header
- Located between the chat icon and role badge
- Allows instant switching between Farmer and Buyer roles
- Perfect for MVP testing without creating multiple accounts
- **All data (listings and orders) persists across role switches**

### 3. **Data Visibility Fix** ✅
- Listings and orders are now globally accessible
- When you create crops as a farmer and switch to buyer, those crops are immediately visible
- All listings appear in the buyer's browse section
- Orders are properly tracked across both roles

### 4. **Order History & Received Status** ✅
- Fixed buyer order history tab to show completed orders correctly
- Orders with status "received" now appear in the History tab
- Added "Mark as Received" button for buyers when order is in "shipping" status
- When buyer marks order as received, farmer gets notified
- Proper timestamps for receivedAt field

## How to Test Your MVP

### Quick Start Testing Flow:

1. **Create Your First User (Farmer)**
   - Complete the onboarding flow
   - Select "Farmer" role
   - Fill in profile details
   - On KYC screen, click **"Skip for Now"**
   - You'll land on the KYC Status screen
   - Click **"Simulate Verification (Demo)"** to get full access
   - Or click **"Browse (Limited Access)"** to test with restrictions

2. **Add Crops as Farmer**
   - Click "Add New Crop" button
   - Create a few crop listings with different varieties
   - Add images, set prices, quantities, etc.

3. **Switch to Buyer Role**
   - Click the **🔄 (RefreshCw icon)** button in the header
   - Your role instantly switches to "Buyer"
   - Navigate to the Browse tab
   - **You should now see all the crops you created as a farmer!**

4. **Place Orders as Buyer**
   - Browse the available crops
   - Click on a listing to view details
   - Place an order with quantity and optional message

5. **Switch Back to Farmer Role**
   - Click the **🔄** button again
   - Your role switches back to "Farmer"
   - Navigate to "Orders" tab or "Order Management"
   - You should see the incoming order request
   - Accept/confirm the order

6. **Test Order Flow**
   - Confirm orders as farmer
   - Mark as shipping
   - Switch to buyer to mark as received
   - Test the complete order lifecycle

### Complete Order Flow Test Scenario:

1. **As Farmer**: Create a crop listing (e.g., Rice - Basmati, 100kg)
2. **Switch to Buyer**: Use 🔄 button
3. **As Buyer**: Place an order for 50kg
4. **Switch to Farmer**: Use 🔄 button
5. **As Farmer**: 
   - Go to "Order Management" or "Orders" tab
   - See the new order request
   - Click "Accept Order" or "Confirm"
6. **As Farmer**: Mark order as "Shipping"
7. **Switch to Buyer**: Use 🔄 button
8. **As Buyer**: 
   - Go to "My Orders" tab
   - Click "View" on the order
   - See order status as "Shipping"
   - Click **"Mark as Received"** button
   - Order moves to "History" tab with status "Received"
9. **Switch to Farmer**: Use 🔄 button
10. **As Farmer**: View order in history with "Delivered" status

### Important Testing Notes:

- **Data Persistence**: All listings and orders remain in memory during your session
- **Role Switching**: You can switch roles unlimited times without losing data
- **KYC Status**: You can simulate verification at any time for testing
- **Limited Access**: Test with unverified accounts to see the restrictions
- **Multi-Language**: Test all three languages (English, Hindi, Gujarati)

### Testing Features:

#### Farmer Features:
- ✅ Create crop listings
- ✅ Manage listings (view, edit status)
- ✅ View incoming order requests
- ✅ Accept/reject orders
- ✅ Update order status (confirmed → shipping)
- ✅ View order history and revenue stats
- ✅ In-app messaging with buyers
- ✅ Call functionality

#### Buyer Features:
- ✅ Browse all available crops
- ✅ Filter by crop type, state, price, grade
- ✅ Search crops, varieties, farmers
- ✅ View listing details
- ✅ Place orders with custom quantities
- ✅ Track order status
- ✅ Repeat previous orders
- ✅ View purchase history
- ✅ In-app messaging with farmers
- ✅ Call functionality
- ✅ Notifications system
- ✅ Receipt generation

#### Shared Features:
- ✅ Phone verification (OTP simulation)
- ✅ Profile setup
- ✅ KYC upload (or skip for testing)
- ✅ Multi-language support
- ✅ Role-based dashboards
- ✅ Order tracking system
- ✅ Status indicators (verified, pending, etc.)

### Known Demo Limitations:

1. **Data Storage**: All data is stored in React state (memory only)
   - Data is lost when you refresh the page
   - No backend/database persistence
   - This is intentional for MVP demo purposes

2. **Authentication**: Simplified for demo
   - No real OTP verification
   - No actual phone authentication
   - Accept any 6-digit code

3. **KYC**: Instant simulation
   - Documents are not actually processed
   - Verification is instant via button click
   - In production, this would take 24-48 hours

4. **Payments**: Removed from flow
   - No actual payment processing
   - Order flow simplified: requested → confirmed → shipping → received

### Troubleshooting:

**Problem**: Can't see crops when switching to buyer role
- **Solution**: The issue has been fixed! All listings are now globally visible. Make sure you've created crops as a farmer first.

**Problem**: Data disappears after page refresh
- **Solution**: This is expected behavior. Data is stored in memory only. For persistence, you would need Supabase integration.

**Problem**: Can't complete actions as unverified user
- **Solution**: Click "Simulate Verification (Demo)" on the KYC Status screen to get full access.

**Problem**: Switch role button not visible
- **Solution**: Make sure you're logged in. The button only appears when a user is authenticated.

## Production Considerations:

When moving from MVP to production, you should:
1. Remove the "Switch Role" button
2. Remove "Simulate Verification" button
3. Integrate real backend (Supabase recommended)
4. Add proper authentication
5. Implement real KYC verification process
6. Add payment gateway integration
7. Add real-time notifications
8. Implement proper data persistence
9. Add security measures (rate limiting, validation, etc.)
10. Add analytics and monitoring

## Support:

For any issues or questions during testing, the switch role feature allows you to quickly test both sides of the marketplace without creating multiple accounts.

**Happy Testing! 🌾**