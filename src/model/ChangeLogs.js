import mongoose from 'mongoose';

const changeLogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },    
    timeOfAction: {
        type: Date,
        required: true,
    },
    incidentNo: {
        type: String,
        required: true,
    },
}, {timestamps: true})

const ChangeLog = mongoose.models.ChangeLog || mongoose.model("ChangeLog",changeLogSchema)

export default ChangeLog;