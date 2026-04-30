import { Client, Message, TextChannel, GuildMember, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, APIActionRowComponent, APIMessageActionRowComponent, APITextInputComponent, Attachment } from 'discord.js'
import { readFileSync } from "fs";

import { IConfig } from '../types'
import { logger } from '../publiclogger'
import messageCreate from './events/messageCreate'
import interactionCreate from './events/interactionCreate'

export const runClient = (config: IConfig): Promise<void> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent
    ]
  })

  const token = readFileSync('bot-secret.txt', 'utf8')

  client.on('messageCreate', (message) => {
    messageCreate(message, client, config)
  })

  // Append a log message to a message that has 1 normal embed and 1 logging embed
  client.on('interactionCreate', async (interaction) => {
    interactionCreate(interaction, client, config)
  })

  return client.login(token).then(() => {
    console.log('Discord Client Logged in!')
    logger.info('Discord Client Logged in!')
    client.user?.setPresence({
      activities: [
        {
          name: config['bot-status'],
          url: config['bot-status-url'],
          // @ts-ignore
          type: config['bot-status-type']
        }
      ],
      status: 'online'
    })
  })
}
