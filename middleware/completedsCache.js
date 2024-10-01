import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setCompletedsCache = (user, value) => {
    if (value) {
        cache.set(`completeds-${user}`, value)
    } else {
        cache.del(`completeds-${user}`)
    }
}

export const getCompletedsCache = (req, res, next) => {
    const completeds = cache.get(`completeds-${req.character.id}`)

    if (completeds && typeof completeds === 'object') {
        return res.json({ status: true, completeds: completeds })
    }

    next()
}