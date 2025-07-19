// ============================================
// app/api/admin/produits/route.ts - CRUD Produits Admin
// ============================================

import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'salon-admin-secret-key-change-me'

// Vérifier le token admin
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw new Error('Token manquant')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') {
      throw new Error('Accès refusé')
    }
    return decoded
  } catch (error) {
    throw new Error('Token invalide')
  }
}

// POST - Ajouter un produit (Admin seulement)
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    verifyAdminToken(request)
    
    await connectMongoDB()
    
    const body = await request.json()
    
    // Valider les données requises
    if (!body.nom || !body.prix || !body.categorie) {
      return Response.json({
        success: false,
        error: 'Nom, prix et catégorie sont requis'
      }, { status: 400 })
    }

    // Créer le produit
    const produit = await Produit.create({
      ...body,
      prix: parseFloat(body.prix),
      stock: parseInt(body.stock) || 0,
      actif: body.actif !== false // Par défaut true
    })
    
    return Response.json({
      success: true,
      data: produit,
      message: 'Produit créé avec succès'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erreur création produit admin:', error)
    
    if (error.message === 'Token manquant' || error.message === 'Token invalide' || error.message === 'Accès refusé') {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 401 })
    }
    
    if (error.name === 'ValidationError') {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 })
    }
    
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}

// GET - Lister tous les produits pour admin (même inactifs)
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    verifyAdminToken(request)
    
    await connectMongoDB()
    
    const produits = await Produit.find({}) // Tous les produits, même inactifs
      .sort({ createdAt: -1 })
      .lean()
    
    return Response.json({
      success: true,
      data: produits,
      count: produits.length
    })
    
  } catch (error: any) {
    console.error('Erreur récupération produits admin:', error)
    
    if (error.message === 'Token manquant' || error.message === 'Token invalide' || error.message === 'Accès refusé') {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 401 })
    }
    
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}


