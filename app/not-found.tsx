import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        href="/"
        className="bg-brand-pink2 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
      >
        Return Home
      </Link>
    </div>
  );
}
