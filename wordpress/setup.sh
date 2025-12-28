#!/bin/bash
# Don't use set -e so script continues even if some commands fail

# Change to WordPress directory
cd /var/www/html

# Wait for wp-config.php to exist (created by docker-entrypoint)
echo "Waiting for WordPress configuration..."
while [ ! -f /var/www/html/wp-config.php ]; do
  sleep 2
done

# Wait for database to be ready
echo "Waiting for database connection..."
for i in $(seq 1 30); do
  if wp db check --allow-root --path=/var/www/html 2>/dev/null; then
    echo "Database connected!"
    break
  fi
  echo "Database not ready, attempt $i/30..."
  sleep 3
done

# Check if WordPress is already installed
if ! wp core is-installed --allow-root 2>/dev/null; then
  echo "Installing WordPress..."

  wp core install \
    --url="${WORDPRESS_URL:-http://localhost}" \
    --title="${WORDPRESS_TITLE:-My WordPress Site}" \
    --admin_user="${WORDPRESS_ADMIN_USER:-admin}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD:-changeme}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
    --skip-email \
    --allow-root

  echo "WordPress installed successfully!"

  # Remove default plugins (keep only next-revalidate)
  echo "Removing default plugins..."
  wp plugin delete akismet --allow-root 2>/dev/null || true
  wp plugin delete hello --allow-root 2>/dev/null || true
fi

# Install and activate WooCommerce
if ! wp plugin is-active woocommerce --allow-root 2>/dev/null; then
  echo "Installing WooCommerce (this may take a minute)..."
  for i in 1 2 3; do
    wp plugin install woocommerce --activate --allow-root && break
    echo "WooCommerce install attempt $i failed, retrying..."
    sleep 5
  done
  if wp plugin is-active woocommerce --allow-root 2>/dev/null; then
    echo "WooCommerce installed and activated!"
  else
    echo "WARNING: WooCommerce installation failed. Please install manually from wp-admin."
  fi
fi

# Activate the revalidation plugin if not already active
if ! wp plugin is-active next-revalidate --allow-root 2>/dev/null; then
  echo "Activating Next.js Revalidation plugin..."
  wp plugin activate next-revalidate --allow-root
fi

# Activate the headless theme
echo "Activating Next.js Headless theme..."
wp theme activate nextjs-headless --allow-root || echo "WARNING: Could not activate nextjs-headless theme"

# Configure the plugin if NEXTJS_URL is set
if [ -n "$NEXTJS_URL" ]; then
  echo "Configuring Next.js Revalidation plugin..."
  # Plugin expects: nextjs_url, webhook_secret, cooldown (no enable_notifications field)
  wp option update next_revalidate_settings "{\"nextjs_url\":\"${NEXTJS_URL}\",\"webhook_secret\":\"${WORDPRESS_WEBHOOK_SECRET:-}\",\"cooldown\":2}" --format=json --allow-root
  echo "Plugin configured with Next.js URL: $NEXTJS_URL"
fi

echo "WordPress setup complete!"
