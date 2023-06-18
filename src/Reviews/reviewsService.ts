import { connection } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const ordersQuery = `
            SELECT orders.id AS orderId, requests.executorId 
            FROM orders 
            INNER JOIN requests 
            ON orders.id = requests.orderId
            WHERE orders.id = ? AND requests.executorId = ? AND orders.authorId = ? AND requests.status = 'ACCEPTED'
        `
        const ordersParams = [orderId, recipientId, reviewAuthorId]

        const [orders] = await connection.query(ordersQuery, ordersParams)
        if(!orders[0]) return false

        const reviewQuery = `
            SELECT * FROM reviews 
            WHERE orderId = ? AND recipientId = ?
        `
        const reviewParams = [orderId, recipientId]
        const [reviews] = await connection.query(reviewQuery, reviewParams)
        if(reviews.length > 0) {
            return false
        }

        const newReviewQuery = `
            INSERT INTO 
                reviews (id, orderId, recipientId, authorId, mark, comment, date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        const newReviewParams = [v4(), orderId, recipientId, reviewAuthorId, mark, comment, dateTime]

        const [newReview] = await connection.query(newReviewQuery, newReviewParams)
        return (newReview.affectedRows > 0)
    }

    async addReviewToAuthor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const date = new Date();
        const dateOfPublishing = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const timeOfPublishing = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateTime = dateOfPublishing+ ' ' +timeOfPublishing

        const ordersQuery = `
            SELECT orders.id AS orderId, orders.authorId, requests.executorId
            FROM orders
            INNER JOIN requests
            ON orders.id = requests.orderId
            WHERE orders.id = ? AND orders.authorId = ? AND requests.executorId = ? AND requests.status = 'ACCEPTED'
        `
        const ordersParams = [orderId, recipientId, reviewAuthorId]

        const [orders] = await connection.query(ordersQuery, ordersParams)
        console.log(orders[0])
        if(!orders[0]) return false

        const reviewsQuery = `
            SELECT * FROM reviews 
            WHERE orderId = ? AND recipientId = ?
        `
        const reviewsParams = [orderId, recipientId]
        const [reviews] = await connection.query(reviewsQuery, reviewsParams)
        if(reviews.length > 0) {
            return false
        }

        const newReviewQuery = `
            INSERT INTO reviews 
                (id, orderId, recipientId, authorId, mark, comment, date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        const newReviewParams = [v4(), orderId, recipientId, reviewAuthorId, mark, comment, dateTime]
        const [newReview] = await connection.query(newReviewQuery, newReviewParams)
        return (newReview.affectedRows > 0) 
    }

    async deleteReview(reviewId: string, reviewAuthorId: string) {
        const reviewExistsQuery = `
            SELECT * FROM reviews 
            WHERE id = ? AND authorId = ?
        `
        const reviewExistsParams = [reviewId, reviewAuthorId]
        const [reviewExists] = await connection.query(reviewExistsQuery, reviewExistsParams)
        console.log(reviewExists[0])
        if(!reviewExists[0]) return false

        const query = `
            DELETE FROM reviews 
            WHERE id = ? AND authorId = ?
        `
        const params = [reviewId, reviewAuthorId]
        const [review] = await connection.query(query, params)

        return (review.affectedRows > 0) 
    }

    async getReviews() {
        const [reviews] = await connection.query(`
        SELECT * FROM reviews ORDER BY date DESC
        `)
        return reviews;
    }

    async getUserReviews(userId: string) {
        const query = `
            SELECT * FROM reviews 
            WHERE recipientId = ? 
            ORDER BY date DESC
        `
        const params = [userId]
        const [userReviews] = await connection.query(query, params)
        return userReviews;
    }
}

export const reviewsService = new ReviewsService