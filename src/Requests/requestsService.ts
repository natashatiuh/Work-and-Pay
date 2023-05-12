import { connect } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';

class RequestsService {
    async checkOrder(orderId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM orders WHERE id = ?`, 
        [orderId]);
        console.log(rows)
        if(rows[0]) {
            return true
        } else {
            return false
        }
    }

    async checkOrderAuthor(orderId: string, executorId: string) {
        const connection = await connect;
        const [isNotAuthor] = await connection.query(`SELECT orders.id, orders.authorsId, requests.id, requests.executorId
        FROM orders
        INNER JOIN requests 
        ON orders.id = requests.orderId 
        WHERE orders.id = ? AND requests.executorId = ? AND orders.authorsId <> requests.executorId`, 
        [orderId, executorId])
        console.log(isNotAuthor)
        if(isNotAuthor[0]) {
            return true
        } else {
            return false
        }
    }

    async sendRequest(orderId: string, executorId: string) {
        const connection = await connect;
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`SELECT authorsId FROM orders WHERE id = ?`, [orderId])
        const order = orders[0]

        console.log(order)
        console.log(executorId)
        if (order.authorsId === executorId) {
            return false
        }

        const [requests] = await connection.query(`SELECT executorId FROM requests 
        WHERE executorId = ? AND orderId = ?`,
        [executorId, orderId])
        console.log(requests)
        if(requests.length > 0) {
            return false
        } 
        
        const [rows] = await connection.query(`INSERT INTO requests (id, orderId, executorId, status, date) 
        VALUES (?, ?, ?, ?, ?)`, 
        [v4(), orderId, executorId, "PENDING", dateTime]);
        console.log(rows);
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }


    async checkUserRequest(requestId: string, userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`
        SELECT orders.authorsId, requests.id AS requestId FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE requests.id = ? AND orders.authorsId = ?`, [requestId, userId]);

        if(rows[0]) {
            return true
        } else {
            return false
        }
    }

    async acceptRequest(requestId: string) {
        const connection = await connect;
        await connection.query(`UPDATE requests SET status = "ACCEPTED"
        WHERE id = ?`, [requestId])
    }

    async declineRequest(requestId: string) {
        const connection = await connect;
        await connection.query(`UPDATE requests SET status = "DECLINED"
        WHERE id = ?`, [requestId])
    }

    async cancelRequest(requestId: string) {
        const connection = await connect;
        await connection.query(`DELETE FROM requests WHERE id = ?`, [requestId])
    }

    async getOrderRequests(orderId: string, userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.id = ? AND orders.authorsId = ?`, [orderId, userId])
        console.log(rows)
        return rows;
    }

    async getAcceptedRequests(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND requests.status = "ACCEPTED";`, [userId])
        return rows;
    }

    async getDeclinedRequests(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`
        SELECT orders.id AS ordersId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND status = "DECLINED"`, [userId])
        return rows;
    }

    async getPendingRequests(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND status = "PENDING"`, [userId])
        return rows;
    }

    async getUserRequests(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE orders.authorsId = ?`, [userId])
        return rows;
    }
}

export const requestsService = new RequestsService();