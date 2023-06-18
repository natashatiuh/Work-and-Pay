import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class OrdersService {
    async addOrder(orderName: string, authorId: string, country: string, city: string, price: number) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing
        
        const query = `
            INSERT INTO orders 
                (id, orderName, authorId, dateOfPublishing, country, city, price, state) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
        `
        const params = [v4(), orderName, authorId, dateTime, country, city, price]
        
        await connection.query(query, params);   
    }


    async checkUsersOrder(orderId: string, userId: string) {
        const query = `
            SELECT * FROM orders 
            WHERE id = ? AND authorId = ?
        `
        const params = [orderId, userId]
        
        const [orders] = await connection.query(query, params)
        return orders[0]
    }

    async editOrder(orderId: string, orderName: string, country: string, city: string, price: number) {
        const query = `
            UPDATE orders 
            SET orderName = ?, country = ?, city = ?, price = ? 
            WHERE id = ?
        `
        const params = [orderName, country, city, price, orderId]

        await connection.query(query, params);
    }

    async deleteOrder(orderId: string) {
        const query = `
            DELETE FROM orders 
            WHERE id = ?
        `
        const params = [orderId]

        await connection.query(query, params);
    }

    async getOrders() {
        const query = `
            SELECT * FROM orders 
            ORDER BY dateOfPublishing DESC
`
        const [orders] = await connection.query(query)
        return orders;
    }

    async getUserOrders(userId: string) {
        const query = `
            SELECT * FROM orders 
            WHERE authorId = ?
            ORDER BY dateOfPublishing DESC
        `
        const params = [userId]
        const [userOrders] = await connection.query(query, params)
        return userOrders;
    }
    
}

export const ordersService = new OrdersService()