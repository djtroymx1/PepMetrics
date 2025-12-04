// PepMetrics Comprehensive Peptide Database
// Generated from PEPTIDE-DATABASE.md

// ============================================================================
// TYPES
// ============================================================================

export type DoseUnit = 'mcg' | 'mg' | 'IU'
export type AdministrationRoute = 'subcutaneous' | 'intramuscular' | 'oral' | 'intranasal'

export const PEPTIDE_CATEGORIES = [
  'GH Secretagogue',
  'GLP-1 Agonist',
  'GLP-1/GIP Dual Agonist',
  'GLP-1/GIP/Glucagon Triple Agonist',
  'Fat Loss',
  'Recovery/Healing',
  'Mitochondrial/Longevity',
  'Cognitive/Nootropic',
  'Sleep',
  'Sexual Health',
  'Sexual Health/Tanning',
  'Sexual Health/Fertility',
  'Sexual Health/Social',
  'Sexual Health/Vascular',
  'Tanning',
  'Growth Factor',
  'Immune',
  'Bioregulator',
] as const

export type PeptideCategory = typeof PEPTIDE_CATEGORIES[number]

export const STACK_CATEGORIES = [
  'Recovery Stack',
  'GH Stack',
  'Fat Loss Stack',
  'Cognitive Stack',
  'Mitochondrial Stack',
] as const

export type StackCategory = typeof STACK_CATEGORIES[number]

export interface DoseRange {
  min: number
  max: number
  unit: DoseUnit
}

export interface Peptide {
  id: string
  name: string
  brandNames: string[]
  category: PeptideCategory
  vialSizes: number[]  // Available vial sizes in mg
  doseRange: DoseRange
  fastingRequired: boolean
  fastingNotes?: string
  frequency: string
  route: AdministrationRoute
  fdaApproved: boolean
  notes?: string
}

export interface StackComponent {
  peptideId: string
  amount: number | null  // mg per vial, null if variable
}

export interface PeptideStack {
  id: string
  name: string
  category: StackCategory
  components: StackComponent[]
  totalStrength: number | null  // Total mg per vial
  vialSizes: number[]
  vendors?: string[]
  fastingRequired?: boolean
  route?: AdministrationRoute
  notes?: string
}

// ============================================================================
// CATEGORY DISPLAY NAMES
// ============================================================================

export const CATEGORY_DISPLAY_NAMES: Record<PeptideCategory, string> = {
  'GH Secretagogue': 'Growth Hormone Secretagogues',
  'GLP-1 Agonist': 'GLP-1 Agonists',
  'GLP-1/GIP Dual Agonist': 'GLP-1/GIP Dual Agonists',
  'GLP-1/GIP/Glucagon Triple Agonist': 'Triple Agonists',
  'Fat Loss': 'Fat Loss / Metabolic',
  'Recovery/Healing': 'Recovery & Healing',
  'Mitochondrial/Longevity': 'Mitochondrial / Longevity',
  'Cognitive/Nootropic': 'Cognitive / Nootropic',
  'Sleep': 'Sleep',
  'Sexual Health': 'Sexual Health',
  'Sexual Health/Tanning': 'Sexual Health / Tanning',
  'Sexual Health/Fertility': 'Fertility',
  'Sexual Health/Social': 'Social / Bonding',
  'Sexual Health/Vascular': 'Vascular Health',
  'Tanning': 'Tanning',
  'Growth Factor': 'Growth Factors',
  'Immune': 'Immune System',
  'Bioregulator': 'Bioregulators',
}

export const STACK_CATEGORY_DISPLAY_NAMES: Record<StackCategory, string> = {
  'Recovery Stack': 'Recovery Stacks',
  'GH Stack': 'Growth Hormone Stacks',
  'Fat Loss Stack': 'Fat Loss Stacks',
  'Cognitive Stack': 'Cognitive Stacks',
  'Mitochondrial Stack': 'Mitochondrial Stacks',
}

// ============================================================================
// INDIVIDUAL PEPTIDES DATABASE
// ============================================================================

