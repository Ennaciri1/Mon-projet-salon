import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'

export async function GET() {
  try {
    await connectMongoDB()
    
    // Test de connexion
    const count = await Produit.countDocuments()
    
    return Response.json({
      success: true,
      message: 'MongoDB connecté avec succès!',
      produits_count: count,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erreur test:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    await connectMongoDB()
    
    // Créer un produit test
    const produitTest = await Produit.create({
      nom: 'Stand Test',
      description: 'Produit de test pour vérifier la connexion MongoDB',
      prix: 999.99,
      images: ['https://example.com/test.jpg'],
      categorie: 'stands',
      stock: 5,
      caracteristiques: {
        dimensions: '2m x 3m',
        materiau: 'Aluminium',
        couleur: 'Blanc'
      }
    })
    
    return Response.json({
      success: true,
      message: 'Produit test créé!',
      data: produitTest
    })
    
  } catch (error) {
    console.error('Erreur création test:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}