import { connect } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class OrdersService {
    async addOrder(orderName: string, authorsId: string, country: string, city: string, price: number) {
        const connection = await connect;
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const dateOfPublishing = `${year}-${month}-${day}`;
        await connection.query(`INSERT INTO orders 
        (id, orderName, authorsId, dateOfPublishing, country, city, price, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`, 
        [v4(), orderName, authorsId, dateOfPublishing, country, city, price]);   
    }

    async checkUsersOrder(orderId: string, userId: string) {
        const connection = await connect;
        const [orders] = await connection.query(`SELECT * FROM orders WHERE id = ? AND authorsId = ?`,
        [orderId, userId])
        if(orders[0]) {
            return true
        } else {
            return false
        }
    }

    async editOrder(orderId: string, orderName: string, country: string, city: string, price: number) {
        const connection = await connect;
        await connection.query(`UPDATE orders SET orderName = ?, country = ?, city = ?, price = ? 
        WHERE id = ?`, [orderName, country, city, price, orderId]);
    }

    async deleteOrder(orderId: string) {
        const connection = await connect;
        await connection.query(`DELETE FROM orders WHERE id = ?`, [orderId]);
    }

    async getOrders() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM orders`)
        return rows;
    }

    async getUserOrders(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM orders WHERE authorsId = ?`,
        [userId])
        return rows;
    }
    
}

export const ordersService = new OrdersService()