import {
  Dna,
  Activity,
  Pill,
  BarChart3,
  MapPin,
  Hash,
  Dna2,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react'
import Accordion from './Accordion'

function VariantResult({ data }) {
  // 提取基础信息
  const basicInfo = {
    id: data._id || 'N/A',
    chromosome: data.chrom || data.vcf?.chrom || 'N/A',
    position: data.vcf?.position || data.hg19?.start || data.hg38?.start || 'N/A',
    ref: data.vcf?.ref || 'N/A',
    alt: data.vcf?.alt || 'N/A',
    gene: data.gene?.symbol || data.dbsnp?.gene?.symbol || 'N/A',
    hgvs: data.hgvs?.genomic || [],
  }

  // 提取 ClinVar 信息
  const clinvar = data.clinvar || {}
  const clinvarInfo = {
    clinicalSignificance: clinvar.rcv?.[0]?.clinical_significance || clinvar.clinical_significance || 'N/A',
    reviewStatus: clinvar.rcv?.[0]?.review_status || clinvar.review_status || 'N/A',
    conditions: clinvar.rcv?.[0]?.conditions?.map(c => c.name).filter(Boolean) || [],
    accession: clinvar.rcv?.[0]?.accession || clinvar.accession || 'N/A',
  }

  // 提取 PharmGKB 信息
  const pharmgkb = data.pharmgkb || {}
  const pharmgkbInfo = {
    drugs: pharmgkb.drugs || [],
    guidelines: pharmgkb.guidelines || [],
    variantId: pharmgkb.variant_id || 'N/A',
  }

  // 提取预测分值
  const predictions = {
    sift: data.sift?.pred || data.dbnsfp?.sift?.pred || 'N/A',
    siftScore: data.sift?.score || data.dbnsfp?.sift?.score || 'N/A',
    polyphen: data.polyphen?.pred || data.dbnsfp?.polyphen2?.hdiv?.pred || 'N/A',
    polyphenScore: data.polyphen?.score || data.dbnsfp?.polyphen2?.hdiv?.score || 'N/A',
    cadd: data.cadd?.phred || data.dbnsfp?.cadd?.phred || 'N/A',
    revel: data.dbnsfp?.revel?.score || 'N/A',
    mutationtaster: data.dbnsfp?.mutationtaster?.pred || 'N/A',
  }

  // 获取临床意义对应的样式
  const getClinicalSignificanceStyle = (significance) => {
    if (!significance || significance === 'N/A') return { badge: 'badge-info', icon: Info }
    const s = significance.toLowerCase()
    if (s.includes('pathogenic')) {
      return { badge: 'badge-danger', icon: AlertCircle }
    }
    if (s.includes('benign')) {
      return { badge: 'badge-success', icon: CheckCircle2 }
    }
    if (s.includes('uncertain')) {
      return { badge: 'badge-warning', icon: Info }
    }
    return { badge: 'badge-info', icon: Info }
  }

  const significanceStyle = getClinicalSignificanceStyle(clinvarInfo.clinicalSignificance)
  const SignificanceIcon = significanceStyle.icon

  return (
    <div className="max-w-5xl mx-auto mt-12 space-y-6">
      {/* 基础概览卡片 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Dna className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold">基础概览</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem icon={Hash} label="Variant ID" value={basicInfo.id} mono />
          <InfoItem icon={Dna2} label="基因符号" value={basicInfo.gene} />
          <InfoItem icon={MapPin} label="染色体" value={basicInfo.chromosome} />
          <InfoItem icon={MapPin} label="位置" value={basicInfo.position?.toString()} mono />
          <InfoItem icon={Dna} label="REF" value={basicInfo.ref} mono />
          <InfoItem icon={Dna} label="ALT" value={basicInfo.alt} mono />
        </div>

        {basicInfo.hgvs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-lab-light">
            <p className="text-sm text-gray-400 mb-2">HGVS 标识符:</p>
            <div className="flex flex-wrap gap-2">
              {basicInfo.hgvs.slice(0, 5).map((h, i) => (
                <span key={i} className="px-3 py-1 bg-lab-dark rounded-lg text-xs font-mono text-gray-300">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 临床意义 */}
      <Accordion title="临床意义 (ClinVar)" icon={Stethoscope} defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">临床意义:</span>
            <span className={`badge ${significanceStyle.badge} flex items-center gap-1.5`}>
              <SignificanceIcon className="w-3.5 h-3.5" />
              {clinvarInfo.clinicalSignificance}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">审核状态:</span>
            <span className="text-white">{clinvarInfo.reviewStatus}</span>
          </div>

          {clinvarInfo.accession && clinvarInfo.accession !== 'N/A' && (
            <div className="flex items-center gap-4">
              <span className="text-gray-400">RCV 编号:</span>
              <span className="font-mono text-primary-400">{clinvarInfo.accession}</span>
            </div>
          )}

          {clinvarInfo.conditions.length > 0 && (
            <div>
              <p className="text-gray-400 mb-2">相关疾病:</p>
              <div className="flex flex-wrap gap-2">
                {clinvarInfo.conditions.map((condition, i) => (
                  <span key={i} className="px-3 py-1 bg-lab-light rounded-lg text-sm text-gray-300">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* 药物信息 */}
      <Accordion title="药物信息 (PharmGKB)" icon={Pill}>
        {pharmgkbInfo.drugs.length > 0 ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-2">相关药物:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pharmgkbInfo.drugs.map((drug, i) => (
                  <div key={i} className="p-3 bg-lab-dark rounded-lg border border-lab-light">
                    <p className="font-medium text-white">{drug.name || drug}</p>
                    {drug.id && (
                      <p className="text-xs text-gray-500 mt-1">ID: {drug.id}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {pharmgkbInfo.guidelines.length > 0 && (
              <div>
                <p className="text-gray-400 mb-2">用药指南:</p>
                <div className="space-y-2">
                  {pharmgkbInfo.guidelines.map((guideline, i) => (
                    <div key={i} className="p-3 bg-lab-dark rounded-lg border border-lab-light">
                      <p className="text-sm text-gray-300">{guideline.name || guideline}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">暂无 PharmGKB 药物信息</p>
        )}
      </Accordion>

      {/* 预测分值 */}
      <Accordion title="预测分值" icon={BarChart3}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PredictionCard
            title="SIFT"
            prediction={predictions.sift}
            score={predictions.siftScore}
            description="SIFT < 0.05 表示有害"
          />
          <PredictionCard
            title="PolyPhen-2"
            prediction={predictions.polyphen}
            score={predictions.polyphenScore}
            description="分值越高越可能有害"
          />
          <PredictionCard
            title="CADD"
            score={predictions.cadd}
            description="Phred 分值 > 20 表示可能有害"
          />
          <PredictionCard
            title="REVEL"
            score={predictions.revel}
            description="REVEL > 0.5 表示可能有害"
          />
          <PredictionCard
            title="MutationTaster"
            prediction={predictions.mutationtaster}
            description="预测变异功能影响"
          />
        </div>
      </Accordion>

      {/* 原始数据 */}
      <Accordion title="原始 JSON 数据" icon={Activity}>
        <pre className="bg-lab-dark p-4 rounded-lg overflow-auto max-h-96 text-xs font-mono text-gray-300 scrollbar-thin">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Accordion>
    </div>
  )
}

// 信息项组件
function InfoItem({ icon: Icon, label, value, mono }) {
  return (
    <div className="p-3 bg-lab-dark rounded-lg border border-lab-light">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <p className={`text-white font-medium ${mono ? 'font-mono text-sm' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  )
}

// 预测卡片组件
function PredictionCard({ title, prediction, score, description }) {
  const getPredictionColor = (pred) => {
    if (!pred || pred === 'N/A') return 'text-gray-400'
    const p = pred.toLowerCase()
    if (p.includes('damaging') || p.includes('deleterious') || p.includes('disease')) {
      return 'text-red-400'
    }
    if (p.includes('benign') || p.includes('tolerated') || p.includes('neutral')) {
      return 'text-green-400'
    }
    return 'text-yellow-400'
  }

  return (
    <div className="p-4 bg-lab-dark rounded-lg border border-lab-light">
      <h4 className="font-medium text-white mb-2">{title}</h4>
      {prediction && prediction !== 'N/A' && (
        <p className={`text-sm mb-1 ${getPredictionColor(prediction)}`}>
          {prediction}
        </p>
      )}
      {score && score !== 'N/A' && (
        <p className="text-2xl font-bold text-primary-400 mb-2">
          {typeof score === 'number' ? score.toFixed(3) : score}
        </p>
      )}
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}

export default VariantResult
