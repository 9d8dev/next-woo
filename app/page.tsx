// Craft Imports
import { Section, Container, Prose } from "@/components/craft";

// Next.js Imports
import Link from "next/link";

// Icons
import {
  ShoppingBag,
  ShoppingCart,
  Layers,
  Pen,
  User,
  CreditCard,
  Folder,
  Tag,
} from "lucide-react";
import { WordPressIcon } from "@/components/icons/wordpress";
import { NextJsIcon } from "@/components/icons/nextjs";
import { WooCommerceIcon } from "@/components/icons/woocommerce";

export default function Home() {
  return (
    <Section>
      <Container>
        <main className="space-y-6">
          <Prose>
            <h1>Headless WooCommerce with Next.js</h1>

            <p>
              This is <a href="https://github.com/9d8dev/next-woo">next-woo</a>, a
              headless WooCommerce storefront built with Next.js 16, React 19,
              and TypeScript. It features a complete e-commerce experience with
              products, cart, checkout, and customer accounts. Built with{" "}
              <a href="https://ui.shadcn.com">shadcn/ui</a>,{" "}
              <a href="https://craft-ds.com">craft-ds</a>, and Tailwind CSS.
            </p>
          </Prose>

          <div className="flex justify-between items-center gap-4">
            <a
              className="h-auto block"
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-woo&env=WORDPRESS_URL,WORDPRESS_HOSTNAME,WORDPRESS_WEBHOOK_SECRET,WC_CONSUMER_KEY,WC_CONSUMER_SECRET&envDescription=WordPress%20URL%2C%20hostname%20for%20images%2C%20webhook%20secret%2C%20and%20WooCommerce%20API%20credentials&project-name=next-woo&repository-name=next-woo&demo-title=Next.js%20WooCommerce%20Starter&demo-url=https%3A%2F%2Fnext-woo.com"
            >
              {/* eslint-disable-next-line */}
              <img
                className="not-prose my-4"
                src="https://vercel.com/button"
                alt="Deploy with Vercel"
                width={105}
                height={32.62}
              />
            </a>

            <div className="flex gap-2 items-center">
              <WooCommerceIcon className="text-foreground" width={36} height={36} />
              <WordPressIcon className="text-foreground" width={32} height={32} />
              <NextJsIcon className="text-foreground" width={32} height={32} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {/* Shop Links */}
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/shop"
            >
              <ShoppingBag size={32} />
              <span>
                Shop
                <span className="block text-sm text-muted-foreground">
                  Browse all products
                </span>
              </span>
            </Link>
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/cart"
            >
              <ShoppingCart size={32} />
              <span>
                Cart
                <span className="block text-sm text-muted-foreground">
                  View your shopping cart
                </span>
              </span>
            </Link>
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/checkout"
            >
              <CreditCard size={32} />
              <span>
                Checkout
                <span className="block text-sm text-muted-foreground">
                  Complete your purchase
                </span>
              </span>
            </Link>

            {/* Account Link - WooCommerce */}
            <a
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/my-account`}
            >
              <User size={32} />
              <span>
                My Account
                <span className="block text-sm text-muted-foreground">
                  Login, orders, and settings
                </span>
              </span>
            </a>
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/posts/categories"
            >
              <Tag size={32} />
              <span>
                Categories
                <span className="block text-sm text-muted-foreground">
                  Browse by category
                </span>
              </span>
            </Link>

            {/* Blog Links */}
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/posts"
            >
              <Pen size={32} />
              <span>
                Blog
                <span className="block text-sm text-muted-foreground">
                  Read our latest posts
                </span>
              </span>
            </Link>
            <Link
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="/pages"
            >
              <Layers size={32} />
              <span>
                Pages
                <span className="block text-sm text-muted-foreground">
                  Static content pages
                </span>
              </span>
            </Link>
            <a
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="https://github.com/9d8dev/next-woo"
            >
              <Folder size={32} />
              <span>
                GitHub
                <span className="block text-sm text-muted-foreground">
                  View source code
                </span>
              </span>
            </a>
            <a
              className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
              href="https://github.com/9d8dev/next-woo/tree/main/plugin"
            >
              <Folder size={32} />
              <span>
                Plugin
                <span className="block text-sm text-muted-foreground">
                  WordPress revalidation plugin
                </span>
              </span>
            </a>
          </div>
        </main>
      </Container>
    </Section>
  );
}
