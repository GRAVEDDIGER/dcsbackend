import multer =require('multer')
import { v4 } from 'uuid'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = v4()
    cb(null, uniqueSuffix + file.originalname)
  }
})

export const upload = multer({ storage })
