// Import required modules and dependencies
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/db');
const route = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger_options');
require('dotenv').config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// CORS settings - Allow all origins and localhost:4200
app.use(
  cors({
    origin: ['*', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.json()); // Body parser for JSON payloads
app.use(helmet()); // Security middleware to set HTTP headers

// API routes
route(app);

// Root route
app.get('/', (req, res) => {
  res.send('Helmet is now protecting this app!');
});

// Start server and establish database connection
server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    // Authenticate Sequelize connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error(`Database connection failed. Attempting to reconnect. error : ${error}`);

    try {
      await sequelize.authenticate();
      console.log('Database connection re-established successfully.');
    } catch (createError) {
      console.error('Failed to connect to the database:', createError);
    }
  }
});

// Timeout middleware to handle request timeouts
app.use((req, res, next) => {
  if (req.timedOut) {
    return res.status(500).json({
      error: 'Request timed out. Please try again later.',
    });
  }
  next();
});

// Swagger API documentation setup
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global error handler
app.use((err, req, res) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});
