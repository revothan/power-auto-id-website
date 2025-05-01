# Power Auto ID Website

Modern SEO-optimized website for Power Auto ID, a used car dealership in BSD, Tangerang.

## Features

- 🚗 Showcase vehicle inventory with detailed listings
- 🔍 Advanced search and filtering options
- 🤝 Built-in lead generation (WhatsApp integration)
- 📱 Fully responsive design for all devices
- 🔧 SEO optimized for better search engine rankings
- ⚡ Fast performance and optimal loading times

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase
- **SEO**: React Helmet Async
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/revothan/power-auto-id-website.git

# Navigate to the project directory
cd power-auto-id-website

# Install dependencies
npm install
# or
yarn
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

### Build

```bash
# Build for production
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── assets/        # Static assets (images, icons, etc.)
├── components/    # Reusable UI components
│   ├── common/    # Common components (buttons, inputs, etc.)
│   ├── layout/    # Layout components (header, footer, etc.)
│   └── sections/  # Page section components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utilities and helper functions
│   └── supabase/  # Supabase client setup and functions
├── pages/         # Page components
├── routes/        # Route configuration
├── types/         # TypeScript type definitions
└── styles/        # Global styles
```

## License

MIT
