import { generateUUID } from "@/lib/utils"
import {
  streamText as _streamText,
  ToolSet,
  UIMessage,
  smoothStream,
  convertToModelMessages,
  stepCountIs,
} from "ai"

export const streamText = async (
  {
    userMessage,
  }: { userMessage: UIMessage },
  args: Omit<Parameters<typeof _streamText>[0], "tools"> & {
    getTools: () => Promise<ToolSet>
  }
) => {
  const {
    maxSteps = 1,
    messages: _messages,
    getTools,
    ...rest
  } = args
  
  // Convert UI messages to proper Message objects with IDs if needed
  let messages = (_messages ?? []).map((msg) =>
    "id" in msg ? msg : { ...msg, id: generateUUID() }
  ) as UIMessage[]

  const tools = await getTools()
  console.log(">> Using tools", Object.keys(tools).join(", "))
  console.log(">> MaxSteps configured:", maxSteps)

  // Go back to manual step approach for proper sequential execution and streaming
  // This ensures tools execute sequentially and results are properly chained
  
  // Use v5's built-in multi-step execution with stopWhen 
  const result = _streamText({
    ...rest,
    messages: convertToModelMessages(messages),
    tools,
    
    // v5 pattern: stopWhen evaluated only when step contains tool results
    stopWhen: stepCountIs(maxSteps),
    
    // Remove smoothStream to test if it's causing buffering in multi-step
    // experimental_transform: [
    //   smoothStream({
    //     chunking: /\s*\S+\s*/m,
    //     delayInMs: 25
    //   })
    // ],
    
    // Monitor each step
    onStepFinish: ({ stepNumber, finishReason, toolCalls, toolResults, steps }) => {
      console.log(`>> Step ${stepNumber} finished with reason: ${finishReason}`)
      console.log(`>> Total steps so far: ${steps?.length || 'unknown'}`)
      if (toolCalls?.length) {
        console.log(`>> Made ${toolCalls.length} tool calls`)
      }
      if (toolResults?.length) {
        console.log(`>> Got ${toolResults.length} tool results`)
      }
      console.log(`>> Should continue? stepCount=${steps?.length}, maxSteps=${maxSteps}`)
    },
    
    onFinish: async (event) => {
      console.log(">> All steps completed, final reason:", event.finishReason)
      console.log(">> Total steps:", event.steps?.length || 0)
      
      // Call the original onFinish handler
      await rest.onFinish?.(event)
    },
  })

  // Return the result directly - this will stream properly
  return result
}
