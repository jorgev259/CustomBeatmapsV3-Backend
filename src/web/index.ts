import { readFileSync } from 'node:fs'
import { getUserInfo, registerNewUser, registerScoreUserId } from '../db'
import { runUserServer } from './user-server'

// TODO: Add config schema parsing and typing
const startUserServer =  (config: Record<string, string>)=>
  runUserServer({
    getUserInfoFromUniqueId: getUserInfo,
    createNewUser: registerNewUser,
    postHighScore: (submission) =>
      registerScoreUserId(submission.beatmapKey, submission.uniqueUserId, {
        score: submission.score,
        accuracy: submission.accuracy,
        fc: submission.fc
      }),
    config: config
  })

export default startUserServer


