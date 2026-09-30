#!/bin/bash
# ============================================================
# Spirit Media — code-server (VS Code in browser) setup
# Run as the deploy user after bootstrap.sh completes
# ============================================================
set -euo pipefail

# ── 1. Install code-server ───────────────────────────────────
curl -fsSL https://code-server.dev/install.sh | sh

# ── 2. Configure code-server ─────────────────────────────────
mkdir -p ~/.config/code-server
cat > ~/.config/code-server/config.yaml << EOF
bind-addr: 127.0.0.1:8080
auth: password
password: REPLACE_WITH_STRONG_PASSWORD
cert: false
EOF

# ── 3. Enable as systemd service ─────────────────────────────
sudo systemctl enable --now code-server@deploy

# ── 4. Nginx reverse proxy with HTTPS ────────────────────────
# Replace code.YOURDOMAIN.com with actual subdomain
sudo tee /etc/nginx/sites-available/code-server << 'NGINX'
server {
    listen 80;
    server_name code.REPLACE_DOMAIN.com;

    location / {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Accept-Encoding gzip;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/code-server /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=== code-server setup complete ==="
echo "Run: sudo certbot --nginx -d code.REPLACE_DOMAIN.com"
echo "Then access at: https://code.REPLACE_DOMAIN.com"
