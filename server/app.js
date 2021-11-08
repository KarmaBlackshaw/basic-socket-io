require('dotenv').config()

const chalk = require('chalk')
const { Server } = require('socket.io')

// Add more namespaces here
const namespaces = new Set([
  'user'
])

// Get socket instances
const getInstances = (io, namespaces) => new Promise((resolve, reject) => {
  const instances = new Map()

  try {
    for (const namespace of namespaces) {
      const namespaceURL = `/${namespace}`

      const instance = io.of(namespaceURL)
        .on('connection', socket => {
          socket
            .on('join-room', data => socket.join(data.room))
            .on('leave-room', data => socket.leave(data.room))
        })

      instances.set(namespace, instance)
    }

    resolve(instances)
  } catch (error) {
    reject(error)
  }
})

// Bootstrap WS services
const bootstrap = async () => {
  try {
    const io = new Server({ transports: ['websocket', 'polling'] })

    const instances = await getInstances(io, namespaces)

    /**
     * Sample emitter
     * You can change this into a dynamic EventEmitter/Redis PubSub
     */
    setInterval(() => {
      const sampleRoom = 'root-1'
      const sampleNamespace = 'user'

      if (instances.has(sampleNamespace)) {
        const instance = instances.get(sampleNamespace)

        if (sampleRoom) {
          instance.in(sampleRoom).emit('test', 'message from room')
        } else {
          instance.emit('test', 'message')
        }
      }
    }, 1000)

    io.listen(process.env.SOCKET_PORT)

    const network = chalk.cyan(`http://localhost:${process.env.SOCKET_PORT}`)

    console.log(`Socket running at: \t${network}`)
  } catch (error) {
    console.log(error)
    throw error
  }
}

bootstrap()
