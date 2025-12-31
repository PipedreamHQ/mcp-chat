# Fleece AI - Complete SaaS Ecosystem Guide

## 🎯 Overview

Fleece AI is a comprehensive AI automation ecosystem consisting of 3 interconnected services that work together to transform business processes through AI-powered automation.

### The 3 Core Services

1. **Fleece AI Consulting** 🔍
   - AI-powered business process audits
   - Process mapping and visualization
   - Automation opportunity detection
   - ROI estimates and prioritization

2. **Fleece AI Automatisations** ⚡
   - AI-generated Pipedream workflows
   - 2,500+ app integrations via OAuth
   - One-click deployment
   - Real-time execution monitoring

3. **Fleece AI Training** 🎓
   - Auto-generated personalized courses
   - Interactive video lessons and quizzes
   - Progress tracking and gamification
   - Verified certificates

## 📊 Data Flow

```
CONSULTING (Audit)
    ↓ Process analysis
    ↓ Apps used
    ↓ Automation opportunities
    ↓
AUTOMATISATIONS (Build)
    ↓ AI generates workflows
    ↓ User connects apps via OAuth
    ↓ Workflows deployed
    ↓
TRAINING (Learn)
    ↓ AI generates courses
    ↓ User completes modules
    ↓ Earns certificates
```

## 🏗️ Architecture

### Database Schema

The ecosystem extends the base MCP Chat schema with 16 new tables:

**Consulting Tables:**
- `AuditReport` - Business process audits
- `ProcessMap` - Detailed process mappings

**Automatisations Tables:**
- `AutomationRecommendation` - AI recommendations from audits
- `Workflow` - Pipedream workflow configurations
- `WorkflowExecution` - Execution history and stats

**Training Tables:**
- `TrainingCourse` - Course metadata and structure
- `CourseModule` - Individual course modules
- `Quiz` - Knowledge assessments
- `UserCourseProgress` - User learning progress
- `QuizAttempt` - Quiz submission history
- `Certificate` - Earned certifications

**Gamification Tables:**
- `UserAchievement` - Unlocked badges and achievements
- `UserStats` - User level, points, streaks

### API Routes

**Consulting:**
- `POST /api/fleece/consulting/chat` - AI chat for conducting audits
- `GET /api/fleece/consulting/audits` - List user audits
- `POST /api/fleece/consulting/audits` - Create audit
- `PATCH /api/fleece/consulting/audits` - Update audit
- `DELETE /api/fleece/consulting/audits` - Delete audit

**Automatisations:**
- `POST /api/fleece/automations/chat` - AI chat for building workflows
- `GET /api/fleece/automations/workflows` - List workflows
- `POST /api/fleece/automations/workflows` - Create workflow
- `PATCH /api/fleece/automations/workflows` - Update workflow
- `DELETE /api/fleece/automations/workflows` - Delete workflow
- `POST /api/fleece/automations/deploy` - Deploy workflow to Pipedream

**Training:**
- `POST /api/fleece/training/chat` - AI chat for generating courses
- `GET /api/fleece/training/courses` - List courses
- `POST /api/fleece/training/courses` - Create course
- `PATCH /api/fleece/training/courses` - Update course
- `GET /api/fleece/training/quiz` - Get quiz
- `POST /api/fleece/training/quiz` - Submit quiz
- `POST /api/fleece/training/progress` - Update progress
- `GET /api/fleece/training/certificates` - List certificates

### UI Pages

**Dashboard:**
- `/fleece` - Main dashboard with stats and service overview

**Consulting:**
- `/fleece/consulting` - Audit list
- `/fleece/consulting/new` - Start new audit
- `/fleece/consulting/[id]` - View audit details

**Automatisations:**
- `/fleece/automations` - Workflow list
- `/fleece/automations/new` - Create new workflow
- `/fleece/automations/[id]` - View workflow details

**Training:**
- `/fleece/training` - Course catalog
- `/fleece/training/[id]` - Course player with modules

## 🚀 Getting Started

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```env
   # Database
   POSTGRES_URL=postgresql://...

   # Authentication
   AUTH_SECRET=<your-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>

   # Pipedream
   PIPEDREAM_CLIENT_ID=<your-pipedream-client-id>
   PIPEDREAM_CLIENT_SECRET=<your-pipedream-client-secret>
   PIPEDREAM_PROJECT_ID=<your-project-id>
   PIPEDREAM_PROJECT_ENVIRONMENT=development

   # AI Providers
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-...
   GOOGLE_GENERATIVE_AI_API_KEY=...
   ```

