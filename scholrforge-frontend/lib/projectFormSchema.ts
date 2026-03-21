import { z } from 'zod'

// ─── Enums (mirror Spring Boot enums exactly) ─────────────────────────────────

export const PROJECT_TYPES = [
  'WEB_APP',
  'MOBILE_APP',
  'CLI_TOOL',
  'LIBRARY',
  'API',
  'DATA_SCIENCE',
  'GAME',
  'OTHER',
] as const

export const DIFFICULTY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  // ── Step 1 ──
  projectType: z.enum(PROJECT_TYPES, {
    required_error: 'Please select a project type.',
  }),

  // ── Step 2 ──
  projectTitle: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .max(150, 'Title must be 150 characters or fewer.'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(2000, 'Description must be 2000 characters or fewer.'),

  difficultyLevel: z.enum(DIFFICULTY_LEVELS, {
    required_error: 'Please select a difficulty level.',
  }),

  // ── Step 3 ──
  techStackIds: z.array(z.string().uuid()).default([]),
  newTechStackNames: z.array(z.string().min(1)).default([]),

  // ── Step 4 ──
  tagIds: z.array(z.string().uuid()).default([]),
  newTagNames: z.array(z.string().min(1)).default([]),

  // ── Step 5 ──
  zipFile: z
    .instanceof(typeof window !== 'undefined' ? File : Object as unknown as typeof File)
    .refine((f) => f instanceof File, { message: 'A project ZIP file is required.' })
    .refine((f) => f.name.endsWith('.zip'), { message: 'File must be a .zip archive.' })
    .refine((f) => f.size <= 200 * 1024 * 1024, { message: 'ZIP must be 200 MB or smaller.' }),

  mediaFiles: z
    .array(z.instanceof(typeof window !== 'undefined' ? File : Object as unknown as typeof File))
    .max(6, 'You can upload up to 6 screenshots.')
    .default([]),

  // ── Step 6 ──
  githubUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^(https?:\/\/)?(www\.)?github\.com\/.+/.test(v),
      { message: 'Must be a valid GitHub URL.' },
    ),

  demoVideoUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      { message: 'Must be a valid URL starting with http(s)://.' },
    ),

  license: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectFormValues = z.infer<typeof projectSchema>

// ─── Default values ───────────────────────────────────────────────────────────

export const defaultValues: Partial<ProjectFormValues> = {
  techStackIds:     [],
  newTechStackNames: [],
  tagIds:           [],
  newTagNames:      [],
  mediaFiles:       [],
  githubUrl:        '',
  demoVideoUrl:     '',
  license:          '',
}

// ─── Submit ───────────────────────────────────────────────────────────────────

interface SubmitSuccess {
  slug: string
  id:   string | number
  [key: string]: unknown
}

/**
 * Builds a flat multipart/form-data body matching Spring Boot's
 * @ModelAttribute CreateProjectRequest record, then POSTs to /api/projects.
 *
 * Repeated keys (tagIds, newTagNames, techStackIds, newTechStackNames) are
 * appended once per value so Spring Boot binds them as Set<UUID>/Set<String>.
 *
 * Throws on non-2xx responses so the wizard's catch block can handle errors.
 */
export async function submitProject(values: ProjectFormValues): Promise<SubmitSuccess> {
  if (!values.zipFile) {
    throw Object.assign(new Error('A project ZIP file is required.'), { response: { status: 400 } })
  }

  const fd = new FormData()

  // ── Single-value scalars ──────────────────────────────────────────────────
  fd.append('projectTitle',    values.projectTitle)
  fd.append('description',     values.description)
  fd.append('projectType',     values.projectType)
  fd.append('difficultyLevel', values.difficultyLevel)

  if (values.githubUrl?.trim())    fd.append('githubUrl',    values.githubUrl.trim())
  if (values.demoVideoUrl?.trim()) fd.append('demoVideoUrl', values.demoVideoUrl.trim())

  // ── Repeated keys → Set<UUID> / Set<String> on backend ───────────────────
  for (const id   of values.techStackIds     ?? []) fd.append('techStackIds',      id)
  for (const name of values.newTechStackNames ?? []) fd.append('newTechStackNames', name)
  for (const id   of values.tagIds           ?? []) fd.append('tagIds',            id)
  for (const name of values.newTagNames      ?? []) fd.append('newTagNames',       name)

  // ── Files ─────────────────────────────────────────────────────────────────
  // ⚠️  Do NOT set Content-Type — browser injects it with the correct boundary
  fd.append('zipFile', values.zipFile, values.zipFile.name)

  for (const file of values.mediaFiles ?? []) {
    fd.append('mediaFiles', file, file.name)
  }

  // ── POST to Next.js route handler ─────────────────────────────────────────
  const res = await fetch('/api/projects', { method: 'POST', body: fd })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const err  = Object.assign(
      new Error(body?.error ?? `Request failed (${res.status})`),
      { response: { status: res.status }, detail: body?.detail },
    )
    throw err
  }

  const json = await res.json()
  // Spring Boot response is wrapped by the Next.js handler as { success, data }
  return (json?.data ?? json) as SubmitSuccess
}