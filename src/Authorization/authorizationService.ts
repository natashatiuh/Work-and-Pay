const mysql = require('mysql2/promise');
import { connection, userRepository } from "../common-files/mysqlConnection";
import { v4 } from 'uuid';
const jwt = require('jsonwebtoken');

class AuthorizationService {
    async registerUser(userName: string, yearOfBirth: number, country: string, city: string, password: string) {
        const date = new Date();
        const currentYear: number = date.getFullYear();
        const userAge: number = currentYear - yearOfBirth
        if (userAge >= 18) {
            await connection.query(`
            INSERT INTO users (id, userName, age, country, city, password)
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [v4(), userName, userAge, country, city, password])
            return true
        } else {
            return false
        } 
    }

    async logInUser(userName: string, password: string) {
        const maybeUser = await userRepository.query(
            `SELECT * FROM users WHERE userName = ? AND password = ?`, 
            [userName, password]
        )
        console.log(maybeUser)
        if (maybeUser) {
            const token = jwt.sign({userId: maybeUser.id}, 'secret_key')
            return token;
        } 
        return false
    }

    async deleteUser(userId: string, password: string) {
        const [rows] = await connection.query(`DELETE FROM users WHERE id = ? AND password = ?`, 
        [userId, password])
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async editUser(userId: string, userName: string, yearOfBirth: number, country: string, city: string) {
            const date = new Date();
            const currentYear: number = date.getFullYear();
            const userAge: number = currentYear - yearOfBirth
            await connection.query(
                `UPDATE users 
                SET userName = ?, age = ?, country = ?, city = ?
                WHERE id = ?`, 
                [userName, userAge, country, city, userId])
        }

    async checkUser(userId: string) {
        const [users] = await connection.query(`SELECT * FROM users WHERE id = ?`, [userId])
        if(users[0]) {
            return true
        } else {
            return false
        }
    }

    async changePassword(oldPassword: string, newPassword: string) {
        const [rows] = await connection.query(`
        UPDATE users SET password = ? WHERE password = ?`,
        [newPassword, oldPassword])
        console.log(rows)
        if(rows.affectedRows > 0) {
            return true
        } else {
            return false
        }
    }

    async getUsers() {
        const [rows] = await connection.query(`
        SELECT * FROM users`
        );
        return rows;
    }
}

export const authorizationService = new AuthorizationService()

