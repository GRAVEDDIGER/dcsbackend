/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { Controller } from '../controllers/controller'
import { Validation } from '../services/validation'
import { upload } from '../config/multer'
const router = Router()
const { validate } = new Validation('welcome')
const { readData, createData, editData, deleteData } = Controller('welcome')
router.get('/', readData)
router.get('/:id', readData)
router.post('/', upload.single('images'), validate, createData)
router.put('/:id', upload.single('images'), editData)
router.delete('/:id', deleteData)
export default router
