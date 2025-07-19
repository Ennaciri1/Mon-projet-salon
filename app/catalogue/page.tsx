'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { IProduit } from '@/types'
import Link from 'next/link'

// Composant Filtres Avancés
function FiltresAvances() {
  const { categorieActive, setCategorieActive, rechercheTexte, setRechercheTexte } = useStore()
  const [filtresOuverts, setFiltresOuverts] = useState(false)
  const [filtresPrix, setFiltresPrix] = useState({ min: '', max: '' })
  const [triActuel, setTriActuel] = useState('recent')

  const categories = [
    { id: 'all', nom: 'Tous nos produits', count: '500+' },
    { id: 'stands', nom: 'Stands & Structures', count: '120+' },
    { id: 'roll-up', nom: 'Roll-up & Kakémonos', count: '50+' },
    { id: 'salon-beaute', nom: 'Salon Beauté', count: '80+' },
    { id: 'accessoires', nom: 'Accessoires & PLV', count: '200+' },
    { id: 'eclairage', nom: 'Éclairage & Digital', count: '30+' }
  ]

  const optionsTri = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'prix-asc', label: 'Prix croissant' },
    { value: 'prix-desc', label: 'Prix décroissant' },
    { value: 'nom', label: 'Nom A-Z' },
    { value: 'populaire', label: 'Plus populaires' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Barre de recherche */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit, une référence..."
              value={rechercheTexte}
              onChange={(e) => setRechercheTexte(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={triActuel}
            onChange={(e) => setTriActuel(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {optionsTri.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setFiltresOuverts(!filtresOuverts)}
            className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Filtres {filtresOuverts ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categorieActive === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.nom}
              <span className="ml-2 text-xs opacity-75">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtres avancés */}
      {filtresOuverts && (
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Filtre prix */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Prix (DH)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filtresPrix.min}
                  onChange={(e) => setFiltresPrix({...filtresPrix, min: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filtresPrix.max}
                  onChange={(e) => setFiltresPrix({...filtresPrix, max: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Matériaux */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Matériaux</h4>
              <div className="space-y-2">
                {['Aluminium', 'PVC', 'Carton', 'Textile', 'Métal'].map(materiau => (
                  <label key={materiau} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">{materiau}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Dimensions</h4>
              <div className="space-y-2">
                {['60x160cm', '85x200cm', '100x200cm', '120x200cm', 'Sur mesure'].map(dimension => (
                  <label key={dimension} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">{dimension}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Appliquer les filtres
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant Card Produit Avancée
function CardProduitAvancee({ produit }: { produit: IProduit }) {
  const { ajouterAuPanier } = useStore()
  const [quantite, setQuantite] = useState(1)
  const [vueRapide, setVueRapide] = useState(false)

  const ajouterProduit = () => {
    ajouterAuPanier(produit, quantite)
    setQuantite(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image avec overlay */}
      <div className="relative h-64 overflow-hidden">
        {produit.images[0] ? (
          <img 
            src={produit.images[0]} 
            alt={produit.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">📦</span>
          </div>
        )}
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => setVueRapide(true)}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-100"
            >
              👁️ Vue rapide
            </button>
            <Link
              href={`/produit/${produit._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Voir détails
            </Link>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {produit.categorie}
          </span>
          {produit.stock < 5 && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Stock limité
            </span>
          )}
        </div>

        {/* Favori */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          ❤️
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
          {produit.nom}
        </h3>
        
        {produit.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {produit.description}
          </p>
        )}

        {/* Caractéristiques */}
        {produit.caracteristiques && (
          <div className="mb-4 space-y-1">
            {produit.caracteristiques.dimensions && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">📏</span>
                {produit.caracteristiques.dimensions}
              </div>
            )}
            {produit.caracteristiques.materiau && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">🔧</span>
                {produit.caracteristiques.materiau}
              </div>
            )}
          </div>
        )}

        {/* Prix et stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {produit.prix.toFixed(2)} DH
            </div>
            <div className="text-xs text-gray-500">
              HT • À partir de 1 unité
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Stock: {produit.stock}
            </div>
            <div className="text-xs text-green-600">
              ✓ Disponible
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <button 
              onClick={() => setQuantite(Math.max(1, quantite - 1))}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="px-3 py-2 min-w-[50px] text-center border-l border-r">
              {quantite}
            </span>
            <button 
              onClick={() => setQuantite(quantite + 1)}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
          
          <button
            onClick={ajouterProduit}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ajouter au panier
          </button>
        </div>

        {/* Boutons secondaires */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
            💬 Devis
          </button>
          <button className="flex-1 text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            📞 Conseil
          </button>
        </div>
      </div>
    </div>
  )
}

// Page principale catalogue
export default function CataloguePage() {
  const { produits, chargementProduits, chargerProduits, categorieActive } = useStore()
  const [vueGrille, setVueGrille] = useState(true)

  useEffect(() => {
    chargerProduits()
  }, [])

  const categorieNom = {
    'all': 'Tous nos produits',
    'stands': 'Stands & Structures',
    'roll-up': 'Roll-up & Kakémonos',
    'salon-beaute': 'Salon Beauté',
    'accessoires': 'Accessoires & PLV',
    'eclairage': 'Éclairage & Digital'
  }[categorieActive] || 'Produits'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">{categorieNom}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {categorieNom}
          </h1>
          <p className="text-gray-600">
            Découvrez notre sélection de produits professionnels pour vos salons et événements
          </p>
        </div>

        {/* Filtres */}
        <FiltresAvances />

        {/* Barre d'outils */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            {!chargementProduits && (
              <span>{produits.length} produit{produits.length > 1 ? 's' : ''} trouvé{produits.length > 1 ? 's' : ''}</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Affichage:</span>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setVueGrille(true)}
                className={`p-2 ${vueGrille ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setVueGrille(false)}
                className={`p-2 ${!vueGrille ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {chargementProduits && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        )}

        {/* Grille produits */}
        {!chargementProduits && (
          <>
            {produits.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📦</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos filtres ou de chercher avec d'autres mots-clés.
                </p>
                <Link
                  href="/test"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Ajouter des produits de test
                </Link>
              </div>
            ) : (
              <div className={`grid gap-6 ${vueGrille 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
              }`}>
                {produits.map(produit => (
                  <CardProduitAvancee key={produit._id} produit={produit} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {produits.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                ← Précédent
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}