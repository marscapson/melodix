import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setWalletsCache = (user, value) => {
    if (value) {
        cache.set(`wallets-${user}`, value)
    } else {
        cache.del(`wallets-${user}`)
    }
}

export const getWalletsCache = (req, res, next) => {
    const wallets = cache.get(`wallets-${req.character.id}`)

    if (wallets && typeof wallets === 'object') {
        return res.json({ status: true, wallets: wallets })
    }

    next()
}