import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()), // optional if blank document
    ownerId: v.string(),
    roomId: v.optional(v.string()), // only needed for collaboration
    organizationId: v.optional(v.string()), // together with roomId to authenticate
  })
    .index('by_onwerId', ['ownerId'])
    .index('by_organizationId', ['organizationId'])
    .searchIndex('search_title', { searchField: 'title', filterFields: ['ownerId', 'organizationId'] }),
})
