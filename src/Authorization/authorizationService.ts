const mysql = require('mysql2/promise');
import { connection } from "../common-files/mysqlConnection";
import { v4 } from 'uuid';
const jwt = require('jsonwebtoken');
import { userRepository } from "../common-files/mysqlConnection";

class AuthorizationService {
    async registerUser(userName: string, yearOfBirth: number, country: string, city: string, password: string) {
        const date = new Date();
        const currentYear: number = date.getFullYear();
        const userAge: number = currentYear - yearOfBirth
        if (userAge >= 18) {
            await userRepository.insert({
                id: v4(),
                userName: userName,
                age: userAge,
                country: country,
                city: city,
                password: password
            })
            return true
        } else {
            return false
        } 
    }

    async logInUser(userName: string, password: string) {
        const user = await userRepository.findOne({
            where: {userName, password}
        })
        if (user) {
            const token = jwt.sign({userId: user.id}, 'secret_key')
            return token;
        } 
        return false
    }

    async deleteUser(userId: string, password: string) {
        const result = await userRepository.delete({id: userId, password})
        if(result.affected > 0) {
            return true
        } else {
            return false
        }
    }

    async editUser(userId: string, userName: string, yearOfBirth: number, country: string, city: string) {
            const date = new Date();
            const currentYear: number = date.getFullYear();
            const userAge: number = currentYear - yearOfBirth
            await userRepository.update(
                {id: userId},
                {userName: userName, age: userAge, country: country, city: city}
            )
        }

    async checkUser(userId: string) {
        const user = await userRepository.findOne({
            where: {id: userId}
        })
        if (user) {
            return true
        } else {
            return false
        }
    }

    async changePassword(oldPassword: string, newPassword: string) {
        const result = await userRepository.update(
            {password: oldPassword},
            {password: newPassword}
        )
        console.log(result)
        if(result.affected > 0) {
            return true
        } else {
            return false
        }
    }

    async getUsers() {
        return await userRepository.find()
    }
}

export const authorizationService = new AuthorizationService()

