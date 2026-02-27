import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

function Accordion({ title, children, defaultOpen = false, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-lab-light rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-lab-medium hover:bg-lab-light transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-primary-400" />}
          <span className="font-medium text-white">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-lab-dark/50 border-t border-lab-light">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion
