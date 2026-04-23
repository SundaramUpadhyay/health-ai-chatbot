# Health AI Chatbot - Frontend

A modern Next.js frontend for the Health AI Chatbot application with real-time disease analysis and consultation features.

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context
- **HTTP Client**: Axios

## Project Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── admin/           # Admin dashboard
│   ├── chat/            # Chat interface
│   ├── dashboard/       # User dashboard
│   ├── login/           # Login page
│   └── signup/          # Signup page
├── components/          # React components
│   ├── ui/             # UI component library
│   ├── admin/          # Admin components
│   └── ai-chat.tsx     # AI chat component
├── contexts/           # React contexts
│   ├── auth-context.tsx
│   └── language-context.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── styles/             # Global styles
└── public/             # Static assets
```

## Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

## Development

```bash
# Start development server
npm run dev
# or
pnpm dev

# Open http://localhost:3000
```

## Building for Production

```bash
# Build the project
npm run build

# Start production server
npm run start
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Health AI Chatbot
# Add other variables as needed
```

## Key Features

- 🤖 AI-powered disease analysis
- 💬 Real-time chat interface
- 📊 Health dashboard
- 👥 Admin panel
- 🌍 Multi-language support
- 📱 Responsive design

## API Integration

The frontend connects to the backend API for:
- Disease analysis (`/api/ai/analyze-disease`)
- Chat conversations (`/api/conversations`)
- User authentication (`/api/auth`)
- Reports generation (`/api/reports`)

## Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
