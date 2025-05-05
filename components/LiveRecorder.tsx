'use client'

import React, { useState, useRef, useEffect } from 'react'

interface LiveRecorderProps {
  onTranscribe: (file: File) => void
  loading: boolean
}

const LiveRecorder: React.FC<LiveRecorderProps> = ({ onTranscribe, loading }) => {
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop()
        } catch (error) {
          console.error('Error stopping media recorder on unmount:', error)
        }
      }
    }
  }, [])

  const startRecording = async () => {
    if (recording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data)
      })

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
        onTranscribe(file)
      })

      mediaRecorderRef.current.start()
      setRecording(true)
    } catch (error) {
      alert('Microphone access denied or not available.')
    }
  }

  const stopRecording = () => {
    if (!recording || !mediaRecorderRef.current) return
    try {
      mediaRecorderRef.current.stop()
    } catch (error) {
      console.error('Error stopping media recorder:', error)
    }
    setRecording(false)
  }

  return (
    <div className="mb-6 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 transition-colors duration-300">
      <label className="block mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Live Audio Recording
      </label>
      <div className="inline-block">
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  )
}

export default LiveRecorder
