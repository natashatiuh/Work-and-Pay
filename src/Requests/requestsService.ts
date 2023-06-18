import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';

class RequestsService {
    async checkOrder(orderId: string) {
        const [order] = await connection.query(`
        SELECT * FROM orders 
        WHERE id = ?`, 
        [orderId]);
        console.log(order)
        if(order[0]) {
            return true
        } else {
            return false
        }
    }

    async checkOrderAuthor(orderId: string, executorId: string) {
        const [isNotAuthor] = await connection.query(`
        SELECT orders.id, orders.authorId, requests.id, requests.executorId
        FROM orders
        INNER JOIN requests 
        ON orders.id = requests.orderId 
        WHERE orders.id = ? AND requests.executorId = ? AND orders.authorId <> requests.executorId`, 
        [orderId, executorId])
        console.log(isNotAuthor)
        if(isNotAuthor[0]) {
            return true
        } else {
            return false
        }
    }

    async sendRequest(orderId: string, executorId: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`
        SELECT authorId FROM orders 
        WHERE id = ?`, 
        [orderId])
        const order = orders[0]

        console.log(order)
        console.log(executorId)
        if (order.authorId === executorId) {
            return false
        }

        const [requests] = await connection.query(`
        SELECT executorId FROM requests 
        WHERE executorId = ? AND orderId = ?`,
        [executorId, orderId])
        console.log(requests)
        if(requests.length > 0) {
            return false
        } 
        
        const [newRequest] = await connection.query(`
        INSERT INTO requests (id, orderId, executorId, status, date) 
        VALUES (?, ?, ?, ?, ?)`, 
        [v4(), orderId, executorId, "PENDING", dateTime]);
        console.log(newRequest);
        if(newRequest.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }


    async checkUserRequest(requestId: string, userId: string) {
        const [userRequest] = await connection.query(`
        SELECT orders.authorId, requests.id AS requestId FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE requests.id = ? AND orders.authorId = ?`, [requestId, userId]);

        if(userRequest[0]) {
            return true
        } else {
            return false
        }
    }

    async acceptRequest(requestId: string) {
        const [acceptedRequest] = await connection.query(`
        UPDATE requests, orders 
        SET requests.status = "ACCEPTED", orders.state = "INACTIVE"
        WHERE requests.id = ? AND requests.orderId = orders.id AND requests.status = "PENDING" OR requests.status = "DECLINED"`, [requestId])
        if(acceptedRequest.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async declineRequest(requestId: string) {
        const [declinedRequest] = await connection.query(`
        UPDATE requests 
        SET status = "DECLINED"
        WHERE id = ?`, [requestId])
        if(declinedRequest.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async cancelRequest(requestId: string) {
        const [cancelledRequest] = await connection.query(`
        DELETE FROM requests 
        WHERE id = ?`, 
        [requestId])
        if(cancelledRequest.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async getOrderRequests(orderId: string, userId: string) {
        const [orderRequests] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.id = ? AND orders.authorId = ?
        ORDER BY date DESC`, [orderId, userId])
        console.log(orderRequests)
        return orderRequests;
    }

    async getAcceptedRequests(userId: string) {
        const [acceptedRequests] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorId = ? AND requests.status = "ACCEPTED"
        ORDER BY date DESC`, [userId])
        return acceptedRequests;
    }

    async getDeclinedRequests(userId: string) {
        const [declinedRequests] = await connection.query(`
        SELECT orders.id AS ordersId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorId = ? AND status = "DECLINED"
        ORDER BY date DESC`, [userId])
        return declinedRequests;
    }

    async getPendingRequests(userId: string) {
        const [pendingRequests] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
        FROM orders 
        INNER JOIN requests ON orders.id = requests.orderId 
        WHERE orders.authorId = ? AND status = "PENDING"
        ORDER BY date DESC`, [userId])
        return pendingRequests;
    }

    async getUserRequests(userId: string) {
        const [userRequests] = await connection.query(`
        SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
        FROM orders
        INNER JOIN requests ON orders.id = requests.orderId
        WHERE orders.authorId = ?
        ORDER BY date DESC`, [userId])
        return userRequests;
    }
}

export const requestsService = new RequestsService();