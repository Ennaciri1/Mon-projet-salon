'use client'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

interface FormData {
  client: {
    nom: string
    telephone: string
    email: string
    entreprise: string
    adresse: {
      rue: string
      ville: string
      codePostal: string
      pays: string
    }
  }
  messageClient: string
  typeCommande: 'devis' | 'commande'
  urgence: boolean
  dateEvenement: string
  lieuEvenement: string
}

export default function CheckoutPage() {
  const { panier, totalPanier, viderPanier } = useStore()
  const [etape, setEtape] = useState(1) // 1: Info client, 2: Détails commande, 3: Confirmation
  const [chargement, setChargement] = useState(false)
  const [erreurs, setErreurs] = useState<any>({})
  
  const [formData, setFormData] = useState<FormData>({
    client: {
      nom: '',
      telephone: '',
      email: '',
      entreprise: '',
      adresse: {
        rue: '',
        ville: '',
        codePostal: '',
        pays: 'Maroc'
      }
    },
    messageClient: '',
    typeCommande: 'devis',
    urgence: false,
    dateEvenement: '',
    lieuEvenement: ''
  })

  // Calculs
  const totalHT = totalPanier()
  const tva = 20
  const montantTVA = totalHT * (tva / 100)
  const totalTTC = totalHT + montantTVA

  // Validation
  const validerEtape1 = () => {
    const erreurs: any = {}
    
    if (!formData.client.nom.trim()) erreurs.nom = 'Le nom est requis'
    if (!formData.client.telephone.trim()) erreurs.telephone = 'Le téléphone est requis'
    if (!formData.client.email.trim()) erreurs.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(formData.client.email)) erreurs.email = 'Email invalide'
    
    setErreurs(erreurs)
    return Object.keys(erreurs).length === 0
  }

  const suivantEtape = () => {
    if (etape === 1 && validerEtape1()) {
      setEtape(2)
    } else if (etape === 2) {
      setEtape(3)
    }
  }

  const envoyerCommande = async () => {
    setChargement(true)
    
    try {
      const commandeData = {
        ...formData,
        produits: panier.map(item => ({
          produitId: item.produit._id,
          nom: item.produit.nom,
          prix: item.produit.prix,
          quantite: item.quantite,
          options: item.options
        })),
        totalHT,
        tva,
        totalTTC,
        statut: formData.typeCommande === 'devis' ? 'nouveau' : 'nouveau'
      }

      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commandeData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Envoyer par WhatsApp/Email
        if (formData.typeCommande === 'devis') {
          envoyerWhatsApp(result.data)
        } else {
          envoyerEmail(result.data)
        }
        
        viderPanier()
        setEtape(4) // Page de succès
      } else {
        alert('Erreur: ' + result.error)
      }
    } catch (error) {
      console.error('Erreur envoi commande:', error)
      alert('Erreur technique, veuillez réessayer')
    } finally {
      setChargement(false)
    }
  }

  const envoyerWhatsApp = (commande: any) => {
    const message = genererMessageWhatsApp(commande)
    const whatsappUrl = `https://wa.me/212522123456?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const envoyerEmail = (commande: any) => {
    const sujet = `Nouvelle commande #${commande._id}`
    const corps = genererMessageEmail(commande)
    const emailUrl = `mailto:contact@salonpro.ma?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
    window.location.href = emailUrl
  }

  const genererMessageWhatsApp = (commande: any) => {
    let message = `🛒 *NOUVELLE ${formData.typeCommande.toUpperCase()}*\n\n`
    message += `👤 *Client:* ${formData.client.nom}\n`
    message += `🏢 *Entreprise:* ${formData.client.entreprise || 'Non renseigné'}\n`
    message += `📞 *Téléphone:* ${formData.client.telephone}\n`
    message += `📧 *Email:* ${formData.client.email}\n\n`
    
    message += `📦 *PRODUITS:*\n`
    panier.forEach(item => {
      message += `• ${item.produit.nom} (x${item.quantite}) - ${(item.produit.prix * item.quantite).toFixed(2)} DH\n`
    })
    
    message += `\n💰 *TOTAL:* ${totalTTC.toFixed(2)} DH TTC\n`
    
    if (formData.dateEvenement) {
      message += `📅 *Date événement:* ${formData.dateEvenement}\n`
    }
    
    if (formData.lieuEvenement) {
      message += `📍 *Lieu:* ${formData.lieuEvenement}\n`
    }
    
    if (formData.messageClient) {
      message += `\n💬 *Message:* ${formData.messageClient}\n`
    }
    
    return message
  }

  const genererMessageEmail = (commande: any) => {
    // Version plus détaillée pour email
    return genererMessageWhatsApp(commande) + '\n\n---\nEnvoyé via SalonPro.ma'
  }

  if (panier.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Votre panier est vide
          </h2>
          <Link
            href="/catalogue"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {formData.typeCommande === 'devis' ? 'Demande de Devis' : 'Finaliser la Commande'}
          </h1>
          
          {/* Progress bar */}
          <div className="mt-6 flex items-center">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  etape >= num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {etape > num ? '✓' : num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-1 mx-2 ${etape > num ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 flex text-sm text-gray-600">
            <span className={etape >= 1 ? 'text-blue-600 font-medium' : ''}>
              Informations
            </span>
            <span className="mx-8">
              <span className={etape >= 2 ? 'text-blue-600 font-medium' : ''}>
                Détails
              </span>
            </span>
            <span className={etape >= 3 ? 'text-blue-600 font-medium' : ''}>
              Confirmation
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulaire */}
          <div className="lg:col-span-2">
            {etape === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Vos informations</h2>
                
                {/* Type de demande */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type de demande
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="devis"
                        checked={formData.typeCommande === 'devis'}
                        onChange={(e) => setFormData({...formData, typeCommande: e.target.value as 'devis'})}
                        className="mr-2"
                      />
                      <span>💬 Demande de devis (gratuit)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="commande"
                        checked={formData.typeCommande === 'commande'}
                        onChange={(e) => setFormData({...formData, typeCommande: e.target.value as 'commande'})}
                        className="mr-2"
                      />
                      <span>🛒 Commande ferme</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom / Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.client.nom}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {...formData.client, nom: e.target.value}
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        erreurs.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom complet"
                    />
                    {erreurs.nom && <p className="text-red-500 text-sm mt-1">{erreurs.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.client.telephone}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {...formData.client, telephone: e.target.value}
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        erreurs.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+212 6XX XXX XXX"
                    />
                    {erreurs.telephone && <p className="text-red-500 text-sm mt-1">{erreurs.telephone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.client.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {...formData.client, email: e.target.value}
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        erreurs.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="votre@email.com"
                    />
                    {erreurs.email && <p className="text-red-500 text-sm mt-1">{erreurs.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.client.entreprise}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {...formData.client, entreprise: e.target.value}
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de livraison
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.client.adresse.rue}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          adresse: {...formData.client.adresse, rue: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Rue, avenue..."
                    />
                    <input
                      type="text"
                      value={formData.client.adresse.ville}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          adresse: {...formData.client.adresse, ville: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ville"
                    />
                    <input
                      type="text"
                      value={formData.client.adresse.codePostal}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          adresse: {...formData.client.adresse, codePostal: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Code postal"
                    />
                    <select
                      value={formData.client.adresse.pays}
                      onChange={(e) => setFormData({
                        ...formData,
                        client: {
                          ...formData.client,
                          adresse: {...formData.client.adresse, pays: e.target.value}
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Maroc">Maroc</option>
                      <option value="Algérie">Algérie</option>
                      <option value="Tunisie">Tunisie</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={suivantEtape}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            )}

            {etape === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Détails de votre projet</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de l'événement
                    </label>
                    <input
                      type="date"
                      value={formData.dateEvenement}
                      onChange={(e) => setFormData({...formData, dateEvenement: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu de l'événement
                    </label>
                    <input
                      type="text"
                      value={formData.lieuEvenement}
                      onChange={(e) => setFormData({...formData, lieuEvenement: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du lieu, adresse..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.urgence}
                        onChange={(e) => setFormData({...formData, urgence: e.target.checked})}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-700">
                        🚨 Commande urgente (livraison sous 24-48h) - Supplément possible
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message ou demandes spéciales
                    </label>
                    <textarea
                      value={formData.messageClient}
                      onChange={(e) => setFormData({...formData, messageClient: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Précisez vos besoins, couleurs préférées, dimensions spéciales..."
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setEtape(1)}
                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={suivantEtape}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            )}

            {etape === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Confirmation</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Informations client</h3>
                    <p><strong>Nom:</strong> {formData.client.nom}</p>
                    <p><strong>Email:</strong> {formData.client.email}</p>
                    <p><strong>Téléphone:</strong> {formData.client.telephone}</p>
                    {formData.client.entreprise && <p><strong>Entreprise:</strong> {formData.client.entreprise}</p>}
                  </div>

                  {formData.dateEvenement && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Détails événement</h3>
                      <p><strong>Date:</strong> {formData.dateEvenement}</p>
                      {formData.lieuEvenement && <p><strong>Lieu:</strong> {formData.lieuEvenement}</p>}
                      {formData.urgence && <p className="text-orange-600"><strong>⚠️ Commande urgente</strong></p>}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {formData.typeCommande === 'devis' ? '💬 Demande de devis' : '🛒 Commande'}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {formData.typeCommande === 'devis' 
                      ? 'Votre demande sera envoyée par WhatsApp. Nous vous répondrons sous 24h avec un devis personnalisé.'
                      : 'Votre commande sera envoyée par email. Nous vous contacterons pour confirmer les détails et le mode de paiement.'
                    }
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setEtape(2)}
                    className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={envoyerCommande}
                    disabled={chargement}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                  >
                    {chargement ? 'Envoi...' : formData.typeCommande === 'devis' ? '📱 Envoyer le devis' : '📧 Envoyer la commande'}
                  </button>
                </div>
              </div>
            )}

            {etape === 4 && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-semibold text-green-600 mb-4">
                  {formData.typeCommande === 'devis' ? 'Devis envoyé !' : 'Commande envoyée !'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formData.typeCommande === 'devis' 
                    ? 'Votre demande de devis a été envoyée par WhatsApp. Nous vous répondrons sous 24h.'
                    : 'Votre commande a été envoyée par email. Nous vous contacterons rapidement.'
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/catalogue"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Continuer les achats
                  </Link>
                  <Link
                    href="/"
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Résumé</h2>
              
              <div className="space-y-3 mb-6">
                {panier.map(item => (
                  <div key={item.produit._id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.produit.nom}</div>
                      <div className="text-gray-500">Qté: {item.quantite}</div>
                    </div>
                    <div className="font-medium">
                      {(item.produit.prix * item.quantite).toFixed(2)} DH
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Sous-total HT:</span>
                  <span>{totalHT.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA ({tva}%):</span>
                  <span>{montantTVA.toFixed(2)} DH</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total TTC:</span>
                  <span>{totalTTC.toFixed(2)} DH</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <h3 className="font-medium text-gray-800 mb-2">À savoir:</h3>
                <ul className="space-y-1">
                  <li>• Devis gratuit sous 24h</li>
                  <li>• Vérification fichiers incluse</li>
                  <li>• Livraison 48-72h</li>
                  <li>• Support technique inclus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}