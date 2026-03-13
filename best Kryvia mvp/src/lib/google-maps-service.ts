// Google Maps API Service
// This service simulates Google Maps Distance Matrix API for real-time distance and cost calculations
// In production, replace with actual Google Maps API calls

// Note: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface DistanceMatrixResult {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  status: string;
}

export interface RouteCalculationResult {
  distance: string;
  distanceValue: number; // in km
  estimatedTime: string;
  estimatedTimeValue: number; // in minutes
  fuelCost: string;
  tollCost: string;
  totalCost: string;
  savings: string;
  route: RouteStep[];
  alternativeRoutes: AlternativeRoute[];
  tips: string[];
  vehicleType: string;
  coordinates: {
    origin: LocationCoordinates;
    destination: LocationCoordinates;
  };
}

export interface RouteStep {
  step: number;
  location: string;
  coordinates: LocationCoordinates;
  time: string;
  action: string;
  distance?: string;
}

export interface AlternativeRoute {
  name: string;
  distance: string;
  time: string;
  cost: string;
  savings?: string;
}

// Indian cities and their approximate coordinates
const INDIAN_CITIES: { [key: string]: LocationCoordinates } = {
  // Major Agricultural Markets
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'faridabad': { lat: 28.4089, lng: 77.3178 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'meerut': { lat: 28.9845, lng: 77.7064 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'patna': { lat: 25.5941, lng: 85.1376 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'ludhiana': { lat: 30.9010, lng: 75.8573 },
  'amritsar': { lat: 31.6340, lng: 74.8723 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'nashik': { lat: 19.9975, lng: 73.7898 },
  'aurangabad': { lat: 19.8762, lng: 75.3433 },
  'solapur': { lat: 17.6599, lng: 75.9064 },
};

// Geocode location name to coordinates (simplified for demo)
export async function geocodeLocation(location: string): Promise<LocationCoordinates | null> {
  // In production, use: 
  // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Try to match with known cities (case-insensitive)
  const normalizedLocation = location.toLowerCase().trim();
  
  for (const [city, coords] of Object.entries(INDIAN_CITIES)) {
    if (normalizedLocation.includes(city)) {
      return coords;
    }
  }
  
  // If no match, generate random coordinates in India (for demo)
  return {
    lat: 20 + Math.random() * 10, // Between 20-30°N
    lng: 72 + Math.random() * 15, // Between 72-87°E
  };
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(point1: LocationCoordinates, point2: LocationCoordinates): number {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get distance matrix from Google Maps API (simulated)
export async function getDistanceMatrix(
  origin: string,
  destination: string
): Promise<DistanceMatrixResult> {
  // In production, use:
  // const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const originCoords = await geocodeLocation(origin);
  const destCoords = await geocodeLocation(destination);
  
  if (!originCoords || !destCoords) {
    throw new Error('Unable to geocode locations');
  }
  
  const distanceKm = calculateDistance(originCoords, destCoords);
  const distanceMeters = distanceKm * 1000;
  
  // Estimate time based on average speed of 60 km/h in India
  const avgSpeedKmH = 60;
  const durationHours = distanceKm / avgSpeedKmH;
  const durationMinutes = Math.round(durationHours * 60);
  const durationSeconds = durationMinutes * 60;
  
  // Format duration text
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationText = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}` : `${mins} min${mins !== 1 ? 's' : ''}`;
  
  return {
    distance: {
      text: `${distanceKm} km`,
      value: distanceMeters,
    },
    duration: {
      text: durationText,
      value: durationSeconds,
    },
    status: 'OK',
  };
}

// Vehicle fuel efficiency (km per liter)
export const VEHICLE_FUEL_EFFICIENCY: { [key: string]: number } = {
  'truck': 8,        // 14 ft truck: 8 km/l
  'mini-truck': 10,  // 10 ft mini truck: 10 km/l
  'pickup': 12,      // Pickup van: 12 km/l
  'tempo': 14,       // Tempo: 14 km/l
};

// Calculate route with costs
export async function calculateRoute(
  origin: string,
  destination: string,
  vehicleType: string = 'truck'
): Promise<RouteCalculationResult> {
  // Get distance and duration from Google Maps
  const distanceMatrix = await getDistanceMatrix(origin, destination);
  
  const distanceKm = distanceMatrix.distance.value / 1000;
  const durationMinutes = distanceMatrix.duration.value / 60;
  
  // Get coordinates for origin and destination
  const originCoords = await geocodeLocation(origin);
  const destCoords = await geocodeLocation(destination);
  
  if (!originCoords || !destCoords) {
    throw new Error('Unable to geocode locations');
  }
  
  // Calculate fuel cost
  const fuelPricePerLiter = 95; // ₹95 per liter (diesel)
  const vehicleEfficiency = VEHICLE_FUEL_EFFICIENCY[vehicleType] || 8;
  const fuelRequired = distanceKm / vehicleEfficiency;
  const fuelCost = Math.round(fuelRequired * fuelPricePerLiter);
  
  // Calculate toll cost (approximately ₹2 per km on highways)
  const tollCost = Math.round(distanceKm * 2);
  
  // Calculate total cost (fuel + toll + driver cost + misc)
  const driverCost = Math.round(durationMinutes * 5); // ₹5 per minute
  const miscCost = Math.round(distanceKm * 1); // ₹1 per km for misc
  const totalCost = fuelCost + tollCost + driverCost + miscCost;
  
  // Calculate savings compared to traditional route (assume 20-30% savings)
  const savingsPercent = 20 + Math.random() * 10;
  const savingsAmount = Math.round(totalCost * savingsPercent / 100);
  
  // Generate route steps with intermediate waypoints
  const routeSteps: RouteStep[] = generateRouteSteps(
    origin,
    destination,
    originCoords,
    destCoords,
    distanceKm,
    durationMinutes
  );
  
  // Generate alternative routes
  const alternativeRoutes: AlternativeRoute[] = generateAlternativeRoutes(
    distanceKm,
    durationMinutes,
    totalCost
  );
  
  // Generate AI tips based on route
  const tips = generateRouteTips(distanceKm, durationMinutes);
  
  return {
    distance: `${Math.round(distanceKm)} km`,
    distanceValue: distanceKm,
    estimatedTime: distanceMatrix.duration.text,
    estimatedTimeValue: durationMinutes,
    fuelCost: `₹${fuelCost.toLocaleString()}`,
    tollCost: `₹${tollCost.toLocaleString()}`,
    totalCost: `₹${totalCost.toLocaleString()}`,
    savings: `₹${savingsAmount.toLocaleString()} (${Math.round(savingsPercent)}%)`,
    route: routeSteps,
    alternativeRoutes,
    tips,
    vehicleType,
    coordinates: {
      origin: originCoords,
      destination: destCoords,
    },
  };
}

// Generate route steps with waypoints
function generateRouteSteps(
  origin: string,
  destination: string,
  originCoords: LocationCoordinates,
  destCoords: LocationCoordinates,
  distanceKm: number,
  durationMinutes: number
): RouteStep[] {
  const steps: RouteStep[] = [];
  
  // Start point
  steps.push({
    step: 1,
    location: origin,
    coordinates: originCoords,
    time: '0 mins',
    action: 'Pickup',
  });
  
  // Calculate number of intermediate stops based on distance
  const numStops = distanceKm > 300 ? 3 : distanceKm > 150 ? 2 : 1;
  
  // Generate intermediate waypoints
  for (let i = 1; i <= numStops; i++) {
    const progress = i / (numStops + 1);
    const stepTime = Math.round(durationMinutes * progress);
    const stepDistance = Math.round(distanceKm * progress);
    
    // Interpolate coordinates
    const lat = originCoords.lat + (destCoords.lat - originCoords.lat) * progress;
    const lng = originCoords.lng + (destCoords.lng - originCoords.lng) * progress;
    
    let action = 'Highway Route';
    let location = `Via NH-${Math.floor(Math.random() * 100) + 1}`;
    
    if (i === Math.floor(numStops / 2) + 1) {
      action = 'Rest Stop';
      location = `Rest Area - ${stepDistance} km`;
    }
    
    steps.push({
      step: i + 1,
      location,
      coordinates: { lat, lng },
      time: `${stepTime} mins`,
      action,
      distance: `${stepDistance} km from start`,
    });
  }
  
  // End point
  steps.push({
    step: steps.length + 1,
    location: destination,
    coordinates: destCoords,
    time: `${Math.round(durationMinutes)} mins`,
    action: 'Delivery',
  });
  
  return steps;
}

// Generate alternative routes
function generateAlternativeRoutes(
  distanceKm: number,
  durationMinutes: number,
  baseCost: number
): AlternativeRoute[] {
  const routes: AlternativeRoute[] = [];
  
  // Fastest Route (current route)
  const hours = Math.floor(durationMinutes / 60);
  const mins = Math.round(durationMinutes % 60);
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  
  routes.push({
    name: 'Fastest Route (Recommended)',
    distance: `${Math.round(distanceKm)} km`,
    time: timeStr,
    cost: `₹${baseCost.toLocaleString()}`,
  });
  
  // Cheapest Route (longer but cheaper)
  const cheaperDistance = Math.round(distanceKm * 1.15);
  const cheaperTime = Math.round(durationMinutes * 1.25);
  const cheaperCost = Math.round(baseCost * 0.85);
  const cheaperHours = Math.floor(cheaperTime / 60);
  const cheaperMins = Math.round(cheaperTime % 60);
  const cheaperTimeStr = cheaperHours > 0 ? `${cheaperHours}h ${cheaperMins}m` : `${cheaperMins}m`;
  
  routes.push({
    name: 'Cheapest Route',
    distance: `${cheaperDistance} km`,
    time: cheaperTimeStr,
    cost: `₹${cheaperCost.toLocaleString()}`,
    savings: `₹${(baseCost - cheaperCost).toLocaleString()}`,
  });
  
  // Balanced Route
  const balancedDistance = Math.round(distanceKm * 1.08);
  const balancedTime = Math.round(durationMinutes * 1.12);
  const balancedCost = Math.round(baseCost * 0.92);
  const balancedHours = Math.floor(balancedTime / 60);
  const balancedMins = Math.round(balancedTime % 60);
  const balancedTimeStr = balancedHours > 0 ? `${balancedHours}h ${balancedMins}m` : `${balancedMins}m`;
  
  routes.push({
    name: 'Balanced Route',
    distance: `${balancedDistance} km`,
    time: balancedTimeStr,
    cost: `₹${balancedCost.toLocaleString()}`,
  });
  
  return routes;
}

// Generate route tips
function generateRouteTips(distanceKm: number, durationMinutes: number): string[] {
  const tips: string[] = [];
  
  // Time-based tips
  const currentHour = new Date().getHours();
  if (currentHour >= 8 && currentHour <= 10) {
    tips.push('⚠️ Morning rush hour - Expect delays in city areas');
  } else if (currentHour >= 17 && currentHour <= 19) {
    tips.push('⚠️ Evening rush hour - Consider starting after 7 PM');
  } else {
    tips.push('✓ Good time to travel - Light traffic expected');
  }
  
  // Distance-based tips
  if (distanceKm > 200) {
    tips.push('🛑 Long journey - Plan for rest stops every 2-3 hours');
    tips.push('⛽ Fuel up before starting - Limited stations on highways');
  }
  
  // Weather tip (simulated)
  const weatherConditions = ['Clear', 'Partly Cloudy', 'Light Rain', 'Foggy'];
  const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  if (weather === 'Clear' || weather === 'Partly Cloudy') {
    tips.push(`☀️ ${weather} weather - Good conditions for transport`);
  } else if (weather === 'Light Rain') {
    tips.push('🌧️ Light rain expected - Drive carefully');
  } else {
    tips.push('🌫️ Foggy conditions - Reduce speed and use headlights');
  }
  
  // Toll tip
  tips.push('💳 FASTag recommended for faster toll passage');
  
  // Route optimization tip
  tips.push('🤖 AI-optimized route avoids traffic and construction zones');
  
  return tips;
}

// Track shipment in real-time (simulated live tracking)
export interface ShipmentTrackingData {
  orderId: string;
  currentLocation: LocationCoordinates;
  currentLocationName: string;
  origin: LocationCoordinates;
  originName: string;
  destination: LocationCoordinates;
  destinationName: string;
  status: 'in_transit' | 'at_rest' | 'delivered';
  progress: number; // 0-100
  estimatedArrival: string;
  distanceRemaining: string;
  timeRemaining: string;
  lastUpdated: string;
  route: LocationCoordinates[];
  currentSpeed: number; // km/h
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
}

// Get live tracking data for a shipment
export async function getLiveTrackingData(orderId: string, origin: string, destination: string): Promise<ShipmentTrackingData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const originCoords = await geocodeLocation(origin);
  const destCoords = await geocodeLocation(destination);
  
  if (!originCoords || !destCoords) {
    throw new Error('Unable to geocode locations');
  }
  
  // Simulate shipment progress (random for demo, would be real-time in production)
  const progress = Math.random() * 100;
  
  // Calculate current location based on progress
  const currentLat = originCoords.lat + (destCoords.lat - originCoords.lat) * (progress / 100);
  const currentLng = originCoords.lng + (destCoords.lng - originCoords.lng) * (progress / 100);
  const currentLocation: LocationCoordinates = { lat: currentLat, lng: currentLng };
  
  const totalDistance = calculateDistance(originCoords, destCoords);
  const distanceRemaining = Math.round(totalDistance * (1 - progress / 100));
  
  // Calculate time remaining (assume 60 km/h average speed)
  const timeRemainingHours = distanceRemaining / 60;
  const timeRemainingMins = Math.round(timeRemainingHours * 60);
  
  // Generate route path
  const route: LocationCoordinates[] = [];
  for (let i = 0; i <= 10; i++) {
    const p = i / 10;
    route.push({
      lat: originCoords.lat + (destCoords.lat - originCoords.lat) * p,
      lng: originCoords.lng + (destCoords.lng - originCoords.lng) * p,
    });
  }
  
  // Determine status
  let status: 'in_transit' | 'at_rest' | 'delivered' = 'in_transit';
  if (progress >= 99) {
    status = 'delivered';
  } else if (Math.random() > 0.8) {
    status = 'at_rest';
  }
  
  // Calculate estimated arrival
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + timeRemainingMins * 60000);
  
  return {
    orderId,
    currentLocation,
    currentLocationName: `${distanceRemaining} km from destination`,
    origin: originCoords,
    originName: origin,
    destination: destCoords,
    destinationName: destination,
    status,
    progress: Math.round(progress),
    estimatedArrival: arrivalTime.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    distanceRemaining: `${distanceRemaining} km`,
    timeRemaining: timeRemainingHours >= 1 
      ? `${Math.floor(timeRemainingHours)}h ${timeRemainingMins % 60}m`
      : `${timeRemainingMins}m`,
    lastUpdated: now.toLocaleString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    route,
    currentSpeed: status === 'in_transit' ? 50 + Math.random() * 30 : 0,
    vehicleNumber: `GJ-${Math.floor(Math.random() * 30)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
    driverName: ['Raj Kumar', 'Suresh Patel', 'Vijay Singh', 'Ramesh Sharma'][Math.floor(Math.random() * 4)],
    driverPhone: '+91 98765-43210',
  };
}