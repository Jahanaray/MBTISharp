import { useState, useEffect, useRef } from 'react'
import { HubConnection, HubConnectionState, HubConnectionBuilder } from '@microsoft/signalr'
import { HttpTransportType } from '@microsoft/signalr'
import { useTranslation } from 'react-i18next'
import { isContentSafe } from '../utils/safetyFilter'

interface ChatMessage {
  id: string
  matchId: string
  senderId: string
  content: string
  sentAt: string
}

function Chat() {
  const { t } = useTranslation()
  const [matchId, setMatchId] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [contentError, setContentError] = useState('')
  const [connectionState, setConnectionState] = useState<string>('disconnected')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const connectionRef = useRef<HubConnection | null>(null)

  useEffect(() => {
    loadDemoMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadDemoMessages = async () => {
    try {
      const demoMatchId = crypto.randomUUID()
      setMatchId(demoMatchId)

      const historyRes = await fetch(`/api/chat/history/${demoMatchId}`)
      if (historyRes.ok) {
        const data = await historyRes.json()
        setMessages(data)
      } else {
        setMessages([
          {
            id: '1',
            matchId: demoMatchId,
            senderId: 'other',
            content: t('chat.demoHi', 'Hi there! How are you?'),
            sentAt: new Date(Date.now() - 300000).toISOString()
          },
          {
            id: '2',
            matchId: demoMatchId,
            senderId: 'me',
            content: t('chat.demoHello', "Hello! I'm doing great, thanks for asking!"),
            sentAt: new Date(Date.now() - 240000).toISOString()
          }
        ])
      }

      initSignalR(demoMatchId)
    } catch (error) {
      console.error('Failed to load chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const initSignalR = async (matchId: string) => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${window.location.origin}/chatHub`, {
        transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build()

    connection.on('ReceiveMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    connection.on('JoinedMatch', (_id: string) => {
      setConnectionState('connected')
    })

    connection.onreconnecting(() => {
      setConnectionState('reconnecting')
    })

    connection.onreconnected(() => {
      setConnectionState('connected')
    })

    try {
      await connection.start()
      await connection.invoke('JoinMatch', matchId)
      setConnectionState('connected')
      connectionRef.current = connection
    } catch (error) {
      console.error('SignalR connection failed:', error)
      setConnectionState('failed')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !matchId) return

    // Client-side safety filter validation (T106)
    setContentError('')
    if (!isContentSafe(input.trim())) {
      setContentError(t('chat.inappropriateContent', 'Message contains inappropriate language.'))
      return
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      matchId,
      senderId: 'me',
      content: input.trim(),
      sentAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    setInput('')

    if (connectionRef.current?.state === HubConnectionState.Connected) {
      try {
        await connectionRef.current.invoke('SendMessage', matchId, 'me', input.trim())
      } catch (error) {
        console.error('Failed to send message via SignalR:', error)
      }
    }

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          senderId: 'me',
          content: message.content
        })
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('chat.loading', 'Loading chat...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{t('chat.yourMatch', 'Your Match')}</h2>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionState === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {connectionState === 'connected' ? t('chat.online', 'Online') : connectionState}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {t('chat.noMessages', 'No messages yet. Start the conversation!')}
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.senderId === 'me'
                    ? 'bg-primary text-white rounded-se-sm'
                    : 'bg-white text-gray-900 rounded-sw-sm shadow-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderId === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {formatTime(msg.sentAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setContentError('') }}
            placeholder={t('chat.placeholder', 'Type a message...')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('chat.send', 'Send')}
          </button>
        </form>
        {contentError && (
          <p className="max-w-2xl mx-auto mt-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">{contentError}</p>
        )}
      </div>
    </div>
  )
}

export default Chat
