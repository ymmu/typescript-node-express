import { Express, Request, Response } from 'express';
import Comment from "../models/domain/comment";

export function routes(app: Express) {
  app.get('/api/comment', (req: Request, res: Response) => {
  })
}