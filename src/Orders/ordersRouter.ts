import { ordersService } from "./ordersService";
import { validation } from "../common-files/middlewares/validation";
import { addOrderSchema } from "./schemas/addOrderSchema";
import { editOrderSchema } from "./schemas/editOrderSchema";
import { deleteOrderSchema } from "./schemas/deleteOrderSchema";
import { auth } from "../common-files/middlewares/authorization";

const express = require('express')

export const router = express.Router()

router.post('/', auth(), validation(addOrderSchema), async (req, res) => {
    try{
        const { orderName, country, city, price } = req.body as any
        await ordersService.addOrder(orderName, req.userId, country, city, price)
        res.send('The order was added!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/', auth(), validation(editOrderSchema), async (req, res) => {
    try{
        const { orderId, orderName, country, city, price } = req.body as any
        const isTrueOrder = await ordersService.checkUsersOrder(orderId, req.userId)
        console.log(isTrueOrder)
        if(isTrueOrder) {
            await ordersService.editOrder(orderId, orderName, country, city, price) 
            res.send('The order was successfully changed!')
        } else {
            res.send('It is NOT your order!')
        }
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.delete('/', auth(), validation(deleteOrderSchema), async (req, res) => {
    try{
        const { orderId } = req.body as any
        const order = await ordersService.checkUsersOrder(orderId, req.userId)
        if(order) {
            await ordersService.deleteOrder(orderId);
            res.send('The order was deleted!')
        } else {
            res.send('The order does NOT exist!')
        }    
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/', async (req, res) => {
    try{
        const orders = await ordersService.getOrders();
        res.send(orders);
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/user-orders', auth(), async (req, res) => {
    try{
        const userOrders = await ordersService.getUserOrders(req.userId)
        res.send(userOrders)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})