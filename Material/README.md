# 🚀 PlaceMate - AI-Powered Placement Prep Agent

> Transform your placement preparation with personalized, AI-driven interview practice and feedback loops.

## 📋 Table of Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Backend Integration (n8n)](#backend-integration-n8n)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Integration](#api-integration)
- [Key Services](#key-services)
- [Contributing](#contributing)

---

## 🎯 Overview

**PlaceMate** is an intelligent placement preparation platform that provides personalized daily practice questions, AI-powered feedback, and adaptive learning paths tailored to each student's target companies and weak areas.

Students no longer practice randomly—PlaceMate identifies skill gaps, generates focused practice questions, and provides AI-scored evaluations with improvement suggestions.

**Core Idea:** Automate the placement prep journey through an intelligent n8n-orchestrated workflow that analyzes student profiles and delivers personalized practice content.

---

## 🔍 Problem Statement

### The Challenge
- 📚 Students practice interview questions **without personalized feedback**
- 🎲 No adaptive learning system for **weak area identification**
- ⏰ No structured **daily practice schedule** tailored to targets
- 🔄 Manual feedback loops leading to **inefficient learning**
- 🏢 **No company-specific** question generation

### Our Target Users
- Engineering students preparing for campus placements
- Career switchers targeting specific companies
- Job seekers preparing for technical interviews

---

## 💡 Solution

PlaceMate automates the entire placement prep workflow:

```
Student Profile (Branch, CGPA, Target Companies)
         ↓
    n8n Workflow
         ↓
Generate Daily Aptitude + Technical Quiz
         ↓
Student Submission
         ↓
Claude AI Evaluation & Scoring
         ↓
Feedback + Weak Area Identification
         ↓
Auto-generate Next-Day Focused Practice
```

### Key Value Propositions
✅ **Personalized Learning** - Questions aligned with target companies and skill level
✅ **Daily Practice Loop** - Consistent preparation with tracked progress
✅ **AI-Powered Feedback** - Instant, detailed evaluation of answers
✅ **Adaptive Difficulty** - Automatically adjusts based on performance
✅ **Progress Tracking** - Heatmaps and analytics for weak areas

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + Vite)                   │
│  - Dashboard, Practice Plans, Mock Interviews       │
│  - Resume Parsing, Voice Assistant                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓ HTTP/REST
┌─────────────────────────────────────────────────────┐
│          Backend Orchestration (n8n)                │
│  - User Profile Management                          │
│  - Question Generation Workflows                    │
│  - Answer Evaluation Pipeline                       │
│  - Email/WhatsApp Notifications                     │
└──────────┬──────────────────────────┬───────────────┘
           │                          │
           ↓                          ↓
    ┌────────────────┐       ┌──────────────────┐
    │ Claude API     │       │ Gemini API       │
    │ (Evaluation)   │       │ (Q Generation)   │
    └────────────────┘       └──────────────────┘
           ↓                          ↓
    ┌───────────────────────────────────────────┐
    │   Database (Firebase/SQL)                 │
    │   - Users, Progress, Questions, Answers   │
    └───────────────────────────────────────────┘
```

### n8n Workflows

**Core Workflows Implemented:**

1. **Daily Question Generation Workflow**
   - Triggered: Daily at configured times
   - Input: User profile, target company, weak areas
   - Output: 5-7 interview questions with hints

2. **Answer Evaluation Workflow**
   - Triggered: When student submits answer
   - Process: Claude API scores and provides feedback
   - Output: Score, feedback, improvement areas, ideal answer

3. **Progress Tracking Workflow**
   - Triggered: Daily/Weekly
   - Output: Progress heatmaps, weak area identification
   - Action: Updates next-day questions based on gaps

4. **Notification Workflow**
   - Email: Daily practice reminders + question summaries
   - WhatsApp: Alerts for question generation & feedback ready

---

## ✨ Features

### Core Features

#### 1. **Personalized Practice Plans** 📅
- Company-specific 30-day prep schedules
- Daily aptitude + technical session splits
- Estimated time for each question

#### 2. **AI Question Generation** 🤖
- Google Gemini integration for dynamic Q generation
- Questions tagged by topic, difficulty, and company
- Resource links embedded for quick revision

#### 3. **Smart Answer Evaluation** ✅
- Claude API integration for intelligent scoring
- Detailed feedback on correctness, approach, and edge cases
- Ideal answer comparison
- Score: 0-10 with verdicts (correct/partial/incorrect)

#### 4. **Progress Analytics** 📊
- Heatmap visualization of daily practice
- Topic-wise performance breakdown
- Company-specific success rates
- Weak area identification

#### 5. **Resume Parsing & Analysis** 📄
- Auto-parse PDF resumes
- Extract skills, experience, achievements
- Company-aligned suggestion engine

#### 6. **Voice-Enabled Practice** 🎙️
- Voice input for verbal answer practice
- Speech-to-text conversion
- Real-time transcription feedback

#### 7. **Mock Interview Mode** 🎥
- Simulated company interview environment
- Real-time question delivery
- Time-boxed answers with pressure simulation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Lucide Icons** | Icon library |
| **Axios** | HTTP client |
| **React Router v6** | Client-side routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| **n8n** | Workflow orchestration & automation |
| **Claude API** | Answer evaluation & feedback |
| **Google Gemini** | Question generation |
| **Firebase** | Authentication & data storage |
| **Google Sheets/SQL** | Data persistence |

### Infrastructure
- **Firebase Authentication** - User auth & session management
- **Vercel** - Frontend deployment
- **n8n Cloud** - Workflow hosting
- **Email/WhatsApp APIs** - Notification delivery

---

## 📁 Project Structure

```
PlaceMate/
├── Frontend/                          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation component
│   │   │   ├── ProtectedRoute.jsx    # Auth-protected routes
│   │   │   ├── VoiceAssistant.jsx    # Voice input component
│   │   │   ├── CompanyPlanModal.jsx  # Company selection modal
│   │   │   └── sections/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── FeaturesSection.jsx
│   │   │       ├── DailyPrepSection.jsx
│   │   │       ├── QuestionGenPanel.jsx
│   │   │       ├── HeatmapPanel.jsx
│   │   │       └── ProfilePanel.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Home page
│   │   │   ├── Login.jsx             # Authentication
│   │   │   ├── Register.jsx          # User signup
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── CompanyPlan.jsx       # 30-day prep plan
│   │   │   ├── PracticePlan.jsx      # Daily practice questions
│   │   │   ├── MockInterview.jsx     # Interview simulation
│   │   │   ├── ResumeParsing.jsx     # Resume upload & analysis
│   │   │   └── Pricing.jsx           # Subscription plans
│   │   ├── services/
│   │   │   ├── geminiAssistant.js    # Gemini API integration
│   │   │   ├── n8nSync.js            # n8n webhook triggers
│   │   │   ├── resumeService.js      # Resume handling
│   │   │   └── resume/               # Resume-related services
│   │   │       ├── index.js          # Barrel export
│   │   │       ├── questionService.js
│   │   │       ├── analyticsService.js
│   │   │       ├── progressService.js
│   │   │       ├── companyPlanService.js
│   │   │       ├── resumeStorageService.js
│   │   │       └── shared.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state
│   │   ├── data/
│   │   │   ├── mockCompanies.js
│   │   │   └── mockCompanyPlan.js
│   │   ├── firebase.js               # Firebase config
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── Resources/                         # n8n workflow files & API responses
│   ├── answer.json
│   ├── Auth-sync.json
│   ├── company-select.json
│   ├── question-generation.json
│   └── resume-response.json
├── Firebase_config.txt               # Firebase credentials
└── Project Planning.txt              # Project documentation

```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Firebase** account
- **Claude API** key
- **Gemini API** key
- **n8n** account (cloud or self-hosted)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-repo/placemate.git
cd PlaceMate
```

### Step 2: Frontend Setup
```bash
cd Frontend
npm install
```

### Step 3: Environment Configuration
Create `.env.local` in `Frontend/`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_N8N_WEBHOOK_BASE=https://your-n8n-instance.com/webhook

VITE_CLAUDE_API_KEY=your_claude_api_key
```

### Step 4: Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
npm run preview
```

---

## 🔌 Backend Integration (n8n)

### n8n Setup Guide

#### Prerequisites
1. **n8n Cloud Account** or **Self-hosted Instance**
   - Sign up at [n8n.io](https://n8n.io)
   - Create a new workflow

2. **API Keys Required**
   - OpenAI/Claude API key
   - Google Gemini API key
   - Firebase service account JSON

#### Key n8n Workflows

### Workflow 1: Daily Question Generation
**Trigger:** HTTP POST request OR Scheduled trigger
**Flow:**
```
Input: {userId, company, dayNumber, weakAreas}
  ↓
Get User Profile from Firebase
  ↓
Call Gemini API with context
  ↓
Parse Generated Questions
  ↓
Store in Firestore
  ↓
Trigger Notification Workflow
  ↓
Return: {questions, estimatedTime}
```

**Sample Webhook URL:**
```
POST https://your-n8n.com/webhook/generate-questions
```

### Workflow 2: Answer Evaluation
**Trigger:** HTTP POST from frontend
**Flow:**
```
Input: {userId, questionId, userAnswer}
  ↓
Retrieve Question Context
  ↓
Call Claude API for evaluation
  ↓
Parse Verdict (correct/partial/incorrect)
  ↓
Store Evaluation Result
  ↓
Update User Progress
  ↓
Identify Weak Areas
  ↓
Return: {verdict, score, feedback, improvement}
```

### Workflow 3: Daily Notification
**Trigger:** Scheduled (8 AM daily)
**Flow:**
```
Get All Active Users
  ↓
Generate Daily Questions (if not exists)
  ↓
Send Email with Question Summary
  ↓
Send WhatsApp Reminder (optional)
  ↓
Log Activity
```

### Workflow 4: Weekly Progress Report
**Trigger:** Scheduled (Sunday 6 PM)
**Flow:**
```
Aggregate User Progress
  ↓
Identify Top Weak Areas
  ↓
Generate Personalized Recommendations
  ↓
Send Email Report
  ↓
Update Dashboard Analytics
```

---

## ⚙️ Environment Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add Web SDK configuration

**Collections Structure:**
```
users/
├── {uid}/
│   ├── profile: {name, email, cgpa, branch, targetCompanies}
│   ├── progress: {totalQuestions, correctAnswers, weakAreas}
│   └── preferences: {difficulty, topics, companyFocus}

questions/
├── {questionId}/
│   ├── question: string
│   ├── topic: string
│   ├── difficulty: string
│   ├── company: string
│   ├── hint: string
│   └── idealAnswer: string

evaluations/
├── {evaluationId}/
│   ├── userId: string
│   ├── questionId: string
│   ├── userAnswer: string
│   ├── verdict: "correct|partial|incorrect"
│   ├── score: number (0-10)
│   ├── feedback: string
│   └── timestamp: date
```

### API Keys Configuration

**Google Gemini API:**
- Get from [Google AI Studio](https://aistudio.google.com)
- Used for: Question generation, content enhancement

**Claude API:**
- Get from [Anthropic](https://console.anthropic.com)
- Used for: Answer evaluation, feedback generation

**n8n Webhook Configuration:**
- Frontend sends HTTP requests to n8n webhooks
- Webhooks trigger workflows and return results

---

## 🎮 Running the Application

### Development Mode
```bash
cd Frontend
npm run dev
```
- Frontend: `http://localhost:5173`
- Hot reload enabled

### Build & Production
```bash
npm run build        # Creates optimized build
npm run preview      # Preview production build locally
```

### Deployment
**Vercel (Recommended):**
```bash
npm i -g vercel
vercel login
vercel
```

**Manual Deploy:**
- Build: `npm run build`
- Deploy `dist/` folder to your hosting

---

## 🔗 API Integration

### Frontend → n8n Communication

#### Generate Questions Endpoint
```javascript
// Frontend call
const response = await fetch(
  'https://your-n8n.com/webhook/generate-questions',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.uid,
      company: selectedCompany,
      dayNumber: currentDay,
      weakAreas: userWeakAreas
    })
  }
);
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "session": 1,
      "question": "Explain...",
      "topic": "DSA",
      "difficulty": "medium",
      "expected_time": "15 mins",
      "hint": "Consider...",
      "link": "https://...",
      "resource_url": "https://..."
    }
  ]
}
```

#### Submit Answer Endpoint
```javascript
const response = await submitAnswer(
  userId,
  questionDocId,
  questionId,
  userAnswer
);
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "verdict": "partial",
    "score": 7,
    "feedback": "Good approach but missed edge cases...",
    "improvement": "Review array manipulation...",
    "idealAnswer": "function solution() {...}"
  }
}
```

---

## 🔧 Key Services

### Frontend Services

#### `services/resume/index.js` (Barrel Export)
```javascript
export { generateQuestions, submitAnswer } from './questionService.js';
export { getProgressAnalytics } from './analyticsService.js';
export { getCompanyPlan } from './companyPlanService.js';
```

#### `services/geminiAssistant.js`
- Handles Gemini API integration
- Generates follow-up questions
- Content enhancement

#### `services/n8nSync.js`
- Webhook triggers to n8n
- Handles workflow initiation
- Response parsing

#### `services/resume/questionService.js`
- `generateQuestions()` - Fetch daily questions
- `submitAnswer()` - Submit and evaluate answers
- `getQuestionDetails()` - Fetch specific question

#### `services/resume/analyticsService.js`
- `getProgressAnalytics()` - Get user performance
- `getHeatmapData()` - Daily practice data
- `getWeakAreas()` - Identify skill gaps

### Context API

#### `AuthContext.jsx`
Provides global auth state:
- `user` - Current logged-in user
- `login()` - Email/password login
- `register()` - User signup
- `logout()` - Session termination
- `loading` - Auth state loading

---

## 📊 Data Flow

### Question Generation Flow
```
Dashboard/PracticePlan Component
    ↓
    useEffect → generateQuestions(userId, company, day)
    ↓
questionService → n8nSync webhook
    ↓
n8n Workflow (Generate Questions)
    ↓
Gemini API → Parse & Store
    ↓
Return sorted questions
    ↓
Display in UI
```

### Answer Evaluation Flow
```
User submits answer → handleSubmitAnswer()
    ↓
submitAnswer(userId, docId, questionId, answer)
    ↓
n8nSync webhook → n8n Answer Evaluation
    ↓
Claude API evaluates
    ↓
Store evaluation in Firestore
    ↓
Update UI with verdict & feedback
    ↓
User sees evaluation card (Correct/Partial/Incorrect)
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration & login
- [ ] Company plan selection
- [ ] Question generation (Day 1-30)
- [ ] Answer submission
- [ ] Evaluation display
- [ ] Progress heatmap accuracy
- [ ] Resume parsing
- [ ] Voice input capture
- [ ] Mobile responsiveness

### n8n Workflow Testing
1. Open n8n editor
2. Click "Test Workflow"
3. Provide sample payload
4. Verify output matches expected format

---

## 🤝 Contributing

### Guidelines
1. Create feature branch: `git checkout -b feature/feature-name`
2. Follow React best practices
3. Test before committing
4. Write clear commit messages
5. Create pull request with description

### Code Style
- Use functional components
- Follow existing naming conventions
- Add comments for complex logic
- Keep components modular

---

## 📞 Support & Contact

- **Issues:** Create GitHub issue with details
- **Discussions:** GitHub discussions tab
- **Email:** support@placemate.dev
- **n8n Help:** Check n8n documentation & community

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] User authentication
- [x] Company-specific prep plans
- [x] Daily question generation
- [x] Answer evaluation with feedback
- [x] Progress tracking

### Phase 2 (Upcoming) 🔄
- [ ] Mobile app (React Native)
- [ ] Advanced ML-based weak area detection
- [ ] Peer comparison leaderboards
- [ ] Video interview recording & analysis
- [ ] AI-powered salary negotiation tips

### Phase 3 (Future) 🚀
- [ ] Company exclusive content
- [ ] Live mock interviews with mentors
- [ ] Job application integration
- [ ] Interview success prediction

---

## 🙏 Acknowledgments

- Built with ❤️ for placement aspirants
- Powered by Claude & Gemini AI
- Orchestrated by n8n
- Hosted on Vercel & Firebase

---

**Made with passion by the PlaceMate Team** 🎓
