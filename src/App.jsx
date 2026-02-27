import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import VariantResult from './components/VariantResult'
import { Dna, FlaskConical, Microscope } from 'lucide-react'

function App() {
  const [variantData, setVariantData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (query) => {
    setLoading(true)
    setError(null)
    setVariantData(null)

    try {
      const response = await fetch(`https://myvariant.info/v1/variant/${encodeURIComponent(query)}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('未找到该变异信息，请检查输入的 HGVS 标识符是否正确')
        }
        throw new Error('API 请求失败，请稍后重试')
      }

      const data = await response.json()
      // MyVariant.info API返回数组,取第一个元素
      setVariantData(Array.isArray(data) ? data[0] : data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lab-dark via-lab-medium to-lab-dark">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dna className="w-12 h-12 text-primary-400 animate-pulse" />
            <h1 className="text-5xl font-bold text-gradient">
              VariantExplorer
            </h1>
            <Dna className="w-12 h-12 text-primary-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            探索基因变异数据，获取临床意义、药物信息和预测分值
          </p>
        </div>

        {/* Search Section */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Features */}
        {!variantData && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <div className="card text-center hover:border-primary-500/50 transition-all duration-300">
              <Microscope className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">临床意义</h3>
              <p className="text-gray-400 text-sm">查看 Clinvar 提供的变异临床评价</p>
            </div>
            <div className="card text-center hover:border-primary-500/50 transition-all duration-300">
              <FlaskConical className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">药物信息</h3>
              <p className="text-gray-400 text-sm">获取 PharmGKB 相关药物数据</p>
            </div>
            <div className="card text-center hover:border-primary-500/50 transition-all duration-300">
              <Dna className="w-10 h-10 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">预测分值</h3>
              <p className="text-gray-400 text-sm">多软件预测结果对比分析</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-500/30 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-400 mt-4">正在查询变异数据...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Result Section */}
        {variantData && <VariantResult data={variantData} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-lab-light mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>数据来源: <a href="https://myvariant.info" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">MyVariant.info</a></p>
          <p className="mt-2">© 2024 VariantExplorer. 仅供研究使用。</p>
        </div>
      </footer>
    </div>
  )
}

export default App