export const PEPTIDES: Peptide[] = [
  // Growth Hormone Secretagogues
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    brandNames: [],
    category: 'GH Secretagogue',
    vialSizes: [2, 5, 10],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: '30-60 min before meals, 2+ hrs after eating',
    frequency: '1-3x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'cjc_1295_no_dac',
    name: 'CJC-1295 (no DAC)',
    brandNames: ['Mod GRF 1-29'],
    category: 'GH Secretagogue',
    vialSizes: [2, 5],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: '30-60 min before meals',
    frequency: '1-3x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'cjc_1295_dac',
    name: 'CJC-1295 (with DAC)',
    brandNames: [],
    category: 'GH Secretagogue',
    vialSizes: [2, 5],
    doseRange: { min: 1000, max: 2000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    brandNames: ['Geref'],
    category: 'GH Secretagogue',
    vialSizes: [2, 5, 15],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: '30-60 min before meals, best before bed',
    frequency: '1-2x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    brandNames: ['Egrifta', 'Egrifta SV'],
    category: 'GH Secretagogue',
    vialSizes: [2, 11.6],
    doseRange: { min: 1400, max: 2000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once daily',
    route: 'subcutaneous',
    fdaApproved: true,
  },
  {
    id: 'ghrp_2',
    name: 'GHRP-2',
    brandNames: [],
    category: 'GH Secretagogue',
    vialSizes: [5, 10],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: '2+ hrs after eating, 30 min before meals',
    frequency: '2-3x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'ghrp_6',
    name: 'GHRP-6',
    brandNames: [],
    category: 'GH Secretagogue',
    vialSizes: [5, 10],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: '2+ hrs after eating, 30 min before meals',
    frequency: '2-3x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'hexarelin',
    name: 'Hexarelin',
    brandNames: [],
    category: 'GH Secretagogue',
    vialSizes: [2, 5],
    doseRange: { min: 100, max: 200, unit: 'mcg' },
    fastingRequired: true,
    frequency: '1-2x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'mk_677',
    name: 'MK-677 (Ibutamoren)',
    brandNames: ['Ibutamoren'],
    category: 'GH Secretagogue',
    vialSizes: [750, 1000],
    doseRange: { min: 10, max: 25, unit: 'mg' },
    fastingRequired: false,
    frequency: 'Once daily',
    route: 'oral',
    fdaApproved: false,
    notes: 'Non-peptide, available as capsules (12.5mg x 60) or powder',
  },

  // GLP-1 Agonists / Metabolic
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    brandNames: ['Ozempic', 'Wegovy'],
    category: 'GLP-1 Agonist',
    vialSizes: [3, 5, 6, 10],
    doseRange: { min: 250, max: 2400, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: true,
    notes: 'Titration: 0.25mg x4wks, 0.5mg x4wks, then 1mg+',
  },
  {
    id: 'semaglutide_oral',
    name: 'Semaglutide (Oral)',
    brandNames: ['Rybelsus'],
    category: 'GLP-1 Agonist',
    vialSizes: [3, 7, 14],
    doseRange: { min: 3, max: 14, unit: 'mg' },
    fastingRequired: true,
    fastingNotes: 'Take 30 min before food/drinks with small sip of water',
    frequency: 'Once daily',
    route: 'oral',
    fdaApproved: true,
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    brandNames: ['Mounjaro', 'Zepbound'],
    category: 'GLP-1/GIP Dual Agonist',
    vialSizes: [5, 10, 15, 30, 60],
    doseRange: { min: 2500, max: 15000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: true,
    notes: 'Titration: 2.5mg x4wks, 5mg x4wks, increase by 2.5mg every 4wks',
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    brandNames: [],
    category: 'GLP-1/GIP/Glucagon Triple Agonist',
    vialSizes: [5, 10, 12, 15],
    doseRange: { min: 1000, max: 12000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Triple agonist - requires fasting for optimal effect per some protocols',
  },
  {
    id: 'liraglutide',
    name: 'Liraglutide',
    brandNames: ['Victoza', 'Saxenda'],
    category: 'GLP-1 Agonist',
    vialSizes: [18],
    doseRange: { min: 600, max: 3000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once daily',
    route: 'subcutaneous',
    fdaApproved: true,
  },
  {
    id: 'dulaglutide',
    name: 'Dulaglutide',
    brandNames: ['Trulicity'],
    category: 'GLP-1 Agonist',
    vialSizes: [0.75, 1.5, 3, 4.5],
    doseRange: { min: 750, max: 4500, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: true,
  },
  {
    id: 'exenatide',
    name: 'Exenatide',
    brandNames: ['Byetta'],
    category: 'GLP-1 Agonist',
    vialSizes: [5, 10],
    doseRange: { min: 5, max: 10, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: 'Within 60 min before meals',
    frequency: 'Twice daily',
    route: 'subcutaneous',
    fdaApproved: true,
  },
  {
    id: 'exenatide_er',
    name: 'Exenatide ER',
    brandNames: ['Bydureon', 'Bydureon BCise'],
    category: 'GLP-1 Agonist',
    vialSizes: [2],
    doseRange: { min: 2000, max: 2000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Once weekly',
    route: 'subcutaneous',
    fdaApproved: true,
  },

  // Fat Loss / Metabolic
  {
    id: 'aod_9604',
    name: 'AOD-9604',
    brandNames: [],
    category: 'Fat Loss',
    vialSizes: [5, 6],
    doseRange: { min: 200, max: 500, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: 'Recommended on empty stomach',
    frequency: 'Once daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'hgh_frag_176_191',
    name: 'HGH Fragment 176-191',
    brandNames: [],
    category: 'Fat Loss',
    vialSizes: [5, 6],
    doseRange: { min: 250, max: 500, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: 'Empty stomach critical, 1hr before meals',
    frequency: '2-3x daily',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: '5_amino_1mq',
    name: '5-Amino-1MQ',
    brandNames: [],
    category: 'Fat Loss',
    vialSizes: [500, 1000],
    doseRange: { min: 50, max: 150, unit: 'mg' },
    fastingRequired: false,
    frequency: 'Once daily',
    route: 'oral',
    fdaApproved: false,
    notes: 'NNMT inhibitor, available as capsules (50mg x 60)',
  },

  // Recovery / Healing
  {
    id: 'bpc_157',
    name: 'BPC-157',
    brandNames: ['Body Protection Compound'],
    category: 'Recovery/Healing',
    vialSizes: [5, 10, 15],
    doseRange: { min: 200, max: 500, unit: 'mcg' },
    fastingRequired: false,
    fastingNotes: 'Some prefer fasted for GI issues',
    frequency: '1-2x daily',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Also available as oral capsules (250-500mcg)',
  },
  {
    id: 'tb_500',
    name: 'TB-500',
    brandNames: ['Thymosin Beta-4'],
    category: 'Recovery/Healing',
    vialSizes: [2, 5, 10],
    doseRange: { min: 2000, max: 5000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'tb_500_frag',
    name: 'TB-500 Fragment 17-23',
    brandNames: ['Fequesetide', 'LKKTETQ'],
    category: 'Recovery/Healing',
    vialSizes: [2, 5, 10],
    doseRange: { min: 1000, max: 3000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'ghk_cu',
    name: 'GHK-Cu',
    brandNames: ['Copper Peptide'],
    category: 'Recovery/Healing',
    vialSizes: [50, 100],
    doseRange: { min: 1000, max: 5000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '3-5x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'ghk_basic',
    name: 'GHK Basic',
    brandNames: [],
    category: 'Recovery/Healing',
    vialSizes: [50, 100],
    doseRange: { min: 1000, max: 5000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '3-5x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'll_37',
    name: 'LL-37',
    brandNames: ['CAP-18'],
    category: 'Recovery/Healing',
    vialSizes: [5],
    doseRange: { min: 50, max: 100, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Antimicrobial peptide',
  },
  {
    id: 'kpv',
    name: 'KPV',
    brandNames: [],
    category: 'Recovery/Healing',
    vialSizes: [5],
    doseRange: { min: 200, max: 500, unit: 'mcg' },
    fastingRequired: false,
    frequency: '1-2x daily',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Alpha-MSH derived, anti-inflammatory',
  },
  {
    id: 'ara_290',
    name: 'ARA-290',
    brandNames: [],
    category: 'Recovery/Healing',
    vialSizes: [8, 16],
    doseRange: { min: 1000, max: 4000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },

  // Mitochondrial / Longevity
  {
    id: 'mots_c',
    name: 'MOTS-c',
    brandNames: [],
    category: 'Mitochondrial/Longevity',
    vialSizes: [5, 10],
    doseRange: { min: 5000, max: 15000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Mitochondrial-derived peptide',
  },
  {
    id: 'humanin',
    name: 'Humanin',
    brandNames: [],
    category: 'Mitochondrial/Longevity',
    vialSizes: [5, 10],
    doseRange: { min: 1000, max: 5000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'ss_31',
    name: 'SS-31',
    brandNames: ['Elamipretide'],
    category: 'Mitochondrial/Longevity',
    vialSizes: [25],
    doseRange: { min: 10000, max: 40000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'epithalon',
    name: 'Epithalon',
    brandNames: ['Epitalon'],
    category: 'Mitochondrial/Longevity',
    vialSizes: [20, 50],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Daily (10-20 day cycles)',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Telomerase activator, also available as capsules (3mg x 60)',
  },
  {
    id: 'epithalon_amidate',
    name: 'N-Acetyl Epithalon Amidate',
    brandNames: [],
    category: 'Mitochondrial/Longevity',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Daily (10-20 day cycles)',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'foxo4_dri',
    name: 'FOXO4-DRI',
    brandNames: ['Proxofim'],
    category: 'Mitochondrial/Longevity',
    vialSizes: [10],
    doseRange: { min: 2000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Senolytic peptide',
  },
  {
    id: 'nad_plus',
    name: 'NAD+',
    brandNames: [],
    category: 'Mitochondrial/Longevity',
    vialSizes: [100, 500, 750],
    doseRange: { min: 50, max: 250, unit: 'mg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },

  // Cognitive / Nootropic
  {
    id: 'semax',
    name: 'Semax',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [30],
    doseRange: { min: 300, max: 900, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x daily',
    route: 'intranasal',
    fdaApproved: false,
  },
  {
    id: 'semax_acetyl',
    name: 'N-Acetyl Semax',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [10, 20],
    doseRange: { min: 300, max: 900, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x daily',
    route: 'intranasal',
    fdaApproved: false,
  },
  {
    id: 'semax_amidate',
    name: 'N-Acetyl Semax Amidate',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [20, 30],
    doseRange: { min: 300, max: 900, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x daily',
    route: 'intranasal',
    fdaApproved: false,
    notes: 'Most stable/potent Semax variant',
  },
  {
    id: 'selank',
    name: 'Selank',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [10, 30],
    doseRange: { min: 150, max: 900, unit: 'mcg' },
    fastingRequired: false,
    frequency: '1-3x daily',
    route: 'intranasal',
    fdaApproved: false,
    notes: 'Anxiolytic nootropic',
  },
  {
    id: 'selank_amidate',
    name: 'N-Acetyl Selank Amidate',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [10],
    doseRange: { min: 150, max: 500, unit: 'mcg' },
    fastingRequired: false,
    frequency: '1-3x daily',
    route: 'intranasal',
    fdaApproved: false,
  },
  {
    id: 'p21',
    name: 'P21',
    brandNames: ['P021'],
    category: 'Cognitive/Nootropic',
    vialSizes: [5, 25, 50],
    doseRange: { min: 500, max: 2000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'intranasal',
    fdaApproved: false,
    notes: 'CNTF-derived, promotes neurogenesis',
  },
  {
    id: 'dihexa',
    name: 'Dihexa',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [300],
    doseRange: { min: 10, max: 40, unit: 'mg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'oral',
    fdaApproved: false,
    notes: 'Available as capsules (5mg x 60)',
  },
  {
    id: 'pinealon',
    name: 'Pinealon',
    brandNames: [],
    category: 'Cognitive/Nootropic',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Bioregulator peptide',
  },

  // Sleep
  {
    id: 'dsip',
    name: 'DSIP',
    brandNames: ['Delta Sleep-Inducing Peptide'],
    category: 'Sleep',
    vialSizes: [5],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Before bed',
    route: 'subcutaneous',
    fdaApproved: false,
  },

  // Sexual Health / Melanocortin
  {
    id: 'pt_141',
    name: 'PT-141',
    brandNames: ['Bremelanotide', 'Vyleesi'],
    category: 'Sexual Health',
    vialSizes: [3, 10],
    doseRange: { min: 250, max: 1750, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'As needed (max 8x/month)',
    route: 'subcutaneous',
    fdaApproved: true,
    notes: 'Take 45-60 min before activity, max once per 24hrs',
  },
  {
    id: 'melanotan_2',
    name: 'Melanotan II',
    brandNames: [],
    category: 'Sexual Health/Tanning',
    vialSizes: [3, 10],
    doseRange: { min: 100, max: 500, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Loading: daily, Maintenance: 1-2x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Loading dose 200-500mcg, maintenance 100-200mcg',
  },
  {
    id: 'melanotan_1',
    name: 'Melanotan I',
    brandNames: [],
    category: 'Tanning',
    vialSizes: [10],
    doseRange: { min: 500, max: 1000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'kisspeptin_10',
    name: 'Kisspeptin-10',
    brandNames: [],
    category: 'Sexual Health/Fertility',
    vialSizes: [5],
    doseRange: { min: 100, max: 200, unit: 'mcg' },
    fastingRequired: true,
    fastingNotes: 'Preferred fasted',
    frequency: 'Daily or 2-3x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'gonadorelin',
    name: 'Gonadorelin',
    brandNames: ['GnRH'],
    category: 'Sexual Health/Fertility',
    vialSizes: [2, 10],
    doseRange: { min: 50, max: 200, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'oxytocin',
    name: 'Oxytocin',
    brandNames: [],
    category: 'Sexual Health/Social',
    vialSizes: [5, 10],
    doseRange: { min: 10, max: 40, unit: 'IU' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'intranasal',
    fdaApproved: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    brandNames: ['Vasoactive Intestinal Peptide'],
    category: 'Sexual Health/Vascular',
    vialSizes: [5, 6],
    doseRange: { min: 50, max: 200, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },

  // IGF-1 / Growth Factors
  {
    id: 'igf_1_des',
    name: 'IGF-1 DES',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [1],
    doseRange: { min: 20, max: 100, unit: 'mcg' },
    fastingRequired: true,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'igf_1_lr3',
    name: 'IGF-1 LR3',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [1],
    doseRange: { min: 20, max: 100, unit: 'mcg' },
    fastingRequired: true,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Long-acting IGF-1',
  },
  {
    id: 'mgf',
    name: 'MGF',
    brandNames: ['Mechano Growth Factor'],
    category: 'Growth Factor',
    vialSizes: [2, 5],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'intramuscular',
    fdaApproved: false,
  },
  {
    id: 'peg_mgf',
    name: 'PEG-MGF',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [2, 5],
    doseRange: { min: 100, max: 300, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x weekly',
    route: 'intramuscular',
    fdaApproved: false,
    notes: 'Extended half-life MGF',
  },
  {
    id: 'follistatin_315',
    name: 'Follistatin-315',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [1],
    doseRange: { min: 50, max: 100, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Myostatin inhibitor',
  },
  {
    id: 'follistatin_344',
    name: 'Follistatin-344',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [1],
    doseRange: { min: 50, max: 100, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Myostatin inhibitor',
  },
  {
    id: 'ace_031',
    name: 'ACE-031',
    brandNames: [],
    category: 'Growth Factor',
    vialSizes: [1],
    doseRange: { min: 100, max: 500, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Myostatin inhibitor',
  },

  // Immune System
  {
    id: 'thymosin_alpha_1',
    name: 'Thymosin Alpha-1',
    brandNames: [],
    category: 'Immune',
    vialSizes: [3, 10],
    doseRange: { min: 1000, max: 3000, unit: 'mcg' },
    fastingRequired: false,
    frequency: '2-3x weekly',
    route: 'subcutaneous',
    fdaApproved: false,
  },
  {
    id: 'thymalin',
    name: 'Thymalin',
    brandNames: [],
    category: 'Immune',
    vialSizes: [20, 50],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Thymus bioregulator',
  },

  // Bioregulator Peptides (Khavinson)
  {
    id: 'bronchogen',
    name: 'Bronchogen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Lungs/respiratory',
  },
  {
    id: 'cardiogen',
    name: 'Cardiogen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Heart/cardiovascular',
  },
  {
    id: 'cartalax',
    name: 'Cartalax',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Cartilage',
  },
  {
    id: 'livagen',
    name: 'Livagen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Liver',
  },
  {
    id: 'pancragen',
    name: 'Pancragen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Pancreas',
  },
  {
    id: 'prostamax',
    name: 'Prostamax',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Prostate',
  },
  {
    id: 'testagen',
    name: 'Testagen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Testes',
  },
  {
    id: 'vesugen',
    name: 'Vesugen',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Blood vessels',
  },
  {
    id: 'vilon',
    name: 'Vilon',
    brandNames: [],
    category: 'Bioregulator',
    vialSizes: [20],
    doseRange: { min: 5000, max: 10000, unit: 'mcg' },
    fastingRequired: false,
    frequency: 'Per protocol',
    route: 'subcutaneous',
    fdaApproved: false,
    notes: 'Immune/thymus',
  },
]

// ============================================================================
// PRE-MADE STACKS DATABASE
// ============================================================================

export const PEPTIDE_STACKS: PeptideStack[] = [
  // Recovery / Healing Stacks
  {
    id: 'bpc_tb_blend',
    name: 'BPC-157 & TB-500 Blend',
    category: 'Recovery Stack',
    components: [
      { peptideId: 'bpc_157', amount: 5 },
      { peptideId: 'tb_500', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10, 20],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides', 'Limitless Life'],
  },
  {
    id: 'glow_blend',
    name: 'Glow Blend',
    category: 'Recovery Stack',
    components: [
      { peptideId: 'bpc_157', amount: 10 },
      { peptideId: 'tb_500', amount: 10 },
      { peptideId: 'ghk_cu', amount: 10 },
    ],
    totalStrength: 30,
    vialSizes: [30, 60],
    vendors: ['Peptide Sciences', 'Limitless Life'],
  },
  {
    id: 'klow_blend',
    name: 'Klow Blend',
    category: 'Recovery Stack',
    components: [
      { peptideId: 'bpc_157', amount: 20 },
      { peptideId: 'tb_500', amount: 20 },
      { peptideId: 'ghk_cu', amount: 20 },
      { peptideId: 'kpv', amount: 20 },
    ],
    totalStrength: 80,
    vialSizes: [80],
    vendors: ['Peptide Sciences'],
  },
  {
    id: 'gastro_blend',
    name: 'Gastro Inflammation Formula',
    category: 'Recovery Stack',
    components: [
      { peptideId: 'bpc_157', amount: null },
      { peptideId: 'kpv', amount: null },
    ],
    totalStrength: null,
    vialSizes: [],
    vendors: ['Limitless Life'],
    notes: 'GI healing blend',
  },

  // Growth Hormone Stacks
  {
    id: 'cjc_ipa_blend',
    name: 'CJC-1295 & Ipamorelin Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'cjc_1295_no_dac', amount: 5 },
      { peptideId: 'ipamorelin', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10, 18],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides', 'Limitless Life'],
    fastingRequired: true,
  },
  {
    id: 'cjc_ghrp2_blend',
    name: 'CJC-1295 & GHRP-2 Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'cjc_1295_no_dac', amount: 5 },
      { peptideId: 'ghrp_2', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides'],
    fastingRequired: true,
  },
  {
    id: 'cjc_ghrp6_blend',
    name: 'CJC-1295 & GHRP-6 Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'cjc_1295_no_dac', amount: 5 },
      { peptideId: 'ghrp_6', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides'],
    fastingRequired: true,
  },
  {
    id: 'cjc_hex_blend',
    name: 'CJC-1295 & Hexarelin Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'cjc_1295_no_dac', amount: 5 },
      { peptideId: 'hexarelin', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides'],
    fastingRequired: true,
  },
  {
    id: 'cjc_ipa_ghrp2_triple',
    name: 'CJC-1295 + Ipamorelin + GHRP-2',
    category: 'GH Stack',
    components: [
      { peptideId: 'cjc_1295_no_dac', amount: 3 },
      { peptideId: 'ipamorelin', amount: 3 },
      { peptideId: 'ghrp_2', amount: 3 },
    ],
    totalStrength: 9,
    vialSizes: [9],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides'],
    fastingRequired: true,
  },
  {
    id: 'sermorelin_ipa_blend',
    name: 'Sermorelin & Ipamorelin Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'sermorelin', amount: 5 },
      { peptideId: 'ipamorelin', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides'],
    fastingRequired: true,
  },
  {
    id: 'sermorelin_ghrp2_blend',
    name: 'Sermorelin & GHRP-2 Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'sermorelin', amount: 5 },
      { peptideId: 'ghrp_2', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides'],
    fastingRequired: true,
  },
  {
    id: 'sermorelin_ghrp6_blend',
    name: 'Sermorelin & GHRP-6 Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'sermorelin', amount: 5 },
      { peptideId: 'ghrp_6', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Peptide Sciences', 'Core Peptides'],
    fastingRequired: true,
  },
  {
    id: 'sermorelin_triple',
    name: 'Sermorelin + GHRP-6 + GHRP-2',
    category: 'GH Stack',
    components: [
      { peptideId: 'sermorelin', amount: 3 },
      { peptideId: 'ghrp_6', amount: 3 },
      { peptideId: 'ghrp_2', amount: 3 },
    ],
    totalStrength: 9,
    vialSizes: [9],
    vendors: ['Peptide Sciences'],
    fastingRequired: true,
  },
  {
    id: 'tesamorelin_ipa_blend',
    name: 'Tesamorelin & Ipamorelin Blend',
    category: 'GH Stack',
    components: [
      { peptideId: 'tesamorelin', amount: 4 },
      { peptideId: 'ipamorelin', amount: 4 },
    ],
    totalStrength: 8,
    vialSizes: [8],
    vendors: ['Peptide Sciences', 'Core Peptides'],
    fastingRequired: true,
  },
  {
    id: 'tesamorelin_cjc_ipa_triple',
    name: 'Tesamorelin + CJC-1295 + Ipamorelin',
    category: 'GH Stack',
    components: [
      { peptideId: 'tesamorelin', amount: 4 },
      { peptideId: 'cjc_1295_no_dac', amount: 4 },
      { peptideId: 'ipamorelin', amount: 4 },
    ],
    totalStrength: 12,
    vialSizes: [12],
    vendors: ['Peptide Sciences', 'Core Peptides'],
    fastingRequired: true,
  },

  // Fat Loss Stacks
  {
    id: 'frag_cjc_ipa',
    name: 'Fragment + CJC-1295 + Ipamorelin',
    category: 'Fat Loss Stack',
    components: [
      { peptideId: 'hgh_frag_176_191', amount: 6 },
      { peptideId: 'cjc_1295_no_dac', amount: 3 },
      { peptideId: 'ipamorelin', amount: 3 },
    ],
    totalStrength: 12,
    vialSizes: [12],
    vendors: ['Peptide Sciences', 'Core Peptides', 'Biotech Peptides'],
    fastingRequired: true,
  },

  // Cognitive Stacks
  {
    id: 'semax_selank_blend',
    name: 'Semax & Selank Blend',
    category: 'Cognitive Stack',
    components: [
      { peptideId: 'semax_amidate', amount: 15 },
      { peptideId: 'selank_amidate', amount: 15 },
    ],
    totalStrength: 30,
    vialSizes: [30],
    vendors: ['Limitless Life'],
    fastingRequired: false,
    route: 'intranasal',
  },

  // Mitochondrial Stacks
  {
    id: 'mots_humanin_blend',
    name: 'MOTS-c & Humanin Blend',
    category: 'Mitochondrial Stack',
    components: [
      { peptideId: 'mots_c', amount: 5 },
      { peptideId: 'humanin', amount: 5 },
    ],
    totalStrength: 10,
    vialSizes: [10],
    vendors: ['Limitless Life'],
    fastingRequired: false,
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a peptide by its ID
 */
export function getPeptideById(id: string): Peptide | undefined {
  return PEPTIDES.find(p => p.id === id)
}

/**
 * Get a stack by its ID
 */
export function getStackById(id: string): PeptideStack | undefined {
  return PEPTIDE_STACKS.find(s => s.id === id)
}

/**
 * Get all peptides in a category
 */
export function getPeptidesByCategory(category: PeptideCategory): Peptide[] {
  return PEPTIDES.filter(p => p.category === category)
}

/**
 * Get all stacks in a category
 */
export function getStacksByCategory(category: StackCategory): PeptideStack[] {
  return PEPTIDE_STACKS.filter(s => s.category === category)
}

/**
 * Search peptides by name, brand names, or category
 */
export function searchPeptides(query: string): Peptide[] {
  const lowerQuery = query.toLowerCase()
  return PEPTIDES.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brandNames.some(bn => bn.toLowerCase().includes(lowerQuery)) ||
    p.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Search stacks by name or category
 */
export function searchStacks(query: string): PeptideStack[] {
  const lowerQuery = query.toLowerCase()
  return PEPTIDE_STACKS.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.category.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Search both peptides and stacks
 */
export function searchAll(query: string): { peptides: Peptide[]; stacks: PeptideStack[] } {
  return {
    peptides: searchPeptides(query),
    stacks: searchStacks(query),
  }
}

/**
 * Get peptides grouped by category
 */
export function getPeptidesGroupedByCategory(): Record<PeptideCategory, Peptide[]> {
  const grouped = {} as Record<PeptideCategory, Peptide[]>
  for (const category of PEPTIDE_CATEGORIES) {
    const peptides = getPeptidesByCategory(category)
    if (peptides.length > 0) {
      grouped[category] = peptides
    }
  }
  return grouped
}

/**
 * Get stacks grouped by category
 */
export function getStacksGroupedByCategory(): Record<StackCategory, PeptideStack[]> {
  const grouped = {} as Record<StackCategory, PeptideStack[]>
  for (const category of STACK_CATEGORIES) {
    const stacks = getStacksByCategory(category)
    if (stacks.length > 0) {
      grouped[category] = stacks
    }
  }
  return grouped
}

/**
 * Get all FDA approved peptides
 */
export function getFdaApprovedPeptides(): Peptide[] {
  return PEPTIDES.filter(p => p.fdaApproved)
}

/**
 * Get component peptides for a stack
 */
export function getStackComponents(stack: PeptideStack): (Peptide | undefined)[] {
  return stack.components.map(c => getPeptideById(c.peptideId))
}

/**
 * Format vial size for display (e.g., "5mg", "0.75mg")
 */
export function formatVialSize(size: number): string {
  if (size < 1) {
    return `${size}mg`
  }
  return `${size}mg`
}

/**
 * Format dose range for display
 */
export function formatDoseRange(doseRange: DoseRange): string {
  if (doseRange.min === doseRange.max) {
    return `${doseRange.min}${doseRange.unit}`
  }
  return `${doseRange.min}-${doseRange.max}${doseRange.unit}`
}

/**
 * Get display name for a peptide (with brand names if available)
 */
export function getPeptideDisplayName(peptide: Peptide): string {
  if (peptide.brandNames.length > 0) {
    return `${peptide.name} (${peptide.brandNames.join(', ')})`
  }
  return peptide.name
}

/**
 * Check if a peptide or stack requires fasting
 */
export function requiresFasting(item: Peptide | PeptideStack): boolean {
  if ('fastingRequired' in item) {
    return item.fastingRequired ?? false
  }
  return false
}
