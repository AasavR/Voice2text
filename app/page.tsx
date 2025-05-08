'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import LanguageSelector from '../components/LanguageSelector'
import TemplateSelector from '../components/TemplateSelector'
import { getToken } from '../lib/api'

interface Block {
  id: string
  name: string
}

interface Template {
  filename: string
  blocks: Block[]
}

export default function Dashboard() {
  const [language, setLanguage] = useState('auto')
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [blockTexts, setBlockTexts] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [recordingBlock, setRecordingBlock] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const fetchTemplates = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
      const res = await axios.get(`${apiBaseUrl}/templates/list`)
      setTemplates(res.data.templates || [])
    } catch (error) {
      console.error('Error fetching templates', error)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.filename === selectedTemplate)
      setBlocks(template ? template.blocks : [])
      setBlockTexts({})
    } else {
      setBlocks([])
      setBlockTexts({})
    }
  }, [selectedTemplate, templates])

  const handleBlockTextChange = (blockId: string, value: string) => {
    setBlockTexts((prev) => ({
      ...prev,
      [blockId]: value,
    }))
  }

  const startRecording = async (blockId: string) => {
    if (recordingBlock) {
      alert('Please stop the current recording before starting a new one.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        transcribeAudio(audioBlob, blockId)
      }
      mediaRecorderRef.current.start()
      setRecordingBlock(blockId)
    } catch (error) {
      console.error('Error starting recording', error)
      alert('Could not start recording. Please check microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingBlock) {
      mediaRecorderRef.current.stop()
      setRecordingBlock(null)
    }
  }

  const handleRecord = (blockId: string) => {
    if (recordingBlock === blockId) {
      stopRecording()
    } else {
      startRecording(blockId)
    }
  }

  const transcribeAudio = async (audioBlob: Blob, blockId: string) => {
    setLoading(true)
    try {
      const token = getToken()
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')
      formData.append('language', language)

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

      const res = await axios.post(`${apiBaseUrl}/transcribe/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      const rawText = res.data.raw_text || ''

      setBlockTexts((prev) => ({
        ...prev,
        [blockId]: (prev[blockId] || '') + ' ' + rawText,
      }))
    } catch (error) {
      console.error('Transcription error', error)
      alert('Error during transcription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!selectedTemplate) {
      alert('Please select a template before downloading.')
      return
    }
    try {
      const token = getToken()
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

      const res = await axios.post(
        `${apiBaseUrl}/templates/format`,
        {
          template_filename: selectedTemplate,
          blocks_text: blockTexts,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const downloadUrl = res.data.download_url
      if (downloadUrl) {
        window.open(downloadUrl, '_blank')
      } else {
        alert('Download URL not available.')
      }
    } catch (error) {
      console.error('Download error', error)
      alert('Error generating download. Please try again.')
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-12 space-y-12 bg-white dark:bg-gray-900 rounded-xl shadow-xl transition-colors duration-500">
      <h1 className="text-7xl font-extrabold text-center text-gray-900 dark:text-gray-100">
        Voice2Text Dashboard
      </h1>
      <section className="space-y-10">
        <LanguageSelector language={language} setLanguage={setLanguage} />
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      </section>
      <section className="space-y-6">
        {blocks.map((block) => (
          <div key={block.id} className="mb-4">
            <label htmlFor={block.id} className="block mb-1 font-semibold">
              {block.name}
            </label>
            <textarea
              id={block.id}
              value={blockTexts[block.id] || ''}
              onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded p-2"
            />
            <button
              onClick={() => handleRecord(block.id)}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            >
              {recordingBlock === block.id ? 'Stop Recording' : 'Record'}
            </button>
          </div>
        ))}
      </section>
      <button
        onClick={handleDownload}
        disabled={loading || !selectedTemplate}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
      >
        Download Document
      </button>
    </main>
  )
}
