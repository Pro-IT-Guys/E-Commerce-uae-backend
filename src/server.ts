/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import mongoose from 'mongoose'
import app from './app'
import config from './config'
// import { Server } from 'http'
import offerModel from './app/modules/offer/offer.model'
import { scheduleCronJobs } from './app/helpers/cornJobs'
import { IAddId } from './app/modules/offer/offer.interface'
import http from 'http'

const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: 'https://aymifashion.com',
    methods: ['GET', 'POST'],
  },
})

const activeUsers = new Map()

io.on('connection', (socket: any) => {
  socket.on('join', (userId: string) => {
    console.log('User joined: ', userId)
    if (userId && !activeUsers.has(userId)) {
      activeUsers.set(userId, socket.id)
    }
    io.emit('activeUsers', Array.from(activeUsers.keys()))
  })

  socket.on('sendMessage', (data: any) => {
    const receiverId = data.receiverId
    const receiverSocketId = activeUsers.get(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getMessage', data)
    }
  })

  // Get cart data from client
  socket.on('cartData', (data: any) => {
    const receiverId = data.data.userId
    const receiverSocketId = activeUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('getCartData', data.data)
    }
  })

  socket.on('disconnect', () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId)
        break
      }
    }
    io.emit('activeUsers', Array.from(activeUsers.keys()))
  })
})

// Socket end ====================================================================>>>

/* This code is setting up a listener for uncaught exception. It's a synchronous process */
process.on('uncaughtException', error => {
  console.log(error)
  process.exit(1)
})

/* This code is setting up a listener for unhandled promise rejections. It's a asynchronous process */
process.on('unhandledRejection', error => {
  if (server) {
    server.close(() => {
      console.log(error)
      process.exit(1)
    })
  }
})

/* `process.on('SIGTERM', () => {...})` sets up a listener for the SIGTERM signal, which is a signal
sent to a process to request its termination. When this signal is received, the code inside the
listener function is executed. In this case, if the `server` variable is defined (meaning the server
is running), it is closed and a success message is logged. This is a way to gracefully shut down the
server when the process is terminated, such as when the application is deployed to a cloud platform
and needs to be scaled down or updated. */
process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      console.log('Process terminated')
    })
  }
})

async function databaseConnection() {
  try {
    await mongoose.connect(config.database_string as string)
    if (config.env === 'development') {
      console.log('Database connected successfully')
    } else {
      console.log('Database connected successfully')
    }

    server.listen(config.port, async () => {
      if (config.env === 'development') {
        console.log(`Server is listening on port ${config.port}`)
      } else {
        console.log(`Server is listening on port ${config.port}`)
      }

      const currentDate = new Date()
      const nearestOffer = await offerModel
        .findOne({ startFrom: { $gte: currentDate } })
        .sort({ startFrom: 1 })
        .exec()

      if (nearestOffer) {
        // Schedule the cron jobs with the nearest offer data
        scheduleCronJobs(nearestOffer as unknown as Partial<IAddId>)
        console.log(
          `Cron jobs scheduled successfully and will execute at ${nearestOffer.startFrom}`
        )
      } else {
        console.log('No nearest offer found.')
      }
    })
  } catch (error) {
    console.log('Error while connecting database: ', error)
  }
}

databaseConnection()
