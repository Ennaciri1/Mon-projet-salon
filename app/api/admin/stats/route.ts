
// ============================================
// app/api/admin/stats/route.ts - Statistiques Dashboard
// ============================================

import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'
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

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()

    // Statistiques produits
    const totalProduits = await Produit.countDocuments()
    const produitsActifs = await Produit.countDocuments({ actif: true })
    const produitsStock = await Produit.countDocuments({ stock: { $gt: 0 } })

    // Statistiques commandes
    const totalCommandes = await Commande.countDocuments()
    const commandesNouveaux = await Commande.countDocuments({ statut: 'nouveau' })
    
    // Chiffre d'affaires
    const chiffreAffaires = await Commande.aggregate([
      { $group: { _id: null, total: { $sum: '$totalTTC' } } }
    ])

    // Commandes par mois (6 derniers mois)
    const sixMoisAgo = new Date()
    sixMoisAgo.setMonth(sixMoisAgo.getMonth() - 6)
    
    const commandesParMois = await Commande.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMoisAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          total: { $sum: '$totalTTC' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Top 5 produits les plus commandés
    const topProduits = await Commande.aggregate([
      { $unwind: '$produits' },
      {
        $group: {
          _id: '$produits.produitId',
          nom: { $first: '$produits.nom' },
          quantite: { $sum: '$produits.quantite' },
          revenus: { $sum: { $multiply: ['$produits.prix', '$produits.quantite'] } }
        }
      },
      { $sort: { quantite: -1 } },
      { $limit: 5 }
    ])

    return Response.json({
      success: true,
      data: {
        produits: {
          total: totalProduits,
          actifs: produitsActifs,
          enStock: produitsStock,
          inactifs: totalProduits - produitsActifs
        },
        commandes: {
          total: totalCommandes,
          nouveaux: commandesNouveaux,
          chiffreAffaires: chiffreAffaires[0]?.total || 0
        },
        graphiques: {
          commandesParMois,
          topProduits
        }
      }
    })

  } catch (error: any) {
    console.error('Erreur statistiques:', error)
    
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
