import { runClient } from './discord/client'
import { readFileSync } from 'fs'
import { basename } from 'path'

import {
  downloadBeatmapPackage,
  registerSubmission,
  deleteSubmission
} from './db'
import startUserServer from './web'

const config = JSON.parse(readFileSync('config.json', 'utf8'))

// File Server for db/public
/*logger.info(`Hosting db/public on port ${config["public-data-server-port"]}`)
exec(`http-server db/public --port ${config["public-data-server-port"]}`, (error, stdout, stderr) => {
    logger.info("(HTTP server response)")
    if (!!stdout)
        logger.info(stdout)
    if (!!error)
        logger.error(error)
    if (!!stderr)
        logger.error(stderr)
});
*/

// Discord client
runClient({
  onAcceptBeatmap: (attachmentName, beatmapURL, onComplete) => {
    let filename = basename(new URL(beatmapURL).pathname)

    downloadBeatmapPackage(beatmapURL, filename).then(() => {
      console.log('Downloaded: ', filename)
      deleteSubmission(attachmentName)
      console.log('Deleted: ', filename)
      onComplete()
    })
  },
  onPostSubmission: registerSubmission,
  onRejectSubmission: deleteSubmission,
  config
})

startUserServer(config)
