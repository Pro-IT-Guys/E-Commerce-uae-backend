// const io = require('socket.io')(8080, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// })

// const activeUsers: { userId: string; socketId: string }[] = []

// io.on('connection', (socket: any) => {
//   //   Add new user
//   socket.on('new-user-add', (newUserId: string) => {
//     if (newUserId && !activeUsers.some(user => user.userId === newUserId)) {
//       activeUsers.push({ userId: newUserId, socketId: socket.id })
//     }
//     io.emit('get-active-users', activeUsers)
//   })

//   //  Send message
//   socket.on('send-message', (data: any) => {
//     const { receiverId } = data
//     const receiver = activeUsers.find(user => {
//       return user.userId === receiverId._id
//     })

//     if (receiver) {
//       io.to(receiver.socketId).emit('receive-message', data)
//     }
//   })

//   // Disconnect user
//   socket.on('disconnect', () => {
//     activeUsers.filter(user => user.socketId !== socket.id)
//     io.emit('get-active-users', activeUsers)
//   })
// })
