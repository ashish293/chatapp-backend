import multer from "multer";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})

const multerSingleImage = multerUpload.single('image')
const multerAttachment = multerUpload.array('files', 5)

export { multerAttachment, multerSingleImage }