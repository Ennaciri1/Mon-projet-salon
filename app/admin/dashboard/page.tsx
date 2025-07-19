'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Composant FormulaireProduit intégré
function FormulaireProduit({ produit, onSuccess }: { produit?: any, onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    nom: produit?.nom || '',
    description: produit?.description || '',
    prix: produit?.prix || '',
    categorie: produit?.categorie || 'stands',
    stock: produit?.stock || '',
    caracteristiques: {
      dimensions: produit?.caracteristiques?.dimensions || '',
      materiau: produit?.caracteristiques?.materiau || '',
      couleur: produit?.caracteristiques?.couleur || '',
      poids: produit?.caracteristiques?.poids || ''
    },
    actif: produit?.actif ?? true
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagesPreview, setImagesPreview] = useState<string[]>(produit?.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { value: 'stands', label: 'Stands & Structures' },
    { value: 'roll-up', label: 'Roll-up & Kakémonos' },
    { value: 'salon-beaute', label: 'Salon Beauté' },
    { value: 'accessoires', label: 'Accessoires & PLV' },
    { value: 'eclairage', label: 'Éclairage & Digital' }
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + imagesPreview.length > 5) {
      alert('Maximum 5 images autorisées')
      return
    }

    setImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagesPreview(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const supprimerImage = (index: number) => {
    setImagesPreview(prev => prev.filter((_, i) => i !== index))
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return imagesPreview

    const uploadedUrls: string[] = []

    for (const image of images) {
      const formData = new FormData()
      formData.append('file', image)

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        })

        const data = await response.json()
        if (data.success) {
          uploadedUrls.push(data.url)
        }
      } catch (error) {
        console.error('Erreur upload image:', error)
      }
    }

    return [...imagesPreview.filter(url => url.startsWith('http') || url.startsWith('/')), ...uploadedUrls]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const imageUrls = await uploadImages()

      const produitData = {
        ...formData,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        images: imageUrls
      }

      const url = produit ? `/api/admin/produits/${produit._id}` : '/api/admin/produits'
      const method = produit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(produitData)
      })

      const data = await response.json()

      if (data.success) {
        alert(produit ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès !')
        if (onSuccess) onSuccess()
        
        if (!produit) {
          setFormData({
            nom: '', description: '', prix: '', categorie: 'stands', stock: '',
            caracteristiques: { dimensions: '', materiau: '', couleur: '', poids: '' },
            actif: true
          })
          setImages([])
          setImagesPreview([])
        }
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      setError('Erreur technique')
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {produit ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Stand Modulaire Premium 3x3m"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              value={formData.categorie}
              onChange={(e) => setFormData({...formData, categorie: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description détaillée du produit..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (DH) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.prix}
              onChange={(e) => setFormData({...formData, prix: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.actif ? 'true' : 'false'}
              onChange={(e) => setFormData({...formData, actif: e.target.value === 'true'})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
              <input
                type="text"
                value={formData.caracteristiques.dimensions}
                onChange={(e) => setFormData({
                  ...formData,
                  caracteristiques: { ...formData.caracteristiques, dimensions: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 3m x 3m x 2.5m"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matériau</label>
              <input
                type="text"
                value={formData.caracteristiques.materiau}
                onChange={(e) => setFormData({
                  ...formData,
                  caracteristiques: { ...formData.caracteristiques, materiau: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Aluminium anodisé"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
              <input
                type="text"
                value={formData.caracteristiques.couleur}
                onChange={(e) => setFormData({
                  ...formData,
                  caracteristiques: { ...formData.caracteristiques, couleur: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Blanc/Gris"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poids</label>
              <input
                type="text"
                value={formData.caracteristiques.poids}
                onChange={(e) => setFormData({
                  ...formData,
                  caracteristiques: { ...formData.caracteristiques, poids: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 45kg"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Images du Produit</h3>
          
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB (Max 5 images)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {imagesPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {imagesPreview.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => supprimerImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </div>
            ) : (
              produit ? 'Modifier le Produit' : 'Ajouter le Produit'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

interface StatCard {
  title: string
  value: string | number
  change: string
  icon: string
  color: string
}

interface Produit {
  _id: string
  nom: string
  prix: number
  stock: number
  categorie: string
  actif: boolean
  createdAt: string
}

interface Commande {
  _id: string
  client: {
    nom: string
    email: string
  }
  totalTTC: number
  statut: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [produits, setProduits] = useState<Produit[]>([])
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [stats, setStats] = useState<StatCard[]>([])
  const [ongletActif, setOngletActif] = useState('apercu')

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      // Charger produits
      const resProduits = await fetch('/api/produits')
      const dataProduits = await resProduits.json()
      
      // Charger commandes  
      const resCommandes = await fetch('/api/commandes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const dataCommandes = await resCommandes.json()

      if (dataProduits.success) setProduits(dataProduits.data)
      if (dataCommandes.success) setCommandes(dataCommandes.data)

      // Calculer les statistiques
      const totalProduits = dataProduits.data?.length || 0
      const totalCommandes = dataCommandes.data?.length || 0
      const chiffreAffaires = dataCommandes.data?.reduce((sum: number, cmd: Commande) => sum + cmd.totalTTC, 0) || 0
      const commandesEnAttente = dataCommandes.data?.filter((cmd: Commande) => cmd.statut === 'nouveau').length || 0

      setStats([
        {
          title: 'Total Produits',
          value: totalProduits,
          change: '+12%',
          icon: '📦',
          color: 'bg-blue-500'
        },
        {
          title: 'Commandes Totales',
          value: totalCommandes,
          change: '+8%',
          icon: '🛒',
          color: 'bg-green-500'
        },
        {
          title: 'Chiffre d\'Affaires',
          value: `${chiffreAffaires.toFixed(0)} DH`,
          change: '+15%',
          icon: '💰',
          color: 'bg-purple-500'
        },
        {
          title: 'En Attente',
          value: commandesEnAttente,
          change: 'Nouveau',
          icon: '⏳',
          color: 'bg-orange-500'
        }
      ])

    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const deconnexion = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const supprimerProduit = async (id: string) => {
    if (!confirm('Confirmer la suppression ?')) return

    try {
      const response = await fetch(`/api/admin/produits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })

      if (response.ok) {
        chargerDonnees() // Recharger les données
        alert('Produit supprimé !')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold">🔧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-500">Gestion du site SalonPro</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-gray-500 hover:text-gray-700"
              >
                🌐 Voir le site
              </Link>
              <button
                onClick={deconnexion}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation onglets */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'apercu', nom: 'Aperçu', icon: '📊' },
              { id: 'produits', nom: 'Produits', icon: '📦' },
              { id: 'commandes', nom: 'Commandes', icon: '🛒' },
              { id: 'ajouter', nom: 'Ajouter Produit', icon: '➕' }
            ].map(onglet => (
              <button
                key={onglet.id}
                onClick={() => setOngletActif(onglet.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  ongletActif === onglet.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{onglet.icon}</span>
                {onglet.nom}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        
        {/* ONGLET APERÇU */}
        {ongletActif === 'apercu' && (
          <div className="space-y-8">
            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setOngletActif('ajouter')}
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-semibold">Ajouter un Produit</div>
                </button>
                
                <button
                  onClick={() => setOngletActif('commandes')}
                  className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-semibold">Gérer les Commandes</div>
                </button>
                
                <Link
                  href="/"
                  target="_blank"
                  className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-semibold">Voir le Site</div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET PRODUITS */}
        {ongletActif === 'produits' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Gestion des Produits ({produits.length})
                </h2>
                <button
                  onClick={() => setOngletActif('ajouter')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ➕ Nouveau Produit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produits.map(produit => (
                    <tr key={produit._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{produit.nom}</div>
                        <div className="text-sm text-gray-500">ID: {produit._id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{produit.categorie}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{produit.prix} DH</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{produit.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          produit.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {produit.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Modifier</button>
                          <button 
                            onClick={() => supprimerProduit(produit._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET COMMANDES */}
        {ongletActif === 'commandes' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Commandes Récentes ({commandes.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commandes.slice(0, 10).map(commande => (
                    <tr key={commande._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{commande.client.nom}</div>
                        <div className="text-sm text-gray-500">{commande.client.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{commande.totalTTC.toFixed(2)} DH</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          commande.statut === 'nouveau' ? 'bg-yellow-100 text-yellow-800' :
                          commande.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {commande.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(commande.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-900">Voir détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ONGLET AJOUTER PRODUIT */}
        {ongletActif === 'ajouter' && (
          <FormulaireProduit onSuccess={chargerDonnees} />
        )}
      </div>
    </div>
  )
}