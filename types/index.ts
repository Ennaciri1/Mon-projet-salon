export interface IProduit {
  _id?: string
  nom: string
  description?: string
  prix: number
  images: string[]
  categorie: 'stands' | 'roll-up' | 'salon-beaute' | 'accessoires' | 'eclairage'
  stock: number
  caracteristiques?: {
    dimensions?: string
    materiau?: string
    couleur?: string
    poids?: string
  }
  actif: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface ICommande {
  _id?: string
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
  statut: 'nouveau' | 'devis_envoye' | 'confirme' | 'en_production' | 'expedie' | 'livre' | 'annule'
  messageClient?: string
  notesInternes?: string
  devis?: {
    prixPropose?: number
    validiteJours?: number
    accepte?: boolean
    dateAcceptation?: Date
  }
  createdAt?: Date
  updatedAt?: Date
}