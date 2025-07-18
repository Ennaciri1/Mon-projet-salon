import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Commande from '@/models/Commande'
import Produit from '@/models/Produit'

// POST - Créer commande
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()
    
    const body = await request.json()
    
    // Validation et calcul des totaux
    let totalHT = 0
    const produitsValides = []
    
    for (const item of body.produits) {
      const produit = await Produit.findById(item.produitId)
      
      if (!produit) {
        return Response.json({
          success: false,
          error: `Produit ${item.produitId} non trouvé`
        }, { status: 400 })
      }
      
      const sousTotal = produit.prix * item.quantite
      totalHT += sousTotal
      
      produitsValides.push({
        produitId: item.produitId,
        nom: produit.nom,
        prix: produit.prix,
        quantite: item.quantite,
        options: item.options || {}
      })
    }
    
    const tva = body.tva || 20
    const totalTTC = totalHT * (1 + tva / 100)
    
    const commandeData = {
      client: body.client,
      produits: produitsValides,
      totalHT: Math.round(totalHT * 100) / 100,
      tva: tva,
      totalTTC: Math.round(totalTTC * 100) / 100,
      messageClient: body.messageClient || '',
      statut: 'nouveau'
    }
    
    const commande = await Commande.create(commandeData)
    
    // TODO: Envoyer email de confirmation
    console.log('✅ Nouvelle commande créée:', commande._id)
    
    return Response.json({
      success: true,
      data: commande,
      message: 'Commande créée avec succès'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erreur création commande:', error)
    
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

// GET - Récupérer commandes (admin)
export async function GET() {
  try {
    await connectMongoDB()
    
    const commandes = await Commande.find()
      .populate('produits.produitId', 'nom images')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
    
    return Response.json({
      success: true,
      data: commandes
    })
    
  } catch (error) {
    console.error('Erreur récupération commandes:', error)
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}