import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`
        SELECT orders.id AS orderId, requests.executorId 
        FROM orders 
        INNER JOIN requests 
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND requests.executorId = ? AND orders.authorId = ? AND requests.status = 'ACCEPTED'`,
        [orderId, recipientId, reviewAuthorId])
        if(!orders[0]) return false

        const [reviews] = await connection.query(`
        SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, 
        [orderId, recipientId])
        if(reviews.length > 0) {
            return false
        }

        const [newReview] = await connection.query(`
        INSERT INTO reviews (id, orderId, recipientId, authorId, mark, comment, date) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, recipientId, reviewAuthorId, mark, comment, dateTime])
        if(newReview.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async addReviewToAuthor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const [orders] = await connection.query(`
        SELECT orders.id AS orderId, orders.authorId, requests.executorId
        FROM orders
        INNER JOIN requests
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND orders.authorId = ? AND requests.executorId = ? AND requests.status = 'ACCEPTED'`, 
        [orderId, recipientId, reviewAuthorId])
        console.log(orders[0])
        if(!orders[0]) return false

        const [reviews] = await connection.query(`
        SELECT * FROM reviews 
        WHERE orderId = ? AND recipientId = ?`, [orderId, recipientId])
        if(reviews.length > 0) {
            return false
        }

        const [newReview] = await connection.query(`
        INSERT INTO reviews (id, orderId, recipientId, authorId, mark, comment, date) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [v4(), orderId, recipientId, reviewAuthorId, mark, comment, dateTime])
        if(newReview.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async deleteReview(reviewId: string, reviewAuthorId: string) {
        const [reviewExists] = await connection.query(`
        SELECT * FROM reviews 
        WHERE id = ? AND authorId = ?
        `, [reviewId, reviewAuthorId])
        console.log(reviewExists[0])
        if(!reviewExists[0]) return false

        const [review] = await connection.query(`
        DELETE FROM reviews 
        WHERE id = ? AND authorId = ?
        `, [reviewId, reviewAuthorId])

        if (review.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async getReviews() {
        const [reviews] = await connection.query(`
        SELECT * FROM reviews ORDER BY date DESC
        `)
        return reviews;
    }

    async getUserReviews(userId: string) {
        const [userReviews] = await connection.query(`
        SELECT * FROM reviews 
        WHERE recipientId = ? 
        ORDER BY date DESC`, 
        [userId])
        return userReviews;
    }
}

export const reviewsService = new ReviewsService