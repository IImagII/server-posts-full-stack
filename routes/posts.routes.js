import { Router } from 'express'
import { checkAuth } from '../utils/checkAuth.js'
import { createPost, getAll } from '../controllers/posts.js'

const router = new Router()
//Create post
//http://localhost:3002/api/posts
router.post('/', checkAuth, createPost) // обязательно через middleware поэтому мы сможем находить user через User

//Получение постов
//localhost:3002/api/posts
http: router.get('/', getAll)

export default router
