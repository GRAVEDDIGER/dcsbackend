import { Request, Response } from 'express'
import { DbManager } from '../services/firebase'
const dbManager = new DbManager('Bienvenido')
export class WelcomeController {
  async getWelcome (_req: Request, res: Response): Promise<void> {
    res.send(await dbManager.getAll())
  }
}
