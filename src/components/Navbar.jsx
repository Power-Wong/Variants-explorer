import { Dna, BookOpen, Github } from 'lucide-react'

function Navbar() {
  return (
    <nav className="border-b border-lab-light bg-lab-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Dna className="w-8 h-8 text-primary-400" />
            <span className="text-xl font-bold text-white">VariantExplorer</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://myvariant.info/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">API 文档</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
