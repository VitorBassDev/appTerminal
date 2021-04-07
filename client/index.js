/**
 * REQUISIÇÕES ASSINCRONAS
 */

/**
 * COMO RODAR O PROJETO
 * 
  node index.js \
  --username vitor \
  --room sala01 \
  --hostUri localhost
 */

import Events       from 'events'
import CliConfig    from './src/cliConfig.js';
import EventMenager from './src/eventMenager.js';
import SocketClient from './src/socker.js';
import TerminalController from "./src/terminalController.js";

// CAPTURAR O USUÁRIO 
const [nodePath, filePath, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)
console.log('config', config)
const componentEmitter = new Events()
const socketClient     = new SocketClient(config)
await socketClient.initialize()

const eventMenager     = new EventMenager({ componentEmitter, socketClient})
const events           = eventMenager.getEvents()
socketClient.attachEvents(events)

const data = {
  roomId:   config.room,
  userName: config.username
}
eventMenager.joinRoomAndWaitForMessages(data)

const controller       = new TerminalController()
await controller.initalizeTable(componentEmitter)
