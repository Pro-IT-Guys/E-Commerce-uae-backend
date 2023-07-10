"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post('/', order_controller_1.OrderController.createOrder);
router.get('/', order_controller_1.OrderController.getAllOrder);
router.patch('/:id', order_controller_1.OrderController.updateOrder);
router.get('/user/:id', order_controller_1.OrderController.getOrderByUserId);
router.get('/single/:id', order_controller_1.OrderController.getOrderByOrderId);
exports.OrderRoute = router;
