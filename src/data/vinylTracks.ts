export type VinylTrack = {
  id: string
  title: string
  blurb: string
  description: string
  highlights: string[]
  labelAsset: string
}

export const vinylTracks: VinylTrack[] = [
  {
    id: 'about',
    title: 'About Me',
    blurb: 'Who I am and what drives me.',
    description:
      'I build thoughtful digital products with a blend of design sensibility, engineering craft, and product strategy.',
    highlights: [
      'Cross-functional collaborator across product, design, and engineering',
      'Focused on UX clarity, quality, and performance',
      'Open to impactful roles and mission-aligned teams',
    ],
    labelAsset: '/assets/labels/about2.svg',
  },
  {
    id: 'projects',
    title: 'Selected Projects',
    blurb: 'Work I am proud to ship.',
    description:
      'From interactive web experiences to product features, each project emphasizes measurable user impact and durable implementation.',
    highlights: [
      'End-to-end ownership from discovery to release',
      'Attention to accessibility and maintainability',
      'Strong visual polish and interaction quality',
    ],
    labelAsset: '/assets/labels/projects2.svg',
  },
  {
    id: 'experience',
    title: 'Experience',
    blurb: 'Roles, growth, and outcomes.',
    description:
      'I have worked across startup and team environments, helping products move from idea to polished release with reliable execution.',
    highlights: [
      'Shipped high-value user-facing experiences',
      'Partnered deeply with design and analytics',
      'Built reusable systems to improve team velocity',
    ],
    labelAsset: '/assets/labels/experience2.svg',
  },
  {
    id: 'contact',
    title: 'Contact',
    blurb: 'Let us build together.',
    description:
      'If you are building something meaningful and need a thoughtful contributor, I would love to connect.',
    highlights: [
      'Email: hello@example.com',
      'GitHub and LinkedIn links',
      'Open to freelance and full-time opportunities',
    ],
    labelAsset: '/assets/labels/contact2.svg',
  },
]
