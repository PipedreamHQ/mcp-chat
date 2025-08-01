import { Check, ChevronsUpDown, Lock, Globe } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { Button } from './ui/button';
import { createFrontendClient } from "@pipedream/sdk/browser"
import { prettifyToolName } from "@/lib/utils";
import { UseChatHelpers } from '@ai-sdk/react';
import { useEffectiveSession } from '@/hooks/use-effective-session';

type ConnectParams = {
  token: string | undefined;
  app: string;
}

export const ToolCallResult = ({
  name,
  result,
  args,
  append,
}: {
  name: string
  args: any
  result: any
  append: UseChatHelpers['append'];
}) => {

  const text = result?.content?.[0]?.text
  const connectLinkRegex = /https:\/\/pipedream\.com\/_static\/connect\.html[^\s]*/;
  const linkMatch = text?.match(connectLinkRegex);
  const connectLinkUrl = linkMatch ? linkMatch[0] : null;
  const appId = result?.content?.[0]?.hashid
  const iconUrl = `https://pipedream.com/s.v0/${appId}/logo/48`

  const connectParams: ConnectParams = { token: undefined, app: undefined }
  if (connectLinkUrl) {
    const params = connectLinkUrl ? new URL(connectLinkUrl).searchParams : null;
    connectParams.token = params?.get('token') || undefined
    connectParams.app = params?.get('app')
  }

  const { data: session } = useEffectiveSession();
  const pd = createFrontendClient({
    projectId: process.env.PIPEDREAM_PROJECT_ID!,
    environment: (process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'production') as any,
  });
  const connectAccount = () => {
    if (connectParams.app && connectParams.token && session?.user?.id) {
      pd.connectAccount({
        ...connectParams,
        externalUserId: session.user.id,
        onSuccess: ({ id: accountId }) => {
          append({
            role: "user",
            content: "Done",
          });
        }
      })
    }
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex gap-2 items-center justify-center">
        <Check className="text-green-500" />
        {name === 'web_search' ? (
          <div className="flex items-center justify-center size-5 rounded-sm overflow-hidden mr-1 bg-muted/20">
            <Globe className="size-4 text-foreground/70 dark:text-white" />
          </div>
        ) : appId && (
          <div className="flex items-center justify-center size-5 bg-white dark:bg-gray-100 rounded-sm overflow-hidden mr-1">
            <img
              src={iconUrl}
              alt="icon"
              className="size-4 rounded"
            />
          </div>
        )}
      <p className="text-sm text-slate-500 dark:text-slate-400">{prettifyToolName(name)}</p>
        <ChevronsUpDown className="size-4" />
        <span className="sr-only">Toggle</span>
      </CollapsibleTrigger>
      {(args || result) && (
        <CollapsibleContent className="flex flex-col gap-2 p-4">
          <pre className="bg-gray-100 p-4 rounded-md text-xs text-gray-800 overflow-auto">
            {JSON.stringify(args, null, 2)}
          </pre>

          <pre className="bg-gray-100 p-4 rounded-md text-xs text-gray-800 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </CollapsibleContent>
      )}
      {(connectLinkUrl) && (
        <div className="mt-2 flex flex-col">
          <div className="flex items-center gap-2">
            <Button
              data-testid="connect-link"
              className="p-4 md:px-4 md:h-[42px] self-start"
              variant="blue"
              onClick={connectAccount}
            >
            {(appId) && (
              <div className="flex items-center justify-center size-6 bg-white dark:bg-gray-100 rounded-sm overflow-hidden mr-1">
                <img
                  src={iconUrl}
                  alt="icon"
                  className="size-5 rounded"
                />
              </div>
            )}
              Connect account
            </Button>
          </div>
          <p className="mt-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Lock className="mr-1 size-3" />
            <span>Credentials are encrypted. Revoke anytime.</span>
          </p>
        </div>
      )}
    </Collapsible>
  )
}

