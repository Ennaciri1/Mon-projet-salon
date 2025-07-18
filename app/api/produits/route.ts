import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'

// GET - Récupérer produits
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()
    
    const { searchParams } = new URL(request.url)
    const categorie = searchParams.get('categorie')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let query: any = { actif: true }
    
    if (categorie && categorie !== 'all') {
      query.categorie = categorie
    }
    
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const produits = await Produit.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    
    return Response.json({
      success: true,
      data: produits,
      count: produits.length
    })
    
  } catch (error) {
    console.error('Erreur API produits:', error)
    return Response.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}

// POST - Ajouter produit (pour admin plus tard)
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()
    
    const body = await request.json()
    const produit = await Produit.create(body)
    
    return Response.json({
      success: true,
      data: produit,
      message: 'Produit créé avec succès'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Erreur création produit:', error)
    
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