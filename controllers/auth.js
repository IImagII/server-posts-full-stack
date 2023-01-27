//register user
import User from '../models/User.js'
import { validationResult } from 'express-validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
   try {
      //это мы проверяем есть ли у нас ошибки при прохождени ивалидации
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ message: 'Произошла ошибка', errors })
      }

      const { username, password } = req.body //вытягиваем из запроса через деструктуризацию
      // Поиск в базе данных
      const candidate = await User.findOne({ username })
      //если такой пользователь уже существует
      if (candidate) {
         return res.status(409).json({
            message: 'Такой username уже существует',
         })
      }
      // шифрование пароля
      const hashPassword = await bcryptjs.hash(password, 10)
      // создание пользователя
      const user = new User({
         username,
         password: hashPassword,
      })
      //нюанс сразу добавим токен
      const token = jwt.sign(
         {
            id: user._id,
         },
         process.env.JWT_SECRET
      )
      // запись в базу данных пользователя
      await user.save()
      //это мы формируем ответ на фронтенд
      return res
         .status(200)
         .json({ user, token, message: 'Пользователь создан' })
   } catch (e) {
      console.log(e)
      res.send({ message: 'Server error', e })
   }
}

//register login
export const login = async (req, res) => {
   try {
   } catch (e) {
      console.log(e)
      res.send({ message: 'Server error', e })
   }
}

//register get me
export const getMe = async (req, res) => {
   try {
   } catch (e) {
      console.log(e)
      res.send({ message: 'Server error', e })
   }
}
