# 📧 SMTP Mikroservice

Ein einfacher HTTP-zu-SMTP Relay Service für Anything Flow Integration.

## 🎯 Was macht dieser Service?

Dieser Mikroservice empfängt HTTP POST Requests mit E-Mail-Daten und versendet sie über SMTP. Perfekt für Webhook-Integration in Anything Flow oder anderen Automatisierungs-Tools.

## 🚀 Features

- ✅ HTTP zu SMTP Relay
- ✅ Dynamische SMTP Konfiguration pro Request
- ✅ Unterstützung für HTML & Text E-Mails
- ✅ CC/BCC Unterstützung
- ✅ Attachments (Dateianhänge)
- ✅ Detaillierte Fehlerbehandlung
- ✅ Health Check Endpoints
- ✅ CORS & Security Headers
- ✅ Ready für Render.com Deployment

## 📋 Lokale Installation

1. **Repository klonen**
```bash
git clone <your-repo-url>
cd smtp-microservice
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Service starten**
```bash
npm start
```

Der Service läuft auf `http://localhost:3000`

## 🌐 API Endpoints

### POST `/send` - E-Mail versenden

**Request Body:**
```json
{
  "smtp_host": "asmtp.mail.hostpoint.ch",
  "smtp_port": 587,
  "smtp_user": "mail@yourdomain.ch",
  "smtp_pass": "yourpassword",
  "to": "recipient@example.com",
  "from": "mail@yourdomain.ch",
  "subject": "Hello from Anything Flow!",
  "text": "Text version der E-Mail",
  "html": "<h1>HTML version der E-Mail</h1>",
  "cc": "cc@example.com",
  "bcc": "bcc@example.com"
}
```

**Pflichtfelder:**
- `smtp_host`
- `smtp_user` 
- `smtp_pass`
- `to`
- `from`
- `subject`

**Response (Erfolg):**
```json
{
  "success": true,
  "message": "E-Mail erfolgreich versendet",
  "messageId": "unique-message-id",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "recipients": {
    "to": "recipient@example.com",
    "cc": null,
    "bcc": null
  }
}
```

### GET `/health` - Gesundheitsstatus
```json
{
  "status": "healthy",
  "uptime": 12345,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📞 cURL Beispiele

### Einfache Text E-Mail
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "mail@yourdomain.ch",
    "smtp_pass": "yourpassword",
    "to": "recipient@example.com",
    "from": "mail@yourdomain.ch",
    "subject": "Test E-Mail",
    "text": "Das ist eine Test E-Mail von SMTP Mikroservice"
  }'
```

### HTML E-Mail mit CC
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "mail@yourdomain.ch",
    "smtp_pass": "yourpassword",
    "to": "recipient@example.com",
    "cc": "copy@example.com",
    "from": "mail@yourdomain.ch",
    "subject": "HTML Test E-Mail",
    "text": "Fallback Text",
    "html": "<h1>Hallo!</h1><p>Das ist eine <strong>HTML E-Mail</strong> vom SMTP Mikroservice.</p>"
  }'
```

## 🎮 Anything Flow Integration

In Anything Flow verwendest du den **HTTP Request Node** mit:

- **Method:** POST
- **URL:** `https://your-smtp-service.onrender.com/send`
- **Headers:** `Content-Type: application/json`
- **Body:** Das JSON Payload mit deinen SMTP Daten

## 🌍 Deployment auf Render.com

1. **GitHub Repository erstellen**
   - Code zu GitHub pushen
   - Repository auf öffentlich stellen

2. **Render.com Setup**
   - Gehe zu [render.com](https://render.com)
   - "New Web Service" klicken
   - GitHub Repository verbinden
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Deploy**
   - Render deployed automatisch bei jedem Git Push
   - Du erhältst eine öffentliche URL: `https://your-service.onrender.com`

## 🔧 Umgebungsvariablen

Für Produktion kannst du diese Umgebungsvariablen setzen:

```bash
PORT=3000
NODE_ENV=production
```

## 📝 Supported SMTP Provider

Getestet mit:
- ✅ Hostpoint (asmtp.mail.hostpoint.ch:587)
- ✅ Gmail (smtp.gmail.com:587)
- ✅ Outlook (smtp-mail.outlook.com:587)
- ✅ Jeder Standard SMTP Server

## 🛠️ Troubleshooting

### Häufige Fehler:

**"SMTP Authentifizierung fehlgeschlagen"**
- Prüfe smtp_user und smtp_pass
- Bei Gmail: App-Password verwenden

**"Verbindung zum SMTP Server fehlgeschlagen"**
- Prüfe smtp_host und smtp_port
- Firewall/Network Einstellungen prüfen

**"DNS Auflösung fehlgeschlagen"**
- SMTP Host URL prüfen
- Internet Verbindung prüfen

## 📊 Logs

Der Service loggt alle Aktivitäten:
- Eingehende Requests
- Erfolgreiche E-Mail Versendungen
- Fehler mit Details

## 🔒 Sicherheit

- CORS aktiviert
- Helmet.js für Security Headers
- Input Validierung
- Rate Limiting empfohlen für Produktion

## 📄 Lizenz

MIT License - Verwende frei für deine Projekte!

---

**Erstellt für Anything Flow Integration** 🚀 