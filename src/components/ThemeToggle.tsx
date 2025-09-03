"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center h-10 w-10 rounded-md">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </button>
    )
  }

  return (
    <button 
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] text-orange-400 transition-all duration-200 ${
        resolvedTheme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] text-orange-400 transition-all duration-200 ${
        resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}