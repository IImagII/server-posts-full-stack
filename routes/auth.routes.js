import { Router } from 'express'

import { check, validationResult } from 'express-validator'
import { register, login, getMe } from '../controllers/auth.js' // импортируем наш контролер отвечающий нзарегистрацию

const router = new Router() //создаем сам роутер

//Делаем роутер регистрации- registration
//http://localhost:3002/api/auth/register
router.post(
   '/register',
   // параметр для валидации поля которые нужно проверять
   [
      check('username', 'Не коректный username').exists(),

      check('password', 'Не коретный пароль').isLength({ min: 3, max: 12 }),
   ],
   register
)

//Делаем роутер логирование - login
//http://localhost:3002/api/auth/login

router.post('/login', login)

//Делаем роутер get me - me
//http://localhost:3002/api/auth/me
router.post('/me', getMe)

export default router
