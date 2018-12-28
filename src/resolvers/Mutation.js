require('dotenv').config()
import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPass from '../utils/hashPass'
import { duplicateArgMessage } from 'graphql/validation/rules/UniqueArgumentNames'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPass(args.data.password)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },

    async loginUser(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: { email: args.data.email }
        })

        if (!user) {
            throw new Error('Unable to login.')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login.')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.deleteUser(
            {
                where: {
                    id: userId
                }
            },
            info
        )
    },

    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPass(args.data.password)
        }
        return prisma.mutation.updateUser(
            {
                where: {
                    id: userId
                },
                data: args.data
            },
            info
        )
    },

    async createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createPost(
            {
                data: {
                    title: args.data.title,
                    body: args.data.body,
                    published: args.data.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        )
    },

    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Operation failed.')
        }
        return prisma.mutation.deletePost(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    },

    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        const postPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if (!postExists) {
            throw new Error('Operation failed.')
        }

        if (!postPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        return prisma.mutation.updatePost(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        )
    },

    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if (!postExists) {
            throw new Error('Unable to find post.')
        }
        return prisma.mutation.createComment(
            {
                data: {
                    text: args.data.text,
                    post: {
                        connect: {
                            id: args.data.post
                        }
                    },
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        )
    },

    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Operation failed.')
        }
        return prisma.mutation.deleteComment(
            {
                where: {
                    id: args.id
                }
            },
            info
        )
    },

    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Operation failed.')
        }

        return prisma.mutation.updateComment(
            {
                where: {
                    id: args.id
                },
                data: args.data
            },
            info
        )
    }
}

export { Mutation as default }