3. **Run database migrations:**
   ```bash
   pnpm db:migrate
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Access Fleece AI:**
   Open http://localhost:3000/fleece

## 📝 Usage Guide

### 1. Fleece AI Consulting - Conduct an Audit

1. Navigate to `/fleece/consulting`
2. Click "New Audit"
3. Chat with the AI consultant about:
   - Your business processes
   - Current tools and apps
   - Pain points and bottlenecks
   - Time-consuming tasks
4. The AI will generate:
   - Process maps
   - Automation opportunities
   - ROI estimates
   - Prioritized recommendations

**Example conversation:**
```
User: "We're an e-commerce company. Our customer support team spends hours managing support tickets across Gmail, Slack, and our CRM."

AI: "I'll help analyze this process. Let me ask some questions:
1. How many support tickets do you handle daily?
2. Which CRM are you using?
3. What's the typical workflow for handling a ticket?
..."

[After conversation, AI generates detailed audit report]
```

### 2. Fleece AI Automatisations - Build Workflows

1. Navigate to `/fleece/automations`
2. Click "New Workflow"
3. Provide the AI with:
   - Automation goal from audit recommendations
   - Apps to connect
   - Desired triggers and actions
4. The AI generates a complete Pipedream workflow
5. Connect apps via OAuth (Pipedream Connect)
6. Deploy the workflow

**Example workflow:**
```
Goal: "Automatically create CRM tickets from Gmail support emails"

AI generates:
Trigger: New email in Gmail (support@company.com)
Step 1: Parse email content
Step 2: Create ticket in CRM
Step 3: Send Slack notification to support team
Step 4: Send confirmation email to customer
```

### 3. Fleece AI Training - Learn the Workflows

1. Navigate to `/fleece/training`
2. Browse available courses (auto-generated from workflows)
3. Start a course
4. Complete modules:
   - Watch video lessons
   - Read interactive content
   - Take quizzes
5. Track your progress
6. Earn certificates upon completion

**Example course structure:**
```
Course: "Mastering the Gmail-to-CRM Automation"

Module 1: Overview (5 min)
Module 2: How Gmail triggers work (10 min)
Module 3: CRM integration deep dive (15 min)
Module 4: Customizing the workflow (10 min)
Module 5: Troubleshooting (10 min)
Quiz: Knowledge check (10 questions)
Certificate: Earn upon 70% passing score
```

## 🎮 Gamification Features

### Levels & Points
- Actions earn points
- Points unlock levels
- Higher levels unlock features

**Point system:**
- Complete audit: 100 points
- Deploy workflow: 200 points
- Complete course: 150 points
- Earn certificate: 250 points
- Perfect quiz score: 50 bonus points

### Achievements
- 🏆 First Audit - Complete your first business audit
- ⚡ Workflow Master - Deploy 10 workflows
- 🎓 Learning Enthusiast - Complete 5 courses
- 🎯 Automation Expert - Have 5 active workflows
- ⭐ Perfect Score - Ace a quiz with 100%
- 🔥 Speed Learner - Complete a course in one session

### Streaks
- Daily activity tracking
- Maintain learning streaks
- Unlock bonus achievements

## 🔧 Development

### Project Structure

```
/app/(chat)/
  /fleece/
    page.tsx                          # Main dashboard
    /consulting/
      page.tsx                        # Audits list
      /[id]/page.tsx                 # Audit details
    /automations/
      page.tsx                        # Workflows list
      /[id]/page.tsx                 # Workflow details
    /training/
      page.tsx                        # Course catalog
      /[id]/page.tsx                 # Course player
  /api/fleece/
    /consulting/
      /chat/route.ts                 # AI audit chat
      /audits/route.ts               # CRUD audits
    /automations/
      /chat/route.ts                 # AI workflow chat
      /workflows/route.ts            # CRUD workflows
      /deploy/route.ts               # Deploy workflows
    /training/
      /chat/route.ts                 # AI course chat
      /courses/route.ts              # CRUD courses
      /progress/route.ts             # Track progress
      /quiz/route.ts                 # Quiz system

