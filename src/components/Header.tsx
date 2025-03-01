import type React from "react"
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline"

interface HeaderProps {
  toggleAIAssistant: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleAIAssistant }) => {
  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Restaurant</h1>
        <button
          onClick={toggleAIAssistant}
          className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-colors"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          AI Assistant
        </button>
      </div>
    </header>
  )
}

export default Header

