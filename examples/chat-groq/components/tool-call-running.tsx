import { Loader } from "lucide-react"
import { prettifyToolName } from "@/lib/utils"

export const ToolCallRunning = ({ name }: { name: string }) => {
  return (
    <div className="flex gap-2">
      <Loader className="animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{prettifyToolName(name)}</p>
    </div>
  )
}
