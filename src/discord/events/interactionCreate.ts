import {
  Message,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  ActionRowBuilder,
  EmbedBuilder,
  Client
} from 'discord.js'

import { deleteSubmission, onAcceptBeatmap, registerSubmission } from '../../db'
import { logger } from '../../publiclogger'
import { getSubmissionFilename, getDefaultMessageButtons } from '../util'
import { IConfig } from '../../types'

// The bot sent this and it is a poll that we have NOT answered yet
/* const isBotSentUnansweredVerifierPoll = (
  message: Message<boolean>,
  client: Client,
  config: IConfig
): boolean => {
  if (
    message.channelId === config['mod-beatmap-verify-channel-id'] &&
    client.user?.id === message.author.id
  ) {
    // A poll is open if there are 2 buttons
    const comp = message.components[0]
    return comp.components.length == 2
  }
  return false
}
*/

const getBeatmapDownloadURLFromVerifierPoll = (
  message: Message<boolean>
): string | null => {
  const embed = message.embeds[0]
  if (!!embed) {
    return embed.url
  }
  return null
}

const appendVerifierLog = (
  log: string,
  message: Message<boolean>,
  buttons: ButtonBuilder[]
) => {
  let embeds = message.embeds.map((embed) => new EmbedBuilder(embed.data))
  if (embeds.length == 1) {
    embeds.push(new EmbedBuilder().setDescription(log))
  } else if (embeds.length == 2) {
    embeds[1] = embeds[1].setDescription(
      embeds[1].data.description + '\n' + log
    )
  }
  const components =
    buttons.length != 0
      ? [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)]
      : []
  message.edit({ embeds: embeds, components: components })
}

export default async function interactionCreate(
  interaction: Interaction,
  client: Client,
  config: IConfig
) {
  if (!interaction.isButton()) return
  if (interaction.channelId !== config['mod-beatmap-verify-channel-id']) return

  // If we accept/reject, update the embed and remove the components
  let accepted = false
  const message = <Message<boolean>>interaction.message

  const downloadURL = message.embeds[0]?.url
  const username = message.embeds[0]?.author?.name
  const userAvatar = message.embeds[0]?.thumbnail?.url

  const attachmentName = getSubmissionFilename(downloadURL)

  if (interaction.customId === 'accept') {
    accepted = true
    appendVerifierLog(`ACCEPTED by ${interaction.user.toString()}`, message, [])
    // We will remove our submission later, after we download everything.
  } else if (interaction.customId === 'reject') {
    const reopenButton = new ButtonBuilder()
      .setCustomId('reopen')
      .setLabel(`Reopen`)
      .setStyle(ButtonStyle.Secondary)
    appendVerifierLog(`REJECTED by ${interaction.user.toString()}`, message, [
      reopenButton
    ])
    // Remove our submission
    if (!!attachmentName) deleteSubmission(attachmentName)
    interaction.update({})
  } else if (interaction.customId === 'reopen') {
    const buttons = getDefaultMessageButtons()
    appendVerifierLog(
      `reopened by ${interaction.user.toString()}`,
      message,
      buttons
    )
    // Re-register our submission
    if (!!username && !!downloadURL) {
      registerSubmission({
        username: username,
        avatarURL: !!userAvatar ? userAvatar : '',
        fileName: attachmentName,
        downloadURL: downloadURL
      })
    }
    interaction.update({})
  } else {
    logger.error('INVALID INTERACTION ID: ', interaction.id)
    return
  }

  if (accepted) {
    const downloadURL = getBeatmapDownloadURLFromVerifierPoll(message)
    if (!!downloadURL) {
      // TODO: Notify user that their beatmap has been accepted?
      // Accept server side
      await onAcceptBeatmap(attachmentName, downloadURL)
      await interaction.update({})
    }
  }
}
