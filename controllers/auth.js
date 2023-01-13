//register user
import User from '../models/User'
import { bcryptjs } from 'bcryptjs'

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
      // запись в базу данных пользователя
      await user.save()
      return res.status(200).json({ user, message: 'Пользователь создан' })
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
