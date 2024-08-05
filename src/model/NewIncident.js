import mongoose from 'mongoose';

const newIncidentSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: true,
        unique: true,
    },
    inputSource: {
        type: String,
        required: true,
    },    
    dateOfInput: {
        type: Date,
        required: false,
    },    
    entityImpacted: {
        type: String,
        required: false,
    },    
    category: {
        type: String,
        required: false,
    },    
    brief: {
        type: String,
        required: false,
    },    
    assignedTo: {
        type: String,
        required: false,
    },    
    status: {
        type: String,
        required: false,
    },    
    comment: {
        type: String,
        required: false,
    },    
}, {timestamps: true})

const NewIncident = mongoose.models.NewIncident || mongoose.model("NewIncident",newIncidentSchema)

export default NewIncident;