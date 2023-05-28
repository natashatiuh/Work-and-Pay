import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(userId: string, orderId: string, executorId: string, mark: number, comment: string) {
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

        const [reviews] = await connection.query(`
        SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, 
        [orderId, executorId])
        if(reviews.length > 0) {
            return false
        }

        const [rows] = await connection.query(`
        INSERT INTO reviews (id, orderId, recipientId, mark, comment, date) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, executorId, mark, comment, dateTime])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async addReviewToAuthor(userId: string, orderId: string, authorsId: string, mark: number, comment: string) {
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

        const [reviews] = await connection.query(`
        SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, [orderId, authorsId])
        if(reviews.length > 0) {
            return false
        }

        const [rows] = await connection.query(`
        INSERT INTO reviews (id, orderId, recipientId, mark, comment, date) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, authorsId, mark, comment, dateTime])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    //If you are the author of the order and you want to delete the review, which you sent to the order executor, you can use this method
    async deleteAuthorsReview(reviewId: string, authorId: string) { 
        const [review] = await connection.query(`
        SELECT orders.id, orders.authorsId, reviews.id
        FROM orders
        INNER JOIN reviews
        ON orders.id = reviews.orderId
        WHERE orders.authorsId = ? AND reviews.id = ?`, 
        [authorId, reviewId])
        if(!review[0]) return false

        const [rows] = await connection.query(`
        DELETE FROM reviews WHERE id = ?`, 
        [reviewId])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    //If you are the executor of the order and you want to delete the review, which you sent to the order author, you can use this method
    async deleteExecutorsReview(reviewId: string, executorId: string) {
        const [review] = await connection.query(`
        SELECT requests.id, requests.executorId, reviews.id
        FROM requests
        INNER JOIN reviews
        ON requests.orderId = reviews.orderId
        WHERE requests.executorId = ? AND reviews.id = ?`, 
        [executorId, reviewId])
        if(!review[0]) return false

        const [rows] = await connection.query(`
        DELETE FROM reviews WHERE id = ?`, 
        [reviewId])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async getReviews() {
        const [rows] = await connection.query(`
        SELECT * FROM reviews ORDER BY date DESC
        `)
        return rows;
    }

    async getUserReviews(userId: string) {
        const [rows] = await connection.query(`
        SELECT * FROM reviews 
        WHERE recipientId = ? 
        ORDER BY date DESC`, 
        [userId])
        return rows;
    }
}

export const reviewsService = new ReviewsService