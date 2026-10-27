# AI-Based Smart Farming Recommendation and Field Monitoring

A production-ready Full Stack MERN (MongoDB Atlas, Express.js, React, Node.js) platform built with TypeScript to support agricultural decision-making for farmers.

---

## 1. Project Overview

The **AI-Based Smart Farming Recommendation and Field Monitoring** platform assists farmers with data-driven agronomic recommendations and field microclimate monitoring. By processing soil chemical attributes (Nitrogen, Phosphorus, Potassium, pH) and environmental telemetry (temperature, humidity, rainfall, soil moisture), the platform provides:
* **Targeted Crop Recommendations** with confidence ratings and agricultural advice.
* **Smart Irrigation Advisories** based on root-zone moisture deficits and evapotranspiration.
* **Fertilizer Guidance** identifying specific macronutrient deficiencies and soil pH balancing.
* **Live Field Monitoring** with visual metric trends and crop selection.
* **Actionable Pest Risk Decision Support**: Multi-stage guidance (Why → What should I do now? → Recommended Management / What should I use now? → Alternative / Safer Option → Monitor Again).
* **Audited Historical Archive** persisted permanently in MongoDB Atlas.

---

## 2. Key Features

* **Real Persistent Storage**: All user records, soil readings, recommendations, and alerts are stored in MongoDB Atlas via Mongoose. No fake or mock data.
* **Live Password Policy Checklist**: Interactive dynamic validation requiring uppercase initial character, lowercase letters, numbers, symbols, and minimum 8 characters with no spaces.
* **Secure JWT Authentication**: Passwords hashed with `bcryptjs` (salt rounds: 10), state-of-the-art token-based session handling, and protected routes.
* **Role-Isolated Data Security**: Multi-tenant separation ensures users only view their personal fields, advisories, and alert logs.
* **Rule-Based Agronomic Intelligence**: Grounded in physiological crop thresholds (Rice, Wheat, Maize, Cotton, Tomato, Potato, Sugarcane, Millets, Pulses, Groundnut).
* **Responsive Presentation UI**: Modern agricultural aesthetic with Tailwind CSS and Lucide React icons.

---

## 3. MERN Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Responsive, lightning-fast Single Page Application (SPA) |
| **Styling** | Tailwind CSS + Lucide Icons | Clean agriculture-themed user experience |
| **Routing** | React Router v6 | Declarative client routing with ProtectedRoute guards |
| **Backend** | Node.js + Express.js + TypeScript | RESTful API server with centralized error handling |
| **Database** | MongoDB Atlas + Mongoose | Cloud document database with strict schema validation |
| **Auth** | bcryptjs + JSON Web Tokens (JWT) | Safe cryptographic password hashing and authentication |
| **Containerization** | Docker + Docker Compose | Multi-stage production container setup |

---

## 4. Architecture Diagram

```
+-------------------------------------------------------------+
|                     Client Browser                          |
|             React 18 + TypeScript + Tailwind                |
+------------------------------+------------------------------+
                               |
                        HTTPS / JSON REST
                               |
                               v
+-------------------------------------------------------------+
|                  Express Backend API Server                 |
|             (Node.js + Express + TypeScript)                |
|                                                             |
|  [ Auth Middleware (JWT) ]    [ Centralized Error Handler ] |
|                                                             |
|  * /api/auth               * /api/monitoring                |
|  * /api/recommendations    * /api/alerts                    |
|  * /api/dashboard          * /api/health                    |
|                                                             |
|          [ Agronomic & Alert Recommendation Engines ]       |
+------------------------------+------------------------------+
                               |
                        Mongoose Driver
                               |
                               v
+-------------------------------------------------------------+
|                      MongoDB Atlas                          |
|                     (Cloud Database)                        |
|                                                             |
|  Collections: users, croprecommendations,                   |
|  irrigationrecommendations, fertilizerrecommendations,      |
|  monitoringdatas, alerts                                    |
+-------------------------------------------------------------+
```

---

## 5. Folder Structure

