import { auth, currentUser } from '@clerk/nextjs/server'
import { Liveblocks } from '@liveblocks/node'
import { ConvexHttpClient } from 'convex/browser'
import { NextRequest, NextResponse } from 'next/server'
import { api } from '../../../../convex/_generated/api'

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})
const address = process.env.NEXT_PUBLIC_CONVEX_URL!
// Convex: fecth documents through HTTPS
const convex = new ConvexHttpClient(address)

export async function POST(request: NextRequest) {
  //Clerk: getSession and organizationId (set in website)
  const { sessionClaims, orgId } = await auth()
  if (!sessionClaims) {
    return new NextResponse('Session Unauthorized', { status: 401 })
  }

  // Clerk: get currentUser
  const user = await currentUser()
  if (!user) {
    return new NextResponse('User Not Found', { status: 401 })
  }

  // Liveblocks: request from liveblocksprovider
  const { room } = await request.json()

  // Convex: get user document through ConvexHTTPClient
  const document = await convex.query(api.documents.getbyId, { id: room })
  if (!document) {
    return new NextResponse('Document not Found', { status: 401 })
  }

  const isOwner = document.ownerId === user.id
  // Session 可能会返回undefined -> 一直为false
  const isOrganizationMember = document.organizationId === orgId

  if (!isOwner && !isOrganizationMember) {
    return new NextResponse('Not onwer or organization member', { status: 401 })
  }

  // add unique color based on name
  const name = user.fullName ?? 'Anonymos '
  const nameToNumber = name.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0)
  const hue = Math.abs(nameToNumber) % 360
  const color = `hsl(${hue},80%,60%)`

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.imageUrl,
      color,
    },
  })

  session.allow(room, session.FULL_ACCESS)

  const { body, status } = await session.authorize()
  return new NextResponse(body, { status })
}
