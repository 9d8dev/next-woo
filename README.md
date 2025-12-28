# Next Woo

A headless WooCommerce storefront built with Next.js 16, React 19, and TypeScript.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-woo&env=WORDPRESS_URL,WORDPRESS_HOSTNAME,WORDPRESS_WEBHOOK_SECRET,NEXT_PUBLIC_WORDPRESS_URL,WC_CONSUMER_KEY,WC_CONSUMER_SECRET&envDescription=WordPress%20URL%2C%20hostname%20for%20images%2C%20webhook%20secret%2C%20and%20WooCommerce%20API%20credentials&project-name=next-woo&repository-name=next-woo&demo-title=Next.js%20WooCommerce%20Starter&demo-url=https%3A%2F%2Fnext-woo.com)

<!-- Add your screenshot here -->
<!-- ![Next Woo Screenshot](screenshot.png) -->

## Table of Contents

- [Features](#features)
- [What's Included](#whats-included)
- [Setup](#setup)
- [Architecture](#architecture)
- [API Functions](#api-functions)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

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

## What's Included

| Feature | Implementation |
|---------|---------------|
| Product browsing | Next.js pages with WooCommerce API |
| Product search & filters | Server-side with URL params |
| Shopping cart | Client-side with localStorage |
| Checkout form | Next.js form, order created via API |
| Payment processing | **Redirects to WooCommerce** (Stripe, PayPal, etc.) |
| Account management | **Redirects to WooCommerce** My Account |
| Order confirmation | Next.js success page |
| Blog | WordPress posts via REST API |

### Why Redirect for Payment & Accounts?

Instead of building custom Stripe integration and authentication:
- **Security** - WooCommerce handles PCI compliance
- **Flexibility** - Store owner can change payment gateways without code changes
- **Simplicity** - No auth infrastructure to maintain
- **Battle-tested** - WooCommerce's checkout is proven at scale

## Setup

### Step 1: Clone & Install

```bash
git clone https://github.com/9d8dev/next-woo.git
cd next-woo
pnpm install
```

### Step 2: Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# WordPress/WooCommerce Site
WORDPRESS_URL="https://your-wordpress-site.com"
WORDPRESS_HOSTNAME="your-wordpress-site.com"
NEXT_PUBLIC_WORDPRESS_URL="https://your-wordpress-site.com"

# Webhook secret (generate with: openssl rand -base64 32)
WORDPRESS_WEBHOOK_SECRET="your-secret-key-here"

# WooCommerce API (Step 3)
WC_CONSUMER_KEY="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WC_CONSUMER_SECRET="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Step 3: WooCommerce API Credentials

1. Go to **WooCommerce → Settings → Advanced → REST API**
2. Click **Add Key**
3. Set permissions to **Read/Write**
4. Copy Consumer Key and Consumer Secret to `.env.local`

### Step 4: Payment Gateway

Configure your payment gateway in **WooCommerce → Settings → Payments**.

**Important:** Set the return URL to redirect back to your Next.js site after payment:
```
https://your-nextjs-site.com/checkout/success
```

### Step 5: Revalidation Plugin (Optional)

For automatic cache updates when products change:

1. Download [next-revalidate.zip](https://github.com/9d8dev/next-wp/releases/latest/download/next-revalidate.zip)
2. Upload to WordPress via **Plugins → Add New → Upload**
3. Configure in **Settings → Next.js Revalidation** with your Next.js URL and webhook secret

### Step 6: Run Development Server

```bash
pnpm dev
```

Your site is now running at `http://localhost:3000`.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│    Next.js      │ ◄─────► │   WooCommerce   │
│   (Frontend)    │   API   │    (Backend)    │
│                 │         │                 │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ ┌───────────────────────┐ │
         │ │      User Flow        │ │
         │ └───────────────────────┘ │
         │                           │
         ▼                           ▼
   ┌──────────┐               ┌──────────┐
   │  Browse  │               │  Payment │
   │   Cart   │ ──redirect──► │  Account │
   │ Checkout │               │  Orders  │
   └──────────┘               └──────────┘
    (Next.js)                (WooCommerce)
```

### Checkout Flow

1. Customer adds items to cart (client-side, localStorage)
2. Customer fills billing form on `/checkout`
3. Order created in WooCommerce via API (unpaid)
4. Customer redirected to `order.payment_url` (WooCommerce checkout)
5. Customer pays via configured gateway (Stripe, PayPal, etc.)
6. WooCommerce redirects to `/checkout/success`
7. Cart cleared automatically

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
- Check payment gateway return URL points to your Next.js domain

### My Account link not working
- Ensure `NEXT_PUBLIC_WORDPRESS_URL` is set correctly
- Verify WooCommerce My Account page exists at `/my-account`

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
