export const servicesData = [
  {
    id: 'face-painting',
    title: 'Face Painting Magic',
    description: 'Transform kids into their favorite characters with our professional face painting artists.',
    price: 150,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
    rating: 5,
    popular: true,
    includes: [
      'Professional face painting artist',
      'High-quality, hypoallergenic paints',
      'Wide variety of designs',
      'All materials included',
      'Setup and cleanup'
    ],
    options: [
      { id: 'extra-hour', name: 'Extra Hour', price: 60 },
      { id: 'glitter', name: 'Glitter Add-on', price: 25 },
      { id: 'second-artist', name: 'Second Artist', price: 120 },
    ]
  },
  {
    id: 'balloon-twisting',
    title: 'Balloon Twisting Fun',
    description: 'Amazing balloon sculptures and creations that will delight children of all ages.',
    price: 120,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    rating: 5,
    includes: [
      'Professional balloon artist',
      'Premium quality balloons',
      'Custom balloon designs',
      'Interactive performance',
      'Balloon decorations'
    ],
    options: [
      { id: 'extra-hour', name: 'Extra Hour', price: 50 },
      { id: 'jumbo-sculptures', name: 'Jumbo Sculptures', price: 40 },
      { id: 'balloon-arch', name: 'Balloon Arch Decoration', price: 80 },
    ]
  },
  {
    id: 'magic-show',
    title: 'Interactive Magic Show',
    description: 'Professional magician performing mind-blowing tricks and illusions for your little ones.',
    price: 200,
    duration: '1 hour',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    rating: 5,
    popular: true,
    includes: [
      'Professional magician',
      'Interactive magic tricks',
      'Age-appropriate performance',
      'Audience participation',
      'Photo opportunities'
    ],
    options: [
      { id: 'extended-show', name: 'Extended Show (30 min)', price: 80 },
      { id: 'magic-workshop', name: 'Magic Workshop', price: 100 },
      { id: 'levitation-trick', name: 'Grand Levitation Trick', price: 150 },
    ]
  },
  {
    id: 'character-visit',
    title: 'Character Visit',
    description: 'Bring joy with visits from beloved characters - princesses, superheroes, and more!',
    price: 180,
    duration: '1.5 hours',
    image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&auto=format&fit=crop',
    rating: 5,
    includes: [
      'Professional character performer',
      'Authentic costume',
      'Interactive storytelling',
      'Games and activities',
      'Birthday song and cake moment'
    ],
    options: [
      { id: 'extra-character', name: 'Second Character', price: 150 },
      { id: 'photo-package', name: 'Professional Photo Package', price: 75 },
      { id: 'extended-visit', name: 'Extended Visit (+30 min)', price: 60 },
    ]
  },
  {
    id: 'dance-party',
    title: 'Kids Dance Party',
    description: 'High-energy dance party with games, music, and lots of fun for active kids!',
    price: 140,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&auto=format&fit=crop',
    rating: 4,
    includes: [
      'Professional DJ/animator',
      'Sound system and lights',
      'Age-appropriate music',
      'Dance games and contests',
      'Props and accessories'
    ],
    options: [
      { id: 'bubble-machine', name: 'Bubble Machine', price: 35 },
      { id: 'extra-hour', name: 'Extra Hour', price: 55 },
      { id: 'karaoke', name: 'Karaoke Addition', price: 45 },
    ]
  },
  {
    id: 'craft-workshop',
    title: 'Creative Craft Workshop',
    description: 'Hands-on creative workshop where kids make their own crafts to take home.',
    price: 130,
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop',
    rating: 5,
    includes: [
      'Experienced craft instructor',
      'All craft materials',
      'Multiple project options',
      'Take-home creations',
      'Cleanup included'
    ],
    options: [
      { id: 'premium-materials', name: 'Premium Materials Pack', price: 40 },
      { id: 'extra-project', name: 'Additional Craft Project', price: 30 },
      { id: 'craft-bags', name: 'Personalized Craft Bags', price: 25 },
    ]
  },
];

export const galleryImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop', category: 'face-painting' },
  { id: 2, url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop', category: 'balloons' },
  { id: 3, url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&auto=format&fit=crop', category: 'parties' },
  { id: 4, url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop', category: 'crafts' },
  { id: 5, url: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&auto=format&fit=crop', category: 'dance' },
  { id: 6, url: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&auto=format&fit=crop', category: 'characters' },
  { id: 7, url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop', category: 'parties' },
  { id: 8, url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop', category: 'magic' },
  { id: 9, url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop', category: 'parties' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sophie Martinez',
    text: 'Amazing experience! The face painter was so talented and patient with all the kids. Highly recommend!',
    rating: 5,
    service: 'Face Painting Magic'
  },
  {
    id: 2,
    name: 'Lucas Van Den Berg',
    text: 'The magic show was absolutely fantastic! Our son and his friends were mesmerized. Worth every euro!',
    rating: 5,
    service: 'Interactive Magic Show'
  },
  {
    id: 3,
    name: 'Emma Johnson',
    text: 'Professional, punctual, and the kids had a blast! The balloon artist created incredible sculptures.',
    rating: 5,
    service: 'Balloon Twisting Fun'
  },
];
