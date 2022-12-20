/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { WelcomeController } from '../controllers/welcome'

const router = Router()
const welcomeController = new WelcomeController()
router.get('/', welcomeController.getWelcome)
router.get('/:id', welcomeController.getWelcome)
export default router
