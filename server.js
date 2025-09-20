const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Configure multer for multipart/form-data
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SendGrid Webhook Receiver is running on Railway!',
    timestamp: new Date().toISOString()
  });
});

// GET endpoint for webhook (for testing)
app.get('/webhook', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook endpoint is ready',
    method: 'GET',
    timestamp: new Date().toISOString()
  });
});

// POST endpoint for SendGrid Inbound Parse
app.post('/webhook', upload.any(), async (req, res) => {
  console.log('\n=== WEBHOOK RECEIVED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Extract email details
  const from = req.body.from || 'unknown';
  const to = req.body.to || 'unknown';
  const subject = req.body.subject || 'no subject';
  const attachments = req.body.attachments || '0';
  
  console.log('\n=== EMAIL DETAILS ===');
  console.log('From:', from);
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Attachments:', attachments);
  
  // Check for files
  if (req.files && req.files.length > 0) {
    console.log('\n=== FILES RECEIVED ===');
    req.files.forEach(file => {
      console.log('File:', file.originalname, 'Size:', file.size, 'bytes');
    });
  }
  
  // Forward to Vercel
  try {
    console.log('\n=== FORWARDING TO VERCEL ===');
    const vercelUrl = 'https://orders.plecticscompanies.com/api/webhook/email-v3';

    // Use axios instead of node-fetch for better compatibility
    const axios = require('axios');
    const FormData = require('form-data');
    const formData = new FormData();

    // Add all fields from the original request
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    // Add files if present
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formData.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }

    // Forward to Vercel using axios
    const response = await axios.post(vercelUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'User-Agent': 'Sendlib/1.0'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    console.log('Vercel response:', response.data);
    console.log('Forward successful!');

  } catch (error) {
    console.error('Failed to forward to Vercel:', error);
  }

  // Always return success to SendGrid
  res.status(200).json({
    success: true,
    message: 'Webhook received and forwarded',
    received: {
      from,
      to,
      subject,
      attachments,
      timestamp: new Date().toISOString()
    }
  });
});

// Catch-all for other routes
app.all('*', (req, res) => {
  console.log('Request to:', req.method, req.path);
  res.status(200).json({
    success: true,
    message: 'Webhook receiver',
    path: req.path,
    method: req.method
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 SendGrid Webhook Receiver running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log('\nWaiting for webhooks...');
});