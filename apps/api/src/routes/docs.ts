import { Router } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerUi = require('swagger-ui-express');
import openApiSpec from '../docs/openapi.json';

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'ArtAldo API Documentation',
}));

export default router;
