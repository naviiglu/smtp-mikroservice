# 🧪 Test Befehle für SMTP Mikroservice

## Lokale Tests (http://localhost:3000)

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Basis Info
```bash
curl http://localhost:3000/
```

### 3. Test Endpoint (ohne SMTP)
```bash
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Test erfolgreich"}'
```

### 4. E-Mail senden (Hostpoint)
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "DEINE_EMAIL@DOMAIN.CH",
    "smtp_pass": "DEIN_PASSWORD",
    "to": "empfaenger@example.com",
    "from": "DEINE_EMAIL@DOMAIN.CH",
    "subject": "Test von SMTP Mikroservice",
    "text": "Das ist eine Test E-Mail von deinem SMTP Mikroservice! 🚀"
  }'
```

### 5. HTML E-Mail senden
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "DEINE_EMAIL@DOMAIN.CH",
    "smtp_pass": "DEIN_PASSWORD",
    "to": "empfaenger@example.com",
    "from": "DEINE_EMAIL@DOMAIN.CH",
    "subject": "HTML Test von SMTP Mikroservice",
    "text": "Fallback Text für E-Mail Clients ohne HTML Support",
    "html": "<h1>🎉 Erfolg!</h1><p>Dein SMTP Mikroservice funktioniert perfekt!</p><p><strong>Features:</strong></p><ul><li>HTTP zu SMTP Relay</li><li>Dynamische Konfiguration</li><li>HTML & Text Support</li></ul>"
  }'
```

## Produktion Tests (Render.com)

**Ersetze `YOUR-SERVICE-NAME` mit deinem echten Render.com Service Namen:**

### 1. Health Check (Produktion)
```bash
curl https://YOUR-SERVICE-NAME.onrender.com/health
```

### 2. E-Mail senden (Produktion)
```bash
curl -X POST https://YOUR-SERVICE-NAME.onrender.com/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "DEINE_EMAIL@DOMAIN.CH",
    "smtp_pass": "DEIN_PASSWORD",
    "to": "empfaenger@example.com",
    "from": "DEINE_EMAIL@DOMAIN.CH",
    "subject": "Produktion Test - SMTP Mikroservice",
    "text": "Gratulation! Dein SMTP Mikroservice läuft erfolgreich in der Produktion! 🌟"
  }'
```

## Anything Flow Integration

In Anything Flow verwendest du diese Konfiguration:

**HTTP Request Node:**
- **Method:** POST
- **URL:** `https://YOUR-SERVICE-NAME.onrender.com/send`
- **Headers:** 
  - Key: `Content-Type`, Value: `application/json`
- **Body:** 
```json
{
  "smtp_host": "asmtp.mail.hostpoint.ch",
  "smtp_port": 587,
  "smtp_user": "{{deine_email}}",
  "smtp_pass": "{{dein_password}}",
  "to": "{{empfaenger_email}}",
  "from": "{{deine_email}}",
  "subject": "{{email_betreff}}",
  "text": "{{email_inhalt}}"
}
```

## Fehlerbehandlung testen

### Falsches Password
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "smtp_port": 587,
    "smtp_user": "test@domain.ch",
    "smtp_pass": "falsches_password",
    "to": "empfaenger@example.com",
    "from": "test@domain.ch",
    "subject": "Test Fehler",
    "text": "Dieser Test sollte fehlschlagen"
  }'
```

### Fehlende Pflichtfelder
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "smtp_host": "asmtp.mail.hostpoint.ch",
    "to": "empfaenger@example.com",
    "subject": "Test ohne Pflichtfelder"
  }'
```

## Batch Testing

Du kannst mehrere Tests hintereinander ausführen:

```bash
# Alle Tests ausführen
echo "🧪 Starte Tests..."
curl -s http://localhost:3000/health | jq .
echo ""
curl -s http://localhost:3000/ | jq .
echo ""
echo "✅ Tests abgeschlossen"
```

## Monitoring

Für Monitoring kannst du regelmäßige Health Checks einrichten:

```bash
# Alle 30 Sekunden Health Check
watch -n 30 "curl -s https://YOUR-SERVICE-NAME.onrender.com/health | jq ."
``` 