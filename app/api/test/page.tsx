'use client'
import { useState } from 'react'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testerConnexion = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Erreur de connexion' })
    }
    setLoading(false)
  }

  const creerProduitTest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test', { method: 'POST' })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Erreur de création' })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test MongoDB + Next.js</h1>
      
      <div className="space-y-4">
        <button
          onClick={testerConnexion}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Test...' : 'Tester Connexion MongoDB'}
        </button>
        
        <button
          onClick={creerProduitTest}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading ? 'Création...' : 'Créer Produit Test'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
          <pre className="bg-black text-green-400 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}