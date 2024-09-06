import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;

