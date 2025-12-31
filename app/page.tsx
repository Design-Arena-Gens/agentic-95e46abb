'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      const agentMessage: Message = {
        role: 'agent',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'agent',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>AI Agent</h1>
          <p>Autonomous intelligent assistant</p>
        </div>

        <div className={styles.chatContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.agentIcon}>🤖</div>
              <h2>Ready to assist</h2>
              <p>Ask me anything and I'll help you autonomously</p>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${styles.message} ${
                    msg.role === 'user' ? styles.userMessage : styles.agentMessage
                  }`}
                >
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.role}>
                        {msg.role === 'user' ? '👤 You' : '🤖 Agent'}
                      </span>
                      <span className={styles.timestamp}>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.messageText}>{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.agentMessage}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <span className={styles.role}>🤖 Agent</span>
                    </div>
                    <div className={styles.typing}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={3}
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </main>
  )
}
