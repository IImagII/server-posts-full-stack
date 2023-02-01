import Post from '../models/Post.js'
import User from '../models/User.js'
import path, { dirname } from 'path' // это делается дляперемещения файла с картинкой
import { fileURLToPath } from 'url' // это делается дляперемещения файла с картинкой

//Create Post
export const createPost = async (req, res) => {
   try {
      const { title, text } = req.body // получаем это с нашего фронта из формы
      const user = await User.findById(req.userId) //находим конкретного юзера работает толко через middleware checkAuth который мы уазали в posts.routes.js

      //добавляем картинки при этом делаем проверку если картинка у нас есть ее надо поместить в папку
      if (req.files) {
         let fileName = Date.now().toString() + req.files.image.name // формируем имя для файла картинки
         const __dirname = dirname(fileURLToPath(import.meta.url)) // благодаря этому мы получаем ту папку в которой мы находимся
         req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName)) // перемещаемся туда где будут хнариться файлы

         //формируем сам наш пост c картинкой
         const newPostWithImage = new Post({
            username: user.username, // берем нашего наденого user смотреть выше
            title,
            text,
            imgUrl: fileName,
            author: req.userId, // то что передается из токена и вшивается
         })
         await newPostWithImage.save() // непосредсвтенно добавляем в базу данных
         //Также это мы добавляем нашему User так как у нас есть ссылка в модели
         await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithImage },
         })
         return res.json(newPostWithImage) // возвращаем на фронтенд
      }
      // далее формируем пост без картинки
      const newPostWithoutImage = new Post({
         username: user.username, // берем нашего наденого user смотреть выше
         title,
         text,
         imgUrl: '',
         author: req.userId, // то что передается из токена и вшивается
      })
      await newPostWithoutImage.save() // добавляем в базу данных если картики нет
      //также добавляем нашему User который так как указана ссылка (ref) в модели
      await User.findByIdAndUpdate(req.userId, {
         $push: { posts: newPostWithoutImage },
      })
      return res.json(newPostWithoutImage) // возвращаем на фронтенд
   } catch (err) {
      res.json({ message: 'Что-то пошло не так 1' })
   }
}

//получение всех постов
export const getAll = async (req, res) => {
   try {
      const posts = await Post.find().sort('-createdAt') // мы находимосты и сортируем их по дате создания этой строкой
      const popularPosts = await Post.find().limit(5).sort('-views') // тут мы выводим популярные посты в количестве 5 штук и сортируем по просмотрам
      //делаем проверку если у нас нет постов
      if (!posts) {
         return res.json({ message: 'Постов нет' })
      }
      // а если они есть то отправляем их на клиент
      res.json({ posts, popularPosts })
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с постами' })
   }
}
