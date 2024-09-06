
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  incidentNo: { type: String, required: true, unique: true },
  comments: [
    {
      username: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, required: true },
    },
  ],
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
