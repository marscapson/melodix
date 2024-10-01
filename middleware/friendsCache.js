import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setFriendsCache = (user, value) => {
    if (value) {
        cache.set(`friends-${user}`, value)
    } else {
        cache.del(`friends-${user}`)
    }
}

export const getFriendsCache = (req, res, next) => {
    const friends = cache.get(`friends-${req.character.id}`)

    if (friends && typeof friends === 'object') {
        return res.json({ status: true, friends: friends })
    }

    next()
}