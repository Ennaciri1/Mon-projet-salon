'use client'
import { useStore } from '@/store/useStore'
import './globals.css'
import Link from 'next/link'
import { useState } from 'react'

// Composant Header
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { nombreArticlesPanier } = useStore()
  const nbArticles = nombreArticlesPanier()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barre info top */}
      <div className="bg-blue-600 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📞 +33 1 40 29 85 46</span>
            <span>✉️ contact@salonpro.ma</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>🚚 Livraison 48-72h</span>
            <span>💰 Devis gratuit</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">SP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SalonPro</h1>
              <p className="text-sm text-gray-600">PLV & Équipements Salons</p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Accueil
            </Link>
            
            <div className="relative group">
              <Link href="/catalogue" className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                Produits
                <span className="ml-1">▼</span>
              </Link>
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/catalogue?categorie=stands" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Stands & Structures
                </Link>
                <Link href="/catalogue?categorie=roll-up" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Roll-up & Kakémonos
                </Link>
                <Link href="/catalogue?categorie=salon-beaute" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Salon Beauté
                </Link>
                <Link href="/catalogue?categorie=accessoires" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Accessoires & PLV
                </Link>
                <Link href="/catalogue?categorie=eclairage" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Éclairage & Digital
                </Link>
              </div>
            </div>

            <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium">
              Services
            </Link>
            <Link href="/realisations" className="text-gray-700 hover:text-blue-600 font-medium">
              Réalisations
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/panier"
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🛒 Panier
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <Link
              href="/devis"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Devis Gratuit
            </Link>

            {/* Menu mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center">
                <span className={`bg-gray-600 h-0.5 w-full transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`bg-gray-600 h-0.5 w-full my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`bg-gray-600 h-0.5 w-full transition-all ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <nav className="lg:hidden mt-4 bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">
                Accueil
              </Link>
              <Link href="/catalogue" className="block py-2 text-gray-700 hover:text-blue-600">
                Catalogue
              </Link>
              <Link href="/services" className="block py-2 text-gray-700 hover:text-blue-600">
                Services
              </Link>
              <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-600">
                À propos
              </Link>
              <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

// Composant Footer
function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Footer principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 - Entreprise */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">SP</span>
              </div>
              <h3 className="text-xl font-bold">SalonPro</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Spécialiste en PLV et équipements pour salons, événements et expositions. 
              Plus de 15 ans d'expérience au service des professionnels.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">📘</a>
              <a href="#" className="text-gray-300 hover:text-white">📷</a>
              <a href="#" className="text-gray-300 hover:text-white">🐦</a>
              <a href="#" className="text-gray-300 hover:text-white">💼</a>
            </div>
          </div>

          {/* Colonne 2 - Produits */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Produits</h3>
            <ul className="space-y-2">
              <li><Link href="/catalogue?categorie=stands" className="text-gray-300 hover:text-white">Stands & Structures</Link></li>
              <li><Link href="/catalogue?categorie=roll-up" className="text-gray-300 hover:text-white">Roll-up & Kakémonos</Link></li>
              <li><Link href="/catalogue?categorie=salon-beaute" className="text-gray-300 hover:text-white">Salon Beauté</Link></li>
              <li><Link href="/catalogue?categorie=accessoires" className="text-gray-300 hover:text-white">Accessoires & PLV</Link></li>
              <li><Link href="/catalogue?categorie=eclairage" className="text-gray-300 hover:text-white">Éclairage & Digital</Link></li>
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/conception" className="text-gray-300 hover:text-white">Conception & Design</Link></li>
              <li><Link href="/services/impression" className="text-gray-300 hover:text-white">Impression HD</Link></li>
              <li><Link href="/services/installation" className="text-gray-300 hover:text-white">Installation</Link></li>
              <li><Link href="/services/maintenance" className="text-gray-300 hover:text-white">Maintenance</Link></li>
              <li><Link href="/devis" className="text-gray-300 hover:text-white">Devis Gratuit</Link></li>
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="mr-3">📍</span>
                <div>
                  <p className="text-gray-300">123 Avenue Mohammed V</p>
                  <p className="text-gray-300">20000 Casablanca, Maroc</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3">📞</span>
                <p className="text-gray-300">+212 522 123 456</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3">✉️</span>
                <p className="text-gray-300">contact@salonpro.ma</p>
              </div>
              <div className="flex items-center">
                <span className="mr-3">⏰</span>
                <div>
                  <p className="text-gray-300">Lun-Ven: 8h-18h</p>
                  <p className="text-gray-300">Sam: 9h-13h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2025 SalonPro. Tous droits réservés.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-gray-300 hover:text-white text-sm">
                Mentions légales
              </Link>
              <Link href="/cgv" className="text-gray-300 hover:text-white text-sm">
                CGV
              </Link>
              <Link href="/confidentialite" className="text-gray-300 hover:text-white text-sm">
                Confidentialité
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <title>SalonPro - PLV & Équipements pour Salons et Événements</title>
        <meta name="description" content="Spécialiste en PLV, stands, roll-up et équipements pour salons, événements et expositions. Devis gratuit et livraison rapide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
