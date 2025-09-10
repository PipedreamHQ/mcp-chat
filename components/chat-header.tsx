"use client"

import { useRouter } from "next/navigation"
import { ModelSelector } from "@/components/model-selector"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { Button } from "@/components/ui/button"
import { memo } from "react"
import { PlusIcon } from "./icons"
import { useSidebar } from "./ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { VisibilitySelector, VisibilityType } from "./visibility-selector"

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string
  selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
}) {
  const router = useRouter()
  const { open } = useSidebar()

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-4 gap-4">
      {/* Virgo Logo in top-left */}
      <div className="flex items-center gap-2">
        <img src="/images/Logo-01.png" alt="Virgo Logo" className="h-8 w-auto" />
      </div>

      {/* Sidebar toggle */}
      <div className="mt-1">
        <SidebarToggle />
      </div>

      {/* Model + Visibility selectors */}
      {!isReadonly && (
        <div className="hidden md:flex items-center gap-2">
          <ModelSelector selectedModelId={selectedModelId} />
          <VisibilitySelector chatId={chatId} selectedVisibilityType={selectedVisibilityType} />
        </div>
      )}

      {/* Spacer pushes new chat button to the right */}
      <div className="flex-1"></div>

      {/* New chat button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={`md:px-2 md:h-fit ${open ? "md:hidden" : "md:flex"}`}
            onClick={() => {
              router.push("/")
              router.refresh()
            }}
          >
            <PlusIcon size={16} />
            <span className="sr-only">New Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>
    </header>
  )
}

export const ChatHeader = memo(
  PureChatHeader,
  (prevProps, nextProps) => {
    return prevProps.selectedModelId === nextProps.selectedModelId
  }
)
