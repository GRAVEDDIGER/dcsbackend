/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { Controller } from '../controllers/controller'
import { upload } from '../config/multer'
import { ValMiddleWare } from '../services/validationTDD'
const validate = ValMiddleWare
const router = Router()
const { readData, createData, editData, deleteData } = Controller('about')
router.get('/', readData)
router.get('/:id', readData)
router.post('/', upload.single('images'), validate.run, createData)
router.put('/:id', upload.single('images'), editData)
router.delete('/:id', deleteData)
export default router
