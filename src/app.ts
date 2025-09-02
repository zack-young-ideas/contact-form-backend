import express, { Request, Response } from 'express';

const app = express();

app.get('/contact', (req: Request, res: Response) => {
  res.json({ message: 'Cool' });
});

export default app;
