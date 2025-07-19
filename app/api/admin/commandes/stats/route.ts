
// ============================================
// app/api/admin/commandes/stats/route.ts - Statistiques Commandes
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

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()

    const maintenant = new Date()
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1)
    const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0)
    
    // Statistiques générales
    const totalCommandes = await Commande.countDocuments()
    const commandesMoisActuel = await Commande.countDocuments({
      createdAt: { $gte: debutMois, $lte: finMois }
    })
    
    const chiffreAffairesTotal = await Commande.aggregate([
      { $group: { _id: null, total: { $sum: '$totalTTC' } } }
    ])
    
    const chiffreAffairesMois = await Commande.aggregate([
      {
        $match: {
          createdAt: { $gte: debutMois, $lte: finMois }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalTTC' } } }
    ])
    
    // Répartition par statut
    const repartitionStatuts = await Commande.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
          total: { $sum: '$totalTTC' }
        }
      }
    ])
    
    // Évolution mensuelle (12 derniers mois)
    const evoluionMensuelle = await Commande.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(maintenant.getFullYear() - 1, maintenant.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          commandes: { $sum: 1 },
          chiffreAffaires: { $sum: '$totalTTC' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
    
    // Top 5 clients
    const topClients = await Commande.aggregate([
      {
        $group: {
          _id: '$client.email',
          nom: { $first: '$client.nom' },
          commandes: { $sum: 1 },
          total: { $sum: '$totalTTC' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ])
    
    // Panier moyen
    const panierMoyen = totalCommandes > 0 
      ? (chiffreAffairesTotal[0]?.total || 0) / totalCommandes 
      : 0
    
    return Response.json({
      success: true,
      data: {
        apercu: {
          totalCommandes,
          commandesMoisActuel,
          chiffreAffairesTotal: chiffreAffairesTotal[0]?.total || 0,
          chiffreAffairesMois: chiffreAffairesMois[0]?.total || 0,
          panierMoyen: panierMoyen
        },
        repartitionStatuts,
        evoluionMensuelle,
        topClients
      }
    })

  } catch (error: any) {
    console.error('Erreur statistiques commandes:', error)
    
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
