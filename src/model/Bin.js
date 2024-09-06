import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: true,
        // unique: true,
    },
    inputSource: {
        type: String,
        required: true,
    },    
    dateOfInput: {
        type: Date,
        required: false,
    },    
    incidentClosedOn: {
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
        type: [String],
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
    deletedBy: {
        type: String,
        required: false,
    },    
    deletedOn: {
        type: Date,
        required: false,
    },    
}, {timestamps: true})

const BinIncident = mongoose.models.BinIncident || mongoose.model("BinIncident",binSchema)

export default BinIncident;