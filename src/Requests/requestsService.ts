import { request } from "express";
import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';

class RequestsService {
    async checkOrder(orderId: string) {
        const query = `
            SELECT * FROM orders 
            WHERE id = ?
        `
        const params = [orderId]

        const [order] = await connection.query(query, params);
        if (order[0]) return true
    }

    async checkOrderAuthor(orderId: string, executorId: string) {
        const query = `
            SELECT orders.id, orders.authorId, requests.id, requests.executorId
            FROM orders
            INNER JOIN requests 
            ON orders.id = requests.orderId 
            WHERE orders.id = ? AND requests.executorId = ? AND orders.authorId <> requests.executorId
        `
        const params = [orderId, executorId]

        const [isNotAuthor] = await connection.query(query, params)
        return isNotAuthor[0]
    }

    async sendRequest(orderId: string, executorId: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const ordersQuery = `
            SELECT authorId FROM orders 
            WHERE id = ?
        `
        const ordersParams = [orderId]

        const [orders] = await connection.query(ordersQuery, ordersParams)
        const order = orders[0]

        console.log(order)
        console.log(executorId)
        if (order.authorId === executorId) {
            return false
        }

        const requestsQuery = `
            SELECT executorId FROM requests 
            WHERE executorId = ? AND orderId = ?
        `
        const requestsParams = [executorId, orderId]

        const [requests] = await connection.query(requestsQuery, requestsParams)
        console.log(requests)
        if(requests.length > 0) return false
        
        const newRequestQuery = `
            INSERT INTO requests 
                (id, orderId, executorId, status, date) 
            VALUES (?, ?, ?, ?, ?)
        `
        const newRequestParams = [v4(), orderId, executorId, "PENDING", dateTime]
        const [newRequest] = await connection.query(newRequestQuery, newRequestParams);
        console.log(newRequest);
        return (newRequest.affectedRows > 0) 
    }


    async checkUserRequest(requestId: string, userId: string) {
        const query = `
            SELECT orders.authorId, requests.id AS requestId FROM orders
            INNER JOIN requests 
            ON orders.id = requests.orderId
            WHERE requests.id = ? AND orders.authorId = ?
        `
        const params = [requestId, userId]

        const [userRequest] = await connection.query(query, params);
        return userRequest[0]
    }

    async acceptRequest(requestId: string) {
        const query = `
            UPDATE requests, orders 
            SET requests.status = "ACCEPTED", orders.state = "INACTIVE"
            WHERE requests.id = ? 
            AND requests.orderId = orders.id 
            AND requests.status = "PENDING" 
            OR requests.status = "DECLINED"
        `
        const params = [requestId]

        const [acceptedRequest] = await connection.query(query, params)
        return (acceptedRequest.affectedRows > 0)
    }

    async declineRequest(requestId: string) {
        const query = `
            UPDATE requests 
            SET status = "DECLINED"
            WHERE id = ?
        `
        const params = [requestId]

        const [declinedRequest] = await connection.query(query, params)
        return declinedRequest.affectedRows > 0
    }

    async cancelRequest(requestId: string, executorId: string) {
        const query = `
            DELETE FROM requests 
            WHERE id = ? AND executorId = ? AND status = "ACCEPTED" OR  status = "PENDING"
        `
        const params = [requestId, executorId]

        const [cancelledRequest] = await connection.query(query, params)
        return cancelledRequest.affectedRows > 0
    }

    async getOrderRequests(orderId: string, userId: string) {
        const query = `
            SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
            FROM orders 
            INNER JOIN requests 
            ON orders.id = requests.orderId 
            WHERE orders.id = ? AND orders.authorId = ?
            ORDER BY date DESC
        `
        const params = [orderId, userId]

        const [orderRequests] = await connection.query(query, params)
        return orderRequests;
    }

    async getAcceptedRequests(userId: string) {
        const query = `
            SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
            FROM orders 
            INNER JOIN requests 
            ON orders.id = requests.orderId 
            WHERE orders.authorId = ? AND requests.status = "ACCEPTED"
            ORDER BY date DESC
        `
        const params = [userId]

        const [acceptedRequests] = await connection.query(query, params)
        return acceptedRequests;
    }

    async getDeclinedRequests(userId: string) {
        const query = `
            SELECT orders.id AS ordersId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
            FROM orders 
            INNER JOIN requests 
            ON orders.id = requests.orderId 
            WHERE orders.authorId = ? AND status = "DECLINED"
            ORDER BY date DESC
        `
        const params = [userId]

        const [declinedRequests] = await connection.query(query, params)
        return declinedRequests;
    }

    async getPendingRequests(userId: string) {
        const query = `
            SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status 
            FROM orders 
            INNER JOIN requests 
            ON orders.id = requests.orderId 
            WHERE orders.authorId = ? AND status = "PENDING"
            ORDER BY date DESC
        `
        const params = [userId]

        const [pendingRequests] = await connection.query(query, params)
        return pendingRequests;
    }

    async getUserRequests(userId: string) {
        const query = `
            SELECT orders.id AS orderId, orders.orderName, requests.id AS requestId, requests.executorId, requests.status
            FROM orders
            INNER JOIN requests 
            ON orders.id = requests.orderId
            WHERE orders.authorId = ?
            ORDER BY date DESC
        `
        const params = [userId]

        const [userRequests] = await connection.query(query, params)
        return userRequests;
    }
}

export const requestsService = new RequestsService();