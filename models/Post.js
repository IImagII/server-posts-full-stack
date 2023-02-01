import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
   {
      username: { type: String }, // этот username нам приходит с фронтенда
      title: { type: String, required: true },
      text: { type: String, required: true },
      imgUrl: { type: String, default: '' }, //путь к картинке
      views: { type: Number, default: 0 }, // просмотры
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //тут мы показываем что у нас есть ссылка на другую модель  на автора
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // ссылка на таблицу с комнтариями
   },
   { timestamps: true } // для того чтобы видеть историю создания поста, его редактирование и др.
)

export default mongoose.model('Post', PostSchema)
