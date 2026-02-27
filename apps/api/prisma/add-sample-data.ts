import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed script with real artist and artwork data from Aldo Castillo Gallery
 * Run with: pnpm tsx prisma/add-sample-data.ts
 */

// Helper: inches to centimeters
const inToCm = (inches: number) => Math.round(inches * 2.54 * 100) / 100;

async function main() {
  console.log('🎨 Seeding database with Aldo Castillo Gallery data...\n');

  // ============================================================================
  // ARTISTS
  // ============================================================================

  const artist1 = await prisma.artist.upsert({
    where: { slug: 'carolina-sardi' },
    update: {},
    create: {
      name: 'Carolina Sardi',
      slug: 'carolina-sardi',
      bio: 'Carolina Sardi is a sculptor born in Argentina, educated at the National University of La Plata and studied under sculptor Ennio Iommi. She relocated to Miami in 1995, initially establishing her studio at the South Florida Art Center on Lincoln Road before moving to Little Haiti. Her practice centers on abstract wall installations and hanging sculptures combining organic, biomorphic forms with geometric precision.',
      statement: 'My work explores positive and negative space through painted steel, using plasma cutting and welding techniques to create textured, patina-finished compositions that emphasize light, shadow, and reflective surfaces.',
      location: 'Argentina',
      featured: true,
      verified: true,
      displayOrder: 1,
    },
  });
  console.log(`✓ Created artist: ${artist1.name}`);

  const artist2 = await prisma.artist.upsert({
    where: { slug: 'fredy-villamil' },
    update: {},
    create: {
      name: 'Fredy Villamil',
      slug: 'fredy-villamil',
      bio: 'Fredy Villamil was born in 1980 in San Antonio de los Baños, Cuba. He received childhood art instruction from his father, Francis M. Villamil, and formally studied at Cuba\'s Vocational School of Art (EVA) and La Quinta de los Molinos in Havana. After exhibiting throughout Mexico, Spain, and other countries, he emigrated to the United States in 2010. His oil paintings synthesize figuration, abstraction, line, form, and color, reflecting influences from European modernists and Cuban Vanguardia masters.',
      statement: 'I consider myself self-taught at heart, drawing inspiration from intuition, emotional connection, and memory. My work reflects the vibrant palettes of expressionism and cubism.',
      location: 'Cuba',
      featured: true,
      verified: true,
      displayOrder: 2,
    },
  });
  console.log(`✓ Created artist: ${artist2.name}`);

  const artist3 = await prisma.artist.upsert({
    where: { slug: 'augusto-esquivel' },
    update: {},
    create: {
      name: 'Augusto Esquivel',
      slug: 'augusto-esquivel',
      bio: 'Augusto Esquivel was born in Argentina in 1976. He grew up with nostalgia for his grandmother, a seamstress who saved buttons in a tin can — a memory that later influenced his artistic practice. After studying special effects and cinematography in Buenos Aires (1997-2001), he moved to the United States in 2001. He creates sculptural artworks using thousands of meticulously arranged buttons strung on clear monofilament and suspended from acrylic supports.',
      statement: 'My work explores the common objects of daily life that represent my sense of self and search for a place of belonging. It involves pixelation, obsessive compulsive disorder and color.',
      location: 'Argentina',
      featured: true,
      verified: true,
      displayOrder: 3,
    },
  });
  console.log(`✓ Created artist: ${artist3.name}`);

  const artist4 = await prisma.artist.upsert({
    where: { slug: 'keiko-hara' },
    update: {},
    create: {
      name: 'Keiko Hara',
      slug: 'keiko-hara',
      bio: 'Keiko Hara was born in 1942 in North Korea to Japanese parents and moved to Japan in 1945. She relocated to the United States in 1971. She holds an M.F.A. in Printmaking from Cranbrook Academy of Art and taught at Whitman College (1985–2006). Her practice explores themes of place, memory, and cultural intersection through abstract compositions in mixed media and mokuhanga woodblock printing.',
      location: 'Japan',
      featured: false,
      verified: true,
      displayOrder: 4,
    },
  });
  console.log(`✓ Created artist: ${artist4.name}`);

  const artist5 = await prisma.artist.upsert({
    where: { slug: 'kevin-langedijk' },
    update: {},
    create: {
      name: 'Kevin Langedijk',
      slug: 'kevin-langedijk',
      bio: 'Kevin Langedijk (born 1982) is a Dutch visual artist who studied graphic and media design in the Netherlands, earning a Bachelor of Arts degree. He worked in graphic design across major cities including New York, Hong Kong, Singapore, Rome, and Paris before dedicating himself to fine art since 2012. His career gave him insider knowledge of international fashion and lifestyle branding. He creates works in series exploring contemporary consumer culture and society.',
      location: 'Netherlands',
      featured: false,
      verified: true,
      displayOrder: 5,
    },
  });
  console.log(`✓ Created artist: ${artist5.name}`);

  const artist6 = await prisma.artist.upsert({
    where: { slug: 'lluis-barba' },
    update: {},
    create: {
      name: 'Lluís Barba',
      slug: 'lluis-barba',
      bio: 'Lluís Barba was born in 1952 in Barcelona, Spain, and educated at the Escola Massana Centre d\'Art. He is one of the most collected contemporary artists of today, celebrating 50 years in the art world as of 2025. His multidisciplinary practice spans painting, photography, sculpture, and video art. He creates contemporary digital photographs and mixed-media works that merge famous masterpieces with contemporary celebrities, cultural icons, and pop culture elements.',
      statement: 'My work weaves art historical references and Old Master paintings seamlessly into scenes that critique art-world commodification and celebrity culture.',
      location: 'Spain',
      featured: true,
      verified: true,
      displayOrder: 6,
    },
  });
  console.log(`✓ Created artist: ${artist6.name}`);

  const artist7 = await prisma.artist.upsert({
    where: { slug: 'emiliano-gironella-parra' },
    update: {},
    create: {
      name: 'Emiliano Gironella Parra',
      slug: 'emiliano-gironella-parra',
      bio: 'Born in Mexico City in 1972, Emiliano Gironella Parra is the son of artists Alberto Gironella and Carmen Parra. He graduated from the Interlochen Arts Academy in Michigan, where he studied sculpture, photography, and engraving. He is internationally recognized for his dialogues and writings about Artempatía, or Empathy Art, and his diverse social artistic practice. He implements his wide range of media to comment on topics of tradition, violence and social injustice in Mexico.',
      location: 'Mexico',
      featured: true,
      verified: true,
      displayOrder: 7,
    },
  });
  console.log(`✓ Created artist: ${artist7.name}`);

  const artist8 = await prisma.artist.upsert({
    where: { slug: 'daniele-fortuna' },
    update: {},
    create: {
      name: 'Daniele Fortuna',
      slug: 'daniele-fortuna',
      bio: 'Italian sculptor born in 1981 in Milan. Fortuna studied at the European Institute of Design in Milan and spent time working in a lighting studio in Ireland, which deepened his engagement with wood as a primary material. He currently lives and works in Cornovecchio, Italy. His practice merges classical mythology with contemporary pop culture, reimagining timeless figures alongside modern icons through layered, hand-painted carved wood in vibrant acrylic hues.',
      location: 'Italy',
      featured: true,
      verified: true,
      displayOrder: 8,
    },
  });
  console.log(`✓ Created artist: ${artist8.name}`);

  const artist9 = await prisma.artist.upsert({
    where: { slug: 'david-zalben' },
    update: {},
    create: {
      name: 'David Zalben',
      slug: 'david-zalben',
      bio: 'David Zalben is an American artist whose professional career spans several decades, beginning as a photographer in 1982 and evolving into wire sculpture. He received a Silver award from Communication Arts Magazine in 1996 and a Gold Medal from the New York Festivals in 1997. Since 2006, he has been artist-in-residence at ArtCenter/SF, Miami Beach. His work bridges photography and wire sculpture.',
      location: 'United States',
      featured: false,
      verified: true,
      displayOrder: 9,
    },
  });
  console.log(`✓ Created artist: ${artist9.name}`);

  const artist10 = await prisma.artist.upsert({
    where: { slug: 'xavier-toubes' },
    update: {},
    create: {
      name: 'Xavier Toubes',
      slug: 'xavier-toubes',
      bio: 'Xavier Toubes was born in 1947 in A Coruña, Spain. He studied at Goldsmiths, University of London, and earned an MFA from Alfred University in New York. He co-founded the European Ceramics Work Centre (EKWC) in the Netherlands in 1989 and taught at the School of the Art Institute of Chicago, where he holds the title of Professor Emeritus. He is a member of the International Academy of Ceramics in Geneva.',
      statement: 'My work involves an ongoing dialogue between the artist, object, and context through the alchemical processes of ceramics, utilizing multiple glazes and firings.',
      location: 'Spain',
      featured: false,
      verified: true,
      displayOrder: 10,
    },
  });
  console.log(`✓ Created artist: ${artist10.name}`);

  const artist11 = await prisma.artist.upsert({
    where: { slug: 'ancizar-marin' },
    update: {},
    create: {
      name: 'Ancizar Marin',
      slug: 'ancizar-marin',
      bio: 'Ancizar Marin is a Colombian sculptor born and trained in the 1980s at the Bellas Artes Institute in Manizales, Colombia. He continued sculptural studies at the Luccio Petraglia School of Art in Bogota, focusing on bronze and steel. South American travels influenced his approach to color and texture. Following Pop Art traditions of Warhol and Lichtenstein, his work emphasizes joy through movement, color, and form.',
      statement: 'Art should be joyful, devoid of troubling subject matter. My sculptures celebrate movement, color, and the human spirit.',
      location: 'Colombia',
      featured: true,
      verified: true,
      displayOrder: 11,
    },
  });
  console.log(`✓ Created artist: ${artist11.name}`);

  const artist12 = await prisma.artist.upsert({
    where: { slug: 'peter-mars' },
    update: {},
    create: {
      name: 'Peter Mars',
      slug: 'peter-mars',
      bio: 'Peter Mars was born in 1959 in Portland, Oregon. He attended Reed College (1977-1982), earning a chemistry degree. After moving to New Orleans in 1982, he learned silkscreen printing at the Contemporary Arts Center. Mars was named an official artist of Elvis Presley Enterprises in 2008, and his ELVIS exhibition ran at the Clinton Presidential Library in 2011. His work draws inspiration from pop culture artifacts like vintage signs, candy wrappers, matchbooks, and television imagery.',
      location: 'United States',
      featured: false,
      verified: true,
      displayOrder: 12,
    },
  });
  console.log(`✓ Created artist: ${artist12.name}`);

  const artist13 = await prisma.artist.upsert({
    where: { slug: 'mariana-monteagudo' },
    update: {},
    create: {
      name: 'Mariana Monteagudo',
      slug: 'mariana-monteagudo',
      bio: 'Mariana Monteagudo is an award-winning sculptor who has been developing her doll series for over a decade. Her creative process is natural and intuitive, sourcing materials from hardware stores, thrift shops, and neighborhood scavenging. Her philosophy emphasizes that there is no ignoble material. Her work is held in the collections of the Museum of Latin American Art (MOLAA), Everson Museum of Art, and the César Gaviria Trujillo Collection.',
      statement: 'There is no ignoble material. I advocate for creative reuse and examine how external forces shape desire, fear, and identity through figurative sculpture.',
      location: 'Venezuela',
      featured: false,
      verified: true,
      displayOrder: 13,
    },
  });
  console.log(`✓ Created artist: ${artist13.name}`);

  const artist14 = await prisma.artist.upsert({
    where: { slug: 'troy-abbott' },
    update: {},
    create: {
      name: 'Troy Abbott',
      slug: 'troy-abbott',
      bio: 'Troy Abbott (American, b. 1967) is a multidisciplinary artist working primarily in digital media. He holds a Bachelor\'s of Fine Arts in Drawing from the University of Florida (1990). Inspired by the film Blade Runner\'s concept of humans and robots coexisting, his signature pieces feature vintage birdcages sourced from thrift stores, paired with filmed live birds and digital elements. He incorporates exposed circuitry, 3D-printed components, video projection, and chrome or gold finishes.',
      statement: 'The birds sit in cages with the doors open, yet they never leave. My work merges the real and the digital to create commentary on reality\'s nature.',
      location: 'United States',
      featured: false,
      verified: true,
      displayOrder: 14,
    },
  });
  console.log(`✓ Created artist: ${artist14.name}`);

  const artist15 = await prisma.artist.upsert({
    where: { slug: 'metis-atash' },
    update: {},
    create: {
      name: 'Metis Atash',
      slug: 'metis-atash',
      bio: 'Metis Atash is a German-born, Miami-based sculptor recognized for striking contemporary sculptures merging spirituality, luxury, and pop culture. She holds a degree in political economy and initially operated an investor relations consultancy in Munich before transitioning to art in 2007. Her signature Punk Buddha series features spiritually-inspired figures adorned with hand-applied Swarovski crystals and punk mohawk spikes.',
      statement: 'My work emphasizes the Law of Attraction and the duality in life, drawing from pop art, minimalism, and conceptual traditions.',
      location: 'Germany',
      featured: true,
      verified: true,
      displayOrder: 15,
    },
  });
  console.log(`✓ Created artist: ${artist15.name}`);

  console.log(`\n✅ ${15} artists created\n`);

  // ============================================================================
  // ARTWORKS
  // ============================================================================

  console.log('🖼️  Seeding artworks...\n');

  // --- Carolina Sardi artworks ---
  const sardi1 = await prisma.artwork.upsert({
    where: { slug: 'poppy-field' },
    update: {},
    create: {
      title: 'Poppy Field',
      slug: 'poppy-field',
      artistId: artist1.id,
      description: 'A large-scale painted steel wall installation evoking the organic movement of a field of poppies. Bold color and intricate cuts create a dynamic interplay of light and shadow.',
      medium: 'METAL',
      style: 'ABSTRACT',
      year: 2018,
      width: inToCm(85),
      height: inToCm(67),
      depth: inToCm(2),
      price: 15000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Painted steel',
      certificate: true,
      displayOrder: 1,
    },
  });

  const sardi2 = await prisma.artwork.upsert({
    where: { slug: 'red-installation' },
    update: {},
    create: {
      title: 'Red Installation',
      slug: 'red-installation',
      artistId: artist1.id,
      description: 'A vibrant red painted steel wall sculpture featuring biomorphic forms that create a sense of organic growth and transformation.',
      medium: 'METAL',
      style: 'ABSTRACT',
      year: 2013,
      width: inToCm(45),
      height: inToCm(48),
      depth: inToCm(2),
      price: 13500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Painted steel',
      certificate: true,
      displayOrder: 2,
    },
  });

  const sardi3 = await prisma.artwork.upsert({
    where: { slug: 'souls-alma' },
    update: {},
    create: {
      title: 'Souls / Alma',
      slug: 'souls-alma',
      artistId: artist1.id,
      description: 'A monumental painted steel wall installation exploring the intersection of organic forms and geometric precision. The work invites contemplation on the nature of the soul.',
      medium: 'METAL',
      style: 'ABSTRACT',
      year: 2023,
      width: inToCm(94.75),
      height: inToCm(69.5),
      depth: inToCm(2),
      price: 38000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Painted steel',
      certificate: true,
      displayOrder: 3,
    },
  });

  const sardi4 = await prisma.artwork.upsert({
    where: { slug: 'purple-spell' },
    update: {},
    create: {
      title: 'Purple Spell',
      slug: 'purple-spell',
      artistId: artist1.id,
      description: 'A sweeping purple steel composition that enchants with its flowing forms and mesmerizing play of light across patina surfaces.',
      medium: 'METAL',
      style: 'ABSTRACT',
      year: 2023,
      width: inToCm(115),
      height: inToCm(58),
      depth: inToCm(2),
      price: 28000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Painted steel',
      certificate: true,
      displayOrder: 4,
    },
  });

  // --- Fredy Villamil artworks ---
  const villamil1 = await prisma.artwork.upsert({
    where: { slug: 'cubist-living-room' },
    update: {},
    create: {
      title: 'Cubist Living Room',
      slug: 'cubist-living-room',
      artistId: artist2.id,
      description: 'A monumental oil painting that reimagines a domestic interior through a bold cubist lens, weaving vibrant color fields with expressionist gestures.',
      medium: 'PAINTING',
      style: 'EXPRESSIONISM',
      year: 2024,
      width: inToCm(140),
      height: inToCm(90),
      price: 125000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Oil on canvas',
      signature: 'Signed by the artist',
      certificate: true,
      displayOrder: 5,
    },
  });

  const villamil2 = await prisma.artwork.upsert({
    where: { slug: 'a-star-is-born' },
    update: {},
    create: {
      title: 'A Star is Born',
      slug: 'a-star-is-born',
      artistId: artist2.id,
      description: 'A dynamic composition celebrating emergence and brilliance, rendered in Villamil\'s signature cubist-expressionist style with vibrant color harmonies.',
      medium: 'PAINTING',
      style: 'EXPRESSIONISM',
      year: 2024,
      width: inToCm(96),
      height: inToCm(78),
      price: 45000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Oil on canvas',
      signature: 'Signed by the artist',
      certificate: true,
      displayOrder: 6,
    },
  });

  const villamil3 = await prisma.artwork.upsert({
    where: { slug: 'dance-villamil' },
    update: {},
    create: {
      title: 'Dance',
      slug: 'dance-villamil',
      artistId: artist2.id,
      description: 'Figures intertwine in joyful movement across this large-scale canvas, embodying rhythm and human connection through bold colors and flowing forms.',
      medium: 'PAINTING',
      style: 'EXPRESSIONISM',
      year: 2024,
      width: inToCm(90),
      height: inToCm(155),
      price: 75000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Oil on canvas',
      signature: 'Signed by the artist',
      certificate: true,
      displayOrder: 7,
    },
  });

  const villamil4 = await prisma.artwork.upsert({
    where: { slug: 'the-fashionistas' },
    update: {},
    create: {
      title: 'The Fashionistas',
      slug: 'the-fashionistas',
      artistId: artist2.id,
      description: 'A vibrant commentary on contemporary culture and aesthetics, depicting stylish figures through Villamil\'s distinctive blend of cubist structure and expressionist energy.',
      medium: 'PAINTING',
      style: 'EXPRESSIONISM',
      year: 2023,
      width: inToCm(70),
      height: inToCm(70),
      price: 38000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Oil on canvas',
      signature: 'Signed by the artist',
      certificate: true,
      displayOrder: 8,
    },
  });

  // --- Augusto Esquivel artworks ---
  const esquivel1 = await prisma.artwork.upsert({
    where: { slug: 'monalisa-esquivel' },
    update: {},
    create: {
      title: 'Monalisa',
      slug: 'monalisa-esquivel',
      artistId: artist3.id,
      description: 'A reinterpretation of Leonardo\'s iconic portrait using thousands of individually strung buttons on monofilament, creating a three-dimensional pixelated image that shifts as the viewer moves.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2023,
      width: inToCm(51),
      height: inToCm(75),
      depth: inToCm(3),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Sewing buttons, monofilament, acrylic supports',
      certificate: true,
      displayOrder: 9,
    },
  });

  const esquivel2 = await prisma.artwork.upsert({
    where: { slug: 'shark-esquivel' },
    update: {},
    create: {
      title: 'Shark',
      slug: 'shark-esquivel',
      artistId: artist3.id,
      description: 'A striking three-dimensional shark form suspended in space, composed entirely of thousands of buttons meticulously arranged on clear monofilament.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2022,
      width: inToCm(72),
      height: inToCm(36),
      depth: inToCm(32),
      price: 50000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Sewing buttons, monofilament, acrylic supports',
      certificate: true,
      displayOrder: 10,
    },
  });

  const esquivel3 = await prisma.artwork.upsert({
    where: { slug: 'van-gogh-self-portrait' },
    update: {},
    create: {
      title: 'van Gogh Self Portrait',
      slug: 'van-gogh-self-portrait',
      artistId: artist3.id,
      description: 'Van Gogh\'s famous self-portrait reimagined through Esquivel\'s signature button technique, transforming the post-impressionist icon into a contemporary sculptural meditation.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2023,
      width: inToCm(50),
      height: inToCm(70),
      depth: inToCm(3),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Sewing buttons, monofilament, acrylic supports',
      certificate: true,
      displayOrder: 11,
    },
  });

  const esquivel4 = await prisma.artwork.upsert({
    where: { slug: 'american-flag-esquivel' },
    update: {},
    create: {
      title: 'American Flag',
      slug: 'american-flag-esquivel',
      artistId: artist3.id,
      description: 'The American flag rendered in thousands of red, white, and blue buttons, exploring themes of patriotism and belonging through Esquivel\'s immigrant lens.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2019,
      width: inToCm(41),
      height: inToCm(82),
      depth: inToCm(2),
      price: 30000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Sewing buttons, monofilament, acrylic supports',
      certificate: true,
      displayOrder: 12,
    },
  });

  // --- Keiko Hara artworks ---
  const hara1 = await prisma.artwork.upsert({
    where: { slug: 'verse-ma-and-ki-1' },
    update: {},
    create: {
      title: 'Verse Ma and Ki 1',
      slug: 'verse-ma-and-ki-1',
      artistId: artist4.id,
      description: 'A diptych exploring the Japanese concepts of Ma (space/interval) and Ki (energy/spirit) through layered mixed media on paper.',
      medium: 'MIXED_MEDIA',
      style: 'ABSTRACT',
      width: inToCm(42.5),
      height: inToCm(62),
      price: 18000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media on paper, diptych',
      certificate: true,
      displayOrder: 13,
    },
  });

  const hara2 = await prisma.artwork.upsert({
    where: { slug: 'verse-ma-and-ki-2' },
    update: {},
    create: {
      title: 'Verse Ma and Ki II',
      slug: 'verse-ma-and-ki-2',
      artistId: artist4.id,
      description: 'The second work in the Ma and Ki series, a diptych combining paper and mixed media on board to investigate the interplay between presence and absence.',
      medium: 'MIXED_MEDIA',
      style: 'ABSTRACT',
      width: inToCm(45.5),
      height: inToCm(62),
      depth: inToCm(75),
      price: 20000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Paper and mixed media on board, diptych',
      certificate: true,
      displayOrder: 14,
    },
  });

  const hara3 = await prisma.artwork.upsert({
    where: { slug: 'verse-space-yellow' },
    update: {},
    create: {
      title: 'Verse Space Yellow',
      slug: 'verse-space-yellow',
      artistId: artist4.id,
      description: 'A luminous work in yellow tones exploring spatial relationships and the meditative quality of color through mixed media on board.',
      medium: 'MIXED_MEDIA',
      style: 'ABSTRACT',
      width: inToCm(79),
      height: inToCm(40),
      depth: inToCm(2),
      price: 16000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Paper and mixed media on board',
      certificate: true,
      displayOrder: 15,
    },
  });

  // --- Kevin Langedijk artworks ---
  const langedijk1 = await prisma.artwork.upsert({
    where: { slug: 'addicted-chanel' },
    update: {},
    create: {
      title: 'ADDICTED - Chanel',
      slug: 'addicted-chanel',
      artistId: artist5.id,
      description: 'Part of the ADDICTED series referencing late 1980s-1990s culture, placing luxury brand logos on enlarged XTC pill forms. This piece examines how the desire for luxury brands is universal and can be addictive.',
      medium: 'WOOD',
      style: 'CONTEMPORARY',
      year: 2022,
      width: inToCm(60),
      height: inToCm(30),
      depth: inToCm(8),
      price: 12000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Carved wood and acrylic paint',
      certificate: true,
      displayOrder: 16,
    },
  });

  const langedijk2 = await prisma.artwork.upsert({
    where: { slug: 'addicted-louis-vuitton' },
    update: {},
    create: {
      title: 'ADDICTED - Louis Vuitton',
      slug: 'addicted-louis-vuitton',
      artistId: artist5.id,
      description: 'An enlarged XTC pill form bearing the iconic Louis Vuitton monogram, juxtaposing recreational drugs with consumer brand addiction in carved wood and acrylic.',
      medium: 'WOOD',
      style: 'CONTEMPORARY',
      year: 2022,
      width: inToCm(80),
      height: inToCm(35),
      depth: inToCm(8),
      price: 14000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Carved wood and acrylic paint',
      certificate: true,
      displayOrder: 17,
    },
  });

  const langedijk3 = await prisma.artwork.upsert({
    where: { slug: 'addicted-hermes' },
    update: {},
    create: {
      title: 'ADDICTED - Hermès',
      slug: 'addicted-hermes',
      artistId: artist5.id,
      description: 'The Hermès edition of the ADDICTED series, questioning the thin line between aspiration and obsession through the visual language of luxury branding and carved wood.',
      medium: 'WOOD',
      style: 'CONTEMPORARY',
      year: 2022,
      width: inToCm(70),
      height: inToCm(32),
      depth: inToCm(8),
      price: 13000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Carved wood and acrylic paint',
      certificate: true,
      displayOrder: 18,
    },
  });

  // --- Lluís Barba artworks ---
  const barba1 = await prisma.artwork.upsert({
    where: { slug: 'the-sleep-of-reason-produces-monsters' },
    update: {},
    create: {
      title: 'The Sleep of Reason Produces Monsters',
      slug: 'the-sleep-of-reason-produces-monsters',
      artistId: artist6.id,
      description: 'A reinterpretation of Goya\'s iconic capricho, merging the 18th-century etching with contemporary cultural elements in Barba\'s signature diasec technique.',
      medium: 'PHOTOGRAPHY',
      style: 'CONTEMPORARY',
      year: 2019,
      width: inToCm(40),
      height: inToCm(59),
      price: 37000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Diasec (photograph on plexiglass)',
      edition: '1/5',
      certificate: true,
      displayOrder: 19,
    },
  });

  const barba2 = await prisma.artwork.upsert({
    where: { slug: 'warhol-barba' },
    update: {},
    create: {
      title: 'Warhol',
      slug: 'warhol-barba',
      artistId: artist6.id,
      description: 'A contemporary homage to Andy Warhol, weaving the pop art icon\'s self-portrait into a rich tapestry of cultural references and artistic commentary.',
      medium: 'PHOTOGRAPHY',
      style: 'CONTEMPORARY',
      year: 2023,
      width: inToCm(47),
      height: inToCm(58),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Diasec (photograph on plexiglass)',
      edition: 'A.P.',
      certificate: true,
      displayOrder: 20,
    },
  });

  const barba3 = await prisma.artwork.upsert({
    where: { slug: 'ruins-of-a-roman-bath' },
    update: {},
    create: {
      title: 'Ruins of a Roman Bath',
      slug: 'ruins-of-a-roman-bath',
      artistId: artist6.id,
      description: 'Hubert Robert\'s classical ruins reimagined with Victor Vasarely\'s op-art elements, creating a stunning collision of art historical periods.',
      medium: 'PHOTOGRAPHY',
      style: 'CONTEMPORARY',
      year: 2023,
      width: inToCm(48),
      height: inToCm(60),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Diasec (photograph on plexiglass)',
      edition: '1/7',
      certificate: true,
      displayOrder: 21,
    },
  });

  const barba4 = await prisma.artwork.upsert({
    where: { slug: 'the-garden-of-earthly-delights' },
    update: {},
    create: {
      title: 'The Garden of Earthly Delights',
      slug: 'the-garden-of-earthly-delights',
      artistId: artist6.id,
      description: 'Barba\'s monumental reinterpretation of Hieronymus Bosch\'s triptych masterpiece, populated with contemporary figures and cultural references.',
      medium: 'PHOTOGRAPHY',
      style: 'CONTEMPORARY',
      year: 2015,
      width: inToCm(98.43),
      height: inToCm(59.06),
      price: 45000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Diasec (photograph on plexiglass)',
      edition: '1/7',
      certificate: true,
      displayOrder: 22,
    },
  });

  // --- Emiliano Gironella Parra artworks ---
  const gironella1 = await prisma.artwork.upsert({
    where: { slug: 'grenade-with-amapola-flowers' },
    update: {},
    create: {
      title: 'Grenade with Amapola Flowers',
      slug: 'grenade-with-amapola-flowers',
      artistId: artist7.id,
      description: 'A powerful bronze sculpture juxtaposing a weapon of war with delicate poppy flowers, commenting on violence and beauty in Mexican culture.',
      medium: 'SCULPTURE',
      style: 'CONCEPTUAL',
      width: inToCm(16.93),
      height: inToCm(34.25),
      depth: inToCm(16.93),
      price: 20000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Bronze',
      certificate: true,
      displayOrder: 23,
    },
  });

  const gironella2 = await prisma.artwork.upsert({
    where: { slug: 'sacrifice-gironella' },
    update: {},
    create: {
      title: 'Sacrifice',
      slug: 'sacrifice-gironella',
      artistId: artist7.id,
      description: 'An illuminated acrylic light box installation exploring themes of tradition and social injustice through the lens of sacrifice.',
      medium: 'INSTALLATION',
      style: 'CONCEPTUAL',
      width: inToCm(61),
      height: inToCm(54),
      depth: inToCm(35),
      price: 19000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Acrylic, light box',
      certificate: true,
      displayOrder: 24,
    },
  });

  const gironella3 = await prisma.artwork.upsert({
    where: { slug: 'machine-gun-with-marijuana-joints' },
    update: {},
    create: {
      title: 'Machine Gun with Marijuana Joints',
      slug: 'machine-gun-with-marijuana-joints',
      artistId: artist7.id,
      description: 'A provocative bronze sculpture that transforms a machine gun into a vessel for marijuana joints, addressing Mexico\'s drug war with unflinching artistic commentary.',
      medium: 'SCULPTURE',
      style: 'CONCEPTUAL',
      width: inToCm(36.61),
      height: inToCm(19.09),
      depth: inToCm(17.32),
      price: 18000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Bronze',
      certificate: true,
      displayOrder: 25,
    },
  });

  const gironella4 = await prisma.artwork.upsert({
    where: { slug: 'homage-to-jasper-johns' },
    update: {},
    create: {
      title: 'Homage to Jasper Johns',
      slug: 'homage-to-jasper-johns',
      artistId: artist7.id,
      description: 'A serigraph paying tribute to the legendary American artist Jasper Johns, reinterpreted through Gironella Parra\'s Mexican artistic perspective.',
      medium: 'PRINT',
      style: 'CONCEPTUAL',
      width: inToCm(40.94),
      height: inToCm(29.13),
      price: 3500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Serigraph on paper',
      certificate: true,
      displayOrder: 26,
    },
  });

  // --- Daniele Fortuna artworks ---
  const fortuna1 = await prisma.artwork.upsert({
    where: { slug: 'aphrodite-venus-fortuna' },
    update: {},
    create: {
      title: 'Aphrodite Venus',
      slug: 'aphrodite-venus-fortuna',
      artistId: artist8.id,
      description: 'A life-size pixelated sculpture of the goddess Venus, crafted from individually cut and hand-painted wood pieces that merge classical mythology with contemporary pop aesthetics.',
      medium: 'WOOD',
      style: 'POP_ART',
      year: 2021,
      width: inToCm(47.25),
      height: inToCm(81.5),
      depth: inToCm(29.75),
      price: 29500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Painted wood, acrylic',
      certificate: true,
      displayOrder: 27,
    },
  });

  const fortuna2 = await prisma.artwork.upsert({
    where: { slug: 'girl-with-a-pearl-earring-fortuna' },
    update: {},
    create: {
      title: 'Girl with a Pearl Earring',
      slug: 'girl-with-a-pearl-earring-fortuna',
      artistId: artist8.id,
      description: 'Vermeer\'s iconic portrait reimagined as a three-dimensional pixelated wood sculpture, each piece hand-cut and painted.',
      medium: 'WOOD',
      style: 'POP_ART',
      year: 2023,
      width: inToCm(26.25),
      height: inToCm(27.5),
      depth: inToCm(17),
      price: 8500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Wood, hand-painted',
      certificate: true,
      displayOrder: 28,
    },
  });

  const fortuna3 = await prisma.artwork.upsert({
    where: { slug: 'la-grande-odalisque-fortuna' },
    update: {},
    create: {
      title: 'La Grande Odalisque',
      slug: 'la-grande-odalisque-fortuna',
      artistId: artist8.id,
      description: 'After Ingres — a pixelated wood reinterpretation of the famous reclining nude, blending neoclassical elegance with contemporary sculptural technique.',
      medium: 'WOOD',
      style: 'POP_ART',
      year: 2025,
      width: inToCm(48),
      height: inToCm(23),
      depth: inToCm(19),
      price: 18000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Painted wood',
      certificate: true,
      displayOrder: 29,
    },
  });

  const fortuna4 = await prisma.artwork.upsert({
    where: { slug: 'mickey-fortuna' },
    update: {},
    create: {
      title: 'Mickey',
      slug: 'mickey-fortuna',
      artistId: artist8.id,
      description: 'The world\'s most famous mouse rendered in Fortuna\'s signature pixelated wood technique, a playful intersection of pop culture icon and fine art sculpture.',
      medium: 'WOOD',
      style: 'POP_ART',
      year: 2022,
      width: inToCm(30),
      height: inToCm(50),
      depth: inToCm(30),
      price: 18500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Wood, hand-painted',
      certificate: true,
      displayOrder: 30,
    },
  });

  // --- David Zalben artworks ---
  const zalben1 = await prisma.artwork.upsert({
    where: { slug: 'goldilocks-zalben' },
    update: {},
    create: {
      title: 'Goldilocks',
      slug: 'goldilocks-zalben',
      artistId: artist9.id,
      description: 'A delicate wire sculpture capturing the essence of the fairy tale character through sinuous lines of annealed wire.',
      medium: 'METAL',
      style: 'FIGURATIVE',
      year: 2023,
      width: inToCm(30),
      height: inToCm(27),
      depth: inToCm(2.5),
      price: 5000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Gauge annealed wire',
      certificate: true,
      displayOrder: 31,
    },
  });

  const zalben2 = await prisma.artwork.upsert({
    where: { slug: 'jade-came-to-stay' },
    update: {},
    create: {
      title: 'Jade Came to Stay',
      slug: 'jade-came-to-stay',
      artistId: artist9.id,
      description: 'A portrait in wire that captures presence and permanence through the delicate medium of bent and shaped annealed wire.',
      medium: 'METAL',
      style: 'FIGURATIVE',
      year: 2023,
      width: inToCm(21),
      height: inToCm(16),
      depth: inToCm(2),
      price: 5500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Gauge annealed wire',
      certificate: true,
      displayOrder: 32,
    },
  });

  const zalben3 = await prisma.artwork.upsert({
    where: { slug: 'be-you-zalben' },
    update: {},
    create: {
      title: 'Be You',
      slug: 'be-you-zalben',
      artistId: artist9.id,
      description: 'An intimate wire sculpture that celebrates individuality and self-expression through Zalben\'s expressive linear technique.',
      medium: 'METAL',
      style: 'FIGURATIVE',
      year: 2023,
      width: inToCm(16),
      height: inToCm(16),
      depth: inToCm(2),
      price: 3500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Gauge annealed wire',
      certificate: true,
      displayOrder: 33,
    },
  });

  // --- Xavier Toubes artworks ---
  const toubes1 = await prisma.artwork.upsert({
    where: { slug: 'head-iii-toubes' },
    update: {},
    create: {
      title: 'Head III',
      slug: 'head-iii-toubes',
      artistId: artist10.id,
      description: 'A glazed ceramic head sculpture created through multiple firings and intuitive glazing, embodying the alchemical dialogue between artist and material.',
      medium: 'CERAMICS',
      style: 'ABSTRACT',
      width: inToCm(18),
      height: inToCm(33),
      depth: inToCm(16),
      price: 13500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Glazed ceramic',
      certificate: true,
      displayOrder: 34,
    },
  });

  const toubes2 = await prisma.artwork.upsert({
    where: { slug: 'white-head-toubes' },
    update: {},
    create: {
      title: 'White Head',
      slug: 'white-head-toubes',
      artistId: artist10.id,
      description: 'A luminous white ceramic sculpture exploring the boundaries of form and surface through Toubes\' masterful glazing technique.',
      medium: 'CERAMICS',
      style: 'ABSTRACT',
      width: inToCm(12),
      height: inToCm(19),
      depth: inToCm(10),
      price: 5000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Glazed ceramic',
      certificate: true,
      displayOrder: 35,
    },
  });

  const toubes3 = await prisma.artwork.upsert({
    where: { slug: 'abandon-41-toubes' },
    update: {},
    create: {
      title: 'Abandon 41',
      slug: 'abandon-41-toubes',
      artistId: artist10.id,
      description: 'A ceramic form that surrenders to the unpredictable nature of glaze and fire, resulting in a uniquely expressive surface.',
      medium: 'CERAMICS',
      style: 'ABSTRACT',
      width: inToCm(12),
      height: inToCm(22),
      depth: inToCm(12),
      price: 4750,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Glazed ceramic',
      certificate: true,
      displayOrder: 36,
    },
  });

  // --- Ancizar Marin artworks ---
  const marin1 = await prisma.artwork.upsert({
    where: { slug: 'tipsy-cat-marin' },
    update: {},
    create: {
      title: 'Tipsy Cat',
      slug: 'tipsy-cat-marin',
      artistId: artist11.id,
      description: 'A playful fiberglass cat sculpture finished in vibrant car paint, embodying Marin\'s philosophy that art should bring joy through color and form.',
      medium: 'SCULPTURE',
      style: 'POP_ART',
      width: inToCm(8.5),
      height: inToCm(13),
      depth: inToCm(11),
      price: 4500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Fiberglass, car paint',
      certificate: true,
      displayOrder: 37,
    },
  });

  const marin2 = await prisma.artwork.upsert({
    where: { slug: 'campbells-soup-marin' },
    update: {},
    create: {
      title: "Campbell's Soup",
      slug: 'campbells-soup-marin',
      artistId: artist11.id,
      description: 'A towering reinterpretation of the iconic pop art subject, featuring a climber ascending the Campbell\'s Soup can in car paint and metal.',
      medium: 'SCULPTURE',
      style: 'POP_ART',
      width: inToCm(6.75),
      height: inToCm(61),
      depth: inToCm(11.5),
      price: 16000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Acrylic, car paint, metal',
      certificate: true,
      displayOrder: 38,
    },
  });

  const marin3 = await prisma.artwork.upsert({
    where: { slug: '24k-gold-marin' },
    update: {},
    create: {
      title: '24K Gold',
      slug: '24k-gold-marin',
      artistId: artist11.id,
      description: 'A dynamic composition of climber figures in gold finish ascending a large panel, celebrating ambition and the human drive to reach new heights.',
      medium: 'SCULPTURE',
      style: 'POP_ART',
      width: inToCm(48),
      height: inToCm(60),
      depth: inToCm(7),
      price: 22000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Acrylic, car paint, metal',
      certificate: true,
      displayOrder: 39,
    },
  });

  const marin4 = await prisma.artwork.upsert({
    where: { slug: 'painter-marin' },
    update: {},
    create: {
      title: 'Painter',
      slug: 'painter-marin',
      artistId: artist11.id,
      description: 'A life-size figure of a painter rendered in fiberglass and car paint, a joyful tribute to the creative spirit.',
      medium: 'SCULPTURE',
      style: 'POP_ART',
      year: 2021,
      width: inToCm(8.24),
      height: inToCm(77),
      depth: inToCm(40),
      price: 25000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media, fiberglass, car paint',
      certificate: true,
      displayOrder: 40,
    },
  });

  // --- Peter Mars artworks ---
  const mars1 = await prisma.artwork.upsert({
    where: { slug: 'marilyn-mars' },
    update: {},
    create: {
      title: 'Marilyn',
      slug: 'marilyn-mars',
      artistId: artist12.id,
      description: 'A silkscreen portrait of Marilyn Monroe channeling the pop art tradition, rendered in Mars\'s signature style with acrylic on paper.',
      medium: 'PRINT',
      style: 'POP_ART',
      width: inToCm(30),
      height: inToCm(40),
      price: 8000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Silkscreen and acrylic on paper',
      certificate: true,
      displayOrder: 41,
    },
  });

  const mars2 = await prisma.artwork.upsert({
    where: { slug: 'red-gun-mars' },
    update: {},
    create: {
      title: 'Red Gun',
      slug: 'red-gun-mars',
      artistId: artist12.id,
      description: 'A bold pop art statement piece combining silkscreen technique with vibrant acrylic, drawing from American pop culture imagery.',
      medium: 'PRINT',
      style: 'POP_ART',
      width: inToCm(30),
      height: inToCm(40),
      price: 7500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Silkscreen and acrylic on paper',
      certificate: true,
      displayOrder: 42,
    },
  });

  const mars3 = await prisma.artwork.upsert({
    where: { slug: 'god-save-the-queen-mars' },
    update: {},
    create: {
      title: 'God Save The Queen',
      slug: 'god-save-the-queen-mars',
      artistId: artist12.id,
      description: 'A mixed media work on paper that channels punk rock energy and British iconography through Mars\'s pop art sensibility.',
      medium: 'MIXED_MEDIA',
      style: 'POP_ART',
      width: inToCm(40),
      height: inToCm(30),
      price: 8500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media on paper',
      certificate: true,
      displayOrder: 43,
    },
  });

  const mars4 = await prisma.artwork.upsert({
    where: { slug: 'mystic-bunnie-mars' },
    update: {},
    create: {
      title: 'Mystic Bunnie',
      slug: 'mystic-bunnie-mars',
      artistId: artist12.id,
      description: 'A whimsical mixed media piece blending vintage pop culture references with a touch of surreal mysticism.',
      medium: 'MIXED_MEDIA',
      style: 'POP_ART',
      width: inToCm(40),
      height: inToCm(30),
      price: 7000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media on paper',
      certificate: true,
      displayOrder: 44,
    },
  });

  // --- Mariana Monteagudo artworks ---
  const monteagudo1 = await prisma.artwork.upsert({
    where: { slug: 'baba-yaga-monteagudo' },
    update: {},
    create: {
      title: 'Baba Yaga',
      slug: 'baba-yaga-monteagudo',
      artistId: artist13.id,
      description: 'A mixed media doll sculpture inspired by the Slavic folklore witch, exploring themes of power and transformation through Monteagudo\'s intuitive assemblage technique.',
      medium: 'MIXED_MEDIA',
      style: 'SURREALISM',
      year: 2016,
      width: inToCm(14),
      height: inToCm(40),
      depth: inToCm(9),
      price: 7500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media',
      certificate: true,
      displayOrder: 45,
    },
  });

  const monteagudo2 = await prisma.artwork.upsert({
    where: { slug: 'ekeko-monteagudo' },
    update: {},
    create: {
      title: 'Ekeko',
      slug: 'ekeko-monteagudo',
      artistId: artist13.id,
      description: 'From the Punk and Samurais series — a ceramic and concrete figure referencing the Andean god of abundance, reimagined with punk sensibility.',
      medium: 'CERAMICS',
      style: 'SURREALISM',
      year: 2017,
      width: inToCm(12),
      height: inToCm(28.5),
      depth: inToCm(14),
      price: 6500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Ceramic, concrete, paper',
      certificate: true,
      displayOrder: 46,
    },
  });

  const monteagudo3 = await prisma.artwork.upsert({
    where: { slug: 'twins-with-roses-monteagudo' },
    update: {},
    create: {
      title: 'Twins with Roses',
      slug: 'twins-with-roses-monteagudo',
      artistId: artist13.id,
      description: 'From the Apocalyptic series — twin doll figures adorned with roses, exploring duality and beauty amid destruction through hard latex and paper mache.',
      medium: 'MIXED_MEDIA',
      style: 'SURREALISM',
      year: 2015,
      width: inToCm(16),
      height: inToCm(23),
      depth: inToCm(10),
      price: 8500,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Hard latex, paper mache',
      certificate: true,
      displayOrder: 47,
    },
  });

  const monteagudo4 = await prisma.artwork.upsert({
    where: { slug: 'jingle-hat-monteagudo' },
    update: {},
    create: {
      title: 'Jingle Hat',
      slug: 'jingle-hat-monteagudo',
      artistId: artist13.id,
      description: 'A towering figure from the Apocalyptic series wearing an elaborate jingle hat, crafted from hard latex and paper mache with meticulous attention to detail.',
      medium: 'MIXED_MEDIA',
      style: 'SURREALISM',
      year: 2016,
      width: inToCm(25),
      height: inToCm(45),
      depth: inToCm(25),
      price: 9200,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Hard latex, paper mache',
      certificate: true,
      displayOrder: 48,
    },
  });

  // --- Troy Abbott artworks ---
  const abbott1 = await prisma.artwork.upsert({
    where: { slug: 'homie-chrome-abbott' },
    update: {},
    create: {
      title: 'Homie (Chrome)',
      slug: 'homie-chrome-abbott',
      artistId: artist14.id,
      description: 'A 3D-printed birdcage with chrome finish housing a 42-minute video loop of live birds, merging the real and the digital to question the nature of freedom.',
      medium: 'DIGITAL',
      style: 'CONCEPTUAL',
      year: 2023,
      width: inToCm(10),
      height: inToCm(10),
      depth: inToCm(3),
      price: 5000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: '3D printed ABS, video (42 min loop), chrome finish',
      certificate: true,
      displayOrder: 49,
    },
  });

  const abbott2 = await prisma.artwork.upsert({
    where: { slug: 'aqua-abbott' },
    update: {},
    create: {
      title: 'Aqua',
      slug: 'aqua-abbott',
      artistId: artist14.id,
      description: 'A vintage birdcage transformed into a digital art object with aquatic video elements, exposed circuitry, and contemplative commentary on containment and freedom.',
      medium: 'DIGITAL',
      style: 'CONCEPTUAL',
      year: 2019,
      width: inToCm(16.75),
      height: inToCm(28.5),
      depth: inToCm(17),
      price: 21000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Vintage birdcage, video, digital components',
      certificate: true,
      displayOrder: 50,
    },
  });

  const abbott3 = await prisma.artwork.upsert({
    where: { slug: '2-city-chicks-in-red' },
    update: {},
    create: {
      title: '2 City Chicks in Red',
      slug: '2-city-chicks-in-red',
      artistId: artist14.id,
      description: 'A vibrant red birdcage housing digital projections, exploring urban life and the tension between freedom and domestication.',
      medium: 'DIGITAL',
      style: 'CONCEPTUAL',
      width: inToCm(24),
      height: inToCm(19),
      depth: inToCm(15.5),
      price: 16000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Mixed media, digital components, video',
      certificate: true,
      displayOrder: 51,
    },
  });

  // --- Metis Atash artworks ---
  const atash1 = await prisma.artwork.upsert({
    where: { slug: 'kusama-vuitton-atash' },
    update: {},
    create: {
      title: 'Kusama Vuitton',
      slug: 'kusama-vuitton-atash',
      artistId: artist15.id,
      description: 'A Punk Buddha sculpture inspired by the Yayoi Kusama x Louis Vuitton collaboration, adorned with 40,000 hand-applied Swarovski crystals.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2025,
      width: inToCm(14),
      height: inToCm(17.5),
      depth: inToCm(12),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: true,
      materials: 'Fiberglass, acrylic paint, 40,000 Swarovski crystals',
      certificate: true,
      displayOrder: 52,
    },
  });

  const atash2 = await prisma.artwork.upsert({
    where: { slug: 'chanel-5-warhol-atash' },
    update: {},
    create: {
      title: 'Chanel #5 Warhol',
      slug: 'chanel-5-warhol-atash',
      artistId: artist15.id,
      description: 'A Punk Buddha sculpture paying homage to Warhol\'s iconic Chanel No. 5 imagery, encrusted with 40,000 Swarovski crystals.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2025,
      width: inToCm(14),
      height: inToCm(17.5),
      depth: inToCm(12),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Fiberglass, acrylic paint, 40,000 Swarovski crystals',
      certificate: true,
      displayOrder: 53,
    },
  });

  const atash3 = await prisma.artwork.upsert({
    where: { slug: 'saint-laurent-mondrian-atash' },
    update: {},
    create: {
      title: 'Saint Laurent Mondrian',
      slug: 'saint-laurent-mondrian-atash',
      artistId: artist15.id,
      description: 'A Punk Buddha honoring the iconic YSL Mondrian dress, merging high fashion, abstract art, and spiritual iconography with crystal embellishment.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2025,
      width: inToCm(14),
      height: inToCm(17.5),
      depth: inToCm(12),
      price: 35000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Fiberglass, acrylic paint, 40,000 Swarovski crystals',
      certificate: true,
      displayOrder: 54,
    },
  });

  const atash4 = await prisma.artwork.upsert({
    where: { slug: 'ignite-the-passion-atash' },
    update: {},
    create: {
      title: 'Ignite the Passion',
      slug: 'ignite-the-passion-atash',
      artistId: artist15.id,
      description: 'A Warhol-inspired Punk Buddha adorned with 28,000 Swarovski crystals, celebrating the intersection of art, luxury, and spiritual awakening.',
      medium: 'SCULPTURE',
      style: 'CONTEMPORARY',
      year: 2025,
      width: inToCm(12),
      height: inToCm(17.5),
      depth: inToCm(8),
      price: 28000,
      currency: 'USD',
      status: 'AVAILABLE',
      featured: false,
      materials: 'Fiberglass, acrylic paint, 28,000 Swarovski crystals',
      certificate: true,
      displayOrder: 55,
    },
  });

  console.log('✅ 55 artworks created\n');

  // ============================================================================
  // THEMED COLLECTIONS
  // ============================================================================

  console.log('📚 Creating themed collections...\n');

  // Collection 1: Latin American Artists
  const latinAmerican = await prisma.collection.upsert({
    where: { slug: 'latin-american-artists' },
    update: {},
    create: {
      title: 'Latin American Artists',
      slug: 'latin-american-artists',
      description: 'A curated selection of works by acclaimed Latin American artists who bring their rich cultural heritage and unique perspectives to contemporary art. From Argentina to Cuba, Colombia to Mexico, these artists represent the vibrant diversity of the Latin American art scene.',
      featured: true,
      displayOrder: 3,
    },
  });

  // Collect artworks from Latin American artists
  const latinAmericanArtworkIds = [
    sardi1, sardi2, sardi3, sardi4,
    villamil1, villamil2, villamil3, villamil4,
    esquivel1, esquivel2, esquivel3, esquivel4,
    gironella1, gironella2, gironella3, gironella4,
    marin1, marin2, marin3, marin4,
    monteagudo1, monteagudo2, monteagudo3, monteagudo4,
  ].map(a => a.id);

  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: latinAmerican.id },
  });
  await prisma.collectionArtwork.createMany({
    data: latinAmericanArtworkIds.map((artworkId, index) => ({
      collectionId: latinAmerican.id,
      artworkId,
      displayOrder: index,
    })),
    skipDuplicates: true,
  });
  console.log(`✓ "${latinAmerican.title}" — ${latinAmericanArtworkIds.length} artworks`);

  // Collection 2: Sculptures & Installations
  const sculpturesCollection = await prisma.collection.upsert({
    where: { slug: 'sculptures-and-installations' },
    update: {},
    create: {
      title: 'Sculptures & Installations',
      slug: 'sculptures-and-installations',
      description: 'Three-dimensional works that transform space and challenge perception. From monumental steel installations to delicate wire figures, button-strung portraits to crystal-encrusted Buddhas — this collection celebrates the art of sculpture in all its forms.',
      featured: true,
      displayOrder: 4,
    },
  });

  const sculptureArtworkIds = [
    sardi1, sardi2, sardi3, sardi4,
    esquivel1, esquivel2, esquivel3, esquivel4,
    gironella1, gironella2, gironella3,
    fortuna1, fortuna2, fortuna3, fortuna4,
    zalben1, zalben2, zalben3,
    toubes1, toubes2, toubes3,
    marin1, marin2, marin3, marin4,
    monteagudo1, monteagudo2, monteagudo3, monteagudo4,
    atash1, atash2, atash3, atash4,
  ].map(a => a.id);

  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: sculpturesCollection.id },
  });
  await prisma.collectionArtwork.createMany({
    data: sculptureArtworkIds.map((artworkId, index) => ({
      collectionId: sculpturesCollection.id,
      artworkId,
      displayOrder: index,
    })),
    skipDuplicates: true,
  });
  console.log(`✓ "${sculpturesCollection.title}" — ${sculptureArtworkIds.length} artworks`);

  // Collection 3: Pop Art & Street Culture
  const popArtCollection = await prisma.collection.upsert({
    where: { slug: 'pop-art-and-street-culture' },
    update: {},
    create: {
      title: 'Pop Art & Street Culture',
      slug: 'pop-art-and-street-culture',
      description: 'Bold, irreverent, and culturally charged — these works draw from the legacy of Warhol, Lichtenstein, and the street art movement. From silkscreen prints to luxury-branded sculptures, this collection pulses with the energy of pop culture.',
      featured: true,
      displayOrder: 5,
    },
  });

  const popArtArtworkIds = [
    fortuna1, fortuna2, fortuna3, fortuna4,
    langedijk1, langedijk2, langedijk3,
    marin1, marin2, marin3, marin4,
    mars1, mars2, mars3, mars4,
    atash1, atash2, atash3, atash4,
  ].map(a => a.id);

  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: popArtCollection.id },
  });
  await prisma.collectionArtwork.createMany({
    data: popArtArtworkIds.map((artworkId, index) => ({
      collectionId: popArtCollection.id,
      artworkId,
      displayOrder: index,
    })),
    skipDuplicates: true,
  });
  console.log(`✓ "${popArtCollection.title}" — ${popArtArtworkIds.length} artworks`);

  // Collection 4: International Masters
  const internationalCollection = await prisma.collection.upsert({
    where: { slug: 'international-masters' },
    update: {},
    create: {
      title: 'International Masters',
      slug: 'international-masters',
      description: 'Works by distinguished artists from across the globe — Spain, Italy, Japan, the Netherlands, and Germany. These internationally acclaimed creators bring decades of artistic mastery and cultural depth to their contemporary practice.',
      featured: true,
      displayOrder: 6,
    },
  });

  const internationalArtworkIds = [
    barba1, barba2, barba3, barba4,
    toubes1, toubes2, toubes3,
    hara1, hara2, hara3,
    fortuna1, fortuna2, fortuna3, fortuna4,
    langedijk1, langedijk2, langedijk3,
    atash1, atash2, atash3, atash4,
  ].map(a => a.id);

  await prisma.collectionArtwork.deleteMany({
    where: { collectionId: internationalCollection.id },
  });
  await prisma.collectionArtwork.createMany({
    data: internationalArtworkIds.map((artworkId, index) => ({
      collectionId: internationalCollection.id,
      artworkId,
      displayOrder: index,
    })),
    skipDuplicates: true,
  });
  console.log(`✓ "${internationalCollection.title}" — ${internationalArtworkIds.length} artworks`);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n✅ Database seeding complete!\n');
  console.log('📊 Summary:');
  console.log('   - 15 artists');
  console.log('   - 55 artworks');
  console.log('   - 4 themed collections');
  console.log('\n💡 Next steps:');
  console.log('   1. Run: pnpm --filter @artspot/api seed:collections');
  console.log('      (to populate "New Arrivals" and "Museum-Quality" collections)');
  console.log('   2. Add images via the upload endpoint');
  console.log('   3. Visit your frontend to browse the gallery!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