```
smart-farming-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts              # MongoDB Atlas connection handler
│   │   ├── controllers/
│   │   │   ├── authController.ts        # Register, login, profile
│   │   │   ├── recommendationController.ts # Crop, irrigation, fertilizer, history
│   │   │   ├── monitoringController.ts  # Add & retrieve field sensor readings
│   │   │   ├── alertController.ts       # Retrieve & acknowledge risk alerts
│   │   │   └── dashboardController.ts   # Consolidated metrics & user welcome
│   │   ├── middleware/
│   │   │   ├── auth.ts                  # JWT token verification
│   │   │   └── errorHandler.ts          # Centralized error responses
│   │   ├── models/
│   │   │   ├── User.ts                  # User schema & password exclusion
│   │   │   ├── CropRecommendation.ts    # Crop advisory schema
│   │   │   ├── IrrigationRecommendation.ts # Water level schema
│   │   │   ├── FertilizerRecommendation.ts # NPK nutrient schema
│   │   │   ├── MonitoringData.ts        # Sensor telemetry schema
│   │   │   └── Alert.ts                 # Risk indicators schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── recommendationRoutes.ts
│   │   │   ├── monitoringRoutes.ts
│   │   │   ├── alertRoutes.ts
│   │   │   ├── dashboardRoutes.ts
│   │   │   └── healthRoutes.ts
│   │   ├── services/
│   │   │   ├── cropRecommendationEngine.ts
│   │   │   ├── irrigationEngine.ts
│   │   │   ├── fertilizerEngine.ts
│   │   │   └── alertEngine.ts
│   │   ├── utils/
│   │   │   └── passwordValidator.ts     # Multi-rule regex validator
│   │   ├── scripts/
│   │   │   ├── testConnection.ts        # Atlas connection tester
│   │   │   └── runUnitTests.ts          # Automated validation test suite
│   │   └── index.ts                     # Express entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx               # Responsive nav & logout
│   │   │   ├── PasswordChecklist.tsx    # Live dynamic validation UI
│   │   │   ├── ProtectedRoute.tsx       # Auth route guard
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # JWT session provider
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx          # Presentation hero & overview
│   │   │   ├── RegisterPage.tsx         # Live checklist registration
│   │   │   ├── LoginPage.tsx            # Clean secure sign-in
│   │   │   ├── DashboardPage.tsx        # Personal farmer hub
│   │   │   ├── CropRecommendationPage.tsx
│   │   │   ├── IrrigationRecommendationPage.tsx
│   │   │   ├── FertilizerRecommendationPage.tsx
│   │   │   ├── MonitoringPage.tsx       # Sensor logging & telemetry
│   │   │   ├── AlertsPage.tsx           # Risk indicators & resolve
│   │   │   └── HistoryPage.tsx          # Persistent audit trail
│   │   ├── services/
│   │   │   └── api.ts                   # Fetch wrapper with Bearer auth
│   │   ├── types/
│   │   │   └── index.ts                 # Type definitions
│   │   ├── App.tsx                      # Routes
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. MongoDB Atlas Setup

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Free M0 Cluster.
3. Under **Security -> Database Access**, create a database user (e.g. `agri_user`) and set a secure password.
4. Under **Security -> Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) for live demo purposes.
5. In your Cluster Overview, click **Connect -> Drivers -> Node.js** and copy the connection string.
6. Paste the string into `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_farming?retryWrites=true&w=majority
   ```

---

## 7. Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_farming?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_secret_jwt_key_smart_farming_2026

# Server Port
PORT=5000

# Environment Mode
NODE_ENV=development
```

---

## 8. Authentication & Password Rules

### Password Requirements (Strictly Enforced on Frontend and Backend):
1. **Minimum 8 characters**.
2. **First character MUST be an uppercase letter** (`A-Z`).
3. **Must contain at least one lowercase letter** (`a-z`).
4. **Must contain at least one number** (`0-9`).
5. **Must contain at least one special symbol** (`!@#$%^&*`).
6. **No spaces are allowed**.

### Live Dynamic Password Checklist:
As the user types in the registration field, the checklist immediately updates:
* ❌ / ✅ At least 8 characters
* ❌ / ✅ Starts with a capital letter
* ❌ / ✅ Contains lowercase letter
* ❌ / ✅ Contains a number
* ❌ / ✅ Contains special symbol
* ❌ / ✅ No spaces

### Password Hashing:
* Passwords are hashed using `bcryptjs` with **10 salt rounds**.
* The original plain-text password is **never stored**, **never logged**, and **never returned** in API responses.

---

## 9. How to Run Locally

### Prerequisites
* **Node.js** (v18 or higher; tested on v24)
* **npm**

### Step 1: Configure Backend Environment
Open `backend/.env` and replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

### Step 2: Start the Backend Server
```bash
cd backend
npm run dev
```
You will see:
```
✅ MongoDB connected successfully: cluster0-shard-00-00.xxxxx.mongodb.net
🗄️ Database Name: smart_farming
🌾 Server running on port 5000
🌱 Health check: http://localhost:5000/api/health
```

### Step 3: Start the Frontend Application
Open a second terminal window:
```bash
cd frontend
npm run dev
```
Open your browser at:
👉 **`http://localhost:3000`**

---

## 10. How to Run with Docker

To build and run both the Express backend and React frontend with Docker Compose:

```bash
docker compose up --build
```
* **Frontend**: `http://localhost:3000`
* **Backend API**: `http://localhost:5000`

---

