import { orderRepository, reviewRepository } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReviewToExecutor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const order = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                id: orderId,
                authorsId: reviewAuthorId,
                requests: {executorId: recipientId, status: "ACCEPTED"}
            }
        })

        if(!order) return false

        const reviewExists = await reviewRepository.find({
            where: { orderId, recipientId, authorId: reviewAuthorId }
        })

        if(reviewExists.length > 0) return false

        const review = await reviewRepository.insert({
            id: v4(),
            orderId: orderId,
            recipientId: recipientId,
            authorId: reviewAuthorId,
            mark: mark,
            comment: comment,
            date: new Date()
        })
        if(review.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }

    }

    async addReviewToAuthor(orderId: string, recipientId: string, reviewAuthorId: string, mark: number, comment: string) {
        const order = await orderRepository.find({
            relations: {
                requests: true
            },
            where: {
                id: orderId,
                authorsId: recipientId,
                requests: { executorId: reviewAuthorId, status: "ACCEPTED" }
            }
        })
            if (!order) return false

        const reviewExists = await reviewRepository.find({
                where: { orderId, authorId: reviewAuthorId, recipientId }
            })

            if(reviewExists.length > 0) return false

        const review = await reviewRepository.insert({
            id: v4(),
            orderId: orderId,
            recipientId: recipientId,
            authorId: reviewAuthorId,
            mark: mark,
            comment: comment,
            date: new Date()
        })

        if (review.raw.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }
    
    async deleteReview(reviewId: string, reviewAuthorId: string) { 
        const reviewExists = await reviewRepository.find({
            where: {
                id: reviewId,
                authorId: reviewAuthorId
            }
        })
        console.log('This is my review:')
        console.log(reviewId)
        console.log(reviewAuthorId)
        console.log(reviewExists[0])
        if(!reviewExists[0]) return false

        const deletedReview = await reviewRepository.delete({ id: reviewId, authorId: reviewAuthorId })
        if(deletedReview.affected > 0) {
            return true
        } else {
            return false
        }
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