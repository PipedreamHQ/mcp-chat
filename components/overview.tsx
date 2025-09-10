import { motion } from 'framer-motion';
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
          {/* Virgo logo + chat icon */}
         <p className="flex flex-row justify-center gap-4 items-center">
  <Image
    src="/images/profileimg.jpg"
    alt="Virgo Logo"
    width={40}
    height={40}
    className="size-10 rounded-full border border-gray-300"
    priority
  />
  <span>+</span>
  <ChatBubbleIcon size={32} />
</p>


          {/* Custom Virgo copy */}
          <p>
            Welcome to <span className="font-semibold">Virgo Chat</span> —  
            your gateway to connect and chat with any app.
          </p>
          <p>
            Chat directly with <span className="font-semibold">2,800+ APIs</span> 
            and 10k+ tools. Powered by <span className="font-semibold">Virgo</span>, 
            built for speed and simplicity.
          </p>
        </div>

        {/* Keep the banner logic */}
        <InfoBanner 
          isAuthDisabled={isAuthDisabled} 
          isPersistenceDisabled={isPersistenceDisabled} 
        />
      </div>
    </motion.div>
  );
};

