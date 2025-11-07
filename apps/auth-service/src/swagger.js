import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Auth Service API',
    description: 'API documentation for the Auth Service',
  },
  host: 'localhost:6001',
  schemes: ['http'],
  version: '1.0.0',
  schemas: ['http'],
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./routes/auth.router.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
