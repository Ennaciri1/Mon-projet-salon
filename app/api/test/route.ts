// app/api/test/route.ts - Mise à jour pour utiliser les nouvelles données
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
      timestamp: new Date().toISOString(),
      info: count === 0 ? 'Utilisez POST /api/seed-data pour créer des produits de test' : 'Base de données initialisée'
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
    
    // Vérifier si des produits existent
    const count = await Produit.countDocuments()
    
    if (count > 0) {
      return Response.json({
        success: true,
        message: `Base déjà initialisée avec ${count} produits`,
        suggestion: 'Visitez /catalogue pour voir les produits'
      })
    }
    
    // Rediriger vers seed-data
    return Response.json({
      success: true,
      message: 'Aucun produit trouvé. Utilisez /api/seed-data pour initialiser la base',
      count: 0
    })
    
  } catch (error) {
    console.error('Erreur création test:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
