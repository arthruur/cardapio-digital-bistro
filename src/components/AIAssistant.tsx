import type React from "react"
import { useChat } from "ai/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface AIAssistantProps {
  onClose: () => void
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center bg-red-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">AI Assistant</h3>
        <button onClick={onClose}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-red-100" : "bg-gray-100"}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </form>
    </div>
  )
}

export default AIAssistant

