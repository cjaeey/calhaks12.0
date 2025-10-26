#!/bin/bash

echo "🌋 Lava Payments Setup Script"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔑 Configuring Lava credentials..."
echo ""

# Lava credentials from CalHacks 12.0 team
FORWARD_TOKEN="eyJzZWNyZXRfa2V5IjoiYWtzX2xpdmVfQkkxal85dC1TVzhNRHdyelNxeE0tZ3JfaW5rdGdVNTU3LXBLaHdsZG9zYUlXdjNHdHY5dWpKViIsImNvbm5lY3Rpb25fc2VjcmV0IjoiY29uc19saXZlX011akU5X09LOVRBeXczX2MtZHo0bmFON094OFoxQ2ZXaWdYdzFzaFR4SmRFQUFZWmlCLW5UNSIsInByb2R1Y3Rfc2VjcmV0IjoicHNfbGl2ZV8yRjFkb2Q1ZURISU9OY3hRLW41OTBMSC1MbG81eW8wRzF6R2hxS2pRWmhibmpEMF85TWZaWFJsYiJ9"
CONNECTION_SECRET="cons_live_MujE9_OK9TAyw3_c-dz4naN7Ox8Z1CfWigXw1shTxJdEAAYZiB-nT5"
PRODUCT_SECRET="ps_live_2F1dod5eDHIONcxQ-n590LH-Llo5yo0G1zGhqKjQZhbnjD0_9MfZXRlb"

# Function to update or add env variable
update_env() {
    local key=$1
    local value=$2

    if grep -q "^${key}=" .env; then
        # Update existing key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^${key}=.*|${key}=${value}|" .env
        else
            # Linux
            sed -i "s|^${key}=.*|${key}=${value}|" .env
        fi
        echo "   Updated: $key"
    else
        # Add new key
        echo "${key}=${value}" >> .env
        echo "   Added: $key"
    fi
}

# Update Lava credentials
update_env "LAVA_FORWARD_TOKEN" "$FORWARD_TOKEN"
update_env "LAVA_CONNECTION_SECRET" "$CONNECTION_SECRET"
update_env "LAVA_PRODUCT_SECRET" "$PRODUCT_SECRET"

echo ""
read -p "🔌 Enable Lava proxy now? (y/n): " enable_lava

if [[ $enable_lava == "y" || $enable_lava == "Y" ]]; then
    update_env "USE_LAVA" "true"
    echo "✅ Lava proxy ENABLED"
else
    update_env "USE_LAVA" "false"
    echo "⏸️  Lava proxy DISABLED (you can enable it later by setting USE_LAVA=true)"
fi

echo ""
echo "✨ Lava setup complete!"
echo ""
echo "📊 View usage dashboard:"
echo "   https://www.lavapayments.com/dashboard"
echo ""
echo "📖 Read integration docs:"
echo "   cat LAVA_INTEGRATION.md"
echo ""
echo "🧪 Test the integration:"
echo "   cd backend && npm run test-claude"
echo ""
echo "💡 To enable/disable Lava:"
echo "   Edit .env and change USE_LAVA to true or false"
echo ""
