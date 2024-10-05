import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setRecordsCache = (user, value) => {
    if (value) {
        cache.set(`records-${user}`, value)
    } else {
        cache.del(`records-${user}`)
    }
}

export const getRecordsCache = (req, res, next) => {
    const records = cache.get(`records-${req.character.id}`)

    if (records && typeof records === 'object') {
        return res.json({ status: true, records: records })
    }

    next()
}