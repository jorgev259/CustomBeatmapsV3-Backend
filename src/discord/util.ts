import { ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js'

export const getSubmissionFilename = (
  attachmentURL: string | null | undefined
) => {
  const attachmentURLParts = !!attachmentURL ? attachmentURL.split('/') : []
  return attachmentURLParts.length != 0
    ? attachmentURLParts[attachmentURLParts.length - 1].split('?')[0]
    : 'ERROR'
}

export const getDefaultMessageButtons = (): ButtonBuilder[] => {
  return [
    new ButtonBuilder()
      .setCustomId('accept')
      .setLabel(`✅ Accept`)
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('reject')
      .setLabel(`❌ Reject`)
      .setStyle(ButtonStyle.Danger)
  ]
}

export const hasRole = (member: GuildMember, roleId: string) => {
  const roles = member.roles
  return roles.cache.has(roleId)
}