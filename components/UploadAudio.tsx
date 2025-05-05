'use client'

import React, { useRef } from 'react'

interface UploadAudioProps {
  onTranscribe: (file: File) => void
  loading: boolean
}

const UploadAudio: React.FC<UploadAudioProps> = ({ onTranscribe, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onTranscribe(e.target.files[0])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Upload Audio File</label>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={loading}
        className="border border-gray-300 rounded p-2 w-full max-w-xs"
      />
    </div>
  )
}

export default UploadAudio
