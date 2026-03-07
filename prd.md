# Product Requirements Document: Aesthetic Portfolio

## Overview
A lightweight, static single-page application (SPA) portfolio featuring an ultra-aesthetic, minimalist grid-based design with light/dark mode support. The portfolio's content is entirely dynamic, driven by a `data.json` file. It is optimized for easy deployment to Vercel.

## Key Features
1. **Dynamic Content rendering**: The SPA uses client-side JavaScript to fetch and render data from `data.json`.
2. **Light/Dark Mode**: High-contrast grayscale aesthetic with a sun/moon toggle.
3. **Glassmorphism**: Premium UI elements with backdrop blur and fluid layouts.
4. **Vercel Ready**: A purely static architecture (HTML/CSS/JS) that can be instantly deployed.

## Architecture
- **Frontend**: Vanilla HTML/CSS/JS. No build step or heavy frameworks required.
- **Data Storage**: Local JSON file (`data.json`) and local file system for assets (e.g., `assets/` folder). Updates are done manually in the repository and pushed to deploy.

## Content Schema (data.json)
- `profile`: name, email, location, availability, image (path), cv (path), cgpa
- `about`: string
- `skills`: array of strings
- `techstack`: array of objects (category, items)
- `experience`: array of objects (role, company, duration, details)
- `internships`: array of objects (role, company, duration, details)
- `projects`: array of objects (title, date, description, link)
