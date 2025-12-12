# Docker Setup Guide

This project is fully Dockerized for easy development and deployment.

## For Contributors

When contributing to this project, **NEVER commit actual credentials**. Follow these steps:

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/Sunny-Saurya/HireMe.git
cd HireMe

# The .env.example and docker-compose.yml have placeholders
# You need to add your own credentials locally
```

### 2. Get Your API Keys

#### Clerk (Authentication)
1. Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/)
2. Sign up or log in
3. Create a new application
4. Copy these values:
   - **Publishable Key** (starts with `pk_`)
   - **Webhook Secret** (from Webhooks section)

#### Cloudinary (Image Storage)
1. Go to [https://console.cloudinary.com/](https://console.cloudinary.com/)
2. Sign up or log in
3. From the Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configure Locally

Edit `docker-compose.yml` and replace the placeholder values:

```yaml
environment:
  # Replace these with your actual values
  - CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
  - CLOUDINARY_NAME=your_cloud_name
  - CLOUDINARY_API_KEY=123456789012345
  - CLOUDINARY_SECRET_KEY=your_actual_secret_key
```

**Important Notes:**
- ✅ These credentials are for YOUR LOCAL TESTING only
- ❌ DO NOT commit the modified `docker-compose.yml` with your credentials
- ✅ The `.gitignore` is configured to ignore `.env` files
- ✅ Use placeholder values when creating PRs

### 4. Run the Application

```bash
# Start all services
docker compose up -d

# Check logs
docker compose logs -f app

# You should see:
# ✅ "Database Connected"
# ✅ "Server is running on port 5000"
# ✅ No Clerk errors (if configured correctly)
```

### 5. Before Committing

```bash
# Check what you're committing
git status
git diff

# Make sure docker-compose.yml shows ONLY placeholder values:
# ❌ NOT: CLERK_WEBHOOK_SECRET=whsec_abc123realkey
# ✅ YES: CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here

# If you accidentally modified docker-compose.yml, reset it:
git checkout docker-compose.yml
```

## For Deployment

### Option 1: Using Environment Variables (Recommended)

Most hosting platforms (Heroku, Railway, Render, etc.) allow setting environment variables through their dashboard. This is the **recommended approach** as it keeps credentials out of your code.

### Option 2: Docker Secrets (Production)

For production deployments, use Docker secrets or external secret management:

```yaml
services:
  app:
    environment:
      - CLERK_WEBHOOK_SECRET_FILE=/run/secrets/clerk_webhook
    secrets:
      - clerk_webhook

secrets:
  clerk_webhook:
    external: true
```

## Common Issues

### "Publishable key is missing"
- You haven't configured Clerk credentials
- Make sure to update `docker-compose.yml` with real values
- Restart: `docker compose restart app`

### Port conflicts
- Change ports in `docker-compose.yml` if needed:
  ```yaml
  ports:
    - "8080:5000"  # Use 8080 instead of 3000
  ```

### MongoDB connection issues
- Make sure MongoDB container is running: `docker compose ps`
- Check logs: `docker compose logs mongodb`

## Architecture

```
┌─────────────────────────────────────┐
│     Docker Compose Network          │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │   App    │◄────►│ MongoDB  │   │
│  │  :3000   │      │  :27018  │   │
│  └──────────┘      └──────────┘   │
│       │                             │
└───────┼─────────────────────────────┘
        │
        ▼
   localhost:3000
```

## Files Structure

```
HireMe/
├── Dockerfile              # Multi-stage build for production
├── docker-compose.yml      # Services orchestration (MODIFY LOCALLY ONLY)
├── .dockerignore          # Files to exclude from Docker build
├── .env.example           # Template for environment variables
└── .gitignore             # Includes .env to prevent credential leaks
```

## Questions?

- Check the main [README.md](README.md)
- Open an issue on GitHub
- Review existing PRs for examples

**Remember: Security first! Never commit credentials!** 🔒
