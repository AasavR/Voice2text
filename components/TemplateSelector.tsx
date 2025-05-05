import React from 'react'

interface Block {
  id: string
  name: string
}

interface Template {
  filename: string
  template_name: string
  blocks: Block[]
}

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="template" className="block mb-1 font-semibold">
        Select Template
      </label>
      <select
        id="template"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full max-w-xs"
      >
        <option value="">-- Select a template --</option>
        {templates.map((template) => (
          <option key={template.filename} value={template.filename}>
            {template.template_name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TemplateSelector
