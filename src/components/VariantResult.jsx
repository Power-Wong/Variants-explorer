import {
  Dna,
  Activity,
  Pill,
  BarChart3,
  MapPin,
  Hash,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Info,
  Database,
  Microscope,
  FlaskConical,
  AlertTriangle
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
    gene: data.gene?.symbol || data.gene?.genename || data.cadd?.gene?.genename || data.dbsnp?.gene?.symbol || 'N/A',
    rsid: data.dbsnp?.rsid || 'N/A',
    hgvs: data.hgvs?.genomic || data.clinvar?.hgvs?.genomic || [],
  }

  // 提取变异类型和后果
  const variantType = {
    consequence: data.cadd?.consequence || data.snpeff?.ann?.[0]?.effects || 'N/A',
    consdetail: data.cadd?.consdetail || 'N/A',
    type: data.cadd?.type || 'N/A',
    aminoAcidChange: data.cadd?.oaa && data.cadd?.naa ? `${data.cadd.oaa} → ${data.cadd.naa}` : 'N/A',
    proteinPosition: data.cadd?.gene?.prot?.protpos || 'N/A',
  }

  // 提取 ClinVar 信息
  const clinvar = data.clinvar || {}
  const clinvarInfo = {
    hasData: Object.keys(clinvar).length > 0,
    alleleId: clinvar.allele_id || 'N/A',
    clinicalSignificance: clinvar.rcv?.[0]?.clinical_significance || 'N/A',
    reviewStatus: clinvar.rcv?.[0]?.review_status || 'N/A',
    conditions: clinvar.rcv?.[0]?.conditions?.name 
      ? [clinvar.rcv[0].conditions.name] 
      : (Array.isArray(clinvar.rcv?.[0]?.conditions) 
          ? clinvar.rcv[0].conditions.map(c => c.name).filter(Boolean) 
          : []),
    accession: clinvar.rcv?.[0]?.accession || 'N/A',
    lastEvaluated: clinvar.rcv?.[0]?.last_evaluated || 'N/A',
    origin: clinvar.rcv?.[0]?.origin || 'N/A',
  }

  // 提取 CIViC 信息
  const civic = data.civic || {}
  const civicInfo = {
    hasData: Object.keys(civic).length > 0 && civic.evidence_items?.length > 0,
    gene: civic.gene || 'N/A',
    variant: civic.variant || 'N/A',
    evidenceCount: civic.evidence_items?.length || 0,
    evidenceItems: civic.evidence_items || [],
  }

  // 提取 COSMIC 信息
  const cosmic = data.cosmic || {}
  const cosmicInfo = {
    hasData: Object.keys(cosmic).length > 0,
    cosmicId: cosmic.cosmic_id || 'N/A',
    tumorSite: cosmic.tumor_site || 'N/A',
    mutFreq: cosmic.mut_freq || 'N/A',
  }

  // 提取 PharmGKB 信息
  const pharmgkb = data.pharmgkb || {}
  const pharmgkbInfo = {
    hasData: Object.keys(pharmgkb).length > 0,
    drugs: pharmgkb.drugs || [],
    guidelines: pharmgkb.guidelines || [],
    variantId: pharmgkb.variant_id || 'N/A',
  }

  // 提取预测分值
  const predictions = {
    sift: {
      pred: data.sift?.cat || (Array.isArray(data.dbnsfp?.sift?.pred) ? data.dbnsfp.sift.pred[0] : data.dbnsfp?.sift?.pred) || 'N/A',
      score: data.sift?.val || (Array.isArray(data.dbnsfp?.sift?.score) ? data.dbnsfp.sift.score[0] : data.dbnsfp?.sift?.score) || 'N/A',
    },
    polyphen: {
      pred: data.cadd?.polyphen?.cat || (Array.isArray(data.dbnsfp?.polyphen2?.hdiv?.pred) ? data.dbnsfp.polyphen2.hdiv.pred[0] : data.dbnsfp?.polyphen2?.hdiv?.pred) || 'N/A',
      score: data.cadd?.polyphen?.val || (Array.isArray(data.dbnsfp?.polyphen2?.hdiv?.score) ? data.dbnsfp.polyphen2.hdiv.score[0] : data.dbnsfp?.polyphen2?.hdiv?.score) || 'N/A',
    },
    cadd: {
      phred: data.cadd?.phred || 'N/A',
      rawscore: data.cadd?.rawscore || 'N/A',
    },
    revel: {
      score: Array.isArray(data.dbnsfp?.revel?.score) ? data.dbnsfp.revel.score[0] : data.dbnsfp?.revel?.score || 'N/A',
    },
    mutationtaster: {
      pred: Array.isArray(data.dbnsfp?.mutationtaster?.pred) ? data.dbnsfp.mutationtaster.pred[0] : data.dbnsfp?.mutationtaster?.pred || 'N/A',
      score: Array.isArray(data.dbnsfp?.mutationtaster?.score) ? data.dbnsfp.mutationtaster.score[0] : data.dbnsfp?.mutationtaster?.score || 'N/A',
    },
  }

  // 获取临床意义对应的样式
  const getClinicalSignificanceStyle = (significance) => {
    if (!significance || significance === 'N/A') return { badge: 'badge-info', icon: Info, color: 'text-gray-400' }
    const s = significance.toLowerCase()
    if (s.includes('pathogenic')) {
      return { badge: 'badge-danger', icon: AlertCircle, color: 'text-red-400' }
    }
    if (s.includes('benign')) {
      return { badge: 'badge-success', icon: CheckCircle2, color: 'text-green-400' }
    }
    if (s.includes('uncertain')) {
      return { badge: 'badge-warning', icon: AlertTriangle, color: 'text-yellow-400' }
    }
    return { badge: 'badge-info', icon: Info, color: 'text-blue-400' }
  }

  const significanceStyle = getClinicalSignificanceStyle(clinvarInfo.clinicalSignificance)
  const SignificanceIcon = significanceStyle.icon

  // 获取预测结果的样式
  const getPredictionColor = (pred) => {
    if (!pred || pred === 'N/A') return 'text-gray-400'
    const p = pred.toString().toLowerCase()
    if (p.includes('damaging') || p.includes('deleterious') || p.includes('disease') || p === 'd') {
      return 'text-red-400'
    }
    if (p.includes('benign') || p.includes('tolerated') || p.includes('neutral') || p === 'n' || p === 't') {
      return 'text-green-400'
    }
    return 'text-yellow-400'
  }

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
          <InfoItem icon={Dna} label="基因" value={basicInfo.gene} />
          <InfoItem icon={Hash} label="rs ID" value={basicInfo.rsid} mono />
          <InfoItem icon={MapPin} label="染色体" value={`chr${basicInfo.chromosome}`} />
          <InfoItem icon={MapPin} label="位置" value={basicInfo.position?.toString()} mono />
          <InfoItem icon={Dna} label="REF → ALT" value={`${basicInfo.ref} → ${basicInfo.alt}`} mono />
        </div>

        {variantType.aminoAcidChange !== 'N/A' && (
          <div className="mt-6 pt-6 border-t border-lab-light">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem icon={Activity} label="氨基酸改变" value={variantType.aminoAcidChange} mono />
              <InfoItem icon={MapPin} label="蛋白位置" value={variantType.proteinPosition?.toString()} mono />
              <InfoItem icon={Info} label="变异类型" value={variantType.consdetail} />
              <InfoItem icon={Info} label="后果" value={variantType.consequence} />
            </div>
          </div>
        )}

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

      {/* 临床意义 - ClinVar */}
      {clinvarInfo.hasData && (
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

            {clinvarInfo.lastEvaluated && clinvarInfo.lastEvaluated !== 'N/A' && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">最后评估:</span>
                <span className="text-white">{clinvarInfo.lastEvaluated}</span>
              </div>
            )}

            {clinvarInfo.origin && clinvarInfo.origin !== 'N/A' && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">变异来源:</span>
                <span className="text-white">{clinvarInfo.origin}</span>
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
      )}

      {/* CIViC 信息 */}
      {civicInfo.hasData && (
        <Accordion title="临床证据 (CIViC)" icon={Microscope}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem icon={Dna} label="基因" value={civicInfo.gene} />
              <InfoItem icon={Activity} label="变异" value={civicInfo.variant} />
              <InfoItem icon={Database} label="证据数量" value={civicInfo.evidenceCount?.toString()} />
            </div>

            {civicInfo.evidenceItems.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 mb-2">证据条目:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {civicInfo.evidenceItems.slice(0, 5).map((item, i) => (
                    <div key={i} className="p-3 bg-lab-dark rounded-lg border border-lab-light">
                      <p className="text-sm text-gray-300">{item.description || item.evidence_type || 'N/A'}</p>
                      {item.source && (
                        <p className="text-xs text-gray-500 mt-1">来源: {item.source.citation || 'N/A'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Accordion>
      )}

      {/* COSMIC 信息 */}
      {cosmicInfo.hasData && (
        <Accordion title="体细胞突变 (COSMIC)" icon={FlaskConical}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem icon={Hash} label="COSMIC ID" value={cosmicInfo.cosmicId} mono />
              <InfoItem icon={Activity} label="肿瘤部位" value={cosmicInfo.tumorSite} />
              <InfoItem icon={BarChart3} label="突变频率" value={cosmicInfo.mutFreq?.toString()} />
            </div>
          </div>
        </Accordion>
      )}

      {/* 药物信息 */}
      {pharmgkbInfo.hasData && (
        <Accordion title="药物信息 (PharmGKB)" icon={Pill}>
          <div className="space-y-4">
            {pharmgkbInfo.drugs.length > 0 ? (
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
            ) : (
              <p className="text-gray-500 text-center py-4">暂无 PharmGKB 药物信息</p>
            )}

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
        </Accordion>
      )}

      {/* 预测分值 */}
      <Accordion title="致病性预测" icon={BarChart3} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PredictionCard
            title="SIFT"
            prediction={predictions.sift.pred}
            score={predictions.sift.score}
            description="SIFT < 0.05 表示有害"
            getPredictionColor={getPredictionColor}
          />
          <PredictionCard
            title="PolyPhen-2"
            prediction={predictions.polyphen.pred}
            score={predictions.polyphen.score}
            description="分值越高越可能有害"
            getPredictionColor={getPredictionColor}
          />
          <PredictionCard
            title="CADD"
            score={predictions.cadd.phred}
            description="Phred > 20 表示可能有害"
            getPredictionColor={getPredictionColor}
          />
          <PredictionCard
            title="REVEL"
            score={predictions.revel.score}
            description="REVEL > 0.5 表示可能有害"
            getPredictionColor={getPredictionColor}
          />
          <PredictionCard
            title="MutationTaster"
            prediction={predictions.mutationtaster.pred}
            score={predictions.mutationtaster.score}
            description="预测变异功能影响"
            getPredictionColor={getPredictionColor}
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
function PredictionCard({ title, prediction, score, description, getPredictionColor }) {
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
