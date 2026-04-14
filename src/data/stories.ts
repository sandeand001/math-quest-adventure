export interface StoryEntry {
  trigger: 'world-intro' | 'stage-intro' | 'boss-intro' | 'boss-victory' | 'world-complete' | 'mini-boss-intro';
  worldIndex: number;
  stageIndex?: number;
  speaker?: string;
  portrait?: string;  // emoji or image path for speaker
  lines: string[];
}

/**
 * The Grand Story of MathQuest
 * ────────────────────────────
 * An evil sorcerer named Zalthor has stolen the Numbers of Power —
 * eight magical crystals that keep the kingdom of Numeria balanced.
 * Without them, the land is falling into chaos. A young hero must
 * travel across Numeria, solve challenges, defeat Zalthor's guardians,
 * and restore the crystals before it's too late.
 *
 * Pip the Fox is the hero's companion — brave, funny, a little clumsy,
 * and always hungry. Professor Hoot (an old owl) provides wisdom from
 * afar via magical letters that appear at key moments.
 */
export const FANTASY_STORY: StoryEntry[] = [

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 0 — EMERALD FOREST (Addition, 0–10)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 0,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      'Ah, there you are! I\'ve been waiting for someone brave enough to answer my call.',
      'I am Professor Hoot, keeper of the Great Library. I\'m afraid I have terrible news.',
      'The sorcerer Zalthor has stolen the eight Numbers of Power — magical crystals that keep our kingdom of Numeria in balance!',
      'Without them, bridges crumble, rivers forget which way to flow, and the bakeries can\'t figure out how many pies to bake. It\'s chaos!',
      'I need a hero to travel across Numeria, recover the crystals, and defeat Zalthor\'s guardians.',
      'But you won\'t be alone! Let me introduce your companion...',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Hiya! I\'m Pip! Pip the Fox! I\'ll be your guide! Your buddy! Your best friend!',
      'I\'m also GREAT at snacking, napping, and getting into trouble. But mostly snacking.',
      'Professor Hoot says the first crystal is hidden somewhere in this forest. Let\'s start looking!',
      'Oh, and don\'t worry about those math puzzles blocking the path — I\'m sure they\'re easy-peasy!',
      '...I mean, I can\'t solve them. I\'m a fox. But YOU can!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 1,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Hey, nice work back there! The forest animals are already starting to cheer up.',
      'A squirrel just told me there\'s a shortcut through the mushroom grove — but it\'s locked with MORE number puzzles.',
      'Who puts math puzzles on a shortcut?! Zalthor, that\'s who. What a meanie.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 2,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Oooh, the puzzles are getting trickier! The trees are whispering that Zalthor\'s magic is stronger up ahead.',
      'But guess what? So are YOU. I can tell because you\'re getting that "I\'m gonna solve everything" look on your face.',
      'I believe in you! Also I just found some berries so I\'ll be snacking while you work. Don\'t judge me.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 3,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A magical letter floats down from the sky*',
      'Dear Hero, I\'ve been watching your progress from the library telescope. Remarkable!',
      'Be warned — Zalthor has placed a guardian up ahead. A small one, but tricky.',
      'Stay focused. When numbers try to confuse you, take a breath and think step by step.',
      'Yours in wisdom, Prof. Hoot 🦉',
    ],
  },
  {
    trigger: 'mini-boss-intro',
    worldIndex: 0,
    stageIndex: 4,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'WAIT. Do you hear that? Something\'s growling behind those bushes...',
      'It\'s... it\'s actually kind of adorable? But also it looks angry!',
      'I think it\'s one of Zalthor\'s guardians! A small one! We can take it!',
      'Quick — answer the questions to fight back! Every right answer is a hit!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 5,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'HA! We beat that little guardian! Did you see it wobble? So funny!',
      'The deeper forest is beautiful — look at those glowing fireflies!',
      'But I can feel something BIG up ahead. The trees are trembling...',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 0,
    stageIndex: 6,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Okay, this is it. The last stretch before the forest guardian.',
      'My tail is literally shaking. Is your tail shaking? Oh wait, you don\'t have a tail. Lucky you.',
      'Let\'s give it everything we\'ve got!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 0,
    stageIndex: 7,
    speaker: 'Numblet',
    portrait: '🐲',
    lines: [
      '*The ground shakes. A cute but fierce little dragon crashes through the trees!*',
      'RAAAWR! I am NUMBLET, guardian of the Emerald Forest and protector of the first crystal!',
      'Zalthor gave me the power of SCRAMBLED NUMBERS! Nothing adds up when I\'m around!',
      'You think you can add? Prove it, tiny human! EVERY correct answer hurts me!',
      'But every WRONG answer? Hehehehe... I get to bite!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'WE DID IT! WE ACTUALLY DID IT! Numblet is down!',
      '*Numblet shrinks to the size of a kitten and yawns*',
      'Awww... without Zalthor\'s magic, he\'s just a sleepy little dragon.',
      'And LOOK! The first crystal! It\'s glowing green, like the forest!',
      '✨ *The Addition Crystal floats into your hands. The trees stop trembling. Birds start singing again.* ✨',
      'One down, seven to go! Professor Hoot says the Crystal Caves are next. Let\'s GO!',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 1 — CRYSTAL CAVES (Addition + Subtraction, 0–20)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 1,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Whoa... these caves are INCREDIBLE. The crystals are every color of the rainbow!',
      'But some of them are dark. Professor Hoot says Zalthor\'s magic drained their light.',
      'And there\'s a NEW kind of puzzle here — SUBTRACTION. Taking things away!',
      'Don\'t worry, it\'s just addition but backwards. Sort of. I think. I\'m a fox, not a mathematician.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 1,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Okay, the cave entrance is covered in glowing crystals with numbers on them.',
      'Some puzzles add, some take away. Mix it up! Keep your brain flexed!',
      'And watch your step — I almost fell into a puddle back there. It was embarrassing.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 1,
    stageIndex: 2,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A letter drifts down, glowing softly in the dark cave*',
      'Dear Hero, subtraction can feel tricky at first. Here\'s a secret:',
      'Think of it as "how far apart are these two numbers?" Stand on the big number and count backwards!',
      'Also, tell Pip to stop licking the crystals. They are NOT candy.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 1,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'I was NOT licking the crystals. I was... tasting them for science.',
      'ANYWAY. The numbers are getting bigger! Up to 20 now!',
      'But you\'re getting faster too. I can barely keep up! And I have four legs!',
    ],
  },
  {
    trigger: 'mini-boss-intro',
    worldIndex: 1,
    stageIndex: 4,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*A shadow moves across the cave ceiling*',
      'Uh oh. Something\'s up there. Something with wings.',
      'It\'s another guardian! And this one can FLY! Great, just great.',
      'Get ready — time to show this cave creature who\'s boss!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 1,
    stageIndex: 5,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'These deeper caves are SO dark. Good thing the crystals still glow a little.',
      'Hey, I just realized something. Every puzzle we solve makes the crystals brighter!',
      'WE\'RE the ones bringing the light back! How cool is that?!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 1,
    stageIndex: 7,
    speaker: 'Syllabuzz',
    portrait: '💎',
    lines: [
      '*A massive crystal golem rises from the cave floor, eyes glowing purple!*',
      'BZZZZT! I am SYLLABUZZ! I eat subtraction for breakfast and addition for lunch!',
      'Zalthor made me from the DARKEST crystals in the cave!',
      'Every wrong answer makes me STRONGER! My crystals grow! My power RISES!',
      'Think you can subtract ME from this cave? TRY IT!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 1,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Syllabuzz shatters into a thousand tiny crystals that rain down like confetti!*',
      'THE CAVE IS LIGHTING UP! All the crystals are glowing again!',
      '✨ *The Subtraction Crystal emerges from the rubble, shining bright blue!* ✨',
      'Two crystals recovered! The kingdom is going to be SO happy!',
      'But Pip... *looks at map*... the next stop is the Mystic Meadows. And the numbers go up to 100.',
      '*gulp* We got this. Right? RIGHT? ...right.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 2 — MYSTIC MEADOWS (Addition + Subtraction, 10–100)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 2,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Woooow! These meadows are magical! The flowers change color when you walk past them!',
      'But they\'re all mixed up — sunflowers in winter, roses in the snow. Zalthor\'s chaos!',
      'The numbers here go up to ONE HUNDRED. I know, I know. That sounds like a lot.',
      'But think about it — you\'ve already mastered up to 20! We\'re just... adding bigger building blocks.',
      'Plus, Professor Hoot sent us a surprise....',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 2,
    stageIndex: 0,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A letter arrives carried by a butterfly*',
      'Dear Hero, bigger numbers may look scary, but they follow the same rules!',
      '23 + 15? Just add the ones: 3+5=8. Then add the tens: 2+1=3. Answer: 38!',
      'Break big problems into small pieces. That\'s the secret to EVERYTHING in life.',
      'P.S. — I\'ve unlocked the SHOP near the old forest! Visit it to spend your coins on fun items!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 2,
    stageIndex: 2,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Hey, have you noticed that some puzzles have a BLANK spot now?',
      'Like "15 + ___ = 22." You have to figure out the MISSING piece!',
      'It\'s like being a detective! Math Detective! I should get a tiny hat.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 2,
    stageIndex: 4,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Pip sniffs the air* I smell trouble. And also wildflowers. Mostly wildflowers.',
      'But ALSO trouble! There\'s a guardian hiding in the tall grass!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 2,
    stageIndex: 7,
    speaker: 'Fablewing',
    portrait: '🦋',
    lines: [
      '*A giant butterfly with shimmering wings descends from the sky!*',
      'I am Fablewing, weaver of stories and guardian of the meadows!',
      'Zalthor told me that NO ONE can solve two-digit subtraction. Is he right?',
      'Show me your power! Solve my number stories and MAYBE I\'ll give you the crystal!',
      'But be warned — my wing-winds blow away wrong answers, and they STING!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 2,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Fablewing\'s wings stop glowing with dark magic. She looks... relieved?*',
      '"Thank you," she whispers. "Zalthor\'s spell made me so angry. I\'m free now."',
      '✨ *The Place Value Crystal rises from the meadow flowers, shining golden!* ✨',
      'THREE crystals! We\'re almost halfway there!',
      'And Pip... the next world is the MOUNTAINS. And they say there\'s a whole NEW kind of math there.',
      'Something called... MULTIPLICATION. *dramatic thunder*',
      'I\'m sure it\'s fine. It\'s probably fine. Let\'s go.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 3 — IRONFORGE MOUNTAINS (Multiplication, tables 1–5)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 3,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *An urgent letter arrives by eagle*',
      'Dear Hero! MULTIPLICATION! The word sounds big and scary, but it\'s really just FAST ADDING!',
      '3 × 4 just means "three groups of four." 4 + 4 + 4 = 12. That\'s it!',
      'The dwarves of Ironforge used to be the greatest multipliers in the land. Now they\'ve forgotten everything.',
      'You\'ll start small — tables 1 through 5. Like learning to walk before you run!',
      'Believe in yourself. You\'ve already come SO far. — Prof. Hoot 🦉',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 3,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Multiplication! NEW SKILL UNLOCKED! This is like leveling up in real life!',
      'The dwarf blacksmiths keep asking things like "I need 3 groups of 5 nails."',
      'That\'s 3 × 5 = 15 nails! See? It\'s just counting groups!',
      'Let\'s start with the easy tables. We\'ll be multiplying masters in no time!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 3,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Okay, the 4s and 5s table...these take a little more thought.',
      'Here\'s a trick for 5s: they always end in 0 or 5! 5, 10, 15, 20...',
      'And for 4s? Just double-double! 4 × 3 = double 3 is 6, double 6 is 12!',
      'Professor Hoot taught me that. Even foxes can learn multiplication... sort of.',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 3,
    stageIndex: 7,
    speaker: 'Calculon',
    portrait: '⚔️',
    lines: [
      '*The mountain SHAKES. A dragon covered in iron armor stomps forward!*',
      'I am CALCULON! Forged in the FIRES of multiplication!',
      'My armor has LAYERS — like times tables! Each plate is a number multiplied by STRENGTH!',
      'The dwarves couldn\'t beat me. Their KING couldn\'t beat me!',
      'What chance does a little human and a scraggly fox have?! HAHAHAHA!',
      'SHOW ME YOUR TIMES TABLES OR BE CRUSHED!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Calculon\'s iron armor falls off piece by piece as each times table is solved!*',
      'The dwarves are CHEERING! They\'re coming out of their hiding spots!',
      '"The forges are burning again!" the Dwarf King shouts. "The hero has freed us!"',
      '✨ *The Multiplication Crystal floats up from the anvil, glowing hot orange!* ✨',
      'FOUR crystals! We\'re HALFWAY! Pip does a little victory dance.',
      'Next up: the Shadow Swamp. And a new math skill called DIVISION.',
      'The Dwarf King says division is "multiplication\'s twin." That sounds less scary... I think.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 4 — SHADOW SWAMP (Division, tables 1–5)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 4,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A damp letter arrives, slightly muddy*',
      'Dear Hero, division is SHARING. That\'s all it is!',
      'If you have 12 cookies and 3 friends, each friend gets 12 ÷ 3 = 4 cookies!',
      'Here\'s the beautiful secret: division is multiplication\'s MIRROR.',
      'If 3 × 4 = 12, then 12 ÷ 3 = 4 AND 12 ÷ 4 = 3. You already know these answers!',
      'Be careful in the swamp. It\'s dark and foggy. Trust your brain, not your eyes. — Prof. Hoot',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 4,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Ewww, this swamp is SQUELCHY. My paws are soaked.',
      'But division is actually kind of fun! It\'s like solving a mystery backwards.',
      'Someone had 15 acorns and split them into groups of 5. How many groups? THREE!',
      'I figured that out by myself! Can I get a treat? No? Fine. Let\'s go.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 4,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Hey, I just realized something. Remember those multiplication facts we learned?',
      'They work HERE too! If I know 4 × 5 = 20, then I ALSO know 20 ÷ 4 = 5!',
      'IT\'S THE SAME THING! My mind is BLOWN! *Pip\'s eyes go wide*',
      'Math is all connected! Like a big spiderweb! ...bad comparison for a swamp. Sorry.',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 4,
    stageIndex: 7,
    speaker: 'Vowelstrike',
    portrait: '🐍',
    lines: [
      '*The swamp water BUBBLES. A massive serpent rises, dripping with dark magic!*',
      'Sssssso... you\'ve come to MY domain. I am VOWELSTRIKE, the divider of dreams!',
      'I ssplit everything in half! Then in thirds! Then in NOTHING!',
      'Zalthor promised me that NO CHILD could master division. Prove him WRONG... if you dare!',
      'Each correct answer WEAKENS me. But each wrong answer? I GROW STRONGER! Hissssss!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 4,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Vowelstrike shrinks down to a tiny garden snake and slithers away!*',
      '"I\'ll tell Zalthor you\'re coming!" he hisses as he disappears.',
      '✨ *The Division Crystal rises from the swamp, glowing a deep purple!* ✨',
      'FIVE crystals! More than halfway!',
      '*Pip gets serious for a moment* "Hey... you know what? You\'re really good at this."',
      '"When Professor Hoot first asked me to find a hero, I was nervous. But you\'re the real deal."',
      '"...Okay, mushy moment over. ONWARD TO THE RUINS!"',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 5 — ENCHANTED RUINS (Multiply + Divide, tables 1–10)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 5,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'These ruins are ANCIENT. Like, older than Professor Hoot ancient. And that\'s SAYING something.',
      'The inscriptions on the walls mix multiplication AND division together!',
      'And the tables go all the way up to 10 now. The big leagues!',
      'But think about how far we\'ve come! We started counting to 10 in the forest!',
      'Now we\'re multiplying and dividing like CHAMPIONS! Zalthor should be scared!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 5,
    stageIndex: 0,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A letter carved into a floating stone tablet appears*',
      'Dear Hero, these ruins are from the Ancient Numerians — the greatest mathematicians who ever lived!',
      'They combined multiplication and division into beautiful patterns.',
      'You\'ll see word problems here too. READ them carefully — the story tells you which operation to use!',
      'If someone is SHARING or SPLITTING — it\'s division. If they\'re making GROUPS — it\'s multiplication.',
      'You have all the skills you need. Trust yourself! — Prof. Hoot',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 5,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'The 6, 7, 8 times tables... okay, I won\'t lie, these are the hardest ones.',
      'But here are Pip\'s SUPER SECRET tips:',
      '6 × 8 = 48. I remember it as "six and eight went on a DATE, they came home at FORTY-EIGHT!"',
      '7 × 8 = 56. Just say "5, 6, 7, 8" — the answer is IN the question! 56 = 7 × 8!',
      'Weird tricks, but they WORK! Now get in there!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 5,
    stageIndex: 7,
    speaker: 'Riddle Sphinx',
    portrait: '🗿',
    lines: [
      '*An enormous stone sphinx opens its eyes. Its voice echoes through the ruins!*',
      'I AM THE RIDDLE SPHINX! I have guarded these ruins for a THOUSAND YEARS!',
      'None have answered ALL my riddles. NONE!',
      'I will ask you multiplication AND division. Mixed together. TWISTED together!',
      'If you answer wrong, you will be TURNED TO STONE... just kidding. But it will hurt a little.',
      'PROVE YOUR WORTH, YOUNG HERO! BEGIN!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 5,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*The Sphinx bows its massive stone head for the first time in a thousand years!*',
      '"In all my centuries... no one has ever answered every riddle. You are... extraordinary."',
      '✨ *The Sphinx opens its mouth and the Operations Crystal floats out, glowing rainbow colors!* ✨',
      'SIX CRYSTALS! Only TWO more!',
      '*Pip is literally bouncing* "THE SKY CITADEL IS NEXT! A CASTLE! IN THE CLOUDS!"',
      '"I\'ve always wanted to go to a cloud castle! Do you think they have cloud food?"',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 6 — SKY CITADEL (All 4 operations, 0–500)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 6,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A letter arrives on golden wings*',
      'Dear Hero, the Sky Citadel is where ALL FOUR operations come together.',
      'Addition. Subtraction. Multiplication. Division. ALL of them. Mixed and matched!',
      'The numbers can go up to 500 for addition and subtraction. But the times tables stay in your range.',
      'This is the test of a TRUE mathematician. Not just knowing each skill, but knowing WHEN to use WHICH one.',
      'I am SO proud of you. The kingdom is watching. — Professor Hoot',
      'P.S. — Yes, Pip, they do have food in the clouds. It tastes like marshmallows.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 6,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'WE\'RE IN THE CLOUDS! I CAN SEE THE WHOLE KINGDOM FROM HERE!',
      'Okay okay, focus Pip. All four operations. This is the big test.',
      'But we know ALL of these! Addition from the forest! Subtraction from the caves!',
      'Multiplication from the mountains! Division from the swamp!',
      'We\'ve been training for this our WHOLE JOURNEY! LET\'S DO THIS!',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 6,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Hey, some of these word problems are TRICKY. They try to confuse you!',
      'Here\'s my tip: READ THE QUESTION TWICE. The first time to understand, the second time to solve.',
      '"How many are LEFT?" = subtraction. "How many IN TOTAL?" = addition.',
      '"How many in EACH group?" = division. "How many ALTOGETHER with groups?" = multiplication.',
      'You. Got. This.',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 6,
    stageIndex: 7,
    speaker: 'The Lexicon',
    portrait: '📖',
    lines: [
      '*A massive living book SLAMS open in the center of the citadel!*',
      'I AM THE LEXICON! MASTER OF ALL OPERATIONS! KEEPER OF EVERY EQUATION!',
      'I contain EVERY math fact that ever existed! All four operations flow through my pages!',
      'Zalthor himself FEARS what I can do! And you think YOU can defeat me?!',
      'Addition! Subtraction! Multiplication! DIVISION! ALL AT ONCE!',
      'LET\'S SEE WHAT YOU\'RE MADE OF, HERO!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 6,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*The Lexicon\'s pages stop turning. Slowly, it closes with a gentle thud.*',
      '"...well done," it whispers. "It has been... an honor."',
      '✨ *The Mastery Crystal rises from the book\'s spine, shining pure white!* ✨',
      'SEVEN CRYSTALS! ONE MORE! JUST! ONE! MORE!',
      '*Pip looks toward the volcano in the distance. His smile fades a little.*',
      '"Dragon\'s Peak. That\'s where Zalthor\'s strongest guardian lives. Archimedes the Eternal."',
      '"They say he\'s never been beaten. Ever. In a thousand years."',
      '"...but they never met US. Right, hero? ...right?"',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 7 — DRAGON'S PEAK (All 4 operations, 0–10000)
  // ═══════════════════════════════════════════════════════════════════

  {
    trigger: 'world-intro',
    worldIndex: 7,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 *A letter arrives, trembling with urgency*',
      'My dearest Hero,',
      'This is it. The FINAL crystal is at Dragon\'s Peak, guarded by Archimedes the Eternal.',
      'The numbers here are ENORMOUS — up to 10,000! But remember...',
      'Every number, no matter how big, follows the same rules you learned in the Emerald Forest.',
      'Addition is addition. Subtraction is subtraction. The rules don\'t change — only the SIZE changes.',
      'You have conquered forests, caves, meadows, mountains, swamps, ruins, and a CASTLE IN THE SKY.',
      'You are ready. I believe in you with every feather in my body.',
      'Go save our kingdom. — Professor Hoot 🦉',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 7,
    stageIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Pip takes a deep breath and looks up at the volcano*',
      'Okay. Here we are. Dragon\'s Peak. The big finale.',
      'I\'m not going to pretend I\'m not scared. My paws are shaking.',
      'But we\'ve come SO FAR together. Remember when we couldn\'t even add past 10?',
      'Now we can do EVERYTHING. ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION!',
      'Zalthor thought nobody would make it this far. He was WRONG.',
      'Let\'s finish this. Together. 🦊❤️',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 7,
    stageIndex: 3,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'The volcano is getting hotter. The numbers are getting BIGGER.',
      'But you know what? Big numbers are just little numbers stacked up!',
      '4,521 + 1,234? Just go column by column! Ones, tens, hundreds, thousands!',
      'You\'re not just doing math anymore. You\'re doing HERO math. That\'s the best kind.',
    ],
  },
  {
    trigger: 'stage-intro',
    worldIndex: 7,
    stageIndex: 6,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*The ground rumbles. The volcano glows brighter.*',
      'This is the last stretch before Archimedes. I can feel his presence.',
      'Whatever happens in there... I want you to know... you\'re the best hero a fox could ask for.',
      'Now let\'s go kick some dragon tail! LITERALLY!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 7,
    stageIndex: 7,
    speaker: 'Archimedes the Eternal',
    portrait: '🐉',
    lines: [
      '*THE VOLCANO ERUPTS WITH LIGHT! A COLOSSAL DRAGON DESCENDS FROM THE SMOKE!*',
      'I... AM... ARCHIMEDES... THE ETERNAL!',
      'For a THOUSAND YEARS I have guarded the final crystal! NONE have EVER reached me!',
      'I have heard of your journey, little hero. The forest. The caves. The mountains.',
      'You defeated my brothers and sisters. Numblet. Syllabuzz. Calculon. All of them.',
      'But I am NOT like them. I am the STRONGEST! The SMARTEST! The FINAL GUARDIAN!',
      'Every operation. Every number. Every trick I know — I will throw at you ALL AT ONCE!',
      'IF YOU CAN DEFEAT ME... the kingdom is saved. But IF YOU CANNOT...',
      'THEN NUMERIA FALLS! FOREVER! MWAHAHAHAHAHA!',
      'PREPARE YOURSELF, HERO! THIS! IS! THE! FINAL! BATTLE!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 7,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Archimedes ROARS one final time... and then slowly, gently, lowers his head.*',
      '"...I yield. For the first time in a thousand years... I yield."',
      '"You truly are the greatest math hero Numeria has ever known."',
      '*Archimedes opens his claw. Inside is the last crystal, glowing like a tiny sun.*',
      '✨ THE FINAL CRYSTAL! THE CRYSTAL OF CHAMPIONS! ✨',
      '*ALL EIGHT CRYSTALS FLOAT UP INTO THE SKY AND MERGE INTO A BRILLIANT RAINBOW OF LIGHT!*',
      '*The dark clouds over Numeria vanish. The rivers flow correctly again. The bridges rebuild themselves.*',
      '*The bakeries finally know how many pies to bake!*',
    ],
  },
  {
    trigger: 'world-complete',
    worldIndex: 7,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '*Professor Hoot soars down from the sky, tears in his ancient eyes*',
      'YOU DID IT! YOU SAVED NUMERIA!',
      'Every creature in the kingdom — the forest animals, the cave crystals, the dwarves, even the Sphinx —',
      'They\'re all celebrating RIGHT NOW because of YOU!',
      'You learned to add. To subtract. To multiply. To divide.',
      'You solved puzzles that GROWN-UPS would struggle with!',
      'You defeated EIGHT guardians and recovered ALL the Numbers of Power!',
      'You, dear hero, are a TRUE MATH CHAMPION! 🏆',
    ],
  },
  {
    trigger: 'world-complete',
    worldIndex: 7,
    stageIndex: 7,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      '*Pip runs in circles, tail wagging like crazy*',
      'WE DID IT! WE DID IT! WE DID IT!',
      'Best adventure EVER! Best hero EVER! Best fox companion EVER!',
      '*Pip hugs your leg* "I\'m gonna miss this. But you know what?"',
      '"Math never ends. There\'s ALWAYS more to learn. More to explore."',
      '"So whenever you want to practice, just come back. I\'ll be right here, waiting."',
      '"With snacks. Obviously."',
      '"Thank you, hero. For everything. Now go be amazing out there! 🦊💛"',
      '',
      '🎉 CONGRATULATIONS! YOU COMPLETED MATHQUEST! 🎉',
    ],
  },
];

/** Look up a story entry. */
export function getStory(
  trigger: StoryEntry['trigger'],
  worldIndex: number,
  stageIndex?: number,
): StoryEntry | undefined {
  return FANTASY_STORY.find(
    (s) =>
      s.trigger === trigger &&
      s.worldIndex === worldIndex &&
      (stageIndex === undefined || s.stageIndex === undefined || s.stageIndex === stageIndex),
  );
}
