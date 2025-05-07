'use client'

import React, { useState, useEffect } from 'react'
import LanguageSelector from '../components/LanguageSelector'
import TemplateSelector from '../components/TemplateSelector'
import LiveRecorder from '../components/LiveRecorder'
import axios from 'axios'

interface Block {
  id: string
  name: string
}

interface Template {
  filename: string
  template_name: string
  blocks: Block[]
}

export default function HomePage() {
  const [language, setLanguage] = useState('auto')
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateFilename, setSelectedTemplateFilename] = useState<string>('')
  const [blocksText, setBlocksText] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await axios.get('/api/templates/list')
        console.log('Templates fetched:', response.data.templates)
        setTemplates(response.data.templates)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      }
    }
    fetchTemplates()
  }, [])

  const selectedTemplate = templates.find(t => t.filename === selectedTemplateFilename) || null

  useEffect(() => {
    if (selectedTemplate) {
      const initialText: Record<string, string> = {}
      selectedTemplate.blocks.forEach(block => {
        initialText[block.id] = ''
      })
      setBlocksText(initialText)
    } else {
      setBlocksText({})
    }
  }, [selectedTemplate])

  function handleBlockTranscription(blockId: string, text: string) {
    setBlocksText(prev => ({ ...prev, [blockId]: text }))
  }

  function generateDocument() {
    if (!selectedTemplate) return ''
    let doc = `Template: ${selectedTemplate.template_name}\n\n`
    selectedTemplate.blocks.forEach(block => {
      doc += `${block.name}:\n${blocksText[block.id] || ''}\n\n`
    })
    return doc
  }

  function downloadDocument() {
    const doc = generateDocument()
    const blob = new Blob([doc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedTemplate?.template_name || 'document'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice to Text with Templates</h1>
      <LanguageSelector language={language} setLanguage={setLanguage} />
      <TemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplateFilename}
        setSelectedTemplate={setSelectedTemplateFilename}
      />
      {selectedTemplate && (
        <div className="space-y-6 mt-4">
          {selectedTemplate.blocks.map(block => (
            <div key={block.id} className="border p-4 rounded">
              <h3 className="font-semibold mb-2">{block.name}</h3>
              <LiveRecorder
                language={language}
                onTranscribe={(text) => handleBlockTranscription(block.id, text)}
              />
              <textarea
                className="mt-2 w-full border border-gray-300 rounded p-2"
                rows={4}
                value={blocksText[block.id] || ''}
                onChange={(e) => handleBlockTranscription(block.id, e.target.value)}
                placeholder={`Transcribed text for ${block.name}`}
              />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={downloadDocument}
        disabled={!selectedTemplate}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Download Document
      </button>
    </div>
  )
}
