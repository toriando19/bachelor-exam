import express from 'express';
import helmet from 'helmet';
import { connectToPGDatabase } from '../database/postgres/connect-postgres.mjs';
import { connectToMongoDB } from '../database/mongo/connect-mongo.mjs';
import userRoutes from './index.mjs';

const app = express();

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


// You can customize the CSP header directly if needed (optional, as Helmet can set it by default)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],                // Allow resources only from the same origin
    scriptSrc: ["'self'", 'https://trusted-cdn.com'], // Allow scripts from the same origin and a trusted CDN
    styleSrc: ["'self'", "'unsafe-inline'"],  // Allow styles from the same origin and inline styles (if needed)
    imgSrc: ["'self'", "data:", 'https://trusted-images.com'], // Allow images from the same origin, inline (data URI), and a trusted image host
    connectSrc: ["'self'", 'https://api.trusted.com'],  // Allow AJAX and WebSocket requests to the same origin and a trusted API
    fontSrc: ["'self'", 'https://fonts.gstatic.com'], // Allow fonts from the same origin and Google Fonts
    objectSrc: ["'none'"],  // Disallow plugins like Flash or Java applets
    upgradeInsecureRequests: [],  // Upgrade all HTTP requests to HTTPS
  }
}));



// Connect to the PostgreSQL database
connectToPGDatabase();

// Connect to the Mongo database
connectToMongoDB();

// Use the user routes
app.use(userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
