// Re-export from the comprehensive peptide database for backwards compatibility
// New code should import directly from '@/lib/data/peptides'

import {
  PEPTIDES as NEW_PEPTIDES,
  getPeptideById as getNewPeptideById,
  type Peptide,
} from './data/peptides'

// Legacy interface for backwards compatibility
export interface PeptideDefinition {
  id: string
  name: string
  category: 'glp1-agonist' | 'growth-hormone' | 'recovery' | 'mitochondrial' | 'longevity' | 'cosmetic' | 'other'
  commonDoses: string[]
  typicalFrequency: string
  requiresFasting: boolean
  notes?: string
}

// Legacy category mapping
export const PEPTIDE_CATEGORIES = {
  'glp1-agonist': 'GLP-1 Agonists',
  'growth-hormone': 'Growth Hormone Releasing',
  'recovery': 'Recovery/Healing',
  'mitochondrial': 'Mitochondrial/Longevity',
  'longevity': 'Longevity',
  'cosmetic': 'Cosmetic',
  'other': 'Other',
} as const

// Map new categories to legacy categories
function mapToLegacyCategory(category: string): PeptideDefinition['category'] {
  const mapping: Record<string, PeptideDefinition['category']> = {
    'GH Secretagogue': 'growth-hormone',
    'GLP-1 Agonist': 'glp1-agonist',
    'GLP-1/GIP Dual Agonist': 'glp1-agonist',
    'GLP-1/GIP/Glucagon Triple Agonist': 'glp1-agonist',
    'Fat Loss': 'other',
    'Recovery/Healing': 'recovery',
    'Mitochondrial/Longevity': 'mitochondrial',
    'Cognitive/Nootropic': 'longevity',
    'Sleep': 'longevity',
    'Sexual Health': 'other',
    'Sexual Health/Tanning': 'cosmetic',
    'Sexual Health/Fertility': 'other',
    'Sexual Health/Social': 'other',
    'Sexual Health/Vascular': 'other',
    'Tanning': 'cosmetic',
    'Growth Factor': 'growth-hormone',
    'Immune': 'recovery',
    'Bioregulator': 'longevity',
  }
  return mapping[category] || 'other'
}

// Convert new peptide format to legacy format
function tolegacyFormat(peptide: Peptide): PeptideDefinition {
  const { doseRange } = peptide
  const commonDoses = [
    `${doseRange.min}${doseRange.unit}`,
    `${Math.round((doseRange.min + doseRange.max) / 2)}${doseRange.unit}`,
    `${doseRange.max}${doseRange.unit}`,
  ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

  return {
    id: peptide.id,
    name: peptide.brandNames.length > 0
      ? `${peptide.name} (${peptide.brandNames[0]})`
      : peptide.name,
    category: mapToLegacyCategory(peptide.category),
    commonDoses,
    typicalFrequency: peptide.frequency,
    requiresFasting: peptide.fastingRequired,
    notes: peptide.notes || peptide.fastingNotes,
  }
}

// Export legacy format peptides
export const PEPTIDES: PeptideDefinition[] = NEW_PEPTIDES.map(tolegacyFormat)

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

  const newPeptide = getNewPeptideById(id)
  if (newPeptide) {
    return tolegacyFormat(newPeptide)
  }

  // Fallback: search in legacy list
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
