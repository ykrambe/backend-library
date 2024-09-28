import { createApp } from './app';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.json';
dotenv.config()


async function startApp() {
  let app = await createApp();
  try {


    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    app.get('/', (req:any, res:any) => {
      res.send('API Perpustakaan');
    });
    
    await mongoose.connect(process.env.MONGO_URI!!);
    console.info('Connected to MongoDB!');
    
    const port = process.env.PORT!!
    app.listen(port, () => {
      console.info(`Server Listening on port ${port}`);
    });

  } catch (e) {
    console.error (e);
    throw e;
  }
}

startApp();
