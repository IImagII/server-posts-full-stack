import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

//получение всех постов
export const createComment = async (req, res) => {
   try {
      //Получаем из нашего клиента
      const { postId, comment } = req.body
      if (!comment) {
         return res.json({ message: 'Коментарий не может быть пустым' })
      }
      // Создаем новую модель куда мы будем передавать ринимаемый из клиента коментарий
      const newComment = new Comment({ comment })

      //Далее сохраняем наш новый коментарий в базе данных
      await newComment.save()

      // нам нужно добавить к конкретному посту данный коментарий( как это мы делали с постами )
      // сначало мы его находим и потом добавляем и обновляем findByIdAndUpdate
      //мы пушим потомучто в каждом посте мы добавили массив с коменатриями
      try {
         await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id },
         })
      } catch (err) {
         console.log(err)
      }
      // Отдаем обратно ответ на клиент
      res.json({ newComment, messages: 'Коментарий создан' })
   } catch (err) {
      res.json({ message: 'Что-то пне так скоментариями' })
   }
}
