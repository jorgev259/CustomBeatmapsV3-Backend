import { ActionRowBuilder, ButtonBuilder, Client, EmbedBuilder, Message, TextChannel } from 'discord.js'

import { getDefaultMessageButtons, getSubmissionFilename } from '../util'
import { registerSubmission } from '../../db'
import { IConfig } from '../../types'

const isUserSubmission = (
  message: Message<boolean>,
  config: IConfig
): boolean => {
  const attachmentName = message.attachments.at(0)?.name.toString()
  return (
    message.channelId === config['user-beatmap-submission-channel-id'] &&
    !!attachmentName &&
    (attachmentName.toLowerCase().endsWith('.zip') ||
      attachmentName.toLowerCase().endsWith('.osz'))
  )
}

const receiveUserSubmission = (message: Message<boolean>, client: Client, config: IConfig) => {
  // Indicate we've received their submission
  // Post a simple poll to the "verification" area
  const channel = client.channels.cache.get(
    config['mod-beatmap-verify-channel-id']
  ) as TextChannel

  const attachment = message.attachments.at(0)

  const attachmentURL = attachment?.url.toString()
  const attachmentName = getSubmissionFilename(attachmentURL)

  const avatarURL = message.author.avatarURL()
  const embed = new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(attachmentName)
    .setThumbnail(!!avatarURL ? avatarURL : '')
    .setURL(!!attachmentURL ? attachmentURL : message.url)
    .setAuthor({ name: message.author.username })
    .setDescription(
      `${message.author.toString()}: ${message.content}\n${message.url}`
    )

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    getDefaultMessageButtons()
  )

  // Make sure our verifiers get an update first before confirming!
  channel.send({ embeds: [embed], components: [buttons] }).then(() => {
    message.react(config['processing-reaction'])
    if (!!attachmentURL) {
      registerSubmission({
        username: message.author.username,
        avatarURL: !!avatarURL ? avatarURL : '',
        fileName: attachmentName,
        downloadURL: attachmentURL
      })
    }
  })
}

export default function messageCreate(message: Message, client: Client, config: IConfig) {
  if (message.author.bot) return

  if (isUserSubmission(message, config)) {
    receiveUserSubmission(message, client, config)
  }
}
