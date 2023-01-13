import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'

const app = express() //создается такаим образом приложение
dotenv.config() // это делаем для переменных
app.use(morgan('dev')) //нужен для более комфортного логирования сервера то есть смотреть что происходит с сервером в данный момент
//Переменные из .env
const PORT = process.env.PORT || 5000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors()) // для того чтобы наш BAKEND разрешал запросы с других IP-адресов
//тестовый запрос для проверки

app.use(express.json()) // для того чтобы воспринимать формат json

app.mongoose.set('strictQuery', false) // делаем чтобы не выскакивало предупреждение

app.use('/api/auth', authRoutes) //вот мы подключили наш роутер авторизации

mongoose
   .connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.zjnmy1r.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
   )
   .then(() => {
      app.listen(PORT, () =>
         console.log(`MongoDb connect and server run ${PORT}`)
      )
   })
   .catch(error => console.log(error))
