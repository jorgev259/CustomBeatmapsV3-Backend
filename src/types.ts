import { ActivityType } from 'discord.js'

export interface IBeatmapSubmission {
  username: string
  avatarURL: string
  fileName: string
  downloadURL: string
}

export interface IUserInfo {
  name: string
  registered: Date
}

export interface IScoreSubmission {
  uniqueUserId: string
  beatmapKey: string
  score: number
  accuracy: number
  fc: number
}

export interface IConfig {
  clientId: string
  guildId: string
  'bot-status': string
  'bot-status-type': ActivityType
  'bot-status-url': string
  'bot-avatar': string
  'mod-verifier-role-id': string
  'user-beatmap-submission-channel-id': string
  'mod-beatmap-verify-channel-id': string
  'bot-logs-channel-id': string
  'processing-reaction': string
  'public-data-server-port': number
  'user-server-port': number
}
