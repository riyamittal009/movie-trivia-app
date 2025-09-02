# Movie Trivia App

A Next.js web application that generates interesting movie facts using AI. Users sign in with Google, select their favorite movie, and get fascinating trivia facts powered by OpenAI.

## Features

- 🔐 Google OAuth authentication
- 🎬 Favorite movie selection and storage
- 🤖 AI-generated movie facts using OpenAI
- 💾 PostgreSQL database with Prisma ORM
- 🔄 New facts on page refresh
- 📱 Responsive design

## Prerequisites

Before running this project locally, you'll need:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v17 or higher)
- **OpenAI API Key**

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd movie-trivia-app
npm install
```

### 2. Set Up PostgreSQL Database Locally

**Recommended: Using Homebrew (macOS)**

```bash
# Install PostgreSQL
brew install postgresql@17

# Start PostgreSQL service
brew services start postgresql@17

# Create database
createdb movie_trivia_app
```

### 3. Get OpenAI API Key

- **Option A**: Get your own key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Option B**: Contact the project maintainer for a shared key

### 4. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/movie_trivia_app"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

**Important**:

- Replace `your-random-secret-key-here` with a random string
- Use your actual OpenAI API key (or contact maintainer for shared key)

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **First Time**: Select your favorite movie and save it
3. **Returning Users**: Automatically see facts about your saved movie
4. **Get New Facts**: Refresh the page to get new AI-generated facts
5. **Sign Out**: Use the logout button to sign out

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── movie-fact/            # OpenAI movie facts API
│   │   ├── save-movie/            # Save user's favorite movie
│   │   └── get-movie/             # Retrieve user's favorite movie
│   ├── login/                     # Login page
│   ├── newuser/                   # First-time user movie selection
│   └── page.tsx                   # Main dashboard
├── lib/
│   └── prisma.ts                  # Prisma client configuration
└── middleware.ts                  # Authentication middleware
prisma/
└── schema.prisma                  # Database schema
```

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel-ready

## Troubleshooting

**Database Connection Issues:**

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**Authentication Issues:**

- Ensure NEXTAUTH_SECRET is set
- Google OAuth is preconfigured in the app

**OpenAI API Issues:**

- Verify API key is valid
- Check OpenAI account has credits
- Contact maintainer for shared key if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request
