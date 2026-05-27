export type VinylSideId = 'a' | 'b'

export type VinylSide = {
  subtitle: string
  description: string
  highlights: string[]
  blurb: string
  labelAsset: string
  songTitle: string
  audioAsset: string
}

export type VinylTrack = {
  id: string
  title: string
  sides: Record<VinylSideId, VinylSide>
}

function musicPath(filename: string) {
  return `/assets/music/${encodeURIComponent(filename)}`
}

export function getVinylSide(track: VinylTrack, sideId: VinylSideId): VinylSide {
  return track.sides[sideId]
}

export function flipSideId(sideId: VinylSideId): VinylSideId {
  return sideId === 'a' ? 'b' : 'a'
}

export const vinylTracks: VinylTrack[] = [
  {
    id: 'identity',
    title: 'Identity',
    sides: {
      a: {
        subtitle: 'Engineer',
        blurb: 'Who I am and what drives me.',
        description:
          'I build thoughtful digital products with a blend of design sensibility, engineering craft, and product strategy.',
        highlights: [
          'Cross-functional collaborator across product, design, and engineering',
          'Focused on UX clarity, quality, and performance',
          'Open to impactful roles and mission-aligned teams',
        ],
        labelAsset: '/assets/labels/blurryme.png',
        songTitle: 'Gold Tomorrow',
        audioAsset: musicPath('gold tomorrow.mp3'),
      },
      b: {
        subtitle: 'Person',
        blurb: 'What keeps me curious off the clock.',
        description:
          'Outside of product work, I collect inspiration from music, visual design, and the small rituals that make creative work feel human.',
        highlights: [
          'Always chasing a good album side flip',
          'Drawn to warm palettes and tactile interfaces',
          'Believes great portfolios should feel lived-in, not staged',
        ],
        labelAsset: '/assets/labels/about2.svg',
        songTitle: 'Get More Done',
        audioAsset: musicPath('get more done.mp3'),
      },
    },
  },
  {
    id: 'projects',
    title: 'Selected Projects',
    sides: {
      a: {
        subtitle: 'Shipped Work',
        blurb: 'Work I am proud to ship.',
        description:
          'From interactive web experiences to product features, each project emphasizes measurable user impact and durable implementation.',
        highlights: [
          'End-to-end ownership from discovery to release',
          'Attention to accessibility and maintainability',
          'Strong visual polish and interaction quality',
        ],
        labelAsset: '/assets/labels/projects2.svg',
        songTitle: 'Get More Done',
        audioAsset: musicPath('get more done.mp3'),
      },
      b: {
        subtitle: 'Process Notes',
        blurb: 'How I like to build.',
        description:
          'I favor tight feedback loops, clear constraints, and prototypes that teach something before they become production code.',
        highlights: [
          'Start with the interaction, then scale the system',
          'Prototype in the medium users will actually touch',
          'Leave room for polish passes after the core loop works',
        ],
        labelAsset: '/assets/labels/projects2.svg',
        songTitle: 'Afraid to Lose the Butterflies',
        audioAsset: musicPath('afraid to lose the butterflies.mp3'),
      },
    },
  },
  {
    id: 'experience',
    title: 'Experience',
    sides: {
      a: {
        subtitle: 'Roles & Outcomes',
        blurb: 'Roles, growth, and outcomes.',
        description:
          'I have worked across startup and team environments, helping products move from idea to polished release with reliable execution.',
        highlights: [
          'Shipped high-value user-facing experiences',
          'Partnered deeply with design and analytics',
          'Built reusable systems to improve team velocity',
        ],
        labelAsset: '/assets/labels/experience2.svg',
        songTitle: 'Afraid to Lose the Butterflies',
        audioAsset: musicPath('afraid to lose the butterflies.mp3'),
      },
      b: {
        subtitle: 'What I Reach For',
        blurb: 'The kind of work I want next.',
        description:
          'I am most energized by teams that care about craft, trust each other with ambiguity, and treat design and engineering as one conversation.',
        highlights: [
          'Mission-aligned products with real user stakes',
          'Collaborative teams with high trust and low ego',
          'Room to shape both the interface and the system underneath',
        ],
        labelAsset: '/assets/labels/experience2.svg',
        songTitle: 'This Is How You Fall Unlove?',
        audioAsset: musicPath('this is how you fall unlove.mp3'),
      },
    },
  },
]
