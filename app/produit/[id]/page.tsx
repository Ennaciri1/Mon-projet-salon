'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Commande {
  _id: string
  client: {
    nom: string
    telephone: string
    email: string
    entreprise?: string
    adresse?: {
      rue?: string
      ville?: string
      codePostal?: string
      pays?: string
    }
  }
  produits: {
    produitId: string
    nom: string
    prix: number
    quantite: number
    options?: {
      couleur?: string
      personnalisation?: string
      urgence?: boolean
    }
  }[]
  totalHT: number
  tva: number
  totalTTC: number
  statut: string
  messageClient?: string
  notesInternes?: string
  dateEvenement?: string
  lieuEvenement?: string
  urgence?: boolean
  createdAt: string
  updatedAt: string
}

export default function CommandeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statutEnCours, setStatutEnCours] = useState('')
  const [notesInternes, setNotesInternes] = useState('')
  const [modificationEnCours, setModificationEnCours] = useState(false)

  const statuts = [
    { value: 'nouveau', label: 'Nouveau', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'devis_envoye', label: 'Devis envoyé', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirme', label: 'Confirmé', color: 'bg-green-100 text-green-800' },
    { value: 'en_production', label: 'En production', color: 'bg-purple-100 text-purple-800' },
    { value: 'expedie', label: 'Expédié', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'livre', label: 'Livré', color: 'bg-green-100 text-green-800' },
    { value: 'annule', label: 'Annulé', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    chargerCommande()
  }, [params.id])

  const chargerCommande = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/commandes/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setCommande(data.data)
        setStatutEnCours(data.data.statut)
        setNotesInternes(data.data.notesInternes || '')
      } else {
        setError(data.error || 'Commande non trouvée')
      }
    } catch (error) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const mettreAJourStatut = async () => {
    setModificationEnCours(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/commandes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          statut: statutEnCours,
          notesInternes: notesInternes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCommande(data.data)
        alert('Commande mise à jour avec succès !')
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      alert('Erreur technique')
    } finally {
      setModificationEnCours(false)
    }
  }

  const envoyerEmail = () => {
    if (!commande) return
    
    const sujet = `Mise à jour commande #${commande._id.slice(-6)}`
    const corps = `Bonjour ${commande.client.nom},\n\nVotre commande a été mise à jour.\nStatut actuel: ${statutEnCours}\n\nCordialement,\nL'équipe SalonPro`
    
    window.open(`mailto:${commande.client.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`)
  }

  const envoyerWhatsApp = () => {
    if (!commande) return
    
    const message = `🛒 Mise à jour commande #${commande._id.slice(-6)}\n\nBonjour ${commande.client.nom},\n\nStatut: ${statutEnCours}\nTotal: ${commande.totalTTC.toFixed(2)} DH\n\nMerci de votre confiance !\nSalonPro`
    
    // Nettoyer le numéro de téléphone
    const tel = commande.client.telephone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(message)}`)
  }

  const imprimerCommande = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (error || !commande) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">{error}</h2>
          <Link
            href="/admin/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  const statutActuel = statuts.find(s => s.value === commande.statut)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Commande #{commande._id.slice(-6)}
                </h1>
                <p className="text-sm text-gray-500">
                  Créée le {new Date(commande.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={imprimerCommande}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                🖨️ Imprimer
              </button>
              <button
                onClick={envoyerEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                📧 Email
              </button>
              <button
                onClick={envoyerWhatsApp}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Détails commande */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Informations client */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Nom:</strong> {commande.client.nom}</div>
                    <div><strong>Email:</strong> {commande.client.email}</div>
                    <div><strong>Téléphone:</strong> {commande.client.telephone}</div>
                    {commande.client.entreprise && (
                      <div><strong>Entreprise:</strong> {commande.client.entreprise}</div>
                    )}
                  </div>
                </div>

                {commande.client.adresse && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Adresse</h3>
                    <div className="space-y-1 text-sm">
                      {commande.client.adresse.rue && <div>{commande.client.adresse.rue}</div>}
                      {commande.client.adresse.ville && (
                        <div>
                          {commande.client.adresse.codePostal} {commande.client.adresse.ville}
                        </div>
                      )}
                      {commande.client.adresse.pays && <div>{commande.client.adresse.pays}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Détails événement */}
            {(commande.dateEvenement || commande.lieuEvenement) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Détails Événement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {commande.dateEvenement && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Date</h3>
                      <p className="text-sm">{new Date(commande.dateEvenement).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                  {commande.lieuEvenement && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Lieu</h3>
                      <p className="text-sm">{commande.lieuEvenement}</p>
                    </div>
                  )}
                </div>
                {commande.urgence && (
                  <div className="mt-4 bg-orange-100 border border-orange-200 rounded-lg p-3">
                    <div className="text-orange-800 font-semibold">🚨 Commande Urgente</div>
                  </div>
                )}
              </div>
            )}

            {/* Produits commandés */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Produits Commandés</h2>
              <div className="space-y-4">
                {commande.produits.map((produit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{produit.nom}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          Quantité: {produit.quantite} × {produit.prix.toFixed(2)} DH
                        </div>
                        
                        {produit.options && Object.keys(produit.options).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            {produit.options.couleur && <span>Couleur: {produit.options.couleur} </span>}
                            {produit.options.personnalisation && <span>Personnalisé </span>}
                            {produit.options.urgence && <span className="text-orange-600">Urgent </span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {(produit.prix * produit.quantite).toFixed(2)} DH
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total HT:</span>
                    <span>{commande.totalHT.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA ({commande.tva}%):</span>
                    <span>{(commande.totalTTC - commande.totalHT).toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total TTC:</span>
                    <span>{commande.totalTTC.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message client */}
            {commande.messageClient && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Message du Client</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{commande.messageClient}</p>
                </div>
              </div>
            )}
          </div>

          {/* Gestion statut */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion Commande</h2>

              {/* Statut actuel */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut actuel
                </label>
                <div className={`inline-flex px-3 py-2 rounded-full text-sm font-semibold ${statutActuel?.color}`}>
                  {statutActuel?.label}
                </div>
              </div>

              {/* Changer statut */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modifier le statut
                </label>
                <select
                  value={statutEnCours}
                  onChange={(e) => setStatutEnCours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statuts.map(statut => (
                    <option key={statut.value} value={statut.value}>
                      {statut.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes internes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes internes
                </label>
                <textarea
                  value={notesInternes}
                  onChange={(e) => setNotesInternes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes pour l'équipe..."
                />
              </div>

              {/* Bouton mise à jour */}
              <button
                onClick={mettreAJourStatut}
                disabled={modificationEnCours}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {modificationEnCours ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </div>
                ) : (
                  'Mettre à jour'
                )}
              </button>

              {/* Informations supplémentaires */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Informations</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ID Commande:</span>
                    <span className="font-mono text-xs">{commande._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créée:</span>
                    <span>{new Date(commande.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifiée:</span>
                    <span>{new Date(commande.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}