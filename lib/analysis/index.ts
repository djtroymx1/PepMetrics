/**
 * Analysis Module Exports
 *
 * This module provides data aggregation, statistical analysis,
 * and validation utilities for the AI insights engine.
 */

export { aggregateUserData, aggregateChatContext } from './data-aggregation'

export {
  calculateCorrelations,
  detectOutliers,
  calculateTrend,
  calculateComplianceRate,
  compareToBaseline,
} from './statistics'

export {
  validateDataSufficiency,
  canGenerateWeeklyAnalysis,
  getValidationMessages,
  type DataValidationResult,
} from './validation'
