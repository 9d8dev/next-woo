# Next Woo

A headless WooCommerce storefront built with Next.js 16, React 19, and TypeScript.

## Features

- **Full WooCommerce Integration** - Products, categories, variations, cart, and checkout
- **Type-safe API Layer** - Comprehensive TypeScript definitions for WooCommerce
- **Client-side Cart** - Persistent shopping cart with localStorage
- **WooCommerce Checkout** - Redirects to WooCommerce for secure payment processing
- **Server-side Pagination** - Efficient product browsing with filters
- **Blog Support** - WordPress posts, categories, tags, and authors
- **Cache Revalidation** - Automatic updates when content changes
- **Dark Mode** - Built-in theme switching
- **Responsive Design** - Mobile-first with Tailwind CSS v4

## Quick Start

```bash
# Clone the repository
git clone https://github.com/brijr/next-woo.git
cd next-woo

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your WordPress/WooCommerce credentials

# Start development server
pnpm dev
```

Your site is now running at `http://localhost:3000`.

## Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later
- **WordPress** with WooCommerce installed
- **WooCommerce REST API** credentials

## Environment Variables

Create a `.env.local` file:

```bash
# WordPress/WooCommerce Site
WORDPRESS_URL="https://your-wordpress-site.com"
WORDPRESS_HOSTNAME="your-wordpress-site.com"
NEXT_PUBLIC_WORDPRESS_URL="https://your-wordpress-site.com"

# Webhook secret for cache revalidation
WORDPRESS_WEBHOOK_SECRET="your-secret-key-here"

# WooCommerce REST API credentials
# Generate in: WooCommerce > Settings > Advanced > REST API
WC_CONSUMER_KEY="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WC_CONSUMER_SECRET="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Project Structure

```
next-woo/
├── app/
│   ├── api/
│   │   ├── checkout/        # Order creation endpoint
│   │   ├── og/              # OG image generation
│   │   └── revalidate/      # Cache revalidation webhook
│   ├── shop/
│   │   ├── [slug]/          # Product detail pages
│   │   └── category/[slug]/ # Category pages
│   ├── cart/                # Shopping cart page
│   ├── checkout/
│   │   └── success/         # Order confirmation
│   ├── posts/               # Blog posts
│   └── pages/               # WordPress pages
├── components/
│   ├── shop/                # Shop components
│   │   ├── product-card.tsx
│   │   ├── product-gallery.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-filters.tsx
│   │   ├── variation-selector.tsx
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-provider.tsx
│   │   └── cart-drawer.tsx
│   ├── posts/               # Blog components
│   ├── ui/                  # shadcn/ui components
│   └── theme/               # Theme toggle
├── lib/
│   ├── woocommerce.ts       # WooCommerce API functions
│   ├── woocommerce.d.ts     # WooCommerce type definitions
│   ├── wordpress.ts         # WordPress API functions
│   └── wordpress.d.ts       # WordPress type definitions
├── site.config.ts           # Site metadata
└── menu.config.ts           # Navigation configuration
```

## WooCommerce Setup

### 1. Generate API Credentials

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set permissions to **Read/Write**
4. Copy the Consumer Key and Consumer Secret to your `.env.local`

### 2. Configure Payment Gateway

Payment is handled by WooCommerce's native checkout. Configure your payment gateway (Stripe, PayPal, etc.) in **WooCommerce → Settings → Payments**.

After payment, customers are redirected to:
```
https://your-nextjs-site.com/checkout/success
```

### 3. Install Revalidation Plugin

For automatic cache updates when products change:

1. Download [next-revalidate.zip](https://github.com/9d8dev/next-wp/releases/latest/download/next-revalidate.zip)
2. Upload to WordPress via **Plugins → Add New → Upload**
3. Activate and configure in **Settings → Next.js Revalidation**

## Checkout Flow

1. Customer adds items to cart (client-side, localStorage)
2. Customer fills billing form on `/checkout`
3. Order created in WooCommerce (unpaid)
4. Customer redirected to WooCommerce checkout for payment
5. After payment, redirected to `/checkout/success`
6. Cart cleared automatically

## API Functions

### Products

```typescript
import { getProducts, getProductBySlug } from "@/lib/woocommerce";

// Get paginated products
const { data: products, headers } = await getProducts(1, 12, {
  category: 5,
  on_sale: true,
  orderby: "price",
});

// Get single product
const product = await getProductBySlug("product-name");
```

### Categories & Tags

```typescript
import { getAllProductCategories, getProductCategoryBySlug } from "@/lib/woocommerce";

const categories = await getAllProductCategories();
const category = await getProductCategoryBySlug("clothing");
```

### Orders

```typescript
import { createOrder } from "@/lib/woocommerce";

const order = await createOrder({
  billing: { email: "customer@example.com", ... },
  line_items: [{ product_id: 123, quantity: 2 }],
});

// Redirect to payment
window.location.href = order.payment_url;
```

### Cart (Client-side)

```typescript
import { useCart } from "@/components/shop";

function MyComponent() {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();

  // Add item
  await addItem({
    productId: 123,
    quantity: 1,
    name: "Product Name",
    price: "29.99",
  });
}
```

## Customization

### Site Configuration

Edit `site.config.ts`:

```typescript
export const siteConfig = {
  site_name: "Your Store",
  site_domain: "https://yourstore.com",
  site_description: "Your store description",
};
```

### Navigation

Edit `menu.config.ts`:

```typescript
export const mainMenu = {
  home: "/",
  shop: "/shop",
  blog: "/posts",
};
```

## Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## Troubleshooting

### Products not loading
- Verify WooCommerce REST API credentials are correct
- Check API at `your-site.com/wp-json/wc/v3/products`
- Ensure products are published and visible

### Images not loading
- Add WordPress domain to `WORDPRESS_HOSTNAME`
- Check `next.config.ts` has correct `remotePatterns`

### Checkout redirect fails
- Verify WooCommerce checkout page is configured
- Check payment gateway settings in WooCommerce

### Cart not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [WooCommerce](https://woocommerce.com/) - E-commerce backend

## License

MIT License

## Credits

Built on [next-wp](https://github.com/9d8dev/next-wp) by [9d8](https://9d8.dev).
