# Travel Photo Frontend (Ocean Professional)

This React app implements:
- Login (email/password) via FastAPI backend
- Header with brand, navigation, and location search
- Responsive photo grid for your photos and Unsplash images
- Ocean Professional theme (blue primary, amber secondary, rounded corners, soft shadows)

Configuration:
- Copy .env.example to .env and set REACT_APP_BACKEND_URL to your FastAPI service URL.

Scripts:
- npm start
- npm run build

Notes:
- Login hits POST /auth/login, profile via GET /auth/me
- My photos via GET /photos?location=...
- Search Unsplash via GET /unsplash/search?query=...
