import { NextResponse } from 'next/server';

export function middleware(request) {
    const hostname = request.headers.get('host');

    // Check if the hostname is exactly the vercel.app subdomain we want to redirect
    // We use strict equality to avoid redirecting other preview branches (e.g. dev-branch.vercel.app)
    if (hostname === 'drinkamorchai.vercel.app') {
        const url = request.nextUrl.clone();
        url.hostname = 'drinkamorchai.store';
        url.protocol = 'https';
        url.port = ''; // Ensure we don't accidentally carry over a port

        return NextResponse.redirect(url, 301); // 301 Permanent Redirect
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
};
