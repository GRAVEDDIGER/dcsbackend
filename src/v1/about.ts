/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { Controller } from '../controllers/controller'
import { upload } from '../config/multer'
const router = Router()
const volunteersController = Controller('about')
router.get('/', volunteersController.getController)
router.get('/:id', volunteersController.getController)
router.post('/', upload.single('images'), volunteersController.postController)
router.put('/:id', upload.single('images'), volunteersController.putController)
router.delete('/:id', volunteersController.deleteController)
export default router
