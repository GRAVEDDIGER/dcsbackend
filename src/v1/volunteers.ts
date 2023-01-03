/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { Controller } from '../controllers/controller'
import { upload } from '../config/multer'
const router = Router()
const { readData, createData, editData, deleteData } = Controller('volunteers')
router.get('/', readData)
router.get('/:id', readData)
router.post('/', upload.single('images'), createData)
router.put('/:id', upload.single('images'), editData)
router.delete('/:id', deleteData)
export default router
