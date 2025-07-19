import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Identifiants admin (en production, utiliser variables d'environnement)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'salon2024', // À changer !
}

const JWT_SECRET = process.env.JWT_SECRET || 'salon-admin-secret-key-change-me'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Vérifier les identifiants
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Créer un token JWT
      const token = jwt.sign(
        { 
          username: username,
          role: 'admin',
          iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return Response.json({
        success: true,
        token: token,
        message: 'Connexion réussie'
      })
    } else {
      return Response.json({
        success: false,
        error: 'Identifiants incorrects'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Erreur auth admin:', error)
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}

// Vérifier le token admin
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return Response.json({
        success: false,
        error: 'Token manquant'
      }, { status: 401 })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    return Response.json({
      success: true,
      user: {
        username: decoded.username,
        role: decoded.role
      }
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Token invalide'
    }, { status: 401 })
  }
}