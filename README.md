# Velbuy - Portfolio E-commerce

A full-stack e-commerce portfolio project built with modern web technologies, featuring secure authentication, payment processing, and order management.

**[Live Demo](https://velbuy.nickveles.com)** | **[About the Developer](https://nickveles.com)**

## Features

- **Authentication** - Clerk integration with email/password and Google OAuth
- **Payment Processing** - Stripe checkout with webhook-based order confirmation
- **Database** - PostgreSQL with Prisma ORM for persistent storage
- **Webhooks** - Real-time event handling for Stripe payments and Clerk user sync
- **Order Management** - Complete order history with status tracking in user dashboard
- **Cart Persistence** - Zustand state management with server sync and smart cart merging
- **Responsive Design** - Mobile-friendly UI with dark mode support

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Database | PostgreSQL, Prisma ORM |
| Auth | Clerk |
| Payments | Stripe |
| State | Zustand, TanStack Query |
| Deployment | Vercel, Docker |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (test mode for dev)
- Clerk account (test mode for dev)
- ngrok (for local webhook testing)
- Stripe CLI (for local webhook testing)
- Docker (optional, for local PostgreSQL)

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
NEXT_PUBLIC_BASE_URL=your-website-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-public-test-key
CLERK_SECRET_KEY=your-clerk-test-key
CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Stripe
STRIPE_SECRET_KEY=your-stripe-test-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?schema=public

# docker for development (optional)
DATABASE_NAME=dbname
DATABASE_PASSWORD=password
```

### Installation

```bash
# Install dependencies
npm install

# Set up the database
npm run db:up          # Start PostgreSQL with Docker (optional)
npx prisma migrate dev # Apply migrations
npx prisma generate    # Generate Prisma client

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Webhook Development

For local webhook testing:

```bash
# Clerk webhooks (requires ngrok)
npm run whdev:clerk

# Stripe webhooks (requires Stripe CLI)
npm run whdev:stripe
```

## Project Structure

```
├── app/                   # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── cart/          # Cart endpoints
│   │   ├── checkout/      # Checkout session
│   │   ├── products/      # Product catalog
│   │   └── webhooks/      # Stripe & Clerk webhooks
│   ├── (dashboard)/       # Protected user dashboard
│   └── (auth)/            # Authentication pages
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and integrations
├── prisma/                # Database schema
└── store/                 # Zustand state management
```

## Key Integrations

### Clerk Webhooks

Handles user lifecycle events:
- `user.created` - Creates user record and cart in database
- `user.updated` - Syncs profile changes
- `user.deleted` - Cascade deletes user data

### Stripe Webhooks

Processes payment events:
- `checkout.session.completed` - Creates order from pending checkout, clears cart

## Testing Payments

For dev, run Stripe in test mode. Use [Stripe test cards](https://docs.stripe.com/testing#cards):

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined card |

## Image Credits

**Photography (Unsplash):**
- [@ryanhoffman007](https://unsplash.com/@ryanhoffman007)
- [@mannydream](https://unsplash.com/@mannydream)
- [@molllteaser](https://unsplash.com/@molllteaser)

**Product Mockups:**
- [mockups-design.com](https://mockups-design.com)

## License

This project is for portfolio and educational purposes. See [LICENSE](LICENSE) for details.

## Author

**Nick Veles** - [nickveles.com](https://nickveles.com) | [GitHub](https://github.com/NickVeles) | [LinkedIn](https://linkedin.com/in/nickveles)
