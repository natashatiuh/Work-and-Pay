import { connect } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from 'uuid';

class RequestsService {
    async sendRequest(orderId: string, executorId: string) {
        const connection = await connect;
        await connection.query(`INSERT INTO requests (id, orderId, executorId, status) 
        VALUES (?, ?, ?, ?)`, 
        [v4(), orderId, executorId, "PENDING"]);
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
        return rows;
    }

    async getAcceptedRequests() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM requests WHERE status = "ACCEPTED"`)
        return rows;
    }

    async getDeclinedRequests() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM requests WHERE status = "DECLINED"`)
        return rows;
    }

    async getPendingRequests() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM requests WHERE status = "PENDING"`)
        return rows;
    }

    async getUserRequests(userId: string) {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM requests WHERE executorId = ?`, [userId])
        return rows;
    }
}

export const requestsService = new RequestsService();