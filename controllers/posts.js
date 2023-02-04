import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
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

//получение конкретного поста по id
export const getById = async (req, res) => {
   try {
      const post = await Post.findByIdAndUpdate(req.params.id, {
         //нам нужно увеличить просмотры views
         $inc: { views: 1 }, // тут мы показываем что каждый раз мы будем увеличивать просомтры на 1 если такой пост будет найдет ивыдан
      })
      //делаем проверку
      if (!post) {
         return res.json({ message: 'Поста нет' })
      }
      res.json(post)
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с данным постом' })
   }
}

//получение всех постов конкретного пользователя
export const getMyPosts = async (req, res) => {
   try {
      //сначало находим пользователя в базе
      const user = await User.findById(req.userId)
      // необходимо получить ве посты которые находятся в массиве у данного пользователя
      const list = await Promise.all(
         // мы проходимся по массиву постов и получаем инфрмацию по каждому из постов
         user.posts.map(post => {
            return Post.findById(post._id)
         })
      )
      res.json(list)
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с данным постом' })
   }
}

//удаление поста
export const removePost = async (req, res) => {
   try {
      // сначало находим пост когда он его найдет он его сразу и удалит
      const post = await Post.findByIdAndDelete(req.params.id)
      if (!post) return res.json({ message: 'Такого поста не найдено' })

      //у конкретного пользователя из массива удалить этот пост чтобы он там не оставался
      await User.findByIdAndUpdate(req.userId, {
         $pull: { posts: req.params.id },
      })
      res.json({ message: 'Пост был удален' })
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с данным постом' })
   }
}

//Редактирвоание поста
export const updatePost = async (req, res) => {
   try {
      //сначало из запроса получим поля которые мы изменяли на нашем фронтенде
      const { title, text, id } = req.body
      //  находим пост rjyrhtnysq
      const post = await Post.findById(id) //по тому id который к нам пришел иззапроса фронтенда

      //создаем путь опять для картинки если она будет новой(берем из создания поста)
      // при этом делаем проверку если у нас картинка или нет
      if (req.files) {
         let fileName = Date.now().toString() + req.files.image.name // формируем имя для файла картинки
         const __dirname = dirname(fileURLToPath(import.meta.url)) // благодаря этому мы получаем ту папку в которой мы находимся
         req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName)) // перемещаемся туда где будут хнариться файлы
         post.imgUrl = fileName || '' // это строку добавляем сюда
      }
      post.title = title // тут делаем замену то что пришло title на новое
      post.text = text // тут делаем замену то что пришло text на новое

      await post.save() // теперь весь пост записываем целиком в базу данных

      res.json({ post, message: 'пост отредактирован' })
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с данным постом' })
   }
}

//получение всех коментариев по данному конкретномупосту
export const getCommentsPost = async (req, res) => {
   try {
      //сначало находим пост в базе по id который мы берем из параметров
      const post = await Post.findById(req.params.id)

      // необходимо получить все коментарии которые находятся в массиве у данного поста
      const list = await Promise.all(
         // мы проходимся по массиву постов и получаем инфрмацию по каждому из постов
         post.comments.map(comment => {
            return Comment.findById(comment)
         })
      )
      res.json(list)
   } catch (err) {
      res.json({ message: 'Что-то пошло не так с получением коментариев' })
   }
}
