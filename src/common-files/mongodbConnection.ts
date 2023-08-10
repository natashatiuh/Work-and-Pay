import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://natasha25:AGF%21yae%2Atwz%40tbg0nxu@cluster0.yzqe8ky.mongodb.net/?retryWrites=true&w=majority"

export const client = new MongoClient(uri, {})

const db = client.db('kabanchik')

export const usersRepository =  db.collection('users')
export const ordersRepository = db.collection('orders')
export const requestsRepository = db.collection('requests')
export const reviewsRepository = db.collection('reviews')