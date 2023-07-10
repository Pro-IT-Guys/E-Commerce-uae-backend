'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ChatRoute = void 0
const express_1 = require('express')
const chat_controller_1 = require('./chat.controller')
const router = (0, express_1.Router)()
router.get('/', chat_controller_1.ChatController.getAllChat)
router.post('/', chat_controller_1.ChatController.createChat)
router.get(
  '/:senderId/:receiverId',
  chat_controller_1.ChatController.getChatOfSenderAndReceiver
)
router.get('/:senderId', chat_controller_1.ChatController.getChatOfSender)
exports.ChatRoute = router