export interface PeptideDefinition {
  id: string
  name: string
  category: 'glp1-agonist' | 'growth-hormone' | 'recovery' | 'mitochondrial' | 'longevity' | 'cosmetic' | 'other'
  commonDoses: string[]
  typicalFrequency: string
  requiresFasting: boolean
  notes?: string
}

export const PEPTIDE_CATEGORIES = {
  'glp1-agonist': 'GLP-1 Agonists',
  'growth-hormone': 'Growth Hormone Releasing',
  'recovery': 'Recovery/Healing',
  'mitochondrial': 'Mitochondrial/Longevity',
  'longevity': 'Longevity',
  'cosmetic': 'Cosmetic',
  'other': 'Other',
} as const

export const PEPTIDES: PeptideDefinition[] = [
  // GLP-1 Agonists
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    category: 'glp1-agonist',
    commonDoses: ['1mg', '2mg', '4mg', '8mg', '12mg'],
    typicalFrequency: 'Weekly',
    requiresFasting: true,
    notes: 'Triple agonist (GLP-1, GIP, Glucagon). Start low and titrate up.',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide (Mounjaro/Zepbound)',
    category: 'glp1-agonist',
    commonDoses: ['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg'],
    typicalFrequency: 'Weekly',
    requiresFasting: true,
    notes: 'Dual GLP-1/GIP agonist. FDA approved for weight management.',
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide (Ozempic/Wegovy)',
    category: 'glp1-agonist',
    commonDoses: ['0.25mg', '0.5mg', '1mg', '1.7mg', '2.4mg'],
    typicalFrequency: 'Weekly',
    requiresFasting: true,
    notes: 'GLP-1 agonist. Start at 0.25mg and titrate monthly.',
  },
  {
    id: 'liraglutide',
    name: 'Liraglutide',
    category: 'glp1-agonist',
    commonDoses: ['0.6mg', '1.2mg', '1.8mg', '3mg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Daily GLP-1 agonist. Shorter acting than semaglutide.',
  },
  {
    id: 'cagrisema',
    name: 'CagriSema',
    category: 'glp1-agonist',
    commonDoses: ['2.4mg/2.4mg'],
    typicalFrequency: 'Weekly',
    requiresFasting: true,
    notes: 'Combination of semaglutide and cagrilintide (amylin analog).',
  },

  // Growth Hormone Releasing
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'growth-hormone',
    commonDoses: ['1mg', '2mg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'GHRH analog. FDA approved for HIV lipodystrophy. Inject before bed.',
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg', '300mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Selective GH secretagogue. Often stacked with CJC-1295.',
  },
  {
    id: 'cjc-1295-dac',
    name: 'CJC-1295 with DAC',
    category: 'growth-hormone',
    commonDoses: ['1mg', '2mg'],
    typicalFrequency: '2x/week',
    requiresFasting: true,
    notes: 'Long-acting GHRH. DAC extends half-life to ~8 days.',
  },
  {
    id: 'cjc-1295-no-dac',
    name: 'CJC-1295 (no DAC) / Mod GRF 1-29',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Short-acting GHRH. Stack with GHRP like Ipamorelin.',
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg', '300mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'GHRH analog. Often used as intro to GH peptides.',
  },
  {
    id: 'ghrp-2',
    name: 'GHRP-2',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg', '300mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Strong GH release but can increase hunger and cortisol.',
  },
  {
    id: 'ghrp-6',
    name: 'GHRP-6',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Significant appetite stimulation. Good for those needing to eat more.',
  },
  {
    id: 'mk-677',
    name: 'MK-677 (Ibutamoren)',
    category: 'growth-hormone',
    commonDoses: ['10mg', '15mg', '25mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Oral GH secretagogue. Can affect blood sugar and cause water retention.',
  },
  {
    id: 'hexarelin',
    name: 'Hexarelin',
    category: 'growth-hormone',
    commonDoses: ['100mcg', '200mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Strong GHRP but causes desensitization. Cycle 4 weeks on/off.',
  },

  // Recovery/Healing
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'recovery',
    commonDoses: ['250mcg', '500mcg', '750mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Body Protection Compound. Inject near injury site for best results.',
  },
  {
    id: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4)',
    category: 'recovery',
    commonDoses: ['2mg', '2.5mg', '5mg'],
    typicalFrequency: '2x/week',
    requiresFasting: false,
    notes: 'Systemic healing. Loading phase: 2x/week for 4-6 weeks, then weekly.',
  },
  {
    id: 'kpv',
    name: 'KPV',
    category: 'recovery',
    commonDoses: ['200mcg', '500mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Anti-inflammatory tripeptide from alpha-MSH. Gut healing.',
  },
  {
    id: 'pda',
    name: 'Pentadeca Arginate (PDA)',
    category: 'recovery',
    commonDoses: ['100mcg', '250mcg', '500mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Arginine salt form of BPC-157. Enhanced stability.',
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'recovery',
    commonDoses: ['1mg', '2mg', '3mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Copper peptide. Tissue remodeling, skin health, hair growth.',
  },
  {
    id: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1',
    category: 'recovery',
    commonDoses: ['1.6mg', '3.2mg'],
    typicalFrequency: '2x/week',
    requiresFasting: false,
    notes: 'Immune modulation. FDA approved in other countries.',
  },

  // Mitochondrial/Longevity
  {
    id: 'mots-c',
    name: 'MOTS-c',
    category: 'mitochondrial',
    commonDoses: ['5mg', '10mg'],
    typicalFrequency: '3x/week',
    requiresFasting: true,
    notes: 'Mitochondrial-derived peptide. Metabolic regulation.',
  },
  {
    id: 'ss-31',
    name: 'SS-31 (Elamipretide)',
    category: 'mitochondrial',
    commonDoses: ['5mg', '10mg', '20mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Targets cardiolipin in mitochondria. Improves cellular energy.',
  },
  {
    id: 'epithalon',
    name: 'Epithalon',
    category: 'longevity',
    commonDoses: ['5mg', '10mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Telomerase activator. Typically run in 10-20 day cycles.',
  },
  {
    id: 'dsip',
    name: 'DSIP (Delta Sleep Inducing Peptide)',
    category: 'longevity',
    commonDoses: ['100mcg', '250mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Sleep enhancement. Take 30 min before bed.',
  },
  {
    id: 'selank',
    name: 'Selank',
    category: 'longevity',
    commonDoses: ['250mcg', '500mcg', '750mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Anxiolytic and nootropic. Intranasal or subcutaneous.',
  },
  {
    id: 'semax',
    name: 'Semax',
    category: 'longevity',
    commonDoses: ['200mcg', '600mcg', '1mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Cognitive enhancement. ACTH analog. Usually intranasal.',
  },

  // Other
  {
    id: 'melanotan-ii',
    name: 'Melanotan II',
    category: 'cosmetic',
    commonDoses: ['100mcg', '250mcg', '500mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Tanning peptide. Start very low dose. Side effects common.',
  },
  {
    id: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    category: 'other',
    commonDoses: ['500mcg', '1mg', '1.75mg'],
    typicalFrequency: 'As needed',
    requiresFasting: false,
    notes: 'Sexual dysfunction treatment. FDA approved. Use 45 min before activity.',
  },
  {
    id: 'kisspeptin',
    name: 'Kisspeptin',
    category: 'other',
    commonDoses: ['50mcg', '100mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'Hormone regulation. Stimulates GnRH release.',
  },
  {
    id: 'aod-9604',
    name: 'AOD-9604',
    category: 'other',
    commonDoses: ['250mcg', '300mcg', '500mcg'],
    typicalFrequency: 'Daily',
    requiresFasting: true,
    notes: 'Fat loss fragment of HGH. No effect on blood sugar or IGF-1.',
  },
  {
    id: '5-amino-1mq',
    name: '5-Amino-1MQ',
    category: 'other',
    commonDoses: ['50mg', '100mg', '150mg'],
    typicalFrequency: 'Daily',
    requiresFasting: false,
    notes: 'NNMT inhibitor. Oral compound for metabolism support.',
  },
  {
    id: 'nad-injectable',
    name: 'NAD+ (injectable)',
    category: 'longevity',
    commonDoses: ['50mg', '100mg', '250mg'],
    typicalFrequency: '2x/week',
    requiresFasting: false,
    notes: 'Cellular energy and longevity. Can cause flushing.',
  },
]

// Custom peptide option for freeform entry
export const CUSTOM_PEPTIDE: PeptideDefinition = {
  id: 'custom',
  name: 'Custom Peptide',
  category: 'other',
  commonDoses: [],
  typicalFrequency: 'Daily',
  requiresFasting: false,
  notes: 'Enter your own peptide details.',
}

export function getPeptideById(id: string): PeptideDefinition | undefined {
  if (id === 'custom') return CUSTOM_PEPTIDE
  return PEPTIDES.find(p => p.id === id)
}

export function getPeptidesByCategory(category: PeptideDefinition['category']): PeptideDefinition[] {
  return PEPTIDES.filter(p => p.category === category)
}

export function searchPeptides(query: string): PeptideDefinition[] {
  const lowerQuery = query.toLowerCase()
  return PEPTIDES.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.id.toLowerCase().includes(lowerQuery)
  )
}
