/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Request, Response } from 'express'
import { DbManager } from '../services/firebase'
const dbManager = new DbManager('Bienvenido')
export class WelcomeController {
  async getWelcome (req: Request, res: Response): Promise<void> {
    const id: string = req.params.id
    if (id !== undefined) {
      res.send(await dbManager.getById(id))
    } else {
      res.send(await dbManager.getAll())
    }
  }
}
