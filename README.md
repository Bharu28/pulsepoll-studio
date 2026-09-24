# PulsePoll Studio

Build a completely NEW frontend for PulsePoll from scratch.

IMPORTANT: I have not started the frontend design yet. Do not assume an existing design, dashboard, or UI components. Start from a blank canvas and create the complete application with a consistent, premium visual identity.

PROJECT: PulsePoll — Real-Time Live Polling Platform

TECH STACK:

React + Vite

Tailwind CSS

Lucide icons

React Router

Connect to my existing Go Gin backend.

DESIGN IDENTITY:
Create a premium, rich, professional SaaS interface using:
Midnight Navy #101426
Deep Indigo #191D38
Royal Violet #6C4CF1
Lavender #B49AFF
Jade Mint #25D9C3
Pearl White #F5F3FF

Use elegant typography, beautiful spacing, subtle gradients, premium cards, smooth animations, and polished responsive layouts.

BUILD ALL PAGES FROM SCRATCH:

Landing page with premium hero, product preview, features, and CTA.

Signup page.

Login page.

Authenticated dashboard with poll statistics and poll cards.

Create poll page with dynamic options and validation.

Public poll voting page with live results.

Share poll modal with copy-link functionality.

Responsive navigation, loading states, error messages, and empty states.

FUNCTIONAL REQUIREMENTS:

Connect to existing backend API.

Signup and login using JWT authentication.

Create polls and retrieve real polls from MongoDB through the backend.

Allow public users to vote.

Display live results using the existing Redis-powered SSE endpoint.

Use EventSource for real-time updates. Do not use setInterval polling.

Keep frontend and backend separate.

BACKEND:
My Go Gin backend already exists. Do not create, replace, or modify it.
Do not use Supabase, Firebase, or mock backend services.
Use VITE_API_URL=http://localhost:8080 for local development.
Inspect the actual API response structures before implementing API integration.

Create clean, reusable React components and a complete working application, not just a landing page or static UI mockup.

The final application must be visually impressive, professional, responsive, and functional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/58440cd2-6e32-408b-933d-c5fce149294e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
