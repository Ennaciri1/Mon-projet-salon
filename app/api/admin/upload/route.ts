
// ============================================
// app/api/admin/upload/route.ts - Upload d'Images
// ============================================

import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'salon-admin-secret-key-change-me'

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) throw new Error('Token manquant')

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') throw new Error('Accès refusé')
    return decoded
  } catch (error) {
    throw new Error('Token invalide')
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({
        success: false,
        error: 'Aucun fichier fourni'
      }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return Response.json({
        success: false,
        error: 'Le fichier doit être une image'
      }, { status: 400 })
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({
        success: false,
        error: 'Le fichier ne doit pas dépasser 5MB'
      }, { status: 400 })
    }

    // Créer un nom unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const extension = file.name.split('.').pop()
    const fileName = `product_${timestamp}_${randomString}.${extension}`

    // Créer le dossier si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier
    const filePath = path.join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/products/${fileName}`
    
    return Response.json({
      success: true,
      url: publicUrl,
      message: 'Image uploadée avec succès'
    })
    
  } catch (error: any) {
    console.error('Erreur upload image:', error)
    
    if (error.message.includes('Token')) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 401 })
    }
    
    return Response.json({
      success: false,
      error: 'Erreur lors de l\'upload'
    }, { status: 500 })
  }
}
