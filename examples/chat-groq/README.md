## Pipedream Chat - Groq Edition

A high-performance implementation of Pipedream's MCP server integration powered by Groq's blazing-fast LLMs. This demo provides access to 10,000+ tools across 2,700+ APIs through a conversational interface, leveraging Groq's industry-leading inference speeds.

> Based on the [Next.js AI Chatbot](https://chat.vercel.ai/) and [Pipedream Chat](https://chat.pipedream.com)

### Key Features

- **Groq-powered inference**: Lightning-fast responses using Groq's LLMs including Llama 3.3, DeepSeek R1, and Gemma2
- **MCP integrations**: Connect to thousands of APIs through Pipedream's MCP server with built-in auth
- **Optimized for tool use**: Leverage Groq's specialized tool-use models for enhanced function calling
- **Tool discovery**: Execute tool calls across different APIs via chat

> Check out [Pipedream's developer docs](https://pipedream.com/docs/connect/mcp/developers) for the most up to date information.

### Development Mode

For local development, you can disable authentication and persistence:

```bash
# In your .env file
DISABLE_AUTH=true
DISABLE_PERSISTENCE=true
EXTERNAL_USER_ID=your-dev-user-id
```

This allows you to test the chat functionality without setting up authentication or database persistence.

> [!IMPORTANT]  
> Treat this project as a reference implementation for integrating MCP servers into AI applications.

## Model Providers

This app is optimized for Groq's high-performance models:

- **DeepSeek R1 Distill Llama 70B**: Advanced reasoning with 128k context
- **Llama 3.3 70B Versatile**: Latest Llama model for versatile tasks
- **Llama 3.1 8B Instant**: Fast, lightweight model for quick responses
- **Llama 3 Groq Tool Use models**: Optimized for function calling (70B and 8B variants)
- **Gemma2 9B IT**: Google's efficient instruction-tuned model

## Running locally

You can run this chat app in two ways:

### Option 1: From the monorepo root (recommended)

If you're working within the full MCP monorepo:

```bash
# From the root of the monorepo
cp .env.example .env  # Edit with your values, including GROQ_API_KEY
pnpm install
pnpm chat-groq
```

This will automatically use the `.env` file from the root directory and start the chat app.

### Option 2: From this directory

If you're working directly in the chat example:

```bash
# From examples/chat directory
cp .env.example .env  # Edit with your values
```

Then run all required local services:

```bash
docker compose up -d
```

Run migrations:

```bash
POSTGRES_URL=postgresql://postgres@localhost:5432/postgres pnpm db:migrate
```

Then start the app:

```bash
pnpm install
pnpm chat
```

### Configuration

By default the client will point at https://remote.mcp.pipedream.net. Use the `MCP_SERVER` env var to point to an MCP server running locally:

```bash
MCP_SERVER=http://localhost:3010 pnpm chat
```

Your local app should now be running on [http://localhost:3000](http://localhost:3000/).
