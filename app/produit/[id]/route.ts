// app/api/produits/[id]/route.ts
import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    
  } catch (error) {
    console.error('Erreur API produit:', error)
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}
