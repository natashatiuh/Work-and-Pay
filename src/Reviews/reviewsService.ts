import { connect } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(userId: string, orderId: string, executorId: string, mark: number, comment: string) {
        const connection = await connect;
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`
        SELECT orders.id AS orderId, requests.executorId 
        FROM orders 
        INNER JOIN requests 
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND requests.executorId = ? AND orders.authorsID = ? AND requests.status = 'ACCEPTED'`,
        [orderId, executorId, userId])
        if(!orders[0]) return false

        const [reviews] = await connection.query(`SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, [orderId, executorId])
        if(reviews.length > 0) {
            return false
        }

        const [rows] = await connection.query(`INSERT INTO reviews (id, orderId, recipientId, mark, comment, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, executorId, mark, comment, dateTime])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async addReviewToAuthor(userId: string, orderId: string, authorsId: string, mark: number, comment: string) {
        const connection = await connect;
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`
        SELECT orders.id AS orderId, orders.authorsId, requests.executorId
        FROM orders
        INNER JOIN requests
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND orders.authorsId = ? AND requests.executorId = ? AND requests.status = 'ACCEPTED'`, 
        [orderId, authorsId, userId])
        console.log(orders[0])
        if(!orders[0]) return false

        const [reviews] = await connection.query(`SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, [orderId, authorsId])
        if(reviews.length > 0) {
            return false
        }

        const [rows] = await connection.query(`INSERT INTO reviews (id, orderId, recipientId, mark, comment, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, authorsId, mark, comment, dateTime])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }


    async deleteReview(reviewId: string) {
        const connection = await connect;
        await connection.query(`DELETE FROM reviews WHERE id = ?`, [reviewId])
    }

    async getReviews() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM reviews`)
        return rows;
    }

    async getUserReviews(userId: string) {
        const conection = await connect;
        const [rows] = await conection.query(`SELECT * FROM reviews WHERE userId = ?`, [userId])
        return rows;
    }
}

export const reviewsService = new ReviewsService