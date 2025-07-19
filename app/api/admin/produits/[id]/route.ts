// ============================================
// app/api/admin/produits/[id]/route.ts - Modifier/Supprimer Produit
// ============================================

import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'salon-admin-secret-key-change-me'

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) throw new Error('Token manquant')

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') throw new Error('Accès refusé')
    return decoded
  } catch (error) {
    throw new Error('Token invalide')
  }
}

// PUT - Modifier un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const body = await request.json()
    
    const produit = await Produit.findByIdAndUpdate(
      params.id,
      {
        ...body,
        prix: parseFloat(body.prix),
        stock: parseInt(body.stock),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
    
    if (!produit) {
      return Response.json({
        success: false,
        error: 'Produit non trouvé'
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      data: produit,
      message: 'Produit modifié avec succès'
    })
    
  } catch (error: any) {
    console.error('Erreur modification produit:', error)
    
    if (error.message.includes('Token')) {
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

// DELETE - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const produit = await Produit.findByIdAndDelete(params.id)
    
    if (!produit) {
      return Response.json({
        success: false,
        error: 'Produit non trouvé'
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      message: 'Produit supprimé avec succès'
    })
    
  } catch (error: any) {
    console.error('Erreur suppression produit:', error)
    
    if (error.message.includes('Token')) {
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

// GET - Récupérer un produit spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const produit = await Produit.findById(params.id).lean()
    
    if (!produit) {
      return Response.json({
        success: false,
        error: 'Produit non trouvé'
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      data: produit
    })
    
  } catch (error: any) {
    console.error('Erreur récupération produit:', error)
    
    if (error.message.includes('Token')) {
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
