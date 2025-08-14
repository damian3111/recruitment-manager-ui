import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const publicRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/confirm-email/');
    const secret = Buffer.from(process.env.JWT_SECRET!, 'base64');
    const token = req.cookies.get("authToken")?.value ?? "";

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const jwtVerifyRes = await jwtVerify(token, secret);
        const payload = jwtVerifyRes.payload;

        if (!payload.exp || Math.ceil(Date.now() / 1000) > payload.exp) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next|.*\\..*).*)',
    ],
}
