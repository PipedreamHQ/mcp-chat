import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { ChatBubbleIcon } from './icons';
import { InfoBanner } from './info-banner';
import { useAuthContext } from './session-provider';

export const Overview = () => {
  const { isAuthDisabled, isPersistenceDisabled } = useAuthContext();
  
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-6 max-w-xl px-4">
        <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center">
          <p className="flex flex-row justify-center gap-4 items-center">
            <Image
              src="/images/pipedream-icon.svg"
              alt="Pipedream"
              width={32}
              height={32}
              className="size-8 rounded-sm"
              priority
            />
            <span>+</span>
            <ChatBubbleIcon size={32} />
          </p>
          <p>
            This app uses{" "}
            <Link
              className="font-medium underline underline-offset-4"
              href="https://pipedream.com/docs/connect/mcp/developers"
              target="_blank"
            >
              Pipedream MCP
            </Link>{" "}
            with{" "}
            <Link
              className="font-medium underline underline-offset-4"
              href="https://groq.com/"
              target="_blank"
            >
              Groq's blazing-fast LLMs
            </Link>{" "}
            to let you chat with any app.
          </p>
          <p>
            Powered by Groq's high-performance models including{" "}
            <strong>Llama 3.3 70B</strong>, <strong>Llama 3.1 8B</strong>, and{" "}
            <strong>Gemma2 9B</strong>, with{" "}
            <Link
              className="font-medium underline underline-offset-4"
              href="https://mcp.pipedream.com/"
              target="_blank"
            >
              2700+ built-in APIs
            </Link>{" "}
            and 10k+ tools.
          </p>
        </div>
        <InfoBanner isAuthDisabled={isAuthDisabled} isPersistenceDisabled={isPersistenceDisabled} />
      </div>
    </motion.div>
  );
};
