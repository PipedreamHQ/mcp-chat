// Necessary if using App Router to ensure this file runs on the client
"use client"

import { datadogRum } from "@datadog/browser-rum"

const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID
const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
// const site = process.env.NEXT_PUBLIC_DATADOG_SITE
const service = process.env.NEXT_PUBLIC_DATADOG_SERVICE_NAME

if (!applicationId || !clientToken || !service) {
  console.log("Missing Datadog environment variables. Skipping initialization.")
} else {
  datadogRum.init({
    applicationId,
    clientToken,
    site: "datadoghq.com",
    service,
    env: process.env.NODE_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
    allowedTracingUrls: [
      {
        match: "https://chat.pipedream.com",
        propagatorTypes: ["tracecontext"],
      },
      {
        match: "https://api.pipedream.com",
        propagatorTypes: ["tracecontext"],
      },
    ],
  })
  console.log("Datadog initialized")
}

export default function DatadogInit() {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null
}
