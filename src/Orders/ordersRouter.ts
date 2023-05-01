import { ordersServise } from "./ordersServise";
import { validation } from "../common-files/middlewares/validation";
import { addOrderSchema } from "./schemas/addOrderSchema";
import { editOrderSchema } from "./schemas/editOrderSchema";
import { deleteOrderSchema } from "./schemas/deleteOrderSchema";
import { getUserOrdersSchema } from "./schemas/getUserOrdersSchema";

const express = require('express')

export const router = express.Router()

router.post('/', validation(addOrderSchema), async (req, res) => {
    try{
        const { orderName, authorsId, country, city, price } = req.body as any
        await ordersServise.addOrder(orderName, authorsId, country, city, price)
        res.send('The order was added!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.patch('/', validation(editOrderSchema), async (req, res) => {
    try{
        const { orderId, orderName, country, city, price } = req.body as any
        await ordersServise.editOrder(orderId, orderName, country, city, price) 
        res.send('The order was successfully changed!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.delete('/', validation(deleteOrderSchema), async (req, res) => {
    try{
        const { orderId } = req.body as any
        await ordersServise.deleteOrder(orderId);
        res.send('The order was deleted!')
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/', async (req, res) => {
    try{
        const orders = await ordersServise.getOrders();
        res.send(orders);
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})

router.get('/user-orders', validation(getUserOrdersSchema), async (req, res) => {
    try{
        const {userId } = req.body as any
        const userOrders = await ordersServise.getUserOrders(userId)
        res.send(userOrders)
    } catch(error) {
        console.log(error)
        res.send(error)
    }
})