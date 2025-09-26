import app from './app';
import { getEnvironment } from './utils';

const argument: string | undefined = process.argv[2];
getEnvironment(argument);
if (process.env.NODE_ENV === 'production') {
  app.listen(3000, () => null);
} else {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}
