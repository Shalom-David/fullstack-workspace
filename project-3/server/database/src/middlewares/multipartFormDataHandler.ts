import path from 'path'
import multer, { MulterError } from 'multer'
import { NextFunction, Request, Response } from 'express'
import { CONSTANTS } from '../constants'

const checkFileType = (
  file: Express.Multer.File,
  cb: (error: Error | null, valid: boolean) => void
) => {
  const fileTypes = /jpeg|jpg|png|gif|svg/

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())

  const mimeType = fileTypes.test(file.mimetype)
  if (mimeType && extName) {
    return cb(null, true)
  }

  return cb(Error(CONSTANTS.ERRORS.MULTER_FILE_ERROR), false)
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  },
})

export const multerErrorHandler = (
  err: multer.MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === CONSTANTS.ERRORS.MULTER_FORM_ERROR) {
    return res.status(400).send({ errors: err.message })
  }
  if (err.message === CONSTANTS.ERRORS.MULTER_FILE_ERROR) {
    return res.status(400).send({ error: err.message })
  }
}
