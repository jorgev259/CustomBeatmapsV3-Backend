import { readFileSync } from 'fs'

import { IConfig } from './types'
import { runUserServer } from './web/user-server'
import { runClient } from './discord/client'

const config = JSON.parse(readFileSync('config.json', 'utf8')) as IConfig

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
runClient(config)
runUserServer(config)
