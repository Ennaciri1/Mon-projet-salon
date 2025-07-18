import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Veuillez ajouter MONGODB_URI dans .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectMongoDB() {
  if (cached.conn) {
    console.log('🍃 MongoDB déjà connecté')
    return cached.conn
  }

  if (!cached.promise) {
    console.log('🍃 Connexion à MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  try {
    cached.conn = await cached.promise
    console.log('✅ MongoDB connecté avec succès')
    return cached.conn
  } catch (e) {
    cached.promise = null
    console.error('❌ Erreur connexion MongoDB:', e)
    throw e
  }
}

export default connectMongoDB