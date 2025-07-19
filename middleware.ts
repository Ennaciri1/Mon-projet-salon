// middleware.ts - À créer à la racine du projet
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'salon-admin-secret-key-change-me'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protéger les routes admin (sauf login)
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    // Récupérer le token depuis les headers ou cookies
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('admin_token')?.value
    const token = authHeader?.replace('Bearer ', '') || cookieToken

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Vérifier la validité du token
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Token valide, continuer
      return NextResponse.next()
    } catch (error) {
      // Token invalide, rediriger vers login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protéger les APIs admin
  if (pathname.startsWith('/api/admin') && !pathname.includes('/auth')) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token manquant' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Accès refusé' },
          { status: 403 }
        )
      }

      // Ajouter l'utilisateur au header pour les APIs
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-data', JSON.stringify(decoded))

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}