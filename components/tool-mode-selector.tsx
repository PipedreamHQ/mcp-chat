'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toolModes } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ToolModeSelector({
  selectedToolMode,
  onToolModeChange,
  className,
}: {
  selectedToolMode: string;
  onToolModeChange?: (mode: string) => void;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticToolMode, setOptimisticToolMode] =
    useOptimistic(selectedToolMode);

  const selectedMode = useMemo(
    () => toolModes.find((mode) => mode.id === optimisticToolMode),
    [optimisticToolMode],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="tool-mode-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedMode?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {toolModes.map((mode) => {
          const { id } = mode;

          return (
            <DropdownMenuItem
              data-testid={`tool-mode-selector-item-${id}`}
              key={id}
              onSelect={() => {
                setOpen(false);

                startTransition(() => {
                  setOptimisticToolMode(id);
                  onToolModeChange?.(id);
                });
              }}
              data-active={id === optimisticToolMode}
              asChild
            >
              <button
                type="button"
                className="gap-4 group/item flex flex-row justify-between items-center w-full"
              >
                <div className="flex flex-col gap-1 items-start">
                  <div>{mode.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {mode.description}
                  </div>
                </div>

                <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                  <CheckCircleFillIcon />
                </div>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
