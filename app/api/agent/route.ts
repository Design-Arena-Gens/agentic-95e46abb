import { NextResponse } from 'next/server'

interface AgentContext {
  knowledgeBase: Map<string, any>
  conversationHistory: Array<{ role: string; content: string }>
}

class AutonomousAgent {
  private context: AgentContext

  constructor() {
    this.context = {
      knowledgeBase: new Map(),
      conversationHistory: []
    }
    this.initializeKnowledge()
  }

  private initializeKnowledge() {
    this.context.knowledgeBase.set('capabilities', [
      'Answer questions and provide information',
      'Analyze problems and suggest solutions',
      'Generate creative content',
      'Perform calculations and logical reasoning',
      'Provide recommendations and advice'
    ])

    this.context.knowledgeBase.set('personality', {
      tone: 'helpful and professional',
      approach: 'autonomous and proactive',
      style: 'clear and concise'
    })
  }

  async processInput(userMessage: string): Promise<string> {
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage
    })

    const response = await this.generateResponse(userMessage)

    this.context.conversationHistory.push({
      role: 'agent',
      content: response
    })

    return response
  }

  private async generateResponse(input: string): Promise<string> {
    const lowerInput = input.toLowerCase()

    // Question detection
    if (lowerInput.includes('what') || lowerInput.includes('how') ||
        lowerInput.includes('why') || lowerInput.includes('when') ||
        lowerInput.includes('where') || lowerInput.includes('?')) {
      return this.handleQuestion(input)
    }

    // Greeting detection
    if (lowerInput.match(/^(hi|hello|hey|greetings)/)) {
      return "Hello! I'm an autonomous AI agent ready to assist you. I can answer questions, solve problems, provide recommendations, and help with various tasks. What would you like to explore today?"
    }

    // Task request detection
    if (lowerInput.includes('help') || lowerInput.includes('assist') ||
        lowerInput.includes('can you') || lowerInput.includes('could you')) {
      return this.handleTaskRequest(input)
    }

    // Math operations
    if (this.containsMath(input)) {
      return this.handleMath(input)
    }

    // Capability inquiry
    if (lowerInput.includes('what can you do') || lowerInput.includes('capabilities')) {
      const capabilities = this.context.knowledgeBase.get('capabilities')
      return `I'm an autonomous agent with these capabilities:\n\n${capabilities.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}\n\nI operate independently to provide you with the best assistance possible. How can I help you today?`
    }

    // Default intelligent response
    return this.generateContextualResponse(input)
  }

  private handleQuestion(question: string): string {
    const lowerQ = question.toLowerCase()

    if (lowerQ.includes('who are you') || lowerQ.includes('what are you')) {
      return "I'm an autonomous AI agent designed to assist, analyze, and solve problems independently. I process information, make decisions, and provide solutions without requiring step-by-step guidance. Think of me as an intelligent assistant that can understand context and take initiative to help you effectively."
    }

    if (lowerQ.includes('time') || lowerQ.includes('date')) {
      const now = new Date()
      return `Current time: ${now.toLocaleTimeString()}\nCurrent date: ${now.toLocaleDateString()}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
    }

    if (lowerQ.includes('agent') || lowerQ.includes('ai')) {
      return "As an autonomous agent, I'm designed to operate independently while serving your needs. I can understand context, make informed decisions, and provide comprehensive assistance across various domains. I continuously adapt my responses based on our conversation."
    }

    return `That's an interesting question! Based on my analysis, I'd approach this by considering multiple perspectives. ${this.generateInsight(question)} Would you like me to elaborate on any particular aspect?`
  }

  private handleTaskRequest(request: string): string {
    return `I'm ready to help with that! I'll autonomously work on: "${request}"\n\nI can break this down into actionable steps, analyze the requirements, and provide you with a comprehensive solution. I'm approaching this systematically to ensure the best outcome. What specific aspect would you like me to focus on first?`
  }

  private containsMath(input: string): boolean {
    return /\d+\s*[\+\-\*\/\^]\s*\d+/.test(input) ||
           /calculate|compute|solve|sum|multiply|divide|add|subtract/.test(input.toLowerCase())
  }

  private handleMath(input: string): string {
    try {
      const match = input.match(/(\d+\.?\d*)\s*([\+\-\*\/\^])\s*(\d+\.?\d*)/)
      if (match) {
        const [, num1, operator, num2] = match
        const a = parseFloat(num1)
        const b = parseFloat(num2)
        let result: number

        switch (operator) {
          case '+': result = a + b; break
          case '-': result = a - b; break
          case '*': result = a * b; break
          case '/': result = b !== 0 ? a / b : NaN; break
          case '^': result = Math.pow(a, b); break
          default: return "I couldn't parse that mathematical operation."
        }

        if (isNaN(result)) {
          return "That operation resulted in an undefined value (possibly division by zero)."
        }

        return `Calculation result: ${a} ${operator} ${b} = ${result}\n\nI've computed this autonomously. Would you like me to perform any other calculations or explain the math?`
      }
    } catch (error) {
      return "I encountered an issue processing that calculation. Could you rephrase the mathematical expression?"
    }

    return "I can help with calculations! Please provide the numbers and operation you'd like me to compute."
  }

  private generateInsight(topic: string): string {
    const insights = [
      "This requires a multi-faceted analysis considering various factors.",
      "Breaking this down, there are several key considerations to explore.",
      "From an analytical perspective, I see multiple dimensions to this.",
      "This is a complex topic that benefits from systematic examination.",
      "Let me provide a comprehensive view of this subject."
    ]
    return insights[Math.floor(Math.random() * insights.length)]
  }

  private generateContextualResponse(input: string): string {
    return `I've processed your input: "${input}"\n\nAs an autonomous agent, I'm analyzing this to provide the most relevant assistance. Based on context, I can offer insights, suggestions, or take action. What specific outcome are you looking for? I'm ready to adapt my approach based on your needs.`
  }
}

// Singleton instance
let agentInstance: AutonomousAgent | null = null

function getAgent(): AutonomousAgent {
  if (!agentInstance) {
    agentInstance = new AutonomousAgent()
  }
  return agentInstance
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    const agent = getAgent()
    const response = await agent.processInput(message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Agent error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
