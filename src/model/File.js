import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    fileData: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.File || mongoose.model('File', FileSchema);