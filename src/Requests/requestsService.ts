import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';
import { requestRepository } from "../common-files/mysqlConnection";
import { orderRepository } from "../common-files/mysqlConnection";
import { In } from "typeorm";

class RequestsService {
    async checkOrder(orderId: string) {
        const rows = await orderRepository.find({
            where: {id: orderId}
        })
        console.log(rows)
        if (rows[0]) {
            return true
        } else {
            return false
        }
    }

    async checkOrderAuthor(orderId: string, executorId: string) {
        const isNotAuthor = await orderRepository.query(`
        SELECT orders.id, orders.authorsId, requests.id, requests.executorId
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
        const orders = await orderRepository.find({
            select: {authorsId: true},
            where: {id: orderId}
        })
        console.log(orders[0])
        console.log(executorId)
        if (orders[0].authorsId === executorId) return false

        const requests = await requestRepository.find({
            select: {executorId: true},
            where: {executorId, orderId}
        })
        console.log(requests)
        if (requests.length > 0) return false

        console.log(executorId)
        
        const rows = await requestRepository.insert({
            id: v4(),
            orderId: orderId,
            executorId: executorId,
            status: "PENDING",
            date: new Date()
        })
        
        console.log(rows);
        if(rows.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }


    async checkUserRequest(requestId: string, userId: string) {
        const result = await orderRepository.query(`
        SELECT orders.authorsId, requests.id AS requestId FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE requests.id = ? AND orders.authorsId = ?`, [requestId, userId]);

        if(result[0]) {
            return true
        } else {
            return false
        }
    }

    
    async acceptRequest(requestId: string) {
        const result = await requestRepository.update(
            { id: requestId, status: In(["PENDING", "DECLINED"]) },
            { status: "ACCEPTED" }
        )

        return result.affected > 0
    }

    async declineRequest(requestId: string) {
        await requestRepository.update(
            {id: requestId}, 
            {status: "DECLINED"}
        )
    }

    async cancelRequest(requestId: string) {
        await requestRepository.delete({ id: requestId })
    }

    async getOrderRequests(orderId: string, userId: string) {
        const result = await orderRepository.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.id = ? AND orders.authorsId = ?
        ORDER BY date DESC`, [orderId, userId])
        console.log(result)
        return result;
    }

    async getAcceptedRequests(userId: string) {
        const result = await orderRepository.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND requests.status = "ACCEPTED"
        ORDER BY date DESC`, [userId])
        return result;
    }

    async getDeclinedRequests(userId: string) {
        const result = await orderRepository.query(`
        SELECT orders.id AS ordersId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND status = "DECLINED"
        ORDER BY date DESC`, [userId])
        return result;
    }

    async getPendingRequests(userId: string) {
        const result = await orderRepository.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorsId = ? AND status = "PENDING"
        ORDER BY date DESC`, [userId])
        return result;
    }

    async getUserRequests(userId: string) {
        const [rows] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE orders.authorsId = ?
        ORDER BY date DESC`, [userId])
        return rows;
    }
}

export const requestsService = new RequestsService();