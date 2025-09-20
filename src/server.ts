import dotenv from 'dotenv';
import app from './app';

if (process.env.NODE_ENV === 'production') {
  app.listen(3000, () => null);
} else {
  dotenv.config();
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}
