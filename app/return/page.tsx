'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * A shared component to provide a consistent, centered layout for status messages.
 */
const StatusLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
    <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg max-w-md w-full">
      {children}
    </div>
  </div>
);

/**
 * The UI shown when a payment is successful.
 */
const SuccessUI = () => (
  <>
    <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h1>
    <p className="text-gray-600 mb-8">
      Thank you for your purchase! We&apos;ve received your order and are getting it ready.
    </p>
    <Link href="/products" className="bg-brand-pink2 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
      Continue Shopping
    </Link>
  </>
);

/**
 * The UI shown while the payment status is being fetched or is processing.
 */
const ProcessingUI = ({ message }: { message: string }) => (
  <>
    <h1 className="text-2xl font-bold text-gray-800 mb-4">{message}</h1>
    <p className="text-gray-600">Please wait while we confirm your payment.</p>
  </>
);

/**
 * The UI shown when there's a payment error.
 */
const ErrorUI = ({ message }: { message: string }) => (
   <>
    <div className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
       <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Payment Failed</h1>
    <p className="text-gray-600 mb-8">{message}</p>
    <Link href="/checkout" className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
      Try Again
    </Link>
  </>
);


/**
 * The main logic for the return page. It must be a separate component
 * because `useSearchParams` must be used within a `<Suspense>` boundary.
 */
function ReturnPageLogic() {
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Loading...');
  const searchParams = useSearchParams();
  const clientSecret = searchParams?.get('payment_intent_client_secret');

  useEffect(() => {
    if (!clientSecret) {
      setStatus('error');
      setMessage('Could not find payment details. Please contact us if you have been charged.');
      return;
    }

    fetch(`/api/payment-intent-status?payment_intent_client_secret=${clientSecret}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('error');
          setMessage(data.error);
        } else {
          setStatus(data.status);
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('An error occurred while checking payment status.');
      });
  }, [clientSecret]);

  if (status === 'succeeded') {
    return <StatusLayout><SuccessUI /></StatusLayout>;
  }

  if (status === 'processing') {
    return <StatusLayout><ProcessingUI message="Payment Processing" /></StatusLayout>;
  }
  
  if (status === 'requires_payment_method' || status === 'error') {
     return <StatusLayout><ErrorUI message={message || 'Your payment was not successful. Please try again.'} /></StatusLayout>;
  }

  return <StatusLayout><ProcessingUI message={message} /></StatusLayout>;
}


/**
 * The main export for the page, which wraps the logic component in a Suspense boundary.
 * This is required by Next.js when using `useSearchParams`.
 */
export default function ReturnPage() {
    return (
        <Suspense fallback={<StatusLayout><ProcessingUI message="Loading..." /></StatusLayout>}>
            <ReturnPageLogic />
        </Suspense>
    );
}