// dependencies and packages
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import express from "express"
import { Telegraf } from "telegraf"
import url from "url"

// models
import users from "../models/users.js"
import tasks from "../models/tasks.js"
import records from "../models/records.js"
import farms from "../models/farms.js"
import wallets from "../models/wallets.js"

// middlewares
import { userAuth } from "../middleware/auth.js"
import { rateLimiter } from "../middleware/rateLimiter.js"

// caching
import { setUserCache, getUserCache } from "../middleware/usersCache.js"
import { setFarmCache, getFarmCache } from "../middleware/farmsCache.js"
// import { setTasksCache, getTasksCache } from "../middleware/tasksCache.js"
import { setWalletsCache, getWalletsCache } from "../middleware/walletsCache.js"
import { setFriendsCache, getFriendsCache } from "../middleware/friendsCache.js"
import { setRecordsCache, getRecordsCache } from "../middleware/recordsCache.js"

import qubic from "../wallets/qubic.js"
import ton from "../wallets/ton.js"

const router = express.Router()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

dotenv.config()

// FUNCTION TO SHARE THE REWARDS WITH FRIENDS
const rewardFriends = async (friendId, coins, isReferal) => {
    // find friend
    const user = await users.findById(friendId)

    // check if friend is exist
    if (user) {
        // share awards
        if (isReferal) {
            user.friends += 1
        }
        user.coinsByFriends += (coins * 0.1)
        user.coins += (coins * 0.1)

        // save updated friend
        const userFilter = { _id: user._id }
        
        await users.updateOne(userFilter, user)

        // check if friend has parent friend
        if (user.invitedBy) {
            // find parent friend
            const parent = await users.findById(user.invitedBy)
    
            // check if parent exist
            if (parent) {

                // update income
                parent.coinsByFriends += (coins * 0.025)
                parent.coins += (coins * 0.025)
        
                // save updated parent friend
                const parentFilter = { _id: parent._id }
                
                await users.updateOne(parentFilter, parent)
            }
        }
    }
}


// GET MELODIX TOKEN
router.get('/token/:initData', async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== GET /user/token STARTED ========================")

        const initData = req.params.initData
        console.log("initData received")

        const decoded = new URLSearchParams(initData).get('user')
        console.log("initData decoded")

        const json = JSON.parse(decoded)
        console.log("initData parsed to json")

        console.log("Starting to search User")
        const user = await users.findOne({ tgUserId: json.id })

        if (user) {
        console.log("User found and looks as following -----------------------------------")
        console.log(user)
        console.log("---------------------------------------------------------------------")

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_USER_AUTH
            )
        console.log("JWT token generated")
            
            res.json({ success: true, token: token })
        console.log("JWT token successfully sent")
        } else {
        console.log("User not found")
        console.log("Decoded initData looks as following ---------------------------------")
        console.log(json)
        console.log("---------------------------------------------------------------------")

            res.json({ success: false, error: 'There is no such user!' })
        console.log("Message successfully sent")
        }
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET MELODIX TOKEN
router.post('/token', async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== GET /user/token STARTED ========================")
        const { initData } = req.body
        console.log("initData received")

        const decoded = new URLSearchParams(initData).get('user')
        console.log("initData decoded")

        const json = JSON.parse(decoded)
        console.log("initData parsed to json")

        console.log("Starting to search User")
        const user = await users.findOne({ tgUserId: json.id })

        if (user) {
        console.log("User found and looks as following -----------------------------------")
        console.log(user)
        console.log("---------------------------------------------------------------------")

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_USER_AUTH
            )
        console.log("JWT token generated")
            
            res.json({ success: true, token: token })
        console.log("JWT token successfully sent")
        } else {
        console.log("User not found")
        console.log("Decoded initData looks as following ---------------------------------")
        console.log(json)
        console.log("---------------------------------------------------------------------")

            res.json({ success: false, error: 'There is no such user!' })
        console.log("Message successfully sent")
        }
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

/** ---------- ALL GETTERS ---------- */
// GET USER DATA
router.get("/", userAuth, getUserCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("======================= GET /user STARTED ===========================")
        // find user
        console.log(`User id = ${req.character.id}`)
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist
        if (!user) {
            console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")
        
        // add to cache
        setUserCache(req.character.id, user)
        console.log("User added into cache")
        
        // send respond
        res.json({ status: true, user: user })
        console.log("User successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET USER DATA
router.get("/info", userAuth, getUserCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("===================== GET /user/info STARTED ========================")
        // find user
        console.log(`User id = ${req.character.id}`)
        const user = await users.findById(req.character.id)

        // check if user exist
        if (!user) {
            console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")
        
        // add to cache
        setUserCache(req.character.id, user)
        console.log("User added into cache")
        
        // send respond
        res.json({ status: true, user: user })
        console.log("User successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET LIST OF TASKS
router.get("/tasks", /* getTasksCache, */ async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("===================== GET /user/tasks STARTED =======================")
        // find tasks
        const list = await tasks.find({ status: "active" })
        console.log("Active task list found")

        // add to cache
        // setTasksCache(list)
        // console.log("Task list added into cache")

        // send respond
        res.json({ status: true, tasks: list })
        console.log("Task list successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET LIST OF WALLETS
router.get("/wallets", userAuth, getWalletsCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== GET /user/wallets STARTED ======================")
        // find wallets of user
        console.log(`User id = ${req.character.id}`)
        const list = await wallets.find({ userId: req.character.id })
        console.log("Wallet list found")

        // add to cache
        setWalletsCache(req.character.id, list)
        console.log("Wallet list added into cache")

        // send respond
        res.json({ status: true, wallets: list })
        console.log("Wallet list successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET LIST OF RCORDED TASKS
router.get("/records", userAuth, getRecordsCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("================== GET /user/records STARTED =====================")
        // find list of recorded tasks
        console.log(`User id = ${req.character.id}`)
        const list = await records.find({ userId: req.character.id })
        console.log("Recorded task list found")

        // add to cache
        setRecordsCache(req.character.id, list)
        console.log("Recorded task list added into cache")
        
        // send respond
        res.json({ status: true, records: list })
        console.log("Recorded task list successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET USER'S FARM
router.get("/farm", userAuth, getFarmCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("===================== GET /user/farm STARTED ========================")
        // find farm
        console.log(`User id = ${req.character.id}`)
        const farm = await farms.findOne({ userId: req.character.id })
        console.log("User farm found")

        // set to cache
        setFarmCache(req.character.id, farm)
        console.log("User farm added into cache")

        // send respond
        res.json({ status: true, farm: farm })
        console.log("User farm successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET ALL FRIENDS
router.get("/friends", userAuth, getFriendsCache, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== GET /user/firends STARTED ======================")
        // find friends
        console.log(`User id = ${req.character.id}`)
        const friends = await users.find({ invitedBy: req.character.id })
        console.log("Friend list found")

        // add to cache
        setFriendsCache(req.character.id, friends)
        console.log("Friend list added into cache")

        // send respond
        res.json({ status: true, friends: friends })
        console.log("Friend list successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// GET ALL REFERAL LINK
router.get("/referal", userAuth, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== GET /user/referal STARTED ======================")
        // find friends
        console.log(`User id = ${req.character.id}`)
        const friends = await users.find({ invitedBy: req.character.id })
        console.log("Friend list found")

        // check limit
        if (friends.length >= parseInt(process.env.INVITE_LIMIT)) {
        console.log("Friend list limit has reached")
            return res.status(400).json({ status: false, message: "Referal limit has been reached!" })
        }
        console.log("Friend list limit checked")

        // send respond
        res.json({ status: true, referal: `https://t.me/melodix_mvp_bot?start=${req.character.id}` })
        console.log("Friend list successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})
/** ---------- END GETTERS ---------- */

// UPDATE FARM
router.put("/farm", userAuth, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("====================== PUT /user/farm STARTED =======================")
        // find user to increase points
        console.log(`User id = ${req.character.id}`)
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist and not banned
        if (!user || user.status !== 'active') {
        console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")

        // find farm to update date and time
        const farm = await farms.findOne({ userId: req.character.id })
        console.log("User farm found")
        
        // check if farm exists
        if (!farm) {
        console.log("User farm didn't pass the checking")
            return res.status(400).json({ status: false, message: "Task does not exist!" })
        }
        console.log("User farm passed the checking")

        // define UTC time
        const currentDate = new Date()
        const utcYear = currentDate.getUTCFullYear()
        const utcMonth = currentDate.getUTCMonth() + 1
        const utcDay = currentDate.getUTCDate()
        const utcHours = currentDate.getUTCHours()
        const utcMinutes = currentDate.getUTCMinutes()
        const utcSeconds = currentDate.getUTCSeconds()
        const utcDateTime = `${utcYear}-${utcMonth.toString().padStart(2, '0')}-${utcDay.toString().padStart(2, '0')}T${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}Z`

        // define times to check the difference
        const updateDifference = new Date(utcDateTime).getTime() - new Date(farm.updateTime).getTime()
        const millisecondsToEightHours = (1000 * 60 * 60 * 8)
        console.log("UTC time checkers created")

        // check the difference
        if (updateDifference < millisecondsToEightHours) {
        console.log("Time checker didn't passed")
            return res.status(200).json({ status: false, message: "Eight hours is not passed yet!" }) 
        }
        console.log("Time checker passed")

        // get awards
        user.coins +=  farm.reward
        
        // save updated user
        const userFilter = { _id: user._id }
        
        await users.updateOne(userFilter, user)
        console.log("User updated")
        
        // check if user has friend and increase parents
        if (user.invitedBy) {
            console.log("Start reward friends")
            await rewardFriends(user.invitedBy, farm.reward, false)
        }

        // update last update time
        farm.updateTime = utcDateTime

        // save updated farm
        const farmFilter = { _id: farm._id }
        
        await farms.updateOne(farmFilter, farm)
        console.log("Farm updated")

        // clear user cache
        setUserCache(req.character.id, undefined)

        // clear farm cache
        setFarmCache(req.character.id, undefined)

        console.log("User and Farm caches updated")

        // send updated farm and updated user
        res.json({ status: true, message: "Successfully updated!" })
        console.log("Response successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})



// Subscription checker
const checkTelegramSubscription = async (channel, user) => {
    try {
        const chatMember = await bot.telegram.getChatMember(channel, user)
        
        if (['member', 'administrator', 'creator'].includes(chatMember.status)) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Error checking channel membership:', error)
        return false
    }
}

// ADD RECORD
router.post("/record", userAuth, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== POST /user/record STARTED ======================")
        console.log(`User id = ${req.character.id}`)
        // receive task id
        const { taskId } = req.body
        console.log(`Task id = ${taskId}`)

        // find user
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist and not banned
        if (!user || user.status !== 'active') {
        console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")

        // find task
        const task = await tasks.findById(taskId)
        console.log("Task found")

        // check if task exists
        if (!task) {
        console.log("Task didn't pass the checking")
            return res.status(400).json({ status: false, message: "Task does not exist!" })
        }
        console.log("Task passed the checking")
        
        // check task status
        if (task.status !== 'active') {
        console.log("Task didn't pass the status checking")
            return res.status(400).json({ status: false, message: "This task expired!" })
        }
        console.log("Task passed the status checking")

        // find from records
        const isExist = await records.findOne({ taskId: taskId, userId: req.character.id })
        console.log("Checking if already recorded")
        
        // check if already recorded
        if (isExist) {
        console.log("Task already recorded")
            return res.status(400).json({ status: false, message: "You already recorded!" })
        }
        console.log("Task passed the recorded checking")

        // define UTC time for record time
        const currentDate = new Date()
        const utcYear = currentDate.getUTCFullYear()
        const utcMonth = currentDate.getUTCMonth() + 1
        const utcDay = currentDate.getUTCDate()
        const utcHours = currentDate.getUTCHours()
        const utcMinutes = currentDate.getUTCMinutes()
        const utcSeconds = currentDate.getUTCSeconds()
        const utcDateTime = `${utcYear}-${utcMonth.toString().padStart(2, '0')}-${utcDay.toString().padStart(2, '0')}T${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}Z`
        console.log("Create UTC time")

        // create new task record
        const record = new records({
            taskId: taskId,
            userId: req.character.id,
            status: "loading",
            dateTime: utcDateTime
        })
        console.log("Record for task created")
        
        // save record task
        await record.save()
        console.log("Task record saved")

        // clear record cache
        setRecordsCache(req.character.id, undefined)
        console.log("Records cache updated")

        // send respond
        res.json({ status: true, message: "Successfully recorded!" })
        console.log("Response successully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// CHANGE RECORD STATUS
router.post("/check", userAuth, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("===================== POST /user/check STARTED ======================")
        console.log(`User id = ${req.character.id}`)
        // receive task id
        const { recordId } = req.body
        console.log(`Record id = ${recordId}`)

        // find user
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist and not banned
        if (!user || user.status !== 'active') {
        console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")

        // find record
        const record = await records.findById(recordId)
        console.log("Record found")

        // check if record exists
        if (!record) {
        console.log("Record didn't pass the checking")
            return res.status(400).json({ status: false, message: "Record doesn't exist!" })
        }
        console.log("Record passed the checking")

        // find task
        const task = await tasks.findById(record.taskId)
        console.log("Task found")

        // check if task exists
        if (!task) {
        console.log("Task didn't pass the checking")
            return res.status(400).json({ status: false, message: "Task does not exist!" })
        }
        console.log("Task passed the checking")

        // check telegram subscriptions
        if (task.type === "tg_subs") {
            const parsedUrl = url.parse(task.link)
            const channelUsername = parsedUrl.pathname.split('/')[1]
            const isSubs = await checkTelegramSubscription(`@${channelUsername}`, user.tgUserId)
            if (!isSubs) {
        console.log("User didn't subscribed yet")
        
                await records.deleteOne(record)
        console.log("Record deleted")

                setRecordsCache(req.character.id, undefined)
        console.log("Records cache updated")

                return res.status(400).json({ status: false, message: "You didn't subscribed yet!" })
            }
        console.log("Task passed the telegram subscription checking")
        }

        // define UTC time for record time
        const currentDate = new Date()
        const utcYear = currentDate.getUTCFullYear()
        const utcMonth = currentDate.getUTCMonth() + 1
        const utcDay = currentDate.getUTCDate()
        const utcHours = currentDate.getUTCHours()
        const utcMinutes = currentDate.getUTCMinutes()
        const utcSeconds = currentDate.getUTCSeconds()
        const utcDateTime = `${utcYear}-${utcMonth.toString().padStart(2, '0')}-${utcDay.toString().padStart(2, '0')}T${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}Z`
        console.log("Create UTC time")

        // update task records status
        const recordFilter = { _id: record._id }

        record.status = "completed"

        await records.updateOne(recordFilter, record)
        console.log("Completed task record saved")

        // give an award
        user.coins += task.reward

        // save updates user
        const userFilter = { _id: user._id }
        
        await users.updateOne(userFilter, user)
        console.log("User updated")

        // check if user has friend and increase parents
        if (user.invitedBy) {
            console.log("Start reward friends")
            await rewardFriends(user.invitedBy, task.reward, false)
        }

        // clear user cache
        setUserCache(req.character.id, undefined)

        // clear record cache
        setRecordsCache(req.character.id, undefined)
        console.log("User and Records cache updated")

        // send respond
        res.json({ status: true, message: "Successfully completed!" })
        console.log("Response successully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// ADD WALLET
router.post("/wallet", userAuth, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("===================== POST /user/wallet STARTED =====================")
        console.log(`User id = ${req.character.id}`)
        // receive wallet
        const { wallet, service } = req.body
        console.log(`wallet = ${wallet}`)
        console.log(`service = ${service}`)

        // find user
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist and not banned
        if (!user || user.status !== 'active') {
        console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")

        // find wallets
        const current = await wallets.findOne({ userId: req.character.id, service: service })
        console.log("User wallet list found")

        // check if wallet exists
        if (current) {
            return res.status(400).json({ status: false, message: `Wallet in your ${ service } already exist!` })
        }
        console.log("User wallet list checked")

        // check if wallet exists
        if (service === "qubic") {
            const isExist = await qubic.isExist(wallet)
            if (!isExist) return res.status(400).json({ status: false, message: "This Qubic wallet is not exist!" })
        } else if (service === "ton") {
            const isExist = await ton.isExist(wallet)
            if (!isExist) return res.status(400).json({ status: false, message: "This Qubic wallet is not exist!" }) // edit
        } else {
            return res.status(400).json({ status: false, message: "This wallet can't be added!" })
        }
        console.log("Wallet validity checked")

        // define UTC time for creating wallet time
        const currentDate = new Date()
        const utcYear = currentDate.getUTCFullYear()
        const utcMonth = currentDate.getUTCMonth() + 1
        const utcDay = currentDate.getUTCDate()
        const utcHours = currentDate.getUTCHours()
        const utcMinutes = currentDate.getUTCMinutes()
        const utcSeconds = currentDate.getUTCSeconds()
        const utcDateTime = `${utcYear}-${utcMonth.toString().padStart(2, '0')}-${utcDay.toString().padStart(2, '0')}T${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}Z`
        console.log("UTC time created")
        
        // create new wallet
        const newWallet = new wallets({
            userId: req.character.id,
            wallet: wallet,
            service: service,
            dateTime: utcDateTime
        })
        console.log("Wallet created")
        
        // save wallet
        await newWallet.save()
        console.log("Wallet saved")

        // clear wallets cache
        setWalletsCache(req.character.id, undefined)
        console.log("Wallet cache updated")

        // respod to user
        res.json({ status: true, message: "Successfully added!" })
        console.log("Response successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

// ADD POINTS
router.put("/points", userAuth, rateLimiter, async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("==================== PUT /user/points STARTED =======================")
        console.log(`User id = ${req.character.id}`)
        // receive points
        const { points } = req.body
        console.log(`points = ${points}`)

        // check the amount of points
        if (parseFloat(points) > 5000) {
        console.log("Points didn't pass the checking")
            return res.status(400).json({ status: false, message: "Abnormal amount of points!" })
        }
        console.log("Points passed the checking")

        // find user
        const user = await users.findById(req.character.id)
        console.log("User found")

        // check if user exist and not banned
        if (!user || user.status !== 'active') {
        console.log("User didn't pass the checking")
            return res.status(400).json({ status: false, message: "User does not exist!" })
        }
        console.log("User passed the checking")

        // increase coins
        user.coins += points

        // save user
        const userFilter = { _id: user._id }
        
        await users.updateOne(userFilter, user)
        console.log("User updated")

        // clear user cache
        setUserCache(req.character.id, undefined)
        console.log("User cache updated")

        // send respond
        res.json({ status: true, message: "Successfully added!" })
        console.log("Response successfully sent")
    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

router.delete("/clear-all", async (req, res) => {
    try {///////////////////////////////////////////////////////////////////////////////////
        console.log("======================= DELETE ALL IN DATABASE ======================")
        
        await users.deleteMany({})
        await records.deleteMany({})
        await farms.deleteMany({})
        await wallets.deleteMany({})
    
        res.json({ status: true, message: "Successfully deleted!" })

    } catch (e) {
        console.log("!!!!!!!!!!!!!!!!!!!!! Abnormal error catched !!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(e)
        res.status(500).json({ status: false, message: "Something went wrong, please try it againg!", error: e.message })
    }
})

export default router