import catchAsync from '../../../shared/catchAsync'
import { RequestHandler } from 'express'

const fileUpload: RequestHandler = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      res.json({
        status: 'success',
        url: `https://server.aymifashion.com/images/product/${req.file.filename}`,
      })
    } else {
      res.json({
        status: 'error',
        message: 'Please select an image',
      })
    }
  } catch (err) {
    // Handle any potential errors
  }
})

const multiFileUploads: RequestHandler = catchAsync(async (req, res) => {
  try {
    if (!req.files) {
      return res
        .status(400)
        .json({ status: 'error', message: 'No files uploaded.' })
    }
    const imageUrl: string[] = []
    ;(req.files as Express.Multer.File[]).forEach(
      (img: Express.Multer.File) => {
        imageUrl.push(
          `https://server.aymifashion.com/images/product/${img.filename}`
        )
      }
    )

    res.status(200).json({
      status: 'success',
      imageURLs: imageUrl,
    })
  } catch (err) {
    // Handle any potential errors
  }
})

export const imageUploadController = {
  fileUpload,
  multiFileUploads,
}
