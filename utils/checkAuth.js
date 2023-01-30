import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
   // берем строку с ответа который нам приходит и тот коотры ймы написали в файле axios.js на фронтенде
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '') //Такой строкой мы доставем сам токен отбрасывая Bearer
   // если токен присутсвует
   if (token) {
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET) //декодируем наш токен
         req.userId = decoded.id //мы добавляем дополнительное поле
         next() //обязательно для middleware оно пропускает дальше после выполнения условий функции
      } catch (err) {
         return res.json({
            message: 'Нет доступа',
         })
      }
   } else {
      return res.json({
         message: 'Нет доступа',
      })
   }
}
