import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID,
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY,
  auth: { mode: 'managed' },
});

// Sample bundles for public viewing (when not authenticated)
export const sampleBundles = [
  { id: 'sample-1', name: 'MTN Daily Bundle', network: 'MTN', dataAmount: '1GB', price: 5.00, category: 'Daily' },
  { id: 'sample-2', name: 'MTN Weekly Bundle', network: 'MTN', dataAmount: '5GB', price: 20.00, category: 'Weekly' },
  { id: 'sample-3', name: 'MTN Monthly Bundle', network: 'MTN', dataAmount: '10GB', price: 50.00, category: 'Monthly' },
  { id: 'sample-4', name: 'MTN Data Plus', network: 'MTN', dataAmount: '20GB', price: 90.00, category: 'Monthly' },
  { id: 'sample-5', name: 'Telecel Daily', network: 'Vodafone', dataAmount: '1GB', price: 5.50, category: 'Daily' },
  { id: 'sample-6', name: 'Telecel Weekly', network: 'Vodafone', dataAmount: '5GB', price: 22.00, category: 'Weekly' },
  { id: 'sample-7', name: 'Telecel Monthly', network: 'Vodafone', dataAmount: '10GB', price: 52.00, category: 'Monthly' },
  { id: 'sample-8', name: 'AirtelTigo Daily', network: 'AT', dataAmount: '1GB', price: 4.50, category: 'Daily' },
  { id: 'sample-9', name: 'AirtelTigo Weekly', network: 'AT', dataAmount: '5GB', price: 18.00, category: 'Weekly' },
  { id: 'sample-10', name: 'AirtelTigo Monthly', network: 'AT', dataAmount: '10GB', price: 48.00, category: 'Monthly' },
];
