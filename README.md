# WorkHive - Freelance Marketplace (Zenvio Capstone - Task 6)

A full-stack freelance platform where clients post projects, freelancers bid, chat, and complete work with ratings.

Live Demo: [Frontend Vercel Link] | [Backend Render Link]
GitHub: (https://github.com/Ahmad-abbasi-007/workhive-capstone)

## Problem
Small businesses struggle to find reliable freelancers, and freelancers waste time on fake clients. Existing platforms take 20% fees and have poor chat.

## Solution
WorkHive: Direct client-freelancer marketplace with:
- Role-based auth (Client posts, Freelancer bids)
- Real-time chat after hiring
- Complete + Rating system for trust
- Search with budget filters, Dashboard with charts, Dark mode

## Architecture
Frontend: React + Vite + React Router + Tailwind (5 pages: Login, Register, Projects, My Projects/My Jobs, Chat, Dashboard)
Backend: Node.js + Express + MongoDB + JWT
Real-time: Polling (3s) for chat (Stretch: WebSockets ready)
Tests: Jest + Supertest (backend), Vitest + RTL (frontend) - 15 tests
