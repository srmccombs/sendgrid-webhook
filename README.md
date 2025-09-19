# SendGrid Webhook Receiver for Railway

## Quick Deploy to Railway:

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - OR select "Empty Project" then "Add Service" > "GitHub Repo"

3. **Upload These Files**
   - If using GitHub: Push this folder to a new repo
   - If not using GitHub: Use "Deploy from Local" option

4. **Railway Will:**
   - Detect Node.js automatically
   - Install dependencies
   - Start the server
   - Give you a URL like: `sendgrid-webhook.up.railway.app`

5. **Your Webhook URL Will Be:**
   ```
   https://[your-app-name].up.railway.app/webhook
   ```

## Test Your Railway Endpoint:

```bash
# Test GET
curl https://[your-app-name].up.railway.app/webhook

# Test POST
curl -X POST https://[your-app-name].up.railway.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "hello"}'
```

## Update SendGrid:

1. Go to SendGrid > Settings > Inbound Parse
2. Edit your entry
3. Change URL to: `https://[your-app-name].up.railway.app/webhook`
4. Save
5. Send test email!

## View Logs:

In Railway dashboard, click on your service and go to "Logs" tab to see incoming webhooks!