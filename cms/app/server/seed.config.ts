// ─── Seed Configuration ───────────────────────────────────────────────────────
// Adjust these values to control how much demo data is generated.
// All values can also be overridden via environment variables.

export const SEED_CONFIG = {
  // Number of demo clients to generate
  clientCount: parseInt(process.env.SEED_CLIENT_COUNT || '100'),

  // Number of meal library items to generate (from the built-in Indian food dataset)
  mealCount: parseInt(process.env.SEED_MEAL_COUNT || '1000'),

  // Months of weight history to generate per client
  weightHistoryMonths: parseInt(process.env.SEED_WEIGHT_MONTHS || '3'),

  // Fraction of clients that are inactive (0–1)
  inactiveFraction: parseFloat(process.env.SEED_INACTIVE_FRACTION || '0.15'),

  // Fraction of payments that are unpaid/pending (0–1)
  unpaidFraction: parseFloat(process.env.SEED_UNPAID_FRACTION || '0.25'),
};
