import { usersRepository } from "../common-files/mongodbConnection";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'

class AuthorizationService {
    async registerUser(userName: string, yearOfBirth: number, country: string, city: string, password: string) {
        const date = new Date();
        const currentYear: number = date.getFullYear();
        const userAge: number = currentYear - yearOfBirth
        if (userAge >= 18) {
            await usersRepository.insertOne({userName, age: userAge, country, city, password})
            return true
        } else {
            return false
        } 
    }

    async logInUser(userName: string, password: string) {
        const maybeUser = await usersRepository.find({userName, password}).toArray()
        console.log(maybeUser[0])
        if (maybeUser[0]) {
            const token = jwt.sign({userId: maybeUser[0]._id}, 'secret_key')
            return token;
        } 
        return false
    }

    async deleteUser(userId: string, password: string) {
        const user = await usersRepository.deleteOne({userId, password})
        return (user.deletedCount > 0) 
    }

    async editUser(userId: string, userName: string, yearOfBirth: number, country: string, city: string) {
            const date = new Date();
            const currentYear: number = date.getFullYear();
            const userAge: number = currentYear - yearOfBirth

            await usersRepository.updateOne({_id: { $eq: new ObjectId(userId) }},
                {
                    $set: {
                        userName: userName,
                        age: userAge,
                        country: country,
                        city: city
                    },
                    $currentDate: { lastUpdated: true }
                })
        }

        async checkUser(userId: string) {
            const user = await usersRepository.find({
                _id: { $eq: new ObjectId(userId) }
            }).toArray()
            return user[0]
        }
    
        async changePassword(userId: string, oldPassword: string, newPassword: string) {
            const rows = await usersRepository.updateOne({
                _id: { $eq: new ObjectId(userId) },
                password: oldPassword
            }, {
                $set: {
                    password: newPassword
                },
            })
            
            console.log(rows)
            return (rows.modifiedCount > 0)
        }

    async getUsers() {
        const users = await usersRepository.find().toArray()
        return users
    }
}

export const authorizationService = new AuthorizationService()

