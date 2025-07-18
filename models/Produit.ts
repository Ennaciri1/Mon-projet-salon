import mongoose, { Schema, Document } from 'mongoose'
import { IProduit } from '@/types'

interface IProduitDocument extends Omit<IProduit, '_id'>, Document {}

const ProduitSchema = new Schema<IProduitDocument>({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v)
      },
      message: 'URL d\'image invalide'
    }
  }],
  categorie: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['stands', 'roll-up', 'salon-beaute', 'accessoires', 'eclairage'],
      message: 'Catégorie invalide'
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Le stock ne peut pas être négatif']
  },
  caracteristiques: {
    dimensions: String,
    materiau: String,
    couleur: String,
    poids: String
  },
  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'produits'
})

// Index pour recherche textuelle
ProduitSchema.index({ nom: 'text', description: 'text' })

// Index pour filtres
ProduitSchema.index({ categorie: 1, actif: 1 })
ProduitSchema.index({ prix: 1 })

export default mongoose.models.Produit || mongoose.model<IProduitDocument>('Produit', ProduitSchema)