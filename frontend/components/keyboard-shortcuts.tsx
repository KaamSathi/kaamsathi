"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  // Listen for keyboard shortcut to open the dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + / to open keyboard shortcuts
      if (e.altKey && e.key === "/") {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const shortcuts = [
    { keys: ["Alt", "/"], description: "Show keyboard shortcuts" },
    { keys: ["Tab"], description: "Navigate between focusable elements" },
    { keys: ["Shift", "Tab"], description: "Navigate backwards" },
    { keys: ["Enter"], description: "Activate focused element" },
    { keys: ["Space"], description: "Activate focused element" },
    { keys: ["Esc"], description: "Close dialogs or menus" },
    { keys: ["←", "→"], description: "Navigate between options" },
    { keys: ["↑", "↓"], description: "Navigate dropdown menus" },
    { keys: ["Home"], description: "Go to first item" },
    { keys: ["End"], description: "Go to last item" },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm"
        onClick={() => setIsOpen(true)}
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Keyboard Shortcuts</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded">Alt</kbd> +{" "}
              <kbd className="px-2 py-1 bg-gray-100 rounded">/</kbd> at any time to view this dialog.
            </p>

            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Keys</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {shortcuts.map((shortcut, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex}>
                              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{key}</kbd>
                              {keyIndex < shortcut.keys.length - 1 && <span className="mx-1">+</span>}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Press <kbd className="px-1 bg-gray-100 rounded">Esc</kbd> to close this dialog
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
