// Composant FormulaireProduit - À intégrer dans le dashboard
'use client'
import { useState } from 'react'

interface FormulaireProduitProps {
  produit?: any // Pour la modification
  onSuccess?: () => void
}

export default function FormulaireProduit({ produit, onSuccess }: FormulaireProduitProps) {
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
    
    // Limiter à 5 images
    if (files.length + imagesPreview.length > 5) {
      alert('Maximum 5 images autorisées')
      return
    }

    setImages(prev => [...prev, ...files])

    // Créer des previews
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

    return [...imagesPreview.filter(url => url.startsWith('http')), ...uploadedUrls]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Upload des images
      const imageUrls = await uploadImages()

      // Préparer les données
      const produitData = {
        ...formData,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        images: imageUrls
      }

      // Envoyer au serveur
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
        
        // Reset formulaire si nouveau produit
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
        
        {/* Informations de base */}
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

        {/* Description */}
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

        {/* Prix et Stock */}
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

        {/* Caractéristiques */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matériau
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids
              </label>
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

        {/* Upload d'images */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Images du Produit</h3>
          
          {/* Zone de drag & drop */}
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

          {/* Aperçu des images */}
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

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Boutons d'action */}
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