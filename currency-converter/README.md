# 🌍 CurrencyIQ - Intelligent Currency Converter

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)

A professional, production-ready currency converter that goes beyond simple math. **CurrencyIQ** combines real-time financial data with generative AI to provide travelers with instant, context-aware insights about their destination's purchasing power, safety, and culture.

## ✨ Key Features

### 💰 Core Functionality

- **Real-Time Conversion**: Instant conversion between 30+ global currencies using the Frankfurter API.
- **Smart Caching**: In-memory backend caching to minimize API latency and ensure super-fast responses.
- **Interactive Charts**: Historical exchange rate trends (1W, 1M, 3M, 1Y) powered by `Chart.js`.
- **Country Flags**: Visual currency selection with automatic flag integration via `flagcdn`.

### 🤖 AI-Powered Travel Insights (Bento Grid UI)

Click the **floating AI bot** to unlock a smart, context-aware travel dashboard:

- **Buying Power**: "What does 100 USD actully buy in Tokyo?"
- **Safety Score**: Real-time 1-10 safety rating with color-coded visual gauges.
- **Weather Radar**: Instant forecasts and packing advice.
- **Local Eats & Hidden Gems**: Curated recommendations for food and places.
- **Pro Tips**: Cultural do's and don'ts.
- _Powered by Google Gemini 2.0 Pro/Flash with robust fallback mechanisms._

### 🛠️ Engineering Excellence

- **Centralized Configuration**: Single source of truth for all API endpoints (`src/config.js`).
- **Serverless Backend**: Secure `api/gemini.js` function to hide API keys from the client.
- **Resilience & Rate Limiting**:
  - **In-Memory Caching**: Identical requests are served instantly from RAM, saving API quota.
  - **Smart Fallback**: Automatically switches from `Gemini 2.5` to `Gemini 1.5-Flash` if the primary model is busy or rate-limited.
- **Responsive Design**: Mobile-first glassmorphism UI with smooth animations.

### 💡 Why Serverless?

We chose **Vercel Serverless Functions** for three critical reasons:

1.  **Security**: API keys are stored on the server, never exposed to the frontend browser (preventing theft).
2.  **Scalability**: The backend scales automatically from 0 to 1M+ requests without managing a VPS.
3.  **Cost Efficiency**: No idle server costs; you only pay when the API is actually used.

4.  **Cost Efficiency**: No idle server costs; you only pay when the API is actually used.

---

## 🎓 Key Learnings & Advanced Concepts

| Concept         | Implementation in Project                                   |
| :-------------- | :---------------------------------------------------------- |
| **Resilience**  | Scalable **Rate Limit Handling** & **Model Fallbacks**      |
| **Performance** | **In-Memory Server Caching** for low latency                |
| **Security**    | **Vercel Serverless Functions** for secret management       |
| **Analytics**   | **Chart.js** integration for data visualization             |
| **AI**          | **Generative AI (Gemini)** prompt engineering & integration |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)

### Installation
> **⚠️ Note for Cloners**: Please remove the `DeveloperInfo` component (`src/components/DeveloperInfo.jsx`) and its usage in `src/App.jsx` if you are using this for your own project.

1.  **Clone the repository**

    ```bash
    git clone https://github.com/DheerajBaheti06/react-projects.git
    cd currency-converter
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:

    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

    > **Secure By Design**: The API key is ONLY accessible by the serverless backend, never exposed to the browser.

4.  **Run Locally**
    Since this app uses Serverless Functions, use Vercel CLI:
    ```bash
    npx vercel dev
    ```
    - Frontend: `http://localhost:3000`
    - API: `http://localhost:3000/api/gemini`

---

## 📂 Project Structure

```
currency-converter/
├── api/
│   └── gemini.js              # 🛡️ Serverless Backend (Secure Proxy + Caching)
├── src/
│   ├── components/
│   │   ├── GeminiInsights.jsx # 🤖 AI Modal (Bento Grid Layout)
│   │   ├── CurrencyChart.jsx  # 📈 Historical Data Visualization
│   │   ├── InputBox.jsx       # 💱 Reusable Input Component
│   │   └── DeveloperInfo.jsx  # 👨‍💻 Developer Credits
│   ├── hooks/
│   │   ├── useCurrencyInfo.js     # Custom hook for fetching rates
│   │   └── useConvertCurrency.js  # Custom hook for conversion math
│   ├── config.js              # ⚙️ Centralized Frontend Configuration
│   ├── App.jsx                # Main Application Layout
│   └── main.jsx
├── .env                       # Secrets (GitIgnored)
└── vercel.json                # Deployment Config
```

---

## 🛠️ Tech Stack

| Helper                 | Technology                           |
| :--------------------- | :----------------------------------- |
| **Frontend Framework** | React 18 + Vite                      |
| **Styling**            | Tailwind CSS (Glassmorphism)         |
| **Icons**              | Lucide React                         |
| **Charts**             | Chart.js + React-Chartjs-2           |
| **AI Model**           | Google Gemini 2.0 Flash / Pro        |
| **Backend**            | Node.js Serverless Functions         |
| **External APIs**      | Frankfurter (Rates), FlagCDN (Flags) |

---

## 👨‍💻 Developer

**Dheeraj Baheti**

- **GitHub**: [@DheerajBaheti06](https://github.com/DheerajBaheti06)
- **LinkedIn**: [Dheeraj Baheti](https://www.linkedin.com/in/dheeraj-baheti1/)

---

Built with ❤️ using **React** & **Gemini AI**.
