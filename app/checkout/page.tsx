'use client';

import { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import supabase from '../../lib/supabaseClient';

const ChaiFormSkeleton = () => (
  <div className='relative w-full h-full animate-pulse space-y-8 flex flex-col justify-center'>
    {/* Shipping Address Skeleton */}
    <div className='space-y-4'>
      <div className='h-6 w-1/3 bg-white/50 rounded'></div> {/* Label */}
      <div className='h-12 w-full bg-white/30 rounded'></div> {/* Input */}
      <div className='h-12 w-full bg-white/30 rounded'></div> {/* Input */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='h-12 w-full bg-white/30 rounded'></div> {/* City */}
        <div className='h-12 w-full bg-white/30 rounded'></div> {/* ZIP */}
      </div>
    </div>
    {/* Payment Skeleton */}
    <div className='space-y-4'>
       <div className='h-6 w-1/4 bg-white/50 rounded'></div> {/* Label */}
       <div className='h-48 w-full bg-white/30 rounded border border-white/20'></div> {/* Payment Element Placeholder */}
    </div>
    {/* Pay Button Skeleton */}
    <div className='h-12 w-full bg-amber-200/50 rounded'></div>
  </div>
);

// Define types for safety
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

// Load Stripe outside of a component's render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);



/**
 * Main Checkout Page Component
 * Renders a split-screen, modern checkout flow.
 */
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // On component mount, load cart and create a payment intent
  useEffect(() => {
    let items: CartItem[] = [];
    
    // 1. Load from Local Storage First (Fastest)
    try {
      const rawCart = localStorage.getItem('amor_cart');
      if (rawCart) {
        items = JSON.parse(rawCart);
        setCartItems(items); // Show immediately
      }
    } catch (e) {
      console.error('Local cart error:', e);
    }

    // 2. Background Sync with Supabase (Latest Truth)
    const syncSupabaseCart = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('user_cart')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });
            
            if (!error && data) {
                 const dbItems: CartItem[] = data.map((dbItem: any) => ({
                    id: dbItem.product_id,
                    name: dbItem.product_name,
                    price: parseFloat(dbItem.product_price),
                    image: dbItem.product_image,
                    qty: dbItem.quantity,
                 }));

                 // If Supabase has more/different items, update state AND local storage
                 if (dbItems.length > items.length || JSON.stringify(dbItems) !== JSON.stringify(items)) {
                     console.log('Syncing cart from Supabase...');
                     setCartItems(dbItems);
                     localStorage.setItem('amor_cart', JSON.stringify(dbItems));
                     return dbItems; // Return new items for payment intent
                 }
            }
        }
        return items; // Return local items if no update
    };

    // 3. Initialize Payment Intent (using the freshest items)
    syncSupabaseCart().then((finalItems) => {
        if (finalItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        const timeoutId = setTimeout(() => {
             setInitError('Connection timed out. Please refresh.');
        }, 15000); // 15s timeout
        
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: finalItems }),
        })
        .then(async (res) => {
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('Failed to initialize payment system.');
            return res.json();
        })
        .then((data) => {
            if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            } else {
            setInitError(data.error || 'Failed to initialize payment.');
            }
        })
        .catch((err) => {
            clearTimeout(timeoutId);
            setInitError('Failed to load payment system.');
            console.error(err);
        });
    });

  }, []);

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return <div className="p-8 text-center text-red-500">Stripe is not configured.</div>;
  }
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Safely define options only when clientSecret is available
  const options: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance: { theme: 'stripe' },
  } : undefined;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-start">
      {/* Left Column: Order Summary */}
      <div className="w-full lg:w-[45%] bg-gray-50 border-r border-gray-200 lg:min-h-screen flex flex-col px-8 py-12 lg:sticky lg:top-0">
        <div className="max-w-md mx-auto w-full">
            <img src="/assets/logo.png" alt="Amor Chai Logo" className="h-12 mb-8" />
            <h1 className="text-xl font-semibold mb-6">Order Summary</h1>
            {cartItems.length > 0 ? (
                 <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <img src="/assets/icons/Visa.png" alt="Visa" className="h-8 w-auto object-contain" />
                        <img src="/assets/icons/Mastercard.png" alt="Mastercard" className="h-8 w-auto object-contain" />
                        <img src="/assets/icons/Amex.png" alt="American Express" className="h-8 w-auto object-contain" />
                        <img src="/assets/icons/ApplePay.png" alt="Apple Pay" className="h-8 w-auto object-contain" />
                        <img src="/assets/icons/GooglePay.png" alt="Google Pay" className="h-8 w-auto object-contain" />
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 font-medium">
                            <div className="flex items-center gap-1">
                                <span>🔒</span> Secure SSL Encryption
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🛡️</span> Buyer Protection
                            </div>
                            <div className="flex items-center gap-1">
                                <span>🚚</span> Local Delivery (Cape Girardeau)
                            </div>
                        </div>
                    </div>
                </div>
            ) : <p className="text-gray-500">{!error ? 'Loading cart...' : 'Your cart is empty.'}</p>
            }
        </div>
      </div>

      {/* Right Column: Payment Form */}
      <div className={`w-full lg:w-[55%] min-h-screen flex flex-col px-8 py-12 lg:overflow-y-auto transition-colors duration-700 ${!clientSecret ? 'bg-gradient-to-br from-matcha-lightest to-matcha-darkest' : 'bg-white'}`}>
        <div className="w-full max-w-md mx-auto h-full">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {initError ? (
                <div className="h-full flex flex-col justify-center items-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to load checkout</h3>
                        <p className="text-gray-600 text-sm mb-6">{initError}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            ) : clientSecret && options ? (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            ) : !error && (
                 <div className="h-full flex flex-col justify-center">
                    <ChaiFormSkeleton />
                 </div>
            )}
        </div>
      </div>
    </div>
  );
}

