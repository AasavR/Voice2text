'use client'

import React, { useState, useEffect } from 'react'
import LanguageSelector from '../components/LanguageSelector'
import TemplateSelector from '../components/TemplateSelector'
import BlockSelector from '../components/BlockSelector'
import LiveRecorder from '../components/LiveRecorder'
import axios from 'axios'

interface Template {
  id: string
  filename: string
  blocks: string[]
}

export default function HomePage() {
  const [language, setLanguage] = useState('auto')
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [transcribedText, setTranscribedText] = useState<string>('')

  // Fetch templates from backend on mount
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await axios.get('/templates/list')
        setTemplates(response.data.templates)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      }
    }
    fetchTemplates()
  }, [])

  // Reset selected block when template changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.blocks.length > 0) {
      setSelectedBlock(selectedTemplate.blocks[0])
    } else {
      setSelectedBlock(null)
    }
  }, [selectedTemplate])

  // Handle new transcription text
  function handleTranscription(text: string) {
    setTranscribedText(text)
  }

  // Generate the full document text with the transcribed text populated in the selected block
  function generateDocument() {
    if (!selectedTemplate) return ''
    let doc = `Template: ${selectedTemplate.filename}\n\n`
    selectedTemplate.blocks.forEach((block) => {
      if (block === selectedBlock) {
        doc += `${block}:\n${transcribedText}\n\n`
      } else {
        doc += `${block}:\n\n`
      }
    })
    return doc
  }

  // Download the generated document as a text file
  function downloadDocument() {
    const doc = generateDocument()
    const blob = new Blob([doc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTemplate?.filename || 'document'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice to Text with Templates</h1>
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <TemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
      {selectedTemplate && (
        <BlockSelector
          blocks={selectedTemplate.blocks}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
        />
      )}
      <LiveRecorder language={language} onTranscribe={handleTranscription} />
      <div className="mt-4">
        <h2 className="font-semibold">Transcribed Text for Block: {selectedBlock}</h2>
        <div className="border p-2 min-h-[100px] whitespace-pre-wrap">{transcribedText}</div>
      </div>
      <button
        onClick={downloadDocument}
        disabled={!selectedTemplate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Download Document
      </button>
    </div>
  )
}
