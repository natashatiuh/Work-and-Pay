import { router as authorization } from "../src/Authorization/authorizationRouter"
import { router as ordersRouter } from "../src/Orders/ordersRouter"
import { router as reviewsRouter } from "../src/Reviews/reviewsRouter"
import { router as requestsRouter } from "../src/Requests/requestsRouter"
import cors from 'cors'

const express = require('express')
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

app.use('/authorization', authorization)
app.use('/orders', ordersRouter)
app.use('/reviews', reviewsRouter)
app.use('/requests', requestsRouter)



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})

