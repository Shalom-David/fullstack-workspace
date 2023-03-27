import { readFile, unlink, writeFile } from 'fs/promises'
import { Document } from 'mongoose'
import { DeleteResult } from 'mongodb'
import {
  IpaginatedProducts,
  Iproduct,
  IproductWithImage,
} from '../interfaces/product'
import { Product } from '../models/product'
import { checkFile, fileMatcher } from '../utils'

export const createProduct = async (
  doc: Iproduct,
  file: Express.Multer.File[]
): Promise<Document<unknown, any, Iproduct>> => {
  const productsList = await findProducts()
  const [productExists] = productsList.filter(
    (product) => product.name === doc.name
  )
  if (productExists) throw Error('product already exists')
  checkFile(file[0])
  const timestamp = Date.now()
  doc.imageId = timestamp.toString()
  const product = new Product(doc)
  await product.save()
  await writeFile(
    `./images/${timestamp}.${file[0].mimetype.split('/')[1]}`,
    file[0].buffer
  )

  return product
}

export const findProductbyId = async (id: string): Promise<Iproduct[]> => {
  return await Product.find({ _id: id })
}
export const findProductByCategory = async (
  category: string,
  pageNumber: number,
  pageSize: number,
  searchQuery?: string
): Promise<IpaginatedProducts> => {
  const productsList = await Product.find(
    searchQuery
      ? { category: category, name: { $regex: searchQuery } }
      : { category: category }
  )
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
  const products: IproductWithImage[] = []
  const totalCount = await Product.countDocuments({ category: category })
  for (const product of productsList) {
    products.push({
      productId: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      imageData: await readFile(
        `./images/${await fileMatcher(product.imageId)}`
      ),
      description: product.description,
    })
  }

  const paginatedProducts: IpaginatedProducts = {
    products: products,
    totalCount,
  }
  return paginatedProducts
}
export const findProducts = async (): Promise<Iproduct[]> => {
  return await Product.find()
}

export const paginatedProducts = async (
  pageNumber: number,
  pageSize: number,
  searchQuery?: string
): Promise<IpaginatedProducts> => {
  const productsList = await Product.find(
    searchQuery ? { name: { $regex: searchQuery } } : {}
  )
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
  const products: IproductWithImage[] = []
  const totalCount = await Product.countDocuments()
  for (const product of productsList) {
    products.push({
      productId: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      imageData: await readFile(
        `./images/${await fileMatcher(product.imageId)}`
      ),
      description: product.description,
    })
  }
  const paginatedProducts: IpaginatedProducts = {
    products: products,
    totalCount,
  }
  return paginatedProducts
}

export const deleteProduct = async (
  productId: string
): Promise<DeleteResult> => {
  const [product] = await findProductbyId(productId)

  if (!product) throw { status: 404, message: 'product not found' }
  const matchedFile = await fileMatcher(product.imageId)
  if (matchedFile) await unlink(`./images/${matchedFile}`)
  const res = await Product.deleteOne(product)

  return res
}

export const updateProduct = async (
  doc: Iproduct & { productId: string },
  file: Express.Multer.File[]
): Promise<Document<unknown, any, Iproduct>> => {
  const productsList = await findProducts()
  const [productNameExists] = productsList.filter(
    (product) => product.name === doc.name
  )
  if (productNameExists)
    throw Error(`product with name ${doc.name} already exists`)
  if (file[0]) {
    checkFile(file[0])
    const [oldProduct] = await findProductbyId(doc.productId)
    const timestamp = Date.now()
    const matchedFile = await fileMatcher(oldProduct.imageId)
    await unlink(`./images/${matchedFile}`)
    await writeFile(
      `./images/${timestamp}.${file[0].mimetype.split('/')[1]}`,
      file[0].buffer
    )
    doc.imageId = timestamp.toString()
  }
  const newProduct = await Product.findOneAndUpdate(
    { _id: doc.productId },
    { $set: doc },
    { upsert: true, new: true }
  )
  return newProduct
}