## 11. REST API Endpoints

### Authentication
* `POST /api/auth/register` - Create new user account with strict password validation.
* `POST /api/auth/login` - Authenticate with email/password and issue JWT token.
* `GET /api/auth/me` - Fetch authenticated user profile (Protected).

### Dashboard
* `GET /api/dashboard` - Get consolidated farm statistics and user name (Protected).

### Recommendations
* `POST /api/recommendations/crop` - Compute & save crop recommendation (Protected).
* `POST /api/recommendations/irrigation` - Compute & save irrigation advisory (Protected).
* `POST /api/recommendations/fertilizer` - Compute & save fertilizer formulation (Protected).
* `GET /api/recommendations/history` - Retrieve all historical recommendations (Protected).

### Field Monitoring
* `POST /api/monitoring` - Record manual sensor reading & trigger alerts (Protected).
* `GET /api/monitoring` - Retrieve user's historical field telemetry (Protected).

### Risk Alerts
* `GET /api/alerts` - List environmental and pathogen risk indicators (Protected).
* `PATCH /api/alerts/:id/resolve` - Toggle alert resolution status (Protected).

### Health Check
* `GET /api/health` - Server uptime, timestamp, and MongoDB Atlas status (Public).

---

## 12. MongoDB Atlas Collections

1. `users`: Name, lowercase unique email, bcrypt password hash, location, timestamps.
2. `croprecommendations`: N, P, K, pH, temp, humidity, rainfall, soil type, location, recommended crop, confidence, reason, advice, alternative crops.
3. `irrigationrecommendations`: Crop, soil moisture, temp, humidity, rainfall, decision (`YES`/`NO`), suggested level, rationale.
4. `fertilizerrecommendations`: Crop, N, P, K, pH, deficient nutrients list, suggested category, application advisory, expert disclaimer.
5. `monitoringdatas`: Plot name, temperature, humidity, soil moisture, rainfall, crop health condition, notes, recorded timestamp.
6. `alerts`: Severity (`Critical`, `High`, `Moderate`, `Low`), title, message, risk category, resolved status, reference to monitoring event.

---

## 13. How Data Persistence Works

Every recommendation and monitoring entry submitted by the user is routed through Express controllers into dedicated Mongoose schemas and written to MongoDB Atlas. 
* The user's MongoDB `ObjectId` is extracted from the verified JWT payload.
* User data is separated: queries filter by `{ userId: req.user.id }`.
* Even after full browser refresh, clearing frontend caches, or restarting the backend server, historical data remains permanently available via `GET /api/recommendations/history`.

---

## 14. College Live Demo Step-by-Step Flow

1. **Open Landing Page**: Visit `http://localhost:3000` and present the modern MERN architecture overview.
2. **Registration & Live Password Validation**:
   * Click **Register**.
   * Type `smart@123` -> Observe red ❌ on "Starts with a capital letter".
   * Change to `Smart123` -> Observe red ❌ on "Contains special symbol".
   * Change to `Smart@12` -> Observe red ❌ on "At least 8 characters".
   * Type valid password `Smart@123` -> All 6 rules show green ✅!
   * Fill Name and Location, click **Register**.
3. **Login Verification**:
   * Log out or sign in directly with the created credentials.
   * Verify that wrong password returns clear error message and prevents access.
   * Login with correct credentials to enter the **Farmer Dashboard**.
4. **Dashboard**:
   * Observe personalized welcome message: *"Welcome back, <Registered User Name>!"*.
5. **Crop Recommendation**:
   * Click **Crop Advisory**.
   * Click the quick preset *"🌾 Rice (High Rain/Clay)"* or enter custom soil metrics.
   * Click **Get Crop Recommendation** -> Observe calculated match, confidence %, rationale, and farming advice.
6. **Irrigation & Fertilizer Advisories**:
   * Run Irrigation Check (e.g. low moisture 22% -> *IRRIGATION REQUIRED: YES*).
   * Run Fertilizer Check -> View deficient nutrients and advisory warning banner.
7. **Field Monitoring & Alert Generation**:
   * Navigate to **Monitoring**.
   * Enter a critical condition: Soil moisture `20%`, Temp `35°C`, Humidity `84%`.
   * Click **Save Monitoring Log**.
   * Notice alerts generated: Soil Moisture Deficit and Pest & Fungal Risk Indicator.
8. **View History & Persistence**:
   * Navigate to **History** -> All recommendations are listed with timestamps.
   * Refresh browser or restart server -> Verify all records remain intact in MongoDB Atlas!

---

## 15. Future Enhancements

* Integration with IoT ESP32/LoRa field hardware for automated automated sensor telemetry.
* Computer vision leaf disease detection using TensorFlow.js.
* Multilingual support for regional agricultural languages.

