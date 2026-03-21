import { NextRequest } from 'next/server'
import { handleUploadProjectFile } from '@/lib/route-handlers'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params   // Next.js 15 — params is a Promise
    return handleUploadProjectFile(req, id)
}