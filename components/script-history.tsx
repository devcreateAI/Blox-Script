"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getScriptHistory, deleteScript } from "@/lib/scripts"
import { History, Copy, Download, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ScriptHistoryProps {
  user: any
}

interface Script {
  id: string
  prompt: string
  code: string
  createdAt: string
}

export function ScriptHistory({ user }: ScriptHistoryProps) {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user?.id) {
      loadScripts()
    }
  }, [user?.id])

  const loadScripts = async () => {
    if (!user?.id) return
    try {
      const userScripts = await getScriptHistory(user.id)
      setScripts(userScripts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load script history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: "Script copied to clipboard.",
    })
  }

  const handleDownload = (code: string, prompt: string) => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.lua`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (scriptId: string) => {
    try {
      await deleteScript(scriptId, user.id)
      setScripts(scripts.filter((s) => s.id !== scriptId))
      toast({
        title: "Deleted",
        description: "Script removed from history.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete script",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-scripton-card border border-white/10 rounded-lg p-4">
        <div className="animate-spin w-6 h-6 border-2 border-scripton-cyan border-t-transparent rounded-full mx-auto my-8"></div>
      </div>
    )
  }

  return (
    <div className="bg-scripton-card border border-white/10 rounded-lg p-4">
      <h3 className="text-lg md:text-xl font-semibold mb-4 px-2">Recents</h3>
      {scripts.length === 0 ? (
        <div className="text-center py-6 md:py-8">
          <History className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3 md:mb-4" />
          <p className="text-gray-400 text-sm md:text-base">No recent scripts</p>
          <p className="text-xs md:text-sm text-gray-500">Generate a script to see it here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="flex items-center justify-between p-2 md:p-3 rounded-md hover:bg-[#1a1a26] group"
            >
              <p className="text-xs md:text-sm truncate flex-1 pr-2 md:pr-4">{script.prompt}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-scripton-card border-white/10">
                  <DropdownMenuItem onClick={() => handleCopy(script.code)} className="min-h-[40px]">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Script
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(script.code, script.prompt)} className="min-h-[40px]">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(script.id)} className="text-red-400 min-h-[40px]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
