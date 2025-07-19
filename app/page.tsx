'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Composant Hero Section
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      title: "Équipez vos Salons & Événements",
      subtitle: "PLV, Stands, Roll-up professionnels",
      description: "Une gamme complète de solutions d'affichage pour théâtraliser vos espaces",
      image: "/images/hero/d.jpg",
      cta: "Découvrir nos produits"
    },
    {
      title: "Personnalisation & Qualité",
      subtitle: "Impression haute définition",
      description: "Nos équipes vérifient gratuitement vos fichiers pour une impression parfaite",
      image: "/images/hero/f.jpg",
      cta: "Demander un devis"
    },
    {
      title: "Solutions Clés en Main",
      subtitle: "De la conception à la livraison",
      description: "Conseil, design, production et installation pour vos projets",
      image: "/images/hero/h.jpg",
      cta: "Nous contacter"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-blue-200 mb-4 font-semibold">
                  {slide.subtitle}
                </p>
                <p className="text-lg mb-8 leading-relaxed">
                  {slide.description}
                </p>
                <Link
                  href="/catalogue"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {slide.cta} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

// Composant Catégories Principales - Design Moderne
function CategoriesPrincipales() {
  const categories = [
    {
      id: 'stands',
      nom: 'STANDS EXPO PLV',
      description: 'Stands modulaires, cloisons, structures sur-mesure pour vos expositions',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      textColor: 'text-white',
      produits: '120+ produits',
      icon: '🏗️'
    },
    {
      id: 'roll-up',
      nom: 'CADRES & CLOISONS',
      description: 'Solutions d\'affichage et de séparation d\'espaces modernes',
      gradient: 'from-green-400 via-blue-500 to-purple-600',
      textColor: 'text-white',
      produits: '50+ modèles',
      icon: '🖼️'
    },
    {
      id: 'salon-beaute',
      nom: 'SALON BEAUTÉ',
      description: 'Mobilier et équipements spécialisés pour salons de beauté',
      gradient: 'from-pink-500 via-rose-500 to-orange-500',
      textColor: 'text-white',
      produits: '80+ articles',
      icon: '💄'
    },
    {
      id: 'accessoires',
      nom: 'PLV EXTÉRIEUR',
      description: 'Drapeaux, banners et signalétique pour espaces extérieurs',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
      textColor: 'text-white',
      produits: '200+ accessoires',
      icon: '🏁'
    },
    {
      id: 'eclairage',
      nom: 'TAPIS & MOQUETTES',
      description: 'Revêtements de sol professionnels pour événements',
      gradient: 'from-red-500 via-pink-500 to-yellow-500',
      textColor: 'text-white',
      produits: '30+ solutions',
      icon: '🏮'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Nos Solutions Créatives
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez notre gamme complète de solutions PLV et d'équipements professionnels 
            pour créer des espaces d'exception qui marquent les esprits
          </p>
        </div>

        {/* Grille responsive moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/catalogue?categorie=${cat.id}`}
              className="group relative block"
            >
              {/* Carte principale avec gradient */}
              <div className={`
                relative h-80 lg:h-96 rounded-3xl overflow-hidden
                bg-gradient-to-br ${cat.gradient}
                transform transition-all duration-500 ease-out
                group-hover:scale-105 group-hover:rotate-1
                shadow-2xl group-hover:shadow-3xl
              `}>
                
                {/* Pattern décoratif */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-3xl opacity-30"></div>
                </div>

                {/* Badge nombre de produits */}
                <div className="absolute top-6 right-6 z-10">
                  <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                    {cat.produits}
                  </div>
                </div>

                {/* Icône */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border border-white/30">
                    {cat.icon}
                  </div>
                </div>

                {/* Contenu texte */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="transform transition-all duration-300 group-hover:translate-y-[-8px]">
                    <h3 className={`text-2xl lg:text-3xl font-black mb-3 ${cat.textColor} leading-tight tracking-tight`}>
                      {cat.nom}
                    </h3>
                    <p className={`${cat.textColor} opacity-90 text-sm lg:text-base leading-relaxed mb-4`}>
                      {cat.description}
                    </p>
                    
                    {/* Bouton d'action */}
                    <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                      <span className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30 inline-flex items-center">
                        Découvrir
                        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Effet de survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Ombre colorée */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${cat.gradient} rounded-3xl blur-xl opacity-30 
                transform scale-95 -z-10 transition-all duration-500
                group-hover:scale-100 group-hover:opacity-50
              `}></div>
            </Link>
          ))}
        </div>

        {/* Section supplémentaire avec statistiques */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '500+', label: 'Produits disponibles', icon: '📦' },
            { number: '2000+', label: 'Événements équipés', icon: '🎪' },
            { number: '48h', label: 'Livraison express', icon: '🚚' },
            { number: '15ans', label: 'D\'expérience', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant Avantages
function AvantagesSection() {
  const avantages = [
    {
      icon: '✓',
      titre: 'Vérification Gratuite',
      description: 'Nos équipes vérifient systématiquement vos fichiers de création pour une impression sans défaut'
    },
    {
      icon: '⚡',
      titre: 'Livraison Rapide',
      description: 'Production et expédition sous 48-72h pour la plupart de nos produits standard'
    },
    {
      icon: '🎨',
      titre: 'Personnalisation',
      description: 'Solutions sur-mesure avec notre studio de création intégré'
    },
    {
      icon: '💰',
      titre: 'Prix Compétitifs',
      description: 'Tarifs professionnels et devis gratuits sous 24h'
    },
    {
      icon: '🔧',
      titre: 'Installation',
      description: 'Service d\'installation et montage sur site disponible'
    },
    {
      icon: '📞',
      titre: 'Support Expert',
      description: 'Équipe dédiée pour vous conseiller dans vos projets'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Pourquoi choisir SalonPro ?
          </h2>
          <p className="text-xl text-gray-600">
            L'expertise et la qualité au service de vos événements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {avantages.map((avantage, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                <span className="text-2xl group-hover:text-white transition-colors">
                  {avantage.icon}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {avantage.titre}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {avantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant CTA Section
function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à équiper votre prochain événement ?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Découvrez notre catalogue complet ou contactez-nous pour un devis personnalisé
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogue"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Voir le Catalogue
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Demander un Devis
          </Link>
        </div>
      </div>
    </section>
  )
}

// Page principale
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesPrincipales />
      <AvantagesSection />
      <CTASection />
    </div>
  )
}