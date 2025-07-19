// ============================================
// app/api/admin/commandes/route.ts - Liste Commandes Admin
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

// GET - Récupérer toutes les commandes pour admin
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const statut = searchParams.get('statut')
    const dateDebut = searchParams.get('dateDebut')
    const dateFin = searchParams.get('dateFin')
    
    // Construire le filtre
    let filter: any = {}
    
    if (statut && statut !== 'all') {
      filter.statut = statut
    }
    
    if (dateDebut && dateFin) {
      filter.createdAt = {
        $gte: new Date(dateDebut),
        $lte: new Date(dateFin)
      }
    }
    
    // Pagination
    const skip = (page - 1) * limit
    
    // Récupérer les commandes avec pagination
    const commandes = await Commande.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('produits.produitId', 'nom images')
      .lean()
    
    // Compter le total pour la pagination
    const total = await Commande.countDocuments(filter)
    
    // Statistiques rapides
    const stats = await Commande.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
          total: { $sum: '$totalTTC' }
        }
      }
    ])
    
    return Response.json({
      success: true,
      data: commandes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats
    })
    
  } catch (error: any) {
    console.error('Erreur récupération commandes admin:', error)
    
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