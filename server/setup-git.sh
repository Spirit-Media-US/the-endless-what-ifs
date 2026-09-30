#!/bin/bash
# ============================================================
# Spirit Media — Git + GitHub SSH setup on Hetzner server
# Run as deploy user
# ============================================================

# ── 1. Git config ────────────────────────────────────────────
git config --global user.name "Spirit Media Deploy"
git config --global user.email "kevin@spiritmediapublishing.com"
git config --global init.defaultBranch main

# ── 2. Generate deploy SSH key ───────────────────────────────
ssh-keygen -t ed25519 -C "deploy@spirit-media-server" -f ~/.ssh/id_ed25519 -N ""

echo ""
echo "=== Add this public key to GitHub ==="
echo "Go to: https://github.com/settings/keys (personal) or"
echo "       Spirit-Media-US org → Settings → Deploy keys"
echo ""
cat ~/.ssh/id_ed25519.pub
echo ""

# ── 3. Clone all 5 site repos ───────────────────────────────
echo "After adding the key, run:"
cat << 'EOF'
mkdir -p ~/Sites
cd ~/Sites
git clone git@github.com:Spirit-Media-US/artsbyjustin.git
git clone git@github.com:Spirit-Media-US/spirit-media-publishing.git
git clone git@github.com:Spirit-Media-US/the-kohler-group.git
git clone git@github.com:Spirit-Media-US/FHB.git
git clone git@github.com:Spirit-Media-US/WOY.git

# Install deps for each
for site in artsbyjustin spirit-media-publishing the-kohler-group FHB WOY; do
  cd ~/Sites/$site && npm install && cd ..
done
EOF
