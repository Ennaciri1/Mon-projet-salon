'use client'
import { useStore } from '@/store/useStore'

export default function PanierPage() {
  const { panier, modifierQuantite, retirerDuPanier, viderPanier, totalPanier } = useStore()

  const tva = 20
  const totalHT = totalPanier()
  const montantTVA = totalHT * (tva / 100)
  const totalTTC = totalHT + montantTVA

  if (panier.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Votre panier est vide
            </h2>
            <button 
              onClick={() => window.location.href = '/catalogue'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              🛒 Mon Panier
            </h1>
            <button 
              onClick={() => window.location.href = '/catalogue'}
              className="text-blue-600 hover:underline"
            >
              ← Continuer les achats
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des articles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Articles ({panier.reduce((total, item) => total + item.quantite, 0)})
                  </h2>
                  <button
                    onClick={viderPanier}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {panier.map(item => (
                  <div key={item.produit._id} className="p-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                        {item.produit.images[0] ? (
                          <img 
                            src={item.produit.images[0]} 
                            alt={item.produit.nom}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.produit.nom}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.produit.categorie}
                        </p>
                        
                        {/* Options */}
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="text-xs text-gray-500 mb-2">
                            {item.options.couleur && <span>Couleur: {item.options.couleur} </span>}
                            {item.options.personnalisation && <span>Personnalisé </span>}
                            {item.options.urgence && <span className="text-red-500">Urgent </span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantité */}
                          <div className="flex items-center border rounded">
                            <button 
                              onClick={() => modifierQuantite(item.produit._id!, item.quantite - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 min-w-[50px] text-center">
                              {item.quantite}
                            </span>
                            <button 
                              onClick={() => modifierQuantite(item.produit._id!, item.quantite + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Prix */}
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {(item.produit.prix * item.quantite).toFixed(2)} DH
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.produit.prix.toFixed(2)} DH / unité
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => retirerDuPanier(item.produit._id!)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total HT:</span>
                  <span>{totalHT.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({tva}%):</span>
                  <span>{montantTVA.toFixed(2)} DH</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total TTC:</span>
                  <span>{totalTTC.toFixed(2)} DH</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/checkout'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Passer la commande
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                💬 Commande envoyée par WhatsApp/Email<br/>
                📞 Devis personnalisé gratuit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}