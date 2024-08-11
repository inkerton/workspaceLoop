
// models/Incident.js
import mongoose from 'mongoose';
import NewIncident from './NewIncident';

const IncidentSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: false,
    },
    entryPointOfContactName: {
        type: String,
        required: false,
    },
    entryPointOfContactNumber: {
        type: String,
        required: false,
    },
    logCollectionDetails: {
        type: String,
        required: false,
    },
    artifacts: {
        type: String,
        required: false,
    },
    miscellaneousInfo: {
        type: String,
        required: false,
    },
    TTPDetails: {
        type: [{ value: String, info: String }],
        required: false,
    },
    pdfFiles: [
        {
            filename: String,
            fileId: mongoose.Schema.Types.ObjectId,
            data: Buffer,
        },
    ],
}, { timestamps: true });

const IncidentInfo = mongoose.models.IncidentInfo || mongoose.model('IncidentInfo', IncidentSchema);

export default IncidentInfo;

