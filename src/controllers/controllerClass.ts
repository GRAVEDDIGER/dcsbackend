/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-extraneous-class */
// import colors from 'colors'
import { Request, Response } from 'express'
import { DataResponseClass } from '../services/firebase'
import { AbstractController } from '../clases/abstractClasses'
import fs from 'fs/promises'
export class Controller extends AbstractController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (collection: string) {
    super(collection)
  }

  readData = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id
    if (id !== undefined) {
      res.send(await this.dbManager.getById(id))
    } else {
      res.send(await this.dbManager.getAll())
    }
  }

  createData = async (req: Request, res: Response): Promise<void> => {
    if (req.file !== undefined) {
      const uploadedFilePath = await this.dbManager.upLoadFile(req.file)
        .then((response: any) => {
          // console.log(`${response}/${req.file?.filename || ' '}`)
          if (req.file?.path !== undefined) {
            fs.unlink(req.file.path).then(() => console.log('Upload Complete')).catch(err => console.log(err))
          }
          return `${response}`
        })
        .catch((err: any) => {
          console.log(err)
          res.send(false)
        })
      // const data = { ...req.body, images: uploadedFilePath }
      // console.log(colors.bgRed.white(data))
      res.send(await this.dbManager.addItem({ ...req.body, images: uploadedFilePath }))
    } else res.send(new DataResponseClass([], 400, 'Invalid Request no image uploaded', 'Invalid Request no image uploaded', false))
  }

  editData = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (req.file !== undefined) {
      const uploadedFilePath = await this.dbManager.upLoadFile(req.file)
        .then((response: any) => {
          if (req.file?.path !== undefined) {
            fs.unlink(req.file.path).then(() => console.log('Upload Complete')).catch(err => console.log(err))
          }
          return `${response}`
        })
        .catch((err: { toString: () => string }) => {
          console.log(err)
          res.send(new DataResponseClass([], 400, 'Imposible to upload the file', err.toString(), false))
        })
      res.send(await this.dbManager.updateById(id, { ...req.body, images: uploadedFilePath }))
    } else res.send(new DataResponseClass([], 400, 'Invalid Request no image uploaded', 'Invalid Request no image uploaded', false))
  }

  deleteData = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    if (id !== undefined) {
      res.send(await this.dbManager.deleteByid(id))
    } else res.send(new DataResponseClass([], 400, 'Invalid Request no id', 'Invalid  Request no id', false))
  }
}
