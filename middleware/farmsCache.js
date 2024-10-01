import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setFarmCache = (user, value) => {
    if (value) {
        cache.set(`farm-${user}`, value)
    } else {
        cache.del(`farm-${user}`)
    }
}

export const getFarmCache = (req, res, next) => {
    const farm = cache.get(`farm-${req.character.id}`)

    if (farm && typeof farm === 'object') {
        return res.json({ status: true, farm: farm })
    }

    next()
}