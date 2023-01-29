import { Router } from 'express'

import { check } from 'express-validator'
import { register, login, getMe } from '../controllers/auth.js' // импортируем наш контролер отвечающий нзарегистрацию
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router() //создаем сам роутер

//Делаем роутер регистрации- registration
//http://localhost:3002/api/auth/register
router.post(
   '/register',
   // параметр для валидации поля которые нужно проверять
   [
      check('username', 'Не коректный username'),

      check('password', 'Не коретный пароль').isLength({ min: 3, max: 12 }),
   ],
   register
)

//Делаем роутер логирование - login
//http://localhost:3002/api/auth/login

router.post('/login', login)

//Делаем роутер get me - me
//http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe) // мы добавили middleware для того чтобы доступ к постам был только у авторизированных пользователей

export default router
