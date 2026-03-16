// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
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
