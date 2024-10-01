import NodeCache from 'node-cache'
import users from "../models/users.js"

const cache = new NodeCache({ stdTTL: 60 })

export const rateLimiter = async (req, res, next) => {
    const user = req.character.id

    // check if first attempt exist
    if (cache.has(`${user}-1`) || cache.has(`${user}-2`) || cache.has(`${user}-3`) || cache.has(`${user}-4`)) {

        // check if second attempt exist
        if (cache.has(`${user}-2`) || cache.has(`${user}-3`) || cache.has(`${user}-4`)) {

            // check if third attempt exist
            if (cache.has(`${user}-3`) || cache.has(`${user}-4`)) {

                // check if forth attempt exist
                if (cache.has(`${user}-4`)) {
                    // ban the user
                    const banningUser = await users.findById(req.character.id)
                    banningUser.status = 'banned'
                    const userFilter = { _id: banningUser._id }
                    await users.updateOne(userFilter, banningUser)
                    
                    return res.status(429).json({ message: 'Your account banned.' })
                } else {
                    cache.set(`${user}-4`, true)
                    return res.status(429).json({ message: 'Your account will be banned.' })
                }
    
            } else {
                cache.set(`${user}-3`, true)
                return res.status(429).json({ message: 'Please avoid unusual behavior.' })
            }

        } else {
            cache.set(`${user}-2`, true)
            return res.status(429).json({ message: 'Too many requests. Try again later.' })
        }

    } else {
        cache.set(`${user}-1`, true)
    }

    next()
}