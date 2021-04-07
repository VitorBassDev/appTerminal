/**
 * GERENCIAR O SOFTWARE
 */

import http from 'http'
import {v4} from 'uuid'

export default class SocketServer{
  constructor({port}) {
    this.port = port
  }

  // CRIAÇÃO DO SERVIDOR
  async initialize(eventEmitter){
    const server = http.createServer((req, res) =>{
      res.writeHead(200, {'Content-Type': 'text/plan'})
      res.end('hey there !!')
    })

    server.on('upgrade', (req, socket) =>{
      socket.id(v4)
      const headers = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        ''
      ].map(line => line.concat('\r\n')).join('')
        socket.write(headers)
    })

    return new Promise ((resolve, reject) => {
    server.on('error', reject)
    server.listen(this.port, () => resolve(server))
    })
  }
}