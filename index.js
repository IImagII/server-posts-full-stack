import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/posts.routes.js'
import commentsRoutes from './routes/comments.routes.js'

import fileUpload from 'express-fileupload'

const app = express() //создается такаим образом приложение
dotenv.config() // это делаем для переменных
app.use(morgan('dev')) //нужен для более комфортного логирования сервера то есть смотреть что происходит с сервером в данный момент

//Переменные из .env
const PORT = process.env.PORT || 5000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

//Middleware
app.use(cors()) // для того чтобы наш BAKEND разрешал запросы с других IP-адресов
app.use(express.json()) // для того чтобы воспринимать формат json
app.use(fileUpload()) // для загрузки файлов
app.use(express.static('uploads')) // показываем путь где будут храниться статические файлы

mongoose.set('strictQuery', true) // делаем чтобы не выскакивало предупреждение

app.use('/api/auth', authRoutes) //вот мы подключили наш роутер авторизации, регистрации , профиля
app.use('/api/posts', postRoutes) // роут обращения для создания поста
app.use('/api/comments', commentsRoutes) // роут создание коментария

//Тестовый запрос для проверки
app.get('/', (req, res) => {
   res.send('Hello World')
})
mongoose
   .connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.zjnmy1r.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
   )
   .then(() => {
      app.listen(PORT, () =>
         console.log(`MongoDb connect and server run on ${PORT}`)
      )
   })
   .catch(error => console.log(error))
