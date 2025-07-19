// app/about/page.tsx
'use client'
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">À propos de SalonPro</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Depuis plus de 15 ans, nous accompagnons les professionnels dans la réussite de leurs événements avec des solutions PLV et d'équipement de qualité.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fondée en 2009 à Casablanca, SalonPro est née de la passion de créer des espaces d'exposition exceptionnels. 
                  Nos fondateurs, experts en communication visuelle et aménagement d'espaces, ont identifié un besoin crucial : 
                  offrir aux entreprises marocaines des solutions PLV professionnelles et accessibles.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers d'avoir équipé plus de 2000 événements à travers le Maroc et l'Afrique du Nord, 
                  des petites expositions locales aux grands salons internationaux.
                </p>
                <p>
                  Notre engagement : démocratiser l'accès à des outils de communication visuelle de qualité professionnelle, 
                  avec un service personnalisé et des délais respectés.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&h=400"
                alt="Notre équipe"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm">Années d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Nos Chiffres Clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '2000+', label: 'Événements équipés' },
              { number: '500+', label: 'Clients satisfaits' },
              { number: '15000+', label: 'Produits livrés' },
              { number: '48h', label: 'Délai moyen de livraison' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                nom: 'Ahmed Bennani',
                poste: 'Directeur Général',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300',
                description: '15 ans d\'expérience dans l\'événementiel et la PLV'
              },
              {
                nom: 'Fatima Alami',
                poste: 'Responsable Design',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b332c3c1?auto=format&fit=crop&w=300&h=300',
                description: 'Experte en création graphique et conception d\'espaces'
              },
              {
                nom: 'Youssef Idrissi',
                poste: 'Responsable Production',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300',
                description: 'Spécialiste en impression haute définition et finition'
              }
            ].map((membre, index) => (
              <div key={index} className="text-center">
                <img 
                  src={membre.image}
                  alt={membre.nom}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{membre.nom}</h3>
                <p className="text-blue-600 font-medium mb-2">{membre.poste}</p>
                <p className="text-gray-600 text-sm">{membre.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                titre: 'Qualité',
                description: 'Nous sélectionnons rigoureusement nos matériaux et contrôlons chaque étape de production pour garantir des produits durables et esthétiques.',
                icon: '⭐'
              },
              {
                titre: 'Réactivité',
                description: 'Nous comprenons l\'urgence de vos projets. Notre organisation nous permet de livrer rapidement sans compromettre la qualité.',
                icon: '⚡'
              },
              {
                titre: 'Innovation',
                description: 'Nous investissons continuellement dans les dernières technologies d\'impression et les nouveaux matériaux pour vous offrir des solutions modernes.',
                icon: '💡'
              }
            ].map((valeur, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">{valeur.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{valeur.titre}</h3>
                <p className="text-gray-600">{valeur.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}