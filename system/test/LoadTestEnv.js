const testEnvPath = require('path').join(__dirname, '../../.test.env');
require('dotenv').config({ path: testEnvPath});
process.env.NODE_ENV = 'test';
