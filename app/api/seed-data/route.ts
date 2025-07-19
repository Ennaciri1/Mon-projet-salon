// app/api/seed-data/route.ts - Pour initialiser avec des données de test
import { NextRequest } from 'next/server'
import connectMongoDB from '@/lib/mongodb'
import Produit from '@/models/Produit'

const produitsTest = [
  {
    nom: "Stand Modulaire Premium 3x3m",
    description: "Stand modulaire professionnel en aluminium, idéal pour salons et expositions. Structure robuste et design moderne avec panneaux personnalisables.",
    prix: 2500.00,
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "stands",
    stock: 15,
    caracteristiques: {
      dimensions: "3m x 3m x 2.5m",
      materiau: "Aluminium anodisé",
      couleur: "Blanc/Gris",
      poids: "45kg"
    },
    actif: true
  },
  {
    nom: "Roll-up Premium 85x200cm",
    description: "Roll-up haute qualité avec impression HD. Base stable et enrouleur silencieux. Idéal pour présentation et communication événementielle.",
    prix: 350.00,
    images: [
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "roll-up",
    stock: 50,
    caracteristiques: {
      dimensions: "85cm x 200cm",
      materiau: "Aluminium + PVC",
      couleur: "Base argentée",
      poids: "3.2kg"
    },
    actif: true
  },
  {
    nom: "Présentoir Cosmétiques Rotatif",
    description: "Présentoir rotatif 360° pour produits cosmétiques. 4 niveaux ajustables, éclairage LED intégré. Parfait pour salons de beauté.",
    prix: 1200.00,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "salon-beaute",
    stock: 8,
    caracteristiques: {
      dimensions: "Ø80cm x 180cm",
      materiau: "Métal laqué + Verre",
      couleur: "Blanc brillant",
      poids: "25kg"
    },
    actif: true
  },
  {
    nom: "Kakémono Textile 100x200cm",
    description: "Kakémono en textile haute qualité avec structure X-banner. Impression recto-verso possible. Transport facilité par housse incluse.",
    prix: 180.00,
    images: [
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "roll-up",
    stock: 30,
    caracteristiques: {
      dimensions: "100cm x 200cm",
      materiau: "Textile polyester + Fibre de carbone",
      couleur: "Support noir",
      poids: "2.1kg"
    },
    actif: true
  },
  {
    nom: "Comptoir d'Accueil Courbe",
    description: "Comptoir d'accueil design avec structure courbe. Plateau en stratifié haute pression, rangements intégrés. Montage facile sans outils.",
    prix: 950.00,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "accessoires",
    stock: 12,
    caracteristiques: {
      dimensions: "120cm x 60cm x 110cm",
      materiau: "Stratifié HPL + Aluminium",
      couleur: "Blanc/Argent",
      poids: "28kg"
    },
    actif: true
  },
  {
    nom: "Éclairage LED Professionnel",
    description: "Kit d'éclairage LED haute performance. 4 projecteurs orientables, intensité variable, télécommande incluse. Idéal pour mettre en valeur vos produits.",
    prix: 680.00,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "eclairage",
    stock: 20,
    caracteristiques: {
      dimensions: "Projecteur: 15cm x 12cm",
      materiau: "Aluminium + LED CREE",
      couleur: "Noir mat",
      poids: "1.8kg par projecteur"
    },
    actif: true
  },
  {
    nom: "Stand Octanorm 4x2m",
    description: "Stand système Octanorm professionnel. Structure modulaire extensible, panneaux blancs inclus. Référence dans l'événementiel.",
    prix: 1800.00,
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "stands",
    stock: 6,
    caracteristiques: {
      dimensions: "4m x 2m x 2.5m",
      materiau: "Aluminium Octanorm + Panneaux MDF",
      couleur: "Blanc RAL 9010",
      poids: "85kg"
    },
    actif: true
  },
  {
    nom: "Salon de Manucure Complet",
    description: "Station de manucure complète avec table ergonomique, aspirateur intégré, éclairage LED et tabourets assortis. Tout inclus pour démarrer.",
    prix: 2200.00,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "salon-beaute",
    stock: 4,
    caracteristiques: {
      dimensions: "120cm x 50cm x 75cm",
      materiau: "MDF laqué + Verre trempé",
      couleur: "Blanc/Chrome",
      poids: "45kg"
    },
    actif: true
  },
  {
    nom: "Porte-brochures 4 Cases",
    description: "Présentoir porte-brochures format A4, 4 cases transparentes. Base lestée pour stabilité, design épuré et moderne.",
    prix: 120.00,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "accessoires",
    stock: 40,
    caracteristiques: {
      dimensions: "25cm x 35cm x 160cm",
      materiau: "Plexiglas + Base métal",
      couleur: "Transparent/Chromé",
      poids: "3.5kg"
    },
    actif: true
  },
  {
    nom: "Écran Digital 43\" + Support",
    description: "Écran professionnel 43 pouces avec support mobile. Idéal pour affichage dynamique et présentations. Logiciel de gestion inclus.",
    prix: 1500.00,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "eclairage",
    stock: 8,
    caracteristiques: {
      dimensions: "43 pouces (108cm)",
      materiau: "LCD + Support acier",
      couleur: "Noir",
      poids: "12kg + 15kg support"
    },
    actif: true
  },
  {
    nom: "Roll-up Économique 60x160cm",
    description: "Roll-up entrée de gamme, parfait pour débuter. Impression de qualité, montage simple et transport facile avec housse.",
    prix: 85.00,
    images: [
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "roll-up",
    stock: 80,
    caracteristiques: {
      dimensions: "60cm x 160cm",
      materiau: "Aluminium + Bâche PVC",
      couleur: "Base argentée",
      poids: "2.8kg"
    },
    actif: true
  },
  {
    nom: "Fauteuil Salon VIP Cuir",
    description: "Fauteuil haut de gamme en cuir véritable pour salons VIP. Réglable en hauteur, pivotant 360°, base chromée élégante.",
    prix: 800.00,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&h=600"
    ],
    categorie: "salon-beaute",
    stock: 15,
    caracteristiques: {
      dimensions: "70cm x 70cm x 95-105cm",
      materiau: "Cuir véritable + Chrome",
      couleur: "Noir ou Blanc",
      poids: "18kg"
    },
    actif: true
  }
]

export async function POST() {
  try {
    await connectMongoDB()
    
    // Vérifier si des produits existent déjà
    const count = await Produit.countDocuments()
    
    if (count === 0) {
      // Insérer les produits de test
      const produits = await Produit.insertMany(produitsTest)
      
      return Response.json({
        success: true,
        message: `${produits.length} produits de test créés avec succès`,
        data: produits
      })
    } else {
      return Response.json({
        success: true,
        message: `${count} produits déjà présents en base`,
        data: []
      })
    }
    
  } catch (error: any) {
    console.error('Erreur seed data:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}


// Mise à jour du store pour inclure le compteur de panier dans le header
