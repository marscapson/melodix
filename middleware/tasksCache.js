import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 30 })

export const setTasksCache = (value) => {
    if (value) {
        cache.set(`tasks`, value)
    } else {
        cache.del(`tasks`)
    }
}

export const getTasksCache = (req, res, next) => {
    const tasks = cache.get("tasks")

    if (tasks && typeof tasks === 'object') {
        return res.json({ status: true, tasks: tasks })
    }

    next()
}