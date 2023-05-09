const mysql = require('mysql2/promise');
import { connect } from "../common-files/mysqlConnection";
import { v4 } from 'uuid';

class AuthorizationService {
    async registerUser(userName: string, yearOfBirth: number, country: string, city: string, password: string) {
        const connection = await connect;
        const date = new Date();
        const currentYear: number = date.getFullYear();
        const userAge: number = currentYear - yearOfBirth
        if (userAge >= 18) {
            await connection.query(`INSERT INTO users 
            (id, userName, age, country, city, password)
            VALUES (?, ?, ?, ?, ?, ?)`, [v4(), userName, userAge, country, city, password])
            return true
        } else {
            return false
        } 
    }

    async logInUser(userName: string, password: string) {
        const connection = await connect;
        
        const [maybeUser] = await connection.query(
            `SELECT * FROM users WHERE userName = ? AND password = ?`, 
            [userName, password]
        )
        console.log(maybeUser[0])
        if (maybeUser[0]) return true
        
        return false
    }

    async deleteUser(userId: string, password: string) {
        const connection = await connect;
        await connection.query(`DELETE FROM users WHERE id = ? AND password = ?`, 
        [userId, password])
    }

    async editUser(userId: string, userName: string, yearOfBirth: number, country: string, city: string) {
            const connection = await connect;
            const date = new Date();
            const currentYear: number = date.getFullYear();
            const userAge: number = currentYear - yearOfBirth
            await connection.query(`UPDATE users 
            SET userName = ?, age = ?, country = ?, city = ?
            WHERE id = ?`, [userName, userAge, country, city, userId])
        }

    async changePassword(oldPassword: string, newPassword: string) {
        const connection = await connect;
        await connection.query(`UPDATE users SET password = ? WHERE password = ?`,
        [newPassword, oldPassword])
    }

    async getUsers() {
        const connection = await connect;
        const [rows] = await connection.query(`SELECT * FROM users`);
        return rows;
    }
}

export const authorizationService = new AuthorizationService()

