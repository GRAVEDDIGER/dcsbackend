/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { Controller } from '../controllers/controllerClass'
import { ValMiddleWare } from '../services/validationTDD'
import { upload } from '../config/multer'
const router = Router()
const validate = ValMiddleWare
const { readData, createData, editData, deleteData } = new Controller('welcome')
router.get('/', readData)
router.get('/:id', readData)
router.post('/', upload.single('images'), validate.run, createData)
router.put('/:id', upload.single('images'), editData)
router.delete('/:id', deleteData)
export default router
