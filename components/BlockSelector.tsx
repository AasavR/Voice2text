import React from 'react'

interface Block {
  id: string
  name: string
  description: string
}

interface BlockSelectorProps {
  selectedBlock: string
  setSelectedBlock: (block: string) => void
}

const blocks: Block[] = [
  { id: 'sender_address', name: "Sender’s Address", description: "The address of the person writing the letter (top-left)" },
  { id: 'date', name: "Date", description: "The date the letter is written" },
  { id: 'recipient_address', name: "Recipient’s Address", description: "The address of the person or organization the letter is addressed to" },
  { id: 'subject', name: "Subject", description: "A brief line stating the purpose of the letter" },
  { id: 'salutation', name: "Salutation", description: "Greeting (e.g., Dear Sir/Madam, To Whom It May Concern)" },
  { id: 'body', name: "Body of the Letter", description: "The main message (usually divided into 2–3 paragraphs)" },
  { id: 'closing_line', name: "Closing Line", description: "Polite ending (e.g., Thank you, Yours sincerely)" },
  { id: 'signature', name: "Signature", description: "Signature of the sender" },
  { id: 'sender_name', name: "Sender’s Name", description: "Printed name of the sender" },
  { id: 'enclosures', name: "Enclosures (if any)", description: "Mention of attached documents, e.g., Encl: Copy of ID proof" },
  { id: 'cc', name: "CC (if any)", description: "Copy to additional people (CC: Office of the Registrar) (optional)" },
]

const BlockSelector: React.FC<BlockSelectorProps> = ({
  selectedBlock,
  setSelectedBlock,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="block" className="block mb-1 font-semibold">
        Select Block
      </label>
      <select
        id="block"
        value={selectedBlock}
        onChange={(e) => setSelectedBlock(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full max-w-xs"
      >
        <option value="">-- Select a block --</option>
        {blocks.map((block) => (
          <option key={block.id} value={block.id} title={block.description}>
            {block.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default BlockSelector
