import { connect } from "../common-files/mysqlConnection";
const mysql = require('mysql2/promise');
import { v4 } from "uuid";

class ReviewsService {
    async addReview(userId: string, mark: number, comment: string) {
        const connection = await connect;
        await connection.query(`INSERT INTO reviews (id, userId, mark, comment) VALUES (?, ?, ?, ?)`,
        [v4(), userId, mark, comment])
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