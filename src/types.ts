
export interface IBeatmapSubmission {
    username: string,
    avatarURL: string,
    fileName: string,
    downloadURL: string
}

export interface IUserInfo {
    name : string,
    registered: Date
}

export interface IScoreSubmission {
  uniqueUserId: string
  beatmapKey: string
  score: number
  accuracy: number
  fc: number
}
