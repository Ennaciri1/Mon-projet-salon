import mongoose, { Schema, Document } from 'mongoose'
import { ICommande } from '@/types'

interface ICommandeDocument extends Omit<ICommande, '_id'>, Document {}

const CommandeSchema = new Schema<ICommandeDocument>({
  client: {
    nom: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true
    },
    telephone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    entreprise: {
      type: String,
      trim: true
    },
    adresse: {
      rue: String,
      ville: String,
      codePostal: String,
      pays: { type: String, default: 'Maroc' }
    }
  },
  
  produits: [{
    produitId: {
      type: Schema.Types.ObjectId,
      ref: 'Produit',
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    prix: {
      type: Number,
      required: true,
      min: 0
    },
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    options: {
      couleur: String,
      personnalisation: String,
      urgence: { type: Boolean, default: false }
    }
  }],
  
  totalHT: {
    type: Number,
    required: true,
    min: 0
  },
  tva: {
    type: Number,
    default: 20
  },
  totalTTC: {
    type: Number,
    required: true,
    min: 0
  },
  
  statut: {
    type: String,
    enum: ['nouveau', 'devis_envoye', 'confirme', 'en_production', 'expedie', 'livre', 'annule'],
    default: 'nouveau'
  },
  
  messageClient: String,
  notesInternes: String,
  
  devis: {
    prixPropose: Number,
    validiteJours: { type: Number, default: 30 },
    accepte: { type: Boolean, default: false },
    dateAcceptation: Date
  }
  
}, {
  timestamps: true,
  collection: 'commandes'
})

// Index pour recherche et tri
CommandeSchema.index({ 'client.email': 1 })
CommandeSchema.index({ statut: 1 })
CommandeSchema.index({ createdAt: -1 })

export default mongoose.models.Commande || mongoose.model<ICommandeDocument>('Commande', CommandeSchema)