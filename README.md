<a href="https://chat.pipedream.com/">
  <img alt="MCP Chat by Pipedream" src="app/(chat)/opengraph-image.png">
  <h1 align="center">MCP Chat by Pipedream</h1>
</a>

<p align="center">
  MCP Chat is a free, open-source chat app built using the AI SDK, and Pipedream MCP, which provides access to nearly 3,000 APIs and more than 10,000 tools. Use this as a reference to build powerful AI chat applications.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#prerequisites"><strong>Prerequisites</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a>
</p>
<br/>

> **Check out the app in production at [chat.pipedream.com](https://chat.pipedream.com) and refer to [Pipedream's developer docs](https://pipedream.com/docs/connect/mcp/developers) for the most up to date information.**

## Features

- **MCP integrations**: Connect to thousands of APIs through Pipedream's MCP server with built-in auth
- **Automatic tool discovery**: Execute tool calls across different APIs via chat
- **Uses the [AI SDK](https://sdk.vercel.ai/docs)**: Unified API for generating text, structured objects, and tool calls with LLMs
- **Flexible LLM and framework support**: Works with any LLM provider or framework
- **Data persistence**: Uses [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data and [Auth.js](https://authjs.dev) for simple and secure sign-in

## Model Providers

The demo app currently uses models from Anthropic, OpenAI, and Gemini, but the AI SDK supports [many more](https://sdk.vercel.ai/providers/ai-sdk-providers).

### Prerequisites

To run or deploy this app, you'll need:

1. A [Pipedream account](https://pipedream.com/auth/signup)
2. A [Pipedream project](https://pipedream.com/docs/projects/#creating-projects). Accounts connected via MCP will be stored here.
3. [Pipedream OAuth credentials](https://pipedream.com/docs/rest-api/auth/#oauth)
4. An [OpenAI API key](https://platform.openai.com/api-keys)

## Deploy Your Own

One-click deploy this app to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPipedreamHQ%2Fmcp-chat&env=PIPEDREAM_CLIENT_ID,PIPEDREAM_CLIENT_SECRET,PIPEDREAM_PROJECT_ID,PIPEDREAM_PROJECT_ENVIRONMENT,AUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,OPENAI_API_KEY,EXA_API_KEY,POSTGRES_URL&envDescription=API%20keys%20need%20to%20run%20the%20app)

## Running locally

1. Copy the environment file and add your credentials:

```bash
cp .env.example .env  # Edit with your values
```

Note that for easier development, chat persistence and application sign-in are disabled by default in the `.env.example` file:

```bash
# In your .env file
DISABLE_AUTH=true
DISABLE_PERSISTENCE=true
```

2. Install dependencies and start the app:

We recommend using [asdf](https://asdf-vm.com/) to manage core deps like Node. Install it and run

```bash
asdf install
```

Then:

```bash
pnpm install
pnpm dev
```

Your local app should now be running on [http://localhost:3000](http://localhost:3000/) 🎉

### Enabling chat persistence

1. Run all required local services:

```bash
docker compose up -d
```

2. Run migrations:

```bash
POSTGRES_URL=postgresql://postgres@localhost:5432/postgres pnpm db:migrate
```
