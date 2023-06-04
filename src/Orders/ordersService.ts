import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";
import { orderRepository } from "../common-files/mysqlConnection";

class OrdersService {
    async addOrder(orderName: string, authorsId: string, country: string, city: string, price: number) {
        
        await orderRepository.insert({
            id: v4(),
            orderName: orderName,
            authorsId: authorsId,
            dateOfPublishing: new Date(),
            country: country,
            city: city,
            price: price,
            state: "ACTIVE"
        })
    }


    async checkUsersOrder(orderId: string, userId: string) {
        const orders = await orderRepository.find({
            where: {id: orderId, authorsId: userId}
        })
        
        if (orders[0]) {
            return true
        } else {
            return false
        }
    }

    async editOrder(orderId: string, orderName: string, country: string, city: string, price: number) {
        await orderRepository.update(
            {id: orderId},
            {orderName: orderName, country: country, city: city, price: price}
        )
    }

    async deleteOrder(orderId: string) {
        await orderRepository.delete({id: orderId})
    }

    async getOrders() {
        return await orderRepository.find({
            order: {dateOfPublishing: "DESC"}
        })
    }

    async getUserOrders(userId: string) {
        return await orderRepository.find({
            where: {authorsId: userId},
            order: {dateOfPublishing: "DESC"}
        })
    }
}

export const ordersService = new OrdersService()