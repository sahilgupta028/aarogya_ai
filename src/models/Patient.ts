import mongoose, {Schema, Document}  from "mongoose";
import { HistorySchema } from "./utils/History";
import { Appointment } from "./utils/Appointment";


export interface Patient extends Document{
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    age?: number;
    diseases?: string[];
    appointments?: Appointment[];
    history?: History[];
    height?: number;
    weight?: number;
    bloodGroup?: string;
    allergies?: string[];
    medications?: string[];
    address?: string;
}


const PatientSchema = new Schema<Patient>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: false },
        age: { type: Number, required: false },
        diseases: { type: [String], required: false },
        appointments: { type: [String], required: false },
        history: [
            HistorySchema
        ],
        height: { type: Number, required: false },
        weight: { type: Number, required: false },
        bloodGroup: { type: String, required: false },
        allergies: { type: [String], required: false },
        medications: { type: [String], required: false },
        address: { type: String, required: false },
    },
    { 
        timestamps: true
    }
);

const PatientModel = mongoose.models && mongoose.models.Patient || mongoose.model<Patient>('Patient', PatientSchema);
export default PatientModel;