/lib/
  /db/
    schema.ts                         # Extended with Fleece tables
    fleece-queries.ts                 # Fleece-specific queries
  /ai/
    fleece-prompts.ts                 # Specialized AI prompts
```

### Adding New Features

**1. Add a new achievement:**
```typescript
// In lib/db/schema.ts, update achievementType enum
achievementType: varchar("achievementType", {
  enum: [
    // ... existing types
    "new_achievement_name"
  ]
})

// Award it in your code:
await saveUserAchievement({
  userId: session.user.id,
  achievementType: "new_achievement_name",
  title: "Achievement Title",
  description: "What the user did",
  points: 100,
})
```

**2. Add a new course module type:**
```typescript
// Update moduleType enum in schema.ts
moduleType: varchar("moduleType", {
  enum: [
    "video", "text", "interactive", "quiz", "hands_on",
    "your_new_type"  // Add here
  ]
})

// Create handler component
// components/training/YourNewTypeModule.tsx
```

## 🧪 Testing

### Manual Testing Checklist

**Consulting:**
- [ ] Create new audit via chat
- [ ] View audit report with recommendations
- [ ] Edit audit details
- [ ] Delete audit
- [ ] Generate process maps

**Automatisations:**
- [ ] Create workflow from recommendation
- [ ] Connect apps via Pipedream OAuth
- [ ] Deploy workflow
- [ ] View execution history
- [ ] Pause/resume workflow

**Training:**
- [ ] Browse course catalog
- [ ] Start a course
- [ ] Complete modules
- [ ] Take quizzes
- [ ] Earn certificate
- [ ] View progress dashboard

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Fleece AI ecosystem"
   git push origin your-branch
   ```

2. **Deploy to Vercel:**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy

3. **Set up database:**
   - Use Neon Serverless Postgres
   - Run migrations in production

4. **Configure Pipedream:**
   - Create production project
   - Update environment variables
   - Set up OAuth credentials

## 📚 AI Prompts

### Consulting Prompt Strategy
The consulting AI is trained to:
- Ask strategic questions about business processes
- Identify inefficiencies and bottlenecks
- Calculate ROI for automation opportunities
- Generate structured audit reports in JSON format

### Automatisations Prompt Strategy
The automations AI is trained to:
- Design Pipedream workflows from requirements
- Select appropriate triggers and actions
- Handle OAuth authentication flows
- Generate deployment-ready configurations

### Training Prompt Strategy
The training AI is trained to:
- Create engaging course content
- Break down complex topics into modules
- Generate effective quiz questions
- Provide clear explanations and examples

## 🔐 Security Considerations

1. **Authentication:**
   - All routes require authenticated session
   - User ownership verification on all operations

2. **Data Privacy:**
   - Audit reports are private by default
   - Workflows can only be accessed by owner
   - Course progress is user-specific

3. **API Keys:**
   - Store sensitive keys in environment variables
   - Never commit .env files
   - Use Vercel environment variables in production

## 🆘 Troubleshooting

**Database connection errors:**
```bash
# Check PostgreSQL connection
psql $POSTGRES_URL

# Regenerate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate
```

**Pipedream integration issues:**
```bash
# Verify environment variables
echo $PIPEDREAM_CLIENT_ID
echo $PIPEDREAM_PROJECT_ID

# Check MCP server connectivity
curl https://remote.mcp.pipedream.net
```

**AI responses not saving:**
- Check persistence is enabled (DISABLE_PERSISTENCE != "true")
- Verify database tables exist
- Check server logs for errors

## 🎓 Next Steps

1. **Enhance UI:**
   - Add rich text editors for audit notes
   - Create visual workflow builders
   - Build interactive course player with video

2. **Integrate Real Pipedream API:**
   - Replace mock deployment with actual Pipedream SDK calls
   - Implement workflow execution webhooks
   - Add real-time execution monitoring

3. **Gamification Enhancements:**
   - Add leaderboards
   - Team challenges
   - Social sharing of achievements

4. **Analytics:**
   - Dashboard with KPIs
   - ROI tracking for implemented workflows
   - Learning analytics and insights

## 📄 License

This project is part of the Fleece AI ecosystem built on top of Pipedream MCP Chat.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

**Built with:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Pipedream MCP
- Drizzle ORM
- NextAuth v5
- AI SDK (Anthropic Claude, OpenAI, Google Gemini)

**Powered by Pipedream** - 2,500+ app integrations via MCP protocol
