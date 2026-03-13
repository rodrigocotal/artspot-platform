/**
 * Seeds the test database with minimal data for E2E tests.
 * Call from test.beforeAll() — at that point webServers are running.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let seeded = false;

export async function seedTestData() {
  if (seeded) return;

  try {
    // Check if artworks already exist
    const checkRes = await fetch(`${API_URL}/artworks?limit=1`);
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (checkData.data && checkData.data.length > 0) {
        seeded = true;
        return;
      }
    }

    // Create a test artist
    const artistRes = await fetch(`${API_URL}/artists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Test Artist',
        slug: `e2e-test-artist-${Date.now()}`,
        bio: 'An artist created for E2E testing',
        location: 'Test Studio',
      }),
    });

    if (!artistRes.ok) return;

    const artistData = await artistRes.json();
    const artistId = artistData.data?.id;
    if (!artistId) return;

    const artworks = [
      { title: 'Sunset Over Mountains', medium: 'PAINTING', style: 'LANDSCAPE', price: 2500 },
      { title: 'Abstract Composition No. 7', medium: 'PAINTING', style: 'ABSTRACT', price: 3200 },
      { title: 'Urban Reflections', medium: 'PHOTOGRAPHY', style: 'CONTEMPORARY', price: 1800 },
    ];

    for (const artwork of artworks) {
      await fetch(`${API_URL}/artworks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...artwork,
          slug: `${artwork.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`,
          description: `A beautiful ${artwork.medium.toLowerCase()} for E2E testing.`,
          artistId,
          status: 'AVAILABLE',
          year: 2024,
          currency: 'USD',
        }),
      });
    }

    seeded = true;
  } catch {
    // Seed failed — tests will handle empty state gracefully
  }
}
