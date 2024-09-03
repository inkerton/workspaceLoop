// import mongoose from 'mongoose';

// const replySchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   dateOfReply: { type: Date, required: true },
// });

// const commentsSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   replies: [replySchema],
//   date: { type: Date, required: true },
// });

// const commentSchema = new mongoose.Schema({
//   incidentNo: { type: String, required: true, unique: true },
//   username: { type: String, required: true },
//   comments: [commentsSchema],
// });

// const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

// export default Comment;

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  incidentNo: { type: String, required: true, unique: true },
  comments: [
    {
      username: { type: String, required: true },
      text: { type: String, required: true },
      replies: [
        {
          text: { type: String, required: false },
          dateOfReply: { type: Date, required: false },
          username: { type: String, required: false },
        },
      ],
      date: { type: Date, required: true },
    },
  ],
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
