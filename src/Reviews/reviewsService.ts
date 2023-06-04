import { reviewRepository } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(userId: string, orderId: string, executorId: string, mark: number, comment: string) {
        const orders = await reviewRepository.query(`
        SELECT orders.id AS orderId, requests.executorId 
        FROM orders 
        INNER JOIN requests 
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND requests.executorId = ? AND orders.authorsID = ? AND requests.status = 'ACCEPTED'`,
        [orderId, executorId, userId])
        if(!orders) return false
        
        const reviews = await reviewRepository.find({
            where: { orderId, recipientId: executorId }
        })
       
        if (reviews.length > 0) return false
        
        const rows = await reviewRepository.insert({
            id: v4(),
            orderId: orderId,
            recipientId: executorId,
            mark: mark,
            comment: comment,
            date: new Date()
        })
        console.log(rows)
        if(rows.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async addReviewToAuthor(userId: string, orderId: string, authorsId: string, mark: number, comment: string) {
        const orders = await reviewRepository.query(`
        SELECT orders.id AS orderId, orders.authorsId, requests.executorId
        FROM orders
        INNER JOIN requests
        ON orders.id = requests.orderId
        WHERE orders.id = ? AND orders.authorsId = ? AND requests.executorId = ? AND requests.status = 'ACCEPTED'`, 
        [orderId, authorsId, userId])
        if(!orders) return false

        const reviews = await reviewRepository.find({
            where: {orderId: orderId, recipientId: authorsId}
        })

        if(reviews.length > 0) {
            return false
        }

        const rows = await reviewRepository.insert({
            id: v4(),
            orderId: orderId,
            recipientId: authorsId,
            mark: mark,
            comment: comment,
            date: new Date()
        })
        
        
        if( rows.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    //If you are the author of the order and you want to delete the review, which you sent to the order executor, you can use this method
    async deleteAuthorsReview(reviewId: string, authorId: string) { 
        const review = await reviewRepository.query(`
        SELECT orders.id, orders.authorsId, reviews.id
        FROM orders
        INNER JOIN reviews
        ON orders.id = reviews.orderId
        WHERE orders.authorsId = ? AND reviews.id = ?`, 
        [authorId, reviewId])
        if(!review) return false

        const {affected} = await reviewRepository.delete({id: reviewId})
        return affected > 0
    }

    //If you are the executor of the order and you want to delete the review, which you sent to the order author, you can use this method
    async deleteExecutorsReview(reviewId: string, executorId: string) {
        const review = await reviewRepository.query(`
        SELECT requests.id, requests.executorId, reviews.id
        FROM requests
        INNER JOIN reviews
        ON requests.orderId = reviews.orderId
        WHERE requests.executorId = ? AND reviews.id = ?`, 
        [executorId, reviewId])
        if(!review) return false


        const {affected} = await reviewRepository.delete({ id: reviewId })
        return affected > 0
    }

    async getReviews() {
        return await reviewRepository.find()
    }

    async getUserReviews(userId: string) {
        return await reviewRepository.find({
            where: { recipientId: userId },
            order: { date: 'DESC' }
        })
    }
}

export const reviewsService = new ReviewsService