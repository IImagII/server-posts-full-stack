import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
   {
      username: {
         type: String, //это его тип
         required: true, //это флаг что он является обязательным
         unique: true, //это флаг что он будет уникальный
      },
      password: {
         type: String,
         required: true,
      },
      posts: [
         {
            type: mongoose.Schema.Types.ObjectId, //тут мы показываем что у нас есть ссылка на другую модель
            ref: 'Post', //указываем на название этой схемы
         },
      ],
   },
   {
      timestamps: true, // для того чтобы видеть историю создания поста, его редактирование и др.
   }
)

export default mongoose.model('User', UserSchema)
