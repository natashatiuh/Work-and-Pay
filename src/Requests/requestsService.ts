import Connection from "mysql2/typings/mysql/lib/Connection";
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

    async sendRequest(orderId: string, executorId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`INSERT INTO requests (id, orderId, executorId, status) 
        VALUES (?, ?, ?, ?)`, 
        [v4(), orderId, executorId, "PENDING"]);
        if(rows[0]) {
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

    async getOrderRequests(orderId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM requests WHERE orderId = ?`, [orderId])
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