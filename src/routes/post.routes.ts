import { Express, Request, Response } from 'express';
import Post from "../models/domain/post";

export function routes(app: Express) {
  app.get('/api/post', (req: Request, res: Response) => {
  })
}