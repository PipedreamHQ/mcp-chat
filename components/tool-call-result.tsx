import { getConnectedAccountById } from '@/app/(chat)/accounts/actions';
import { useEffectiveSession } from '@/hooks/use-effective-session';
import { prettifyToolName } from "@/lib/utils";
import type { AppendFn } from '@/lib/chat-types';
import { createFrontendClient, type Account, type ConnectResult } from "@pipedream/sdk/browser";
import { Check, ChevronRight, Globe, Lock } from "lucide-react";
import Image from 'next/image';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

type ConnectParams = {
  token: string | undefined;
  app: string | undefined;
}

export const ToolCallResult = ({
  name,
  result,
  args,
  append,
  toolCallId,
}: {
  name: string
  args: any
  result: any
  append: AppendFn;
  toolCallId?: string;
}) => {

  const looksLikeJsonString = (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    return (first === '{' && last === '}') || (first === '[' && last === ']');
  };

  const deepParseJson = (value: any, depth: number = 0): any => {
    if (depth > 6) return value;
    if (typeof value === 'string' && looksLikeJsonString(value)) {
      try {
        const parsed = JSON.parse(value);
        return deepParseJson(parsed, depth + 1);
      } catch {
        return value;
      }
    }
    if (Array.isArray(value)) {
      return value.map((item) => deepParseJson(item, depth + 1));
    }
    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        (output as any)[key] = deepParseJson(val, depth + 1);
      }
      return output;
    }
    return value;
  };

  const escapeHtml = (unsafe: string): string =>
    unsafe
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');

  const decodeHtmlEntities = (input: string): string => {
    const named: Record<string, string> = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      '#039': "'",
    };
    return input.replace(/&(#x[0-9A-Fa-f]+|#\d+|[a-zA-Z]+);/g, (_match, entity: string) => {
      if (!entity) return _match;
      if (entity[0] === '#') {
        try {
          const isHex = entity[1]?.toLowerCase() === 'x';
          const codePoint = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
          if (!Number.isNaN(codePoint)) {
            return String.fromCodePoint(codePoint);
          }
        } catch {
          return _match;
        }
        return _match;
      }
      return Object.prototype.hasOwnProperty.call(named, entity) ? named[entity] : _match;
    });
  };

  const deepDecodeHtmlEntities = (value: any, depth: number = 0): any => {
    if (depth > 6) return value;
    if (typeof value === 'string') {
      return decodeHtmlEntities(value);
    }
    if (Array.isArray(value)) {
      return value.map((item) => deepDecodeHtmlEntities(item, depth + 1));
    }
    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        (output as any)[key] = deepDecodeHtmlEntities(val, depth + 1);
      }
      return output;
    }
    return value;
  };

  const normalizeStringWhitespace = (input: string): string => {
    // Normalize newlines
    let s = input.replace(/\r\n?/g, '\n');
    // Trim trailing spaces per line
    s = s
      .split('\n')
      .map((line) => line.replace(/[\t ]+$/g, ''))
      .join('\n');
    // Remove leading/trailing blank lines
    const lines = s.split('\n');
    while (lines.length && /^\s*$/.test(lines[0]!)) lines.shift();
    while (lines.length && /^\s*$/.test(lines[lines.length - 1]!)) lines.pop();
    // Collapse 3+ consecutive blank lines to at most 2
    const collapsed: string[] = [];
    let blankRun = 0;
    for (const line of lines) {
      if (/^\s*$/.test(line)) {
        blankRun += 1;
        if (blankRun <= 2) collapsed.push('');
      } else {
        blankRun = 0;
        collapsed.push(line);
      }
    }
    return collapsed.join('\n');
  };

  const deepNormalizeWhitespace = (value: any, depth: number = 0): any => {
    if (depth > 6) return value;
    if (typeof value === 'string') return normalizeStringWhitespace(value);
    if (Array.isArray(value)) return value.map((v) => deepNormalizeWhitespace(v, depth + 1));
    if (value && typeof value === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) (out as any)[k] = deepNormalizeWhitespace(v, depth + 1);
      return out;
    }
    return value;
  };

  const prettifyJsonStringLiteral = (stringWithQuotes: string): string => {
    if (stringWithQuotes.length < 2) return stringWithQuotes;
    const inner = stringWithQuotes.slice(1, -1);
    const replaced = inner
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '  ');
    return `"${replaced}"`;
  };

  const highlightJson = (jsonString: string): string => {
    const escaped = escapeHtml(jsonString);
    const pattern =
      /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"\s*:)|("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?\b/g;
    return escaped.replace(pattern, (match, key, stringLiteral, booleanOrNull) => {
      if (key) return `<span class=\"text-sky-700 dark:text-sky-300\">${key.slice(0, -1)}</span>:`;
      if (stringLiteral) {
        const prettyString = prettifyJsonStringLiteral(stringLiteral);
        return `<span class=\"text-emerald-700 dark:text-emerald-300\">${prettyString}</span>`;
      }
      if (booleanOrNull) return `<span class=\"text-purple-700 dark:text-purple-300\">${booleanOrNull}</span>`;
      // numbers
      return `<span class=\"text-amber-700 dark:text-amber-300\">${match}</span>`;
    });
  };

  const JsonBlock = ({ label, value }: { label: string; value: unknown }) => {
    const normalized = deepNormalizeWhitespace(deepDecodeHtmlEntities(deepParseJson(value)));
    const pretty = JSON.stringify(normalized, null, 2) ?? '';
    const highlighted = highlightJson(pretty);
    return (
      <div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</div>
        <pre className="font-mono text-xs leading-5 bg-gray-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-md max-h-96 overflow-auto">
          <code
            className="whitespace-pre-wrap break-words text-gray-800 dark:text-zinc-50"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    );
  };

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
    connectParams.app = params?.get('app') || undefined
  }

  const { data: session } = useEffectiveSession();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<Account | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);

  // Create browser client for connect flow only
  // No projectId needed - that's for server clients
  // tokenCallback/externalUserId only needed for authenticated API calls like getAccounts
  const { id: externalUserId } = session?.user || {};
  if (!externalUserId) return;
  const pd = createFrontendClient({
    externalUserId,
    tokenCallback: async () => {
      throw new Error('tokenCallback not implemented');
    },
  });

  const connectAccount = () => {
    const { app, token } = connectParams;
    if (!app || !token) return;

    pd.connectAccount({
      app,
      token,
      onSuccess: async ({ id: accountId }: ConnectResult) => {
        // Show connected state immediately
        setIsConnected(true);
        setIsLoadingAccount(true);

        // Fetch account details
        try {
          const account = await getConnectedAccountById(accountId);
          setConnectedAccount(account);
        } catch (error) {
          // Still show connected even if details fail
        } finally {
          setIsLoadingAccount(false);
        }

        // Brief delay to let user see the success, then continue chat flow
        setTimeout(() => {
          append({ role: 'user', content: 'Done' });
        }, 1000);
      },
      onError: (error) => {
        console.error('Connect account error:', error);
      },
    })
  }

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="group flex gap-2 items-center justify-start w-full">
        <Check className="size-4 text-green-500/80" />
        {name === 'Web_Search' ? (
          <div className="flex items-center justify-center size-5 rounded-sm overflow-hidden mr-1 bg-muted/20">
            <Globe className="size-4 text-foreground/70 dark:text-white" />
          </div>
        ) : appId && (
          <div className="flex items-center justify-center size-5 bg-white dark:bg-gray-100 rounded-sm overflow-hidden mr-1">
            <Image src={iconUrl} alt="App icon" width={16} height={16} className="size-4 rounded" />
          </div>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400">{prettifyToolName(name, toolCallId)}</p>
        <ChevronRight className="size-4 text-slate-500 dark:text-slate-400 transition-transform duration-150 group-data-[state=open]:rotate-90" />
        <span className="sr-only">Toggle</span>
      </CollapsibleTrigger>
      {(args || result) && (
        <CollapsibleContent className="w-full box-border pl-8 flex flex-col gap-3 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-1 data-[state=closed]:slide-out-to-top-1 duration-150">
          {args !== undefined && args !== null && (
            <JsonBlock label="Request" value={deepParseJson(args)} />
          )}
          {result !== undefined && result !== null && (
            <JsonBlock label="Response" value={deepParseJson(result)} />
          )}
        </CollapsibleContent>
      )}
      {(connectLinkUrl) && (
        <div className="mt-2 flex flex-col">
          <div className="flex items-center gap-2">
            {!isConnected ? (
              <Button
                data-testid="connect-link"
                className="p-4 md:px-4 md:h-[42px] self-start"
                variant="blue"
                onClick={connectAccount}
              >
                {(appId) && (
                  <div className="flex items-center justify-center size-6 bg-white dark:bg-gray-100 rounded-sm overflow-hidden mr-1">
                    <Image src={iconUrl} alt="App icon" width={20} height={20} className="size-5 rounded" />
                  </div>
                )}
                Connect account
              </Button>
            ) : (
              <div aria-live="polite" className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="size-7 rounded-md overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm">
                  <Image
                    src={connectedAccount?.app?.imgSrc || iconUrl}
                    alt={connectedAccount?.app?.name || 'App icon'}
                    width={24}
                    height={24}
                    className="size-5 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Connected
                      {isLoadingAccount ? (
                        <span className="ml-1 inline-block w-16 h-3 bg-green-200 dark:bg-green-800 rounded animate-pulse" />
                      ) : connectedAccount?.name ? (
                        <span> ({connectedAccount.name})</span>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isConnected && (
            <p className="mt-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Lock className="mr-1 size-3" />
              <span>Credentials are encrypted. Revoke anytime.</span>
            </p>
          )}
        </div>
      )}
    </Collapsible>
  )
}
