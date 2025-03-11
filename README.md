# 🌤️ Weather App

A sleek weather application that provides **real-time weather updates** and **5-day forecasts** using the [Open-Meteo API](https://open-meteo.com/). Search any location globally, get current weather conditions, and save your favorite spots for quick access.

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🔍 **Location search** with autocomplete
- 🌡️ **Real-time weather**: temperature, feels-like, humidity
- 💨 **Wind speed & precipitation** data
- 📅 **5-day forecast** (min/max temperature & rainfall)
- 💾 **Save favorite locations** with local persistence
- 🚨 **Error handling** with friendly UI messages
- 📱 **Fully responsive UI** for all devices

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/weather-finder.git
cd weather-finder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open the App
```
http://localhost:3000
```

---

## 🖱️ Usage Guide

### 🔎 Search Locations
Type a location name in the search bar (e.g., "London", "Delhi") and select from the suggestions.

### 📍 View Weather Details
After selecting a location, view:

- Current temperature & weather conditions
- Humidity, wind speed, precipitation
- 5-day forecast with temperature range

### 💾 Save Locations
Click "Save Location" to bookmark up to 5 cities. Saved locations will persist even if the page is refreshed.

### 🗑️ Remove Saved Location
Click the Delet icon next to any saved location to remove it from your list.

---

## 🌐 API Reference

| Service   | Endpoint                                              | Parameters                                     |
|-----------|-------------------------------------------------------|------------------------------------------------|
| Geocoding | https://geocoding-api.open-meteo.com/v1/search        | name, count, language, format                  |
| Weather   | https://api.open-meteo.com/v1/forecast                | latitude, longitude, current, daily, timezone  |

---

## 🛠 Technologies Used

### Frontend
- ⚛️ React 18
- 💨 Tailwind CSS
- 📦 Axios

### Tooling
- ⚡ Vite
- 🧪 Jest & React Testing Library
- 📏 ESLint + Prettier

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Coverage Includes:
- API error handling
- Component rendering and layout checks
- Search input and selection interactions
- Forecast display verification

---



---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
3. Make your changes and commit:
```bash
git commit -m "Add new feature"
```
4. Push to your branch:
```bash
git push origin feature/your-feature-name
```
5. Create a Pull Request 🚀

---

## 🙏 Acknowledgments

- Open-Meteo — for providing free weather APIs  
- React — for powering the frontend  
- Tailwind CSS — for elegant styling  
- React Testing Library — for helping write reliable tests