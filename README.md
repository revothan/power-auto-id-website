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
- **UI Components**: shadcn/ui, Tailwind CSS
- **Routing**: React Router
- **Backend**: Supabase (PostgreSQL)
- **SEO**: React Helmet Async
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

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

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in your Supabase credentials in the `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
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
│   ├── cars/      # Car-related components
│   ├── layout/    # Layout components (header, footer, etc.)
│   └── ui/        # shadcn/ui components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utilities and helper functions
│   └── supabase/  # Supabase client setup and functions
├── pages/         # Page components
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Database Schema

### Cars Table

| Column         | Type           | Description                        |
|----------------|----------------|------------------------------------|
| id             | UUID           | Primary key                        |
| created_at     | timestamp      | When the record was created        |
| updated_at     | timestamp      | When the record was last updated   |
| make           | text           | Car manufacturer                   |
| model          | text           | Car model                          |
| year           | integer        | Manufacturing year                 |
| color          | text           | Car color                          |
| transmission   | enum           | 'manual' or 'automatic'            |
| fuel_type      | enum           | 'gasoline', 'diesel', etc.         |
| mileage        | integer        | Odometer reading in kilometers     |
| price          | integer        | Car price in IDR                   |
| market_price   | integer        | Market price for comparison        |
| features       | text[]         | Array of car features              |
| description    | text           | Detailed description               |
| vin            | text           | Vehicle Identification Number      |
| engine_size    | integer        | Engine capacity in cc              |
| power          | integer        | Engine power in HP                 |
| seats          | integer        | Number of seats                    |
| doors          | integer        | Number of doors                    |
| condition      | enum           | 'excellent', 'good', 'fair'        |
| sold           | boolean        | Whether the car is sold            |
| sold_at        | timestamp      | When the car was sold              |
| title_image    | text           | URL to main image                  |
| images         | text[]         | Array of image URLs                |
| slug           | text           | URL-friendly identifier            |

### Testimonials Table

| Column            | Type           | Description                     |
|-------------------|-----------------|---------------------------------|
| id                | UUID           | Primary key                     |
| created_at        | timestamp      | When the record was created     |
| customer_name     | text           | Customer's name                 |
| customer_location | text           | Customer's location             |
| rating            | integer        | Rating (1-5 stars)              |
| content           | text           | Testimonial content             |
| image             | text           | URL to customer's image          |
| car_id            | UUID           | Reference to purchased car      |

## SEO Optimization

The website is optimized for search engines with the following features:

- Semantic HTML structure
- Proper meta tags and Open Graph tags
- Descriptive page titles and meta descriptions
- Schema.org structured data
- Optimized for target keywords
- Mobile-friendly responsive design
- Fast loading times
- Secure HTTPS connection

## Supabase Setup

1. Create a new Supabase project
2. Set up database tables according to the schemas above
3. Enable storage for car images and testimonial images
4. Configure RLS (Row Level Security) policies for public access to cars and testimonials
5. Create a public bucket for storing images

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy your site

### Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Set up build commands and deploy your site

## SEO Keywords

Primary keywords targeted by this website:

- jual mobil second di bsd
- jual mobil murah di bsd
- jual mobil termurah seindonesia
- jual mobil di bsd
- jual mobil di tangerang
- jual mobil murah di tangerang

## Performance Optimization

The website is optimized for performance with:

- Code splitting and lazy loading
- Image optimization
- Minimal dependencies
- Efficient CSS with Tailwind
- Caching strategies
- Compressed assets

## Accessibility

The website follows accessibility best practices:

- Semantic HTML
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Focus indicators
- Alternative text for images

## Future Enhancements

Potential future enhancements:

- Admin dashboard for inventory management
- Online booking system for test drives
- Car comparison tool
- Financing calculator
- Live chat support
- Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions about this project, please contact:

- Email: info@powerautoid.com
- Phone: 0811-9288-855
