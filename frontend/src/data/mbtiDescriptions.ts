// Funny MBTI type descriptions (T107-T122)

export interface MbtiDescription {
  title: string
  funnyTitle: string
  desc: string
  funnyDesc: string
  traits: string[]
  funnyTraits: string[]
}

export const funnyMbtiDescriptions: Record<string, MbtiDescription> = {
  INTJ: {
    title: 'The Architect',
    funnyTitle: 'The Overthinking Master',
    desc: 'Strategic, analytical, and independent thinkers who see the big picture and plan for the future.',
    funnyDesc: 'The only people who can spend 6 hours planning a grocery list and still forget the milk. They have a 5-year plan for everything, including their nap schedule.',
    traits: ['Strategic', 'Analytical', 'Independent', 'Determined'],
    funnyTraits: ['Overplanner', 'Slightly Paranoid', 'Secretly Softie', 'WiFi Dependent']
  },
  INTP: {
    title: 'The Logician',
    funnyTitle: 'The Internet Research Rabbit Hole',
    desc: 'Innovative, curious, and logical problem-solvers who love exploring abstract ideas.',
    funnyDesc: 'Will research why they are hungry for 3 hours and end up reading about quantum physics. Their brain has 47 tabs open and none of them are relevant.',
    traits: ['Innovative', 'Curious', 'Logical', 'Objective'],
    funnyTraits: ['Procrastination Pro', 'Debate Club', 'Snack Hoarder', 'Existential']
  },
  ENTJ: {
    title: 'The Commander',
    funnyTitle: 'The CEO of Everything',
    desc: 'Bold, strategic, and natural leaders who organize people to get things done.',
    funnyDesc: 'Tries to optimize their sleep schedule like a corporate merger. Will make a spreadsheet for choosing a restaurant. Born to manage, forced to relax.',
    traits: ['Bold', 'Strategic', 'Leader', 'Efficient'],
    funnyTraits: ['Task Master', 'Impatient', 'List Maker', 'Power Napper']
  },
  ENTP: {
    title: 'The Debater',
    funnyTitle: 'The Devil\'s Advocate',
    desc: 'Inventive, clever, and love intellectual challenges and debating ideas.',
    funnyDesc: 'Will argue both sides of any topic just to see what happens. Their idea of relaxation is starting a harmless internet debate at 2 AM.',
    traits: ['Inventive', 'Clever', 'Debate', 'Resourceful'],
    funnyTraits: ['Chaos Agent', 'Meme Lord', 'Wait, Actually', 'No Sleep']
  },
  INFJ: {
    title: 'The Advocate',
    funnyTitle: 'The Human Therapist',
    desc: 'Insightful, principled, and passionate about helping others reach their potential.',
    funnyDesc: 'Can tell you are having a bad day just by your text message punctuation. Has read every self-help book and still forgets to eat lunch.',
    traits: ['Insightful', 'Principled', 'Passionate', 'Compassionate'],
    funnyTraits: ['Empathy Overload', 'Book Worm', 'Cry at Ads', 'Ghost Writer']
  },
  INFP: {
    title: 'The Mediator',
    funnyTitle: 'The Daydream Artist',
    desc: 'Poetic, kind, and altruistic dreamers who seek meaning and authentic connections.',
    funnyDesc: 'Has written at least 47 unfinished poems about coffee. Will cry at a commercial and pretend it is dust in their eye. Lives in a beautifully chaotic world of their own making.',
    traits: ['Poetic', 'Kind', 'Altruistic', 'Creative'],
    funnyTraits: ['Romanticizes Everything', 'Procrastinator', 'Vibe Checker', 'Deep Thinker']
  },
  ENFJ: {
    title: 'The Protagonist',
    funnyTitle: 'The Group Chat Mom/Dad',
    desc: 'Charismatic, inspiring leaders who motivate others to grow and achieve.',
    funnyDesc: 'Remembers everyone birthdays, plans every group hangout, and somehow still gets asked "what do you do for work?" Will send you a playlist for your mood at 3 AM.',
    traits: ['Charismatic', 'Inspiring', 'Leader', 'Empathetic'],
    funnyTraits: ['People Pleaser', 'Motivator', 'Overthinker', 'Heart on Sleeve']
  },
  ENFP: {
    title: 'The Campaigner',
    funnyTitle: 'The Sparkle Hurricane',
    desc: 'Enthusiastic, creative, and sociable free spirits who find possibilities everywhere.',
    funnyDesc: 'Starts 15 hobbies in one weekend and perfects zero of them. Will spontaneously plan a road trip at midnight and convince everyone it is a great idea. Their energy is contagious (scientifically proven).',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Spontaneous'],
    funnyTraits: ['Brain on Fire', 'Sparkle Power', 'Distraction King', 'Hug Dealer']
  },
  ISTJ: {
    title: 'The Logistician',
    funnyTitle: 'The Human Rule Book',
    desc: 'Responsible, thorough, and dependable organizers who value tradition and loyalty.',
    funnyDesc: 'Has a color-coded calendar for their color-coded calendar. Will gently correct your grammar while secretly helping you move furniture. The friend who always shows up 10 minutes early.',
    traits: ['Responsible', 'Thorough', 'Dependable', 'Practical'],
    funnyTraits: ['Rule Follower', 'Detail Nazi', 'Silent Hero', 'Fridge Organizer']
  },
  ISFJ: {
    title: 'The Defender',
    funnyTitle: 'The Secret Santa Every Year',
    desc: 'Dedicated, warm, and protective caregivers who are always ready to help.',
    funnyDesc: 'Will remember your coffee order from 3 years ago and make it for you without asking. Has a drawer full of emergency snacks for everyone they love. The human equivalent of a warm blanket.',
    traits: ['Dedicated', 'Warm', 'Protective', 'Reliable'],
    funnyTraits: ['Memory Bank', 'Snack Dealer', 'Quiet Strength', 'Comfort Maker']
  },
  ESFJ: {
    title: 'The Consul',
    funnyTitle: 'The Party Planner Supreme',
    desc: 'Caring, sociable, and helpful community builders who thrive on harmony.',
    funnyDesc: 'Will organize your birthday, your dinner party, and your life advice session all in one Saturday. Knows everyone in town and somehow remembers everyone else\'s anniversary.',
    traits: ['Caring', 'Sociable', 'Helpful', 'Loyal'],
    funnyTraits: ['Social Butterfly', 'Host Mode', 'Gossip Hub', 'Cake Angel']
  },
  ESTJ: {
    title: 'The Executive',
    funnyTitle: 'The Manager of Managers',
    desc: 'Excellent administrators, organized and loyal who excel at managing projects.',
    funnyDesc: 'Approaches a vacation like a military operation. Will create an agenda for the agenda. Their idea of spontaneous is trying a new brand of toothpaste.',
    traits: ['Organized', 'Loyal', 'Practical', 'Direct'],
    funnyTraits: ['Boss Mode', 'No Nonsense', 'Spreadsheet Life', 'Efficiency God']
  },
  ISTP: {
    title: 'The Virtuoso',
    funnyTitle: 'The Silent Fixer',
    desc: 'Bold, practical, and masters of tools who love understanding how things work.',
    funnyDesc: 'Will fix your car, your computer, and your life advice in under 10 minutes with minimal words. Their idea of a good time is taking apart the toaster "just to see." Speaks fluent sarcasm.',
    traits: ['Bold', 'Practical', 'Hands-on', 'Observant'],
    funnyTraits: ['Tool Wizard', 'Chill Master', 'Fix It Guy', 'Minimalist']
  },
  ISFP: {
    title: 'The Adventurer',
    funnyTitle: 'The Quiet Artist',
    desc: 'Flexible, artistic, and always ready to explore new experiences with sensitivity.',
    funnyDesc: 'Expresses love through carefully curated Spotify playlists and random flower pickups. Will disappear for hours to "get groceries" and return with art supplies. The aesthetic of a human.',
    traits: ['Flexible', 'Artistic', 'Exploratory', 'Sensitive'],
    funnyTraits: ['Vibe Curator', 'Nature Lover', 'Soft Soul', 'Aesthetic Queen']
  },
  ESFP: {
    title: 'The Entertainer',
    funnyTitle: 'The Life of Every Party',
    desc: 'Spontaneous, energetic, and life of the party who love bringing joy to others.',
    funnyDesc: 'Cannot sit through a movie without providing commentary. Will turn a grocery run into an adventure and a funeral into a "well, they would have wanted a good time." Their spirit animal is a confetti cannon.',
    traits: ['Spontaneous', 'Energetic', 'Fun', 'Observant'],
    funnyTraits: ['Dance Floor Owner', 'Attention Magnet', 'Impulsive', 'Joy Dealer']
  },
  ESTP: {
    title: 'The Entrepreneur',
    funnyTitle: 'The Risk-Taker Extraordinaire',
    desc: 'Smart, energetic, and very perceptive individuals who live on the edge.',
    funnyDesc: 'Will skydive on a Monday, start a business on Tuesday, and question their life choices on Wednesday. Their brain works at 200mph and their common sense at 0.5mph. Thrives on chaos like a fish in a whirlpool.',
    traits: ['Smart', 'Energetic', 'Perceptive', 'Practical'],
    funnyTraits: ['Adrenaline Junkie', 'Deal Maker', 'Impulsive King', 'No Filter']
  }
}
