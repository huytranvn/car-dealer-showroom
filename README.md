# Car Showroom

A modern Next.js application for browsing cars using Material UI.

## Features

- Browse cars from the backend API
- Filter by maximum price
- Sort by price or registered year
- Pagination support
- Responsive grid layout
- Modern Material UI design

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables (optional):
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## API Configuration

The app connects to the backend API at `/v1/cars/public`. By default, it expects the backend to be running at `http://localhost:8000`. You can change this by setting the `NEXT_PUBLIC_API_URL` environment variable.

## Demo

<video width="960" heigth="720" controls>
    <source src="docs/videos/demo.mov" type="video/mp4">
</video>