/**
 * The actual payment form component with conditional geofencing and loading states.
 */
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Geofencing states
  const [isCheckingZone, setIsCheckingZone] = useState(false);
  const [isOutsideZone, setIsOutsideZone] = useState(false);
  const [addressDetails, setAddressDetails] = useState<any>(null);

  // Local state to track when PaymentElement is fully rendered
  const [isStripeReady, setIsStripeReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || isOutsideZone || isCheckingZone) return;

    setIsProcessing(true);
    setIsCheckingZone(true);

    // 1. Validate Address Zone First
    try {
        const response = await fetch('/api/verify-delivery-zone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: addressDetails }),
        });
        const data = await response.json();
        
        if (!data.allowed) {
            setIsOutsideZone(true);
            setIsProcessing(false);
            setIsCheckingZone(false);
            return; // Stop payment
        }
    } catch {
         setIsOutsideZone(true);
         setIsProcessing(false); 
         setIsCheckingZone(false);
         return;
    }
    setIsCheckingZone(false);

    // 2. Proceed to Payment if Zone is Valid
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/return` },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsProcessing(false);
  };
  
  const handleAddressChange = (event: { complete: boolean; value: { address: any } }) => {
    if (event.complete) {
        setAddressDetails(event.value.address);
        if (isOutsideZone) setIsOutsideZone(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6 relative">
      
      {/* 1. Address Section - ALWAYS VISIBLE */}
      <div>
        <h3 className="text-base font-semibold mb-2">Shipping Address</h3>
        <AddressElement options={{ mode: 'shipping' }} onChange={handleAddressChange} />
      </div>

      {/* 2. Conditional Section: Error Card OR Payment Form */}
      <div className="relative min-h-[300px]">
        {isOutsideZone ? (
            <div className="space-y-4 animate-fade-in mt-6">
              <div className="text-red-600 text-sm font-semibold text-center">
                  We currently only deliver within 10 miles of Cape Girardeau via the website.
              </div>
              
              {/* Sales Pitch Card */}
              <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center space-y-3">
                  <p className="text-sm text-gray-800">
                      Still want to feel the flavors loved by many? We might still be able to make it happen! Contact us on Instagram to arrange a special delivery.
                  </p>
                  <a 
                      href="https://www.instagram.com/drinkamorchai/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                      <img src="/assets/instagram.png" alt="Instagram" className="w-5 h-5" />
                      <span>Contact us</span>
                  </a>
              </div>
            </div>
        ) : (
          <>
            {/* SKELETON LAYER: Visible only while Stripe is initializing */}
            {(!isStripeReady || !stripe || !elements) && (
              <div className="absolute inset-0 z-10 bg-white pt-2">
                   {/* Only show the bottom half of the skeleton (payment part) */}
                   <div className='w-full animate-pulse space-y-8'>
                      <div className='space-y-4'>
                        <div className='h-6 w-1/4 bg-gray-200 rounded'></div> 
                        <div className='h-48 w-full bg-gray-100 rounded border border-gray-200'></div>
                      </div>
                      <div className='h-12 w-full bg-amber-200 rounded opacity-50'></div>
                  </div>
              </div>
            )}

            {/* REAL FORM LAYER: Hidden until ready, then fades in */}
            <div className={!isStripeReady ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100 animate-in fade-in duration-500'}>
                <div>
                  <h3 className="text-base font-semibold mb-2">Payment</h3>
                  <PaymentElement id="payment-element" onReady={() => setIsStripeReady(true)} />
                </div>

                <div className="relative mt-6">
                  {/* Shimmer Effect for Pay Button Area */}
                  {isCheckingZone && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                          <div className="w-full h-full animate-pulse bg-gray-100/50 rounded-md"></div>
                      </div>
                  )}
                  
                  <button 
                      disabled={isProcessing || !stripe || !elements || isCheckingZone} 
                      id="submit" 
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                      <span id="button-text">{isProcessing ? <div className="spinner"></div> : "Pay now"}</span>
                  </button>
                </div>
                
                {message && <div id="payment-message" className="text-red-500 mt-2 text-center text-sm">{message}</div>}
              </div>
          </>
        )}
      </div>
    </form>
  );
}
