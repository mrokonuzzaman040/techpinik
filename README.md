# TechPinik - E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js, React, TypeScript, and Supabase. TechPinik is designed for electronics retail in Bangladesh, featuring a complete admin dashboard, customer-facing storefront, and integrated payment/order management system.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products by categories with search functionality
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout System**: Complete checkout flow with district-based delivery charges
- **Order Tracking**: Track order status and view order history
- **Responsive Design**: Mobile-first design that works on all devices
- **Facebook Messenger Integration**: Direct customer support via Facebook Messenger
- **Floating Cart Button**: Quick access to cart from any page

### Admin Features
- **Dashboard**: Comprehensive analytics and statistics
- **Product Management**: Create, edit, and manage products with image uploads
- **Category Management**: Organize products with categories
- **Order Management**: View, update, and process orders with invoice generation
- **Customer Management**: View customer information and order history
- **Slider Management**: Manage homepage hero sliders
- **District Management**: Configure delivery charges by district
- **Invoice Generation**: Professional HTML invoices with company branding

### Technical Features
- **Server-Side Rendering (SSR)**: Fast page loads with Next.js
- **Type Safety**: Full TypeScript implementation
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Secure admin authentication
- **Image Storage**: Supabase Storage for product images
- **State Management**: Zustand for cart and global state
- **UI Components**: Radix UI components with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm/pnpm/yarn
- A Supabase account and project
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd techpinik
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up the database**
   
   Run the Supabase migrations in order:
   ```bash
   # Apply all migrations from supabase/migrations/
   # You can use Supabase CLI or run them manually in Supabase SQL Editor
   ```

5. **Populate sample data (optional)**
   ```bash
   npm run populate-data
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Other Commands
```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 📁 Project Structure

```
techpinik/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API routes
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── products/           # Product pages
│   │   └── ...                 # Other pages
│   ├── components/             # React components
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # UI components
│   │   └── admin/             # Admin components
│   ├── lib/                   # Utility libraries
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── scripts/                   # Utility scripts
```

## 🔐 Configuration

### Facebook Messenger Setup

1. Get your Facebook Page ID:
   - Go to your Facebook Page
   - Settings → Page Info
   - Copy your Page ID

2. Update the component:
   - Edit `src/components/ui/facebook-messenger-button.tsx`
   - Replace `'YOUR_PAGE_ID'` with your actual Page ID
   - Optionally add your Facebook App ID for better integration

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

3. **Run migrations**:
   - Apply all SQL files from `supabase/migrations/` in order
   - Use Supabase SQL Editor or CLI

4. **Set up Storage**:
   - Create a storage bucket named `images`
   - Set public access for product images
   - Configure CORS if needed

5. **Configure RLS Policies**:
   - Row Level Security is configured in migrations
   - Ensure policies are active for proper access control

### Admin User Setup

1. Create an admin user in Supabase:
   ```sql
   -- Use the scripts in supabase/migrations/ for admin setup
   -- Or create manually in Supabase Auth
   ```

2. Access admin dashboard:
   - Navigate to `/admin/login`
   - Use your admin credentials

## 🎨 Customization

### Branding
- **Logo**: Replace `public/logo.png` with your logo
- **Colors**: Update Tailwind colors in `tailwind.config.js`
- **Company Info**: Update company details in invoice template (`src/app/admin/orders/page.tsx`)

### Styling
- Global styles: `src/app/globals.css`
- Component styles: Tailwind classes in components
- Theme colors: Yellow (#fbbf24) is the primary brand color

## 📱 Key Pages

### Customer Pages
- `/` - Homepage with hero slider and featured products
- `/products` - Product listing with filters
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/search` - Product search
- `/categories/[id]` - Category pages

### Admin Pages
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/categories` - Category management
- `/admin/customers` - Customer management
- `/admin/analytics` - Analytics and reports
- `/admin/settings` - System settings

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Authentication**: Secure admin authentication with Supabase Auth
- **Environment Variables**: Sensitive keys stored in `.env.local`
- **Input Validation**: Zod schemas for form validation
- **XSS Protection**: React's built-in XSS protection

## 🧪 Testing

Currently, the project doesn't include automated tests. Manual testing is recommended:
- Test checkout flow
- Verify admin operations
- Test responsive design on multiple devices
- Verify image uploads and storage

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Ensure Node.js 18+ is supported
- Set environment variables
- Run `npm run build` before deployment
- Configure Supabase CORS for your domain

## 📝 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Common Issues

**Issue**: Supabase connection errors
- **Solution**: Verify environment variables are set correctly
- Check Supabase project is active
- Verify network connectivity

**Issue**: Images not loading
- **Solution**: Check Supabase Storage bucket configuration
- Verify image URLs in database
- Check CORS settings

**Issue**: Admin login not working
- **Solution**: Verify admin user exists in Supabase Auth
- Check RLS policies for admin access
- Verify authentication middleware

**Issue**: Cart not persisting
- **Solution**: Check browser localStorage
- Verify Zustand persist configuration
- Clear browser cache if needed

## 📞 Support

For issues and questions:
- Check the documentation in `/doc` folder
- Review migration files for database setup
- Check Supabase logs for database errors

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Database powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**TechPinik** - Your Trusted Electronics Store in Bangladesh
