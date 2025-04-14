import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const publicRoutes = ['/login', '/register']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path);
    const secret = Buffer.from(process.env.JWT_SECRET!, 'base64');
    let payload;

    const token = req.cookies.get("authToken")?.value ?? "";

    if (isPublicRoute) {
        return NextResponse.next();
    }

    try {
        const jwtVerifyRes = await jwtVerify(token, secret);
        payload = jwtVerifyRes.payload;
        console.log("Token verified. Payload:", payload)
    } catch (error) {
        console.log("Invalid token:", error)
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (!payload.exp || Math.ceil(Date.now() / 1000) > payload.exp) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}