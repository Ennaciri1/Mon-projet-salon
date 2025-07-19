// ============================================
// app/api/admin/commandes/[id]/route.ts - Détail et Modification Commande
// ============================================

import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Commande from '@/models/Commande'
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

// GET - Récupérer une commande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const commande = await Commande.findById(params.id)
      .populate('produits.produitId', 'nom images caracteristiques')
      .lean()
    
    if (!commande) {
      return Response.json({
        success: false,
        error: 'Commande non trouvée'
      }, { status: 404 })
    }
    
    return Response.json({
      success: true,
      data: commande
    })
    
  } catch (error: any) {
    console.error('Erreur récupération commande:', error)
    
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

// PUT - Modifier une commande (statut, notes, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const body = await request.json()
    const { statut, notesInternes, devis } = body
    
    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (statut) {
      updateData.statut = statut
    }
    
    if (notesInternes !== undefined) {
      updateData.notesInternes = notesInternes
    }
    
    if (devis) {
      updateData.devis = devis
    }
    
    updateData.updatedAt = new Date()
    
    const commande = await Commande.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('produits.produitId', 'nom images')
    
    if (!commande) {
      return Response.json({
        success: false,
        error: 'Commande non trouvée'
      }, { status: 404 })
    }
    
    // Log de l'action pour audit
    console.log(`Admin a modifié la commande ${params.id}: statut=${statut}`)
    
    return Response.json({
      success: true,
      data: commande,
      message: 'Commande mise à jour avec succès'
    })
    
  } catch (error: any) {
    console.error('Erreur modification commande:', error)
    
    if (error.message.includes('Token')) {
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

// DELETE - Supprimer une commande (si nécessaire)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const commande = await Commande.findByIdAndDelete(params.id)
    
    if (!commande) {
      return Response.json({
        success: false,
        error: 'Commande non trouvée'
      }, { status: 404 })
    }
    
    // Log de l'action pour audit
    console.log(`Admin a supprimé la commande ${params.id}`)
    
    return Response.json({
      success: true,
      message: 'Commande supprimée avec succès'
    })
    
  } catch (error: any) {
    console.error('Erreur suppression commande:', error)
    
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