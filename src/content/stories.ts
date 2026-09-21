import type { Story } from '@/types';

/**
 * THE SINGLE SOURCE OF TRUTH.
 *
 * Every piece of story content in the game lives here and nowhere else.
 * If a title, verse, reference or image path ever appears inside a
 * component, that is a bug.
 *
 * Adding a 21st story = one entry here + one image file. Nothing else.
 *
 * Verse text is King James Version (public domain). Before launch, proofread
 * every quotation against a printed Bible - see README, "Before you launch".
 */
export const STORIES: Story[] = [
  {
    id: 'creation',
    order: 1,
    title: 'Let There Be Light',
    reference: 'Genesis 1:1-5',
    retelling:
      'In the beginning the earth was dark and empty, and the Spirit of God moved over the water. Then God spoke, and light poured into the world for the very first time.',
    verse: 'And God said, Let there be light: and there was light.',
    verseReference: 'Genesis 1:3',
    image: '/stories/01-creation.svg',
    thumb: '/stories/01-creation.svg',
    alt: 'Light breaking in a great arc across a dark sea, the sky splitting open above.',
  },
  {
    id: 'noahs-ark',
    order: 2,
    title: "Noah's Ark",
    reference: 'Genesis 7:11-24',
    retelling:
      'God told Noah to build an enormous boat and fill it with his family and two of every animal. The rains came and covered the earth, but everyone inside the ark was safe.',
    verse: 'Thus did Noah; according to all that God commanded him, so did he.',
    verseReference: 'Genesis 6:22',
    image: '/stories/02-noahs-ark.svg',
    thumb: '/stories/02-noahs-ark.svg',
    alt: 'A great wooden ark riding high water, animals at the rail, storm clouds behind.',
  },
  {
    id: 'tower-of-babel',
    order: 3,
    title: 'The Tower of Babel',
    reference: 'Genesis 11:1-9',
    retelling:
      'Everyone on earth spoke one language, and they began building a tower to reach the heavens. God gave them different languages, and they could no longer understand one another.',
    verse:
      'Therefore is the name of it called Babel; because the LORD did there confound the language of all the earth.',
    verseReference: 'Genesis 11:9',
    image: '/stories/03-tower-of-babel.svg',
    thumb: '/stories/03-tower-of-babel.svg',
    alt: 'A vast unfinished tower wrapped in scaffolding, tiny figures scattering from its base.',
  },
  {
    id: 'abraham-stars',
    order: 4,
    title: 'Count the Stars',
    reference: 'Genesis 15:1-6',
    retelling:
      'Abraham had no children and was growing old. God took him outside at night, showed him the endless stars, and promised his family would one day be just as many.',
    verse: 'Look now toward heaven, and tell the stars, if thou be able to number them.',
    verseReference: 'Genesis 15:5',
    image: '/stories/04-abraham-stars.svg',
    thumb: '/stories/04-abraham-stars.svg',
    alt: 'An old man standing alone beneath an enormous field of stars.',
  },
  {
    id: 'josephs-coat',
    order: 5,
    title: "Joseph's Coat of Many Colours",
    reference: 'Genesis 37:3-28',
    retelling:
      'Jacob loved Joseph most and gave him a beautiful striped coat. His brothers grew jealous, and sold him to traders travelling down to Egypt.',
    verse: 'and he made him a coat of many colours.',
    verseReference: 'Genesis 37:3',
    image: '/stories/05-josephs-coat.svg',
    thumb: '/stories/05-josephs-coat.svg',
    alt: 'A brightly striped coat held up, brothers watching, a caravan in the distance.',
  },
  {
    id: 'burning-bush',
    order: 6,
    title: 'The Burning Bush',
    reference: 'Exodus 3:1-6',
    retelling:
      'While Moses was keeping sheep in the desert he saw a bush on fire that never burned up. From the flames God called his name and sent him to rescue Israel.',
    verse:
      'put off thy shoes from off thy feet, for the place whereon thou standest is holy ground.',
    verseReference: 'Exodus 3:5',
    image: '/stories/06-burning-bush.svg',
    thumb: '/stories/06-burning-bush.svg',
    alt: 'A desert bush wrapped in flame but unburnt, a barefoot figure turning toward it.',
  },
  {
    id: 'passover',
    order: 7,
    title: 'The Night of the Passover',
    reference: 'Exodus 12:21-30',
    retelling:
      'After nine plagues Pharaoh still would not let Israel go. God told every family to mark their doorway, and that night the angel of death passed over each marked home.',
    verse: 'and when I see the blood, I will pass over you.',
    verseReference: 'Exodus 12:13',
    image: '/stories/07-passover.svg',
    thumb: '/stories/07-passover.svg',
    alt: 'A dark street of houses with marked doorposts and warm lamplight in the windows.',
  },
  {
    id: 'red-sea',
    order: 8,
    title: 'Crossing the Red Sea',
    reference: 'Exodus 14:21-31',
    retelling:
      'Trapped between Pharaoh’s army and the sea, Israel had nowhere to run. Moses stretched out his hand, the water split into two walls, and the people walked across on dry ground.',
    verse: 'Fear ye not, stand still, and see the salvation of the LORD.',
    verseReference: 'Exodus 14:13',
    image: '/stories/08-red-sea.svg',
    thumb: '/stories/08-red-sea.svg',
    alt: 'Two towering walls of water with a dry path between them and a crowd walking through.',
  },
  {
    id: 'ten-commandments',
    order: 9,
    title: 'The Ten Commandments',
    reference: 'Exodus 19:16-20:17',
    retelling:
      'Mount Sinai shook with thunder, smoke and fire as God came down to meet his people. There he gave Moses ten commandments carved into stone.',
    verse:
      'I am the LORD thy God, which have brought thee out of the land of Egypt, out of the house of bondage.',
    verseReference: 'Exodus 20:2',
    image: '/stories/09-ten-commandments.svg',
    thumb: '/stories/09-ten-commandments.svg',
    alt: 'A mountain wrapped in smoke and lightning, two stone tablets lit from above.',
  },
  {
    id: 'jericho',
    order: 10,
    title: 'The Walls of Jericho',
    reference: 'Joshua 6:12-20',
    retelling:
      'For six days Israel marched silently around the city. On the seventh day they marched seven times, the trumpets sounded, the people shouted, and the great walls fell flat.',
    verse: 'the people shouted with a great shout, that the wall fell down flat.',
    verseReference: 'Joshua 6:20',
    image: '/stories/10-jericho.svg',
    thumb: '/stories/10-jericho.svg',
    alt: 'Massive city walls collapsing outward while ranks of people march and blow trumpets.',
  },
  {
    id: 'gideons-300',
    order: 11,
    title: "Gideon's Three Hundred",
    reference: 'Judges 7:16-22',
    retelling:
      'God shrank Gideon’s army from thousands down to three hundred men. At midnight they smashed their jars, raised their torches and shouted, and the enemy camp fled in confusion.',
    verse: 'The sword of the LORD, and of Gideon.',
    verseReference: 'Judges 7:20',
    image: '/stories/11-gideons-300.svg',
    thumb: '/stories/11-gideons-300.svg',
    alt: 'Torches blazing out of shattered clay jars across a dark hillside at night.',
  },
  {
    id: 'samson',
    order: 12,
    title: 'Samson and the Pillars',
    reference: 'Judges 16:23-30',
    retelling:
      'Samson had lost his strength and his freedom. Standing between the great pillars of the temple he prayed once more, and God answered him one last time.',
    verse:
      'O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once.',
    verseReference: 'Judges 16:28',
    image: '/stories/12-samson.svg',
    thumb: '/stories/12-samson.svg',
    alt: 'Two enormous temple pillars beginning to buckle, a strong figure braced between them.',
  },
  {
    id: 'david-goliath',
    order: 13,
    title: 'David and Goliath',
    reference: '1 Samuel 17:38-51',
    retelling:
      'A giant terrified the whole army of Israel. A shepherd boy refused armour, chose five smooth stones, and went out to meet him in the name of the Lord.',
    verse: 'I come to thee in the name of the LORD of hosts.',
    verseReference: '1 Samuel 17:45',
    image: '/stories/13-david-goliath.svg',
    thumb: '/stories/13-david-goliath.svg',
    alt: 'A small figure with a sling standing before an enormous armoured giant.',
  },
  {
    id: 'solomons-temple',
    order: 14,
    title: "Solomon's Temple",
    reference: '1 Kings 6:1-14',
    retelling:
      'Solomon built a house for God out of stone, cedar and gold. It took seven years, and every part of it was made with great care.',
    verse: 'So Solomon built the house, and finished it.',
    verseReference: '1 Kings 6:14',
    image: '/stories/14-solomons-temple.svg',
    thumb: '/stories/14-solomons-temple.svg',
    alt: 'A golden temple under construction with cedar beams, scaffolding and stonemasons.',
  },
  {
    id: 'mount-carmel',
    order: 15,
    title: 'Fire on Mount Carmel',
    reference: '1 Kings 18:30-39',
    retelling:
      'Elijah soaked his altar with water again and again, then prayed. Fire fell from heaven and burned it all up, and the people knew who the true God was.',
    verse: 'The LORD, he is the God; the LORD, he is the God.',
    verseReference: '1 Kings 18:39',
    image: '/stories/15-mount-carmel.svg',
    thumb: '/stories/15-mount-carmel.svg',
    alt: 'A column of fire falling onto a drenched stone altar as a crowd falls back in awe.',
  },
  {
    id: 'chariots-of-fire',
    order: 16,
    title: 'The Chariots of Fire',
    reference: '2 Kings 6:15-17',
    retelling:
      'An enemy army surrounded the city and Elisha’s servant was terrified. Elisha prayed that his eyes would be opened, and he saw the hills full of horses and chariots of fire.',
    verse: 'Fear not: for they that be with us are more than they that be with them.',
    verseReference: '2 Kings 6:16',
    image: '/stories/16-chariots-of-fire.svg',
    thumb: '/stories/16-chariots-of-fire.svg',
    alt: 'A hillside filled with blazing chariots and horses of light above a walled city.',
  },
  {
    id: 'fiery-furnace',
    order: 17,
    title: 'The Fiery Furnace',
    reference: 'Daniel 3:19-27',
    retelling:
      'Three friends refused to bow to a golden statue and were thrown into a blazing furnace. They walked in the fire unharmed, and a fourth figure walked with them.',
    verse: 'our God whom we serve is able to deliver us from the burning fiery furnace.',
    verseReference: 'Daniel 3:17',
    image: '/stories/17-fiery-furnace.svg',
    thumb: '/stories/17-fiery-furnace.svg',
    alt: 'Three figures standing calmly inside a white-hot furnace with a fourth beside them.',
  },
  {
    id: 'lions-den',
    order: 18,
    title: "Daniel in the Lions' Den",
    reference: 'Daniel 6:16-23',
    retelling:
      'Daniel kept praying to God even though it was against the law. He was thrown to the lions, but God shut their mouths and he was found safe at sunrise.',
    verse: "My God hath sent his angel, and hath shut the lions' mouths.",
    verseReference: 'Daniel 6:22',
    image: '/stories/18-lions-den.svg',
    thumb: '/stories/18-lions-den.svg',
    alt: 'A stone pit at dawn, lions resting calmly, a man standing unharmed in the light.',
  },
  {
    id: 'jonah',
    order: 19,
    title: 'Jonah and the Great Fish',
    reference: 'Jonah 1:15-2:10',
    retelling:
      'Jonah ran from God and a violent storm caught his ship. He was thrown into the sea, and God sent an enormous fish to swallow him and keep him alive.',
    verse: 'Now the LORD had prepared a great fish to swallow up Jonah.',
    verseReference: 'Jonah 1:17',
    image: '/stories/19-jonah.svg',
    thumb: '/stories/19-jonah.svg',
    alt: 'An enormous fish rising beneath a storming sea as a small figure falls toward it.',
  },
  {
    id: 'potters-house',
    order: 20,
    title: "The Potter's House",
    reference: 'Jeremiah 18:1-6',
    retelling:
      'God sent Jeremiah to watch a potter at work. When a pot was spoiled the potter did not throw the clay away, but shaped it again into something new.',
    verse: "as the clay is in the potter's hand, so are ye in mine hand.",
    verseReference: 'Jeremiah 18:6',
    image: '/stories/20-potters-house.svg',
    thumb: '/stories/20-potters-house.svg',
    alt: 'Hands at a spinning wheel reshaping a marred clay vessel in a warm workshop.',
  },
];

export const TOTAL_ROUNDS = STORIES.length;

export function storyByOrder(order: number): Story | undefined {
  return STORIES.find((s) => s.order === order);
}
