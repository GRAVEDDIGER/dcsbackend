/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { WelcomeController } from '../controllers/welcome'
import { upload } from '../config/multer'
const router = Router()
const welcomeController = new WelcomeController('Bienvenido')
router.get('/', welcomeController.getController)
router.get('/:id', welcomeController.getController)
router.post('/', upload.single('images'), welcomeController.postController)
router.put('/:id', upload.single('images'), welcomeController.putController)
router.delete('/:id', welcomeController.deleteController)
export default router
