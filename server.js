const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'SMTP Mikroservice läuft',
    timestamp: new Date().toISOString(),
    endpoints: {
      send: 'POST /send - E-Mail versenden',
      health: 'GET /health - Gesundheitsstatus'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Main Email Sending Endpoint
app.post('/send', async (req, res) => {
  try {
    const {
      smtp_host,
      smtp_port = 587,
      smtp_user,
      smtp_pass,
      to,
      from,
      subject,
      text,
      html,
      cc,
      bcc,
      attachments
    } = req.body;

    // Validierung der Pflichtfelder
    if (!smtp_host || !smtp_user || !smtp_pass || !to || !from || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Fehlende Pflichtfelder',
        required: ['smtp_host', 'smtp_user', 'smtp_pass', 'to', 'from', 'subject'],
        received: Object.keys(req.body)
      });
    }

    console.log(`Versuche E-Mail zu senden an: ${to}`);

    // SMTP Transporter erstellen
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port),
      secure: smtp_port == 465, // true für Port 465, false für andere Ports
      auth: {
        user: smtp_user,
        pass: smtp_pass
      },
      tls: {
        rejectUnauthorized: false // Für Entwicklung
      }
    });

    // E-Mail Optionen
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
      cc: cc,
      bcc: bcc,
      attachments: attachments
    };

    // E-Mail senden
    const info = await transporter.sendMail(mailOptions);

    console.log(`E-Mail erfolgreich gesendet: ${info.messageId}`);

    res.json({
      success: true,
      message: 'E-Mail erfolgreich versendet',
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
      recipients: {
        to: to,
        cc: cc || null,
        bcc: bcc || null
      }
    });

  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);

    // Detaillierte Fehlerbehandlung
    let errorMessage = 'Unbekannter Fehler';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP Authentifizierung fehlgeschlagen';
      errorCode = 'AUTH_FAILED';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Verbindung zum SMTP Server fehlgeschlagen';
      errorCode = 'CONNECTION_FAILED';
    } else if (error.code === 'EDNS') {
      errorMessage = 'DNS Auflösung fehlgeschlagen';
      errorCode = 'DNS_FAILED';
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      errorCode: errorCode,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test Endpoint
app.post('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test erfolgreich',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint nicht gefunden',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /send',
      'POST /test'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unbehandelter Fehler:', err);
  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler',
    timestamp: new Date().toISOString()
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 SMTP Mikroservice läuft auf Port ${PORT}`);
  console.log(`📧 Bereit für E-Mail Versendung via HTTP`);
  console.log(`🌐 Gesundheitsstatus: http://localhost:${PORT}/health`);
});

module.exports = app; 