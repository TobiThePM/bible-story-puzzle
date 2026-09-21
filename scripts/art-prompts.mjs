/**
 * The twenty illustration prompts.
 *
 * Written for FLUX.2 [Pro] at aspect_ratio "1:1", resolution "2K".
 * Generate -> save the PNGs into assets-source/ using the `file` name below ->
 * run `node scripts/process-art.mjs` -> update paths in src/content/stories.ts.
 *
 * RULES LEARNED FROM THE FIRST GENERATION - keep these when editing:
 *
 *  1. FLUX does not support negative prompts. Never write "no text" or
 *     "no empty areas" - it can produce the very thing you forbid. Describe
 *     what you DO want instead.
 *  2. Front-load the subject. Word order carries weight.
 *  3. Stay near 60-75 words. Later tokens get less attention.
 *  4. ALWAYS say "asymmetric composition". The first Creation image came back
 *     with near-identical sky in both top corners and failed the 5x5
 *     confusable-tile check because of it.
 *  5. ALWAYS ask for texture edge to edge. Flat sky or flat sand produces
 *     identical tiles and an unsolvable puzzle.
 *  6. aspect_ratio defaults to 16:9. It MUST be set to "1:1" explicitly.
 *
 * Every image must pass `node scripts/process-art.mjs` before it is committed.
 */

/** Shared style anchor - this is what makes twenty images look like one set. */
export const STYLE =
  "Children's Bible storybook illustration, rich painterly gouache, visible brushwork, " +
  'deep jewel colours, warm cinematic light, reverent and full of awe, gentle enough for a child. ' +
  'Asymmetric composition with different detail on the left and right. ' +
  'Richly textured throughout, intricate detail filling every corner of the square frame.';

/** Scene descriptions. The final prompt is `${scene} ${STYLE}`. */
export const SCENES = [
  {
    file: '01-creation',
    id: 'creation',
    scene:
      'A great arc of golden light breaking across a vast dark ocean at the first morning of creation, the sky tearing open on one side, heavy storm cloud banked on the other, rays striking restless waves.',
  },
  {
    file: '02-noahs-ark',
    id: 'noahs-ark',
    scene:
      'An enormous wooden ark riding high flood water, giraffes and elephants crowding one rail, rain sweeping in from the left, a break of pale sun on the right, drowned treetops below the hull.',
  },
  {
    file: '03-tower-of-babel',
    id: 'tower-of-babel',
    scene:
      'A colossal unfinished brick tower spiralling into cloud, wooden scaffolding and ramps crawling up one side, tiny robed figures streaming away across the plain below, baskets and tools abandoned.',
  },
  {
    file: '04-abraham-stars',
    id: 'abraham-stars',
    scene:
      'An old bearded man in robes standing on a dark hillside with arms open beneath an overwhelming field of stars and glowing nebula, his tent and a small fire at the lower left, rocky ground.',
  },
  {
    file: '05-josephs-coat',
    id: 'josephs-coat',
    scene:
      'A brilliantly striped many-coloured coat held up in sunlight by a young man, older brothers watching resentfully from the shade of an olive tree, a camel caravan winding away over dunes behind.',
  },
  {
    file: '06-burning-bush',
    id: 'burning-bush',
    scene:
      'A desert thornbush wrapped in brilliant flame yet green and unburnt, a barefoot shepherd turning toward it with his staff and sandals set aside, sheep scattered across rocky ground, low golden light.',
  },
  {
    file: '07-passover',
    id: 'passover',
    scene:
      'A narrow moonlit street of mud-brick houses at midnight, doorposts painted with crimson marks, warm lamplight glowing in windows, families sheltering inside, a hushed protective stillness over the rooftops.',
  },
  {
    file: '08-red-sea',
    id: 'red-sea',
    scene:
      'Two towering walls of churning seawater held apart with a dry seabed path between them, a great crowd of people and animals walking through, fish visible inside the water walls, storm sky above.',
  },
  {
    file: '09-ten-commandments',
    id: 'ten-commandments',
    scene:
      'Mount Sinai wrapped in billowing smoke and forked lightning, a bearded man descending the rocky path carrying two glowing stone tablets, the camp of Israel tiny on the plain far below.',
  },
  {
    file: '10-jericho',
    id: 'jericho',
    scene:
      'Massive ancient city walls buckling and crashing outward in clouds of dust, ranks of marching people blowing curved ram horns in the foreground, palm trees and towers toppling behind the breach.',
  },
  {
    file: '11-gideons-300',
    id: 'gideons-300',
    scene:
      'Three hundred torches blazing out of shattered clay jars across a dark hillside at midnight, warriors raising trumpets, sparks and pottery shards flying, an enemy camp in confusion in the valley below.',
  },
  {
    file: '12-samson',
    id: 'samson',
    scene:
      'Two enormous carved stone temple pillars cracking and buckling, a powerful long-haired figure braced between them with head bowed, dust and falling masonry, torchlight raking across the columns.',
  },
  {
    file: '13-david-goliath',
    id: 'david-goliath',
    scene:
      'A small shepherd boy with a leather sling standing before an enormous armoured giant with a spear, two armies watching from opposing hillsides, a dry stony valley floor, dramatic low sunlight.',
  },
  {
    file: '14-solomons-temple',
    id: 'solomons-temple',
    scene:
      'A magnificent golden temple under construction, cedar beams being hoisted by rope, stonemasons carving blocks in the foreground, scaffolding on one flank, warm sunlight on polished gold and white stone.',
  },
  {
    file: '15-mount-carmel',
    id: 'mount-carmel',
    scene:
      'A pillar of fire falling from heaven onto a drenched stone altar on a mountaintop, water trenches steaming, a crowd of people falling back in astonishment, dark cloud massing on one horizon.',
  },
  {
    file: '16-chariots-of-fire',
    id: 'chariots-of-fire',
    scene:
      'A hillside filled with blazing chariots and horses made of living fire and light, a walled city below in the morning haze, two small figures looking up in wonder from the foreground.',
  },
  {
    file: '17-fiery-furnace',
    id: 'fiery-furnace',
    scene:
      'Three robed figures standing calm and unharmed inside a white-hot furnace with a radiant fourth figure beside them, flames roaring around them, astonished onlookers silhouetted at the furnace mouth.',
  },
  {
    file: '18-lions-den',
    id: 'lions-den',
    scene:
      'A deep stone pit at dawn with great lions resting peacefully, a bearded man standing unharmed in a shaft of golden light from the opening above, worn steps and chains along the wall.',
  },
  {
    file: '19-jonah',
    id: 'jonah',
    scene:
      'An enormous fish rising through dark green depths beneath a storming sea, a small robed figure tumbling down through the water toward it, shafts of light and swirling bubbles, a ship keel above.',
  },
  {
    file: '20-potters-house',
    id: 'potters-house',
    scene:
      'Weathered hands at a spinning potter’s wheel reshaping a marred clay vessel, wet clay glistening, finished pots stacked on shelves behind, warm workshop light through a small window.',
  },
];

export const PROMPTS = SCENES.map((s) => ({ ...s, prompt: `${s.scene} ${STYLE}` }));

export const MODEL = 'flux-2-pro';
export const MODEL_PARAMETERS = { aspect_ratio: '1:1', resolution: '2K' };

// Print them when run directly: node scripts/art-prompts.mjs
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  for (const p of PROMPTS) {
    console.log(`\n=== ${p.file} ===\n${p.prompt}`);
  }
  console.log(`\n${PROMPTS.length} prompts. Model ${MODEL}, ${JSON.stringify(MODEL_PARAMETERS)}`);
}
