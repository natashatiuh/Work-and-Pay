const mysql = require('mysql2/promise');
import { connection } from "../common-files/mysqlConnection";
import { v4 } from 'uuid';
const jwt = require('jsonwebtoken');

class AuthorizationService {
    async registerUser(userName: string, yearOfBirth: number, country: string, city: string, password: string) {
        const date = new Date();
        const currentYear: number = date.getFullYear();
        const userAge: number = currentYear - yearOfBirth
        if (userAge >= 18) {

            const query = `
                INSERT INTO users (id, userName, age, country, city, password)
                VALUES (?, ?, ?, ?, ?, ?)
            `
            const params = [v4(), userName, userAge, country, city, password]

            await connection.query(query, params)
            return true
        } else {
            return false
        } 
    }

    async logInUser(userName: string, password: string) {
        const query = `
            SELECT * FROM users 
            WHERE userName = ? AND password = ?
        `
        const params = [userName, password]

        const [maybeUser] = await connection.query(query, params)
        console.log(maybeUser[0])
        if (maybeUser[0]) {
            const token = jwt.sign({userId: maybeUser[0].id}, 'secret_key')
            return token;
        } 
        return false
    }

    async deleteUser(userId: string, password: string) {
        const query = `
            DELETE FROM users 
            WHERE id = ? AND password = ?
        `
        const params = [userId, password]

        const [user] = await connection.query(query, params)
        return (user.affectedRows > 0) 
    }

    async editUser(userId: string, userName: string, yearOfBirth: number, country: string, city: string) {
            const date = new Date();
            const currentYear: number = date.getFullYear();
            const userAge: number = currentYear - yearOfBirth

            const query = `
                UPDATE users 
                SET userName = ?, age = ?, country = ?, city = ?
                WHERE id = ?
            `
            const params = [userName, userAge, country, city, userId]

            await connection.query(query, params)
        }

    async checkUser(userId: string) {
        const query = `
            SELECT * FROM users WHERE id = ?
        `
        const params = [userId]

        const [users] = await connection.query(query, params)
        console.log('This is:')
        console.log(users[0])
        return users[0]
    }

    async changePassword(oldPassword: string, newPassword: string) {
        const query = `
            UPDATE users 
            SET password = ? 
            WHERE password = ?
        `
        const params = [newPassword, oldPassword]

        const [rows] = await connection.query(query, params)
        console.log(rows)
        return (rows.affectedRows > 0)
    }

    async getUsers() {
        const [users] = await connection.query(`
        SELECT * FROM users`
        );

        return users
    }
}

export const authorizationService = new AuthorizationService()

