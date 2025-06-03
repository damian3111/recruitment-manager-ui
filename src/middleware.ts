import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const publicRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const secret = Buffer.from(process.env.JWT_SECRET!, 'base64');
    let myCookieName1 = req.cookies.get('myCookieName');

    // Log all cookies and request headers for debugging
    // console.log("All cookies:", req.cookies.getAll());
    // console.log("Request headers:", Object.fromEntries(req.headers));
    console.log(myCookieName1);
    // console.log(req);
    console.log("req.headers");
    console.log(req.headers);
    // const token = req.cookies.get("authToken")?.value ?? "";
    const token = req.cookies.get("authToken")?.value ?? "";
    console.log("Cookies:", req.cookies.getAll());

    if (isPublicRoute) {
        console.log("Public route accessed:", path);
        return NextResponse.next();
    }

    if (!token) {
        console.log("No authToken cookie found, redirecting to /login");
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const jwtVerifyRes = await jwtVerify(token, secret);
        const payload = jwtVerifyRes.payload;
        console.log("Token verified. Payload:", payload);

        if (!payload.exp || Math.ceil(Date.now() / 1000) > payload.exp) {
            console.log("Token expired, redirecting to /login");
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.log("Invalid token:", error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
}
