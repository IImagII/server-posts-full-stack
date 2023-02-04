import { Router } from 'express'
import { checkAuth } from '../utils/checkAuth.js'
import {
   createPost,
   getAll,
   getById,
   getCommentsPost,
   getMyPosts,
   removePost,
   updatePost,
} from '../controllers/posts.js'

const router = new Router()
//Create post
//http://localhost:3002/api/posts
router.post('/', checkAuth, createPost) // обязательно через middleware поэтому мы сможем находить user через User

//Получение постов
//localhost:3002/api/posts
router.get('/', getAll)

//Получение постов по id
//localhost:3002/api/posts/:id
router.get('/:id', getById)

//Вывод всех постов конкретноо пользователя
//localhost:3002/api/posts/user/me
router.get('/user/me', checkAuth, getMyPosts)

//Удаление постов
//localhost:3002/api/posts/:id
router.delete('/:id', checkAuth, removePost)

//Редактивароние поста
//localhost:3002/api/posts/:id
router.put('/:id', checkAuth, updatePost)

//Получение комментарии к посту
//localhost:3002/api/posts/comments/:id
router.get('/comments/:id', getCommentsPost)

export default router
