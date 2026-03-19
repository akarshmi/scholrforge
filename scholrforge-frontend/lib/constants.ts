export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const SESSION_COOKIE = 'scholrforge_session'

export const ROUTES = {
  login: '/login',
  feed: '/feed',
  forbidden: '/403',
  protected: ['/feed', '/dashboard', '/profile', '/admin'],
  authOnly: ['/login', '/register'],
} as const


export const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
]

export const SEMESTERS = [
  'Fall 2024',
  'Spring 2025',
  'Summer 2025',
  'Fall 2023',
  'Spring 2024',
  'Summer 2024',
]

export const TECH_STACKS = {
  LANGUAGES: [
    { name: 'JavaScript', category: 'Language' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Python', category: 'Language' },
    { name: 'Java', category: 'Language' },
    { name: 'C++', category: 'Language' },
    { name: 'Go', category: 'Language' },
    { name: 'Rust', category: 'Language' },
  ],
  FRAMEWORKS: [
    { name: 'React', category: 'Framework' },
    { name: 'Vue', category: 'Framework' },
    { name: 'Angular', category: 'Framework' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'Svelte', category: 'Framework' },
    { name: 'Django', category: 'Framework' },
    { name: 'Flask', category: 'Framework' },
    { name: 'FastAPI', category: 'Framework' },
    { name: 'Spring Boot', category: 'Framework' },
    { name: 'Express.js', category: 'Framework' },
  ],
  DATABASES: [
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'Firebase', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'SQLite', category: 'Database' },
  ],
}
