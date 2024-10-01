import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setUserCache = (user, value) => {
    if (value) {
        cache.set(`user-${user}`, value)
    } else {
        cache.del(`user-${user}`)
    }
}

export const getUserCache = (req, res, next) => {
    const user = cache.get(`user-${req.character.id}`)

    if (user && typeof user === 'object') {
        return res.json({ status: true, user: user })
    }

    next()
}