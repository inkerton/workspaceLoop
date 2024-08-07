// import mongoose from 'mongoose';

// const IncidentSchema = new mongoose.Schema({
//     incidentNo: {
//         type: String,
//         required: true,
//         unique: true,
//         ref: 'NewIncident',  // Reference to the NewIncident collection
//     },
//     receivers: [{
//         value: String,
//         info: String,
//     }],
//     files: [{
//         filename: String,
//         originalname: String,
//         path: String,
//         mimetype: String,
//         size: Number,
//     }],
// }, { timestamps: true });

// const IncidentInfo = mongoose.models.IncidentInfo || mongoose.model("IncidentInfo", IncidentSchema);

// export default IncidentInfo;

// models/Incident.js
import mongoose from 'mongoose';
import NewIncident from './NewIncident';

const IncidentSchema = new mongoose.Schema({
    incidentNo: {
        type: String,
        required: true,
        unique: true,
        ref: NewIncident,
    },
    entryPointOfContactName: {
        type: String,
        required: true,
    },
    entryPointOfContactNumber: {
        type: String,
        required: true,
    },
    logCollectionDetails: {
        type: String,
        required: true,
    },
    artifacts: {
        type: String,
        required: true,
    },
    miscellaneousInfo: {
        type: String,
        required: true,
    },
    TTPDetails: {
        type: [{ value: String, info: String }],
        required: true,
    },
    pdfFiles: [
        {
            filename: String,
            fileId: mongoose.Schema.Types.ObjectId,
        },
    ],
}, { timestamps: true });

const IncidentInfo = mongoose.models.IncidentInfo || mongoose.model('Incident', IncidentSchema);

export default IncidentInfo;

