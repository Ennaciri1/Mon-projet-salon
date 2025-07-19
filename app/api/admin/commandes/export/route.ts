// ============================================
// app/api/admin/commandes/export/route.ts - Export Commandes
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

// GET - Exporter les commandes en CSV
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    await connectMongoDB()
    
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const dateDebut = searchParams.get('dateDebut')
    const dateFin = searchParams.get('dateFin')
    
    // Construire le filtre
    let filter: any = {}
    
    if (dateDebut && dateFin) {
      filter.createdAt = {
        $gte: new Date(dateDebut),
        $lte: new Date(dateFin)
      }
    }
    
    // Récupérer les commandes
    const commandes = await Commande.find(filter)
      .sort({ createdAt: -1 })
      .lean()
    
    if (format === 'csv') {
      // Générer le CSV
      const headers = [
        'ID Commande',
        'Date',
        'Client',
        'Email',
        'Téléphone',
        'Entreprise',
        'Total HT',
        'TVA',
        'Total TTC',
        'Statut',
        'Nb Produits'
      ]
      
      const csvContent = [
        headers.join(';'),
        ...commandes.map(cmd => [
          cmd._id,
          new Date(cmd.createdAt).toLocaleDateString('fr-FR'),
          cmd.client.nom,
          cmd.client.email,
          cmd.client.telephone,
          cmd.client.entreprise || '',
          cmd.totalHT.toFixed(2),
          cmd.tva,
          cmd.totalTTC.toFixed(2),
          cmd.statut,
          cmd.produits.length
        ].join(';'))
      ].join('\n')
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="commandes_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    // Format JSON par défaut
    return Response.json({
      success: true,
      data: commandes,
      count: commandes.length
    })
    
  } catch (error: any) {
    console.error('Erreur export commandes:', error)
    
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
