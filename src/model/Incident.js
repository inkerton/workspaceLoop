import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: true,
        unique: true,
        ref: 'NewIncident',  // Reference to the NewIncident collection
    },
    receivers: [{
        value: String,
        info: String,
    }],
    files: [{
        filename: String,
        originalname: String,
        path: String,
        mimetype: String,
        size: Number,
    }],
}, { timestamps: true });

const IncidentInfo = mongoose.models.IncidentInfo || mongoose.model("IncidentInfo", IncidentSchema);

export default IncidentInfo;
