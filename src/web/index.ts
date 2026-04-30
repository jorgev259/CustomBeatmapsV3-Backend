import { getUserInfo, registerNewUser, registerScoreUserId } from '../db'
import { runUserServer } from './user-server'
import { IConfig } from '../types'

const startUserServer = (config: IConfig) =>
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
