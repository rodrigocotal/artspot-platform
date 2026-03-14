/**
 * Verifies test data exists (seeded by apps/api/scripts/seed-e2e.ts in CI).
 * Kept as a no-op beforeAll hook for local dev where data may already exist.
 */

export async function seedTestData() {
  // Data is seeded by CI step "Seed E2E test data" before tests run.
  // This is a no-op — kept for local development where you can seed manually.
}
