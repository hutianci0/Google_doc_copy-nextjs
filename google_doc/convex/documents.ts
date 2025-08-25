import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: { title: v.optional(v.string()), initialContent: v.optional(v.string()) },

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()

    if (user === null) {
      throw new ConvexError('Unauthorized')
    }

    // personal 和 organization 的JWT token 不一样. 切换到organization需要刷新页面和token(OrgnaizationSwitcher component)
    const organizationId = (user.organization_id || undefined) as string | undefined

    return await ctx.db.insert('documents', {
      title: args.title ?? 'Untitled',
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
    })
  },
})

// paginated query + optioanl textSearch
export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { paginationOpts, search }) => {
    // protection
    const user = await ctx.auth.getUserIdentity()

    if (user === null) {
      throw new ConvexError('Unauthorized')
    }

    const organizationId = (user.organization_id || undefined) as string | undefined

    // full text search in organization
    if (search && organizationId) {
      return await ctx.db
        .query('documents')
        .withSearchIndex('search_title', (q) => q.search('title', search).eq('organizationId', organizationId))
        .paginate(paginationOpts)
    }
    // full text search in personal
    if (search) {
      return await ctx.db
        .query('documents')
        .withSearchIndex('search_title', (q) => q.search('title', search).eq('ownerId', user.subject))
        .paginate(paginationOpts)
    }

    // query all documents in organization
    if (organizationId) {
      return await ctx.db
        .query('documents')
        .withIndex('by_organizationId', (q) => q.eq('organizationId', organizationId))
        .order('asc')
        .paginate(paginationOpts)
    }

    //Defalut:  query all user's documents
    return await ctx.db
      .query('documents')
      .withIndex('by_onwerId', (q) => q.eq('ownerId', user.subject))
      .order('asc')
      .paginate(paginationOpts)
  },
})

export const deleteById = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) {
      throw new ConvexError('User not found')
    }

    const document = await ctx.db.get(args.id)
    if (!document) {
      throw new ConvexError('DOCUMENT_NOT_FOUND')
    }

    if (document.ownerId !== user.subject) {
      throw new ConvexError('NOT_AUTHORIZED')
    }

    return await ctx.db.delete(args.id)
  },
})

// update title or content

export const UpdateTitleById = mutation({
  args: { id: v.id('documents'), title: v.string() },
  handler: async (ctx, args) => {
    // check user exits
    const user = await ctx.auth.getUserIdentity()
    if (user === null) {
      throw new ConvexError('Unauthorized')
    }
    // check document exists
    const documents = await ctx.db.get(args.id)
    if (!documents) {
      throw new ConvexError('Document not found')
    }

    // check if is in organization
    const organization_id = user.organization_id
    const isOrganizationMember = organization_id === documents.organizationId
    const isOwner = documents.ownerId === user.subject
    // check if is onwer
    if (!isOrganizationMember && !isOwner) {
      throw new ConvexError('Unauthorized')
    }
    await ctx.db.patch(args.id, { title: args.title })
  },
})

// getDocumentById
export const getbyId = query({
  args: { id: v.id('documents') },
  handler: async (ctx, { id }) => {
    // error handling in other functions
    return await ctx.db.get(id)
  },
})

// get a list of documents from Ids
export const getDocumentsByIds = query({
  args: { ids: v.array(v.id('documents')) },
  handler: async (ctx, { ids }) => {
    const documents = []
    for (const id of ids) {
      const document = await ctx.db.get(id)
      if (document) {
        documents.push({ id: document._id, name: document.title })
      } else {
        documents.push({ id: id, name: 'Removed' })
      }
    }
    return documents
  },
})
