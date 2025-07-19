// store/useStore.ts - Ajout d'une fonction pour obtenir le nombre d'articles
import { create } from 'zustand'
import { IProduit } from '@/types'

interface PanierItem {
  produit: IProduit
  quantite: number
  options?: {
    couleur?: string
    personnalisation?: string
    urgence?: boolean
  }
}

interface StoreState {
  // Panier
  panier: PanierItem[]
  ajouterAuPanier: (produit: IProduit, quantite?: number, options?: PanierItem['options']) => void
  retirerDuPanier: (produitId: string) => void
  modifierQuantite: (produitId: string, quantite: number) => void
  viderPanier: () => void
  totalPanier: () => number
  nombreArticlesPanier: () => number // Nouvelle fonction
  
  // Produits
  produits: IProduit[]
  chargementProduits: boolean
  categorieActive: string
  rechercheTexte: string
  chargerProduits: (categorie?: string, recherche?: string) => Promise<void>
  setCategorieActive: (categorie: string) => void
  setRechercheTexte: (texte: string) => void
}

export const useStore = create<StoreState>((set, get) => ({
  // État initial panier
  panier: [],
  
  // Actions panier
  ajouterAuPanier: (produit, quantite = 1, options = {}) => {
    const { panier } = get()
    const existant = panier.find(item => item.produit._id === produit._id)
    
    if (existant) {
      // Mettre à jour quantité si existe déjà
      set({
        panier: panier.map(item =>
          item.produit._id === produit._id
            ? { ...item, quantite: item.quantite + quantite, options: { ...item.options, ...options } }
            : item
        )
      })
    } else {
      // Ajouter nouveau produit
      set({
        panier: [...panier, { produit, quantite, options }]
      })
    }
  },
  
  retirerDuPanier: (produitId) => {
    set({
      panier: get().panier.filter(item => item.produit._id !== produitId)
    })
  },
  
  modifierQuantite: (produitId, quantite) => {
    if (quantite <= 0) {
      get().retirerDuPanier(produitId)
      return
    }
    
    set({
      panier: get().panier.map(item =>
        item.produit._id === produitId
          ? { ...item, quantite }
          : item
      )
    })
  },
  
  viderPanier: () => set({ panier: [] }),
  
  totalPanier: () => {
    return get().panier.reduce((total, item) => {
      return total + (item.produit.prix * item.quantite)
    }, 0)
  },
  
  nombreArticlesPanier: () => {
    return get().panier.reduce((total, item) => total + item.quantite, 0)
  },
  
  // État initial produits
  produits: [],
  chargementProduits: false,
  categorieActive: 'all',
  rechercheTexte: '',
  
  // Actions produits
  chargerProduits: async (categorie = 'all', recherche = '') => {
    set({ chargementProduits: true })
    
    try {
      const params = new URLSearchParams()
      if (categorie !== 'all') params.append('categorie', categorie)
      if (recherche) params.append('search', recherche)
      
      const response = await fetch(`/api/produits?${params}`)
      const data = await response.json()
      
      if (data.success) {
        set({ produits: data.data })
      } else {
        console.error('Erreur chargement produits:', data.error)
      }
    } catch (error) {
      console.error('Erreur API produits:', error)
    } finally {
      set({ chargementProduits: false })
    }
  },
  
  setCategorieActive: (categorie) => {
    set({ categorieActive: categorie })
    get().chargerProduits(categorie, get().rechercheTexte)
  },
  
  setRechercheTexte: (texte) => {
    set({ rechercheTexte: texte })
    get().chargerProduits(get().categorieActive, texte)
  }
}))