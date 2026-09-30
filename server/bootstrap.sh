#!/bin/bash
# ============================================================
# Spirit Media — Hetzner CCX33 Server Bootstrap
# Run once as root immediately after provisioning
# Ubuntu 22.04 LTS | 8 vCPU | 32GB RAM | 240GB NVMe
# ============================================================
set -euo pipefail

echo "=== Spirit Media Server Bootstrap ==="
echo "Starting at $(date)"

# ── 1. System update ─────────────────────────────────────────
apt-get update -y && apt-get upgrade -y
apt-get install -y \
  curl wget git unzip build-essential \
  ufw fail2ban htop ncdu tmux \
  nginx certbot python3-certbot-nginx

# ── 2. Create deploy user ────────────────────────────────────
useradd -m -s /bin/bash deploy || echo "deploy user already exists"
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/ 2>/dev/null || true
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
usermod -aG sudo deploy
echo 'deploy ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/deploy

# ── 3. Node.js 20 LTS via nvm (for deploy user) ─────────────
sudo -u deploy bash << 'NODEEOF'
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
npm install -g npm@latest
NODEEOF

# ── 4. Firewall ──────────────────────────────────────────────
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp   # code-server
ufw --force enable

# ── 5. Fail2ban ──────────────────────────────────────────────
systemctl enable fail2ban
systemctl start fail2ban

# ── 6. SSH hardening ─────────────────────────────────────────
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

echo ""
echo "=== Bootstrap complete ==="
echo "Next: SSH as deploy user and run setup-code-server.sh"
