import { router as usersRouter } from "./Users/usersRouter"
import { router as ordersRouter } from "../src/Orders/ordersRouter"
import { router as reviewsRouter } from "../src/Reviews/reviewsRouter"
import { router as requestsRouter } from "../src/Requests/requestsRouter"

const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

app.use('/users', usersRouter)
app.use('/orders', ordersRouter)
app.use('/reviews', reviewsRouter)
app.use('/requests', requestsRouter)



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  })

