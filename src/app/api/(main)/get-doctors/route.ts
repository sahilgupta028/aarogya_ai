import mongoose from "mongoose";
import DoctorModel, { Doctor } from "@/models/Doctor";
import PatientModel from "@/models/Patient";
import DepartmentModel from "@/models/utils/Department";
import DiseaseModel from "@/models/Disease";
import AppointmentModel from "@/models/utils/Appointment";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url, "http://localhost:3000");
    const { department, disease, location, specialty } = Object.fromEntries(searchParams);
    console.log(department, disease, location, searchParams, specialty);

    await dbConnect();
    console.log("Connected to DB")

    try {
        const departmentList = <String[]>[];
        departmentList.push(department);
        console.log("departmentList: ", departmentList)

        let doctors = new Set<Doctor>();

        console.log("doctors: ", doctors)

        if(disease != undefined || disease != null){
            const diseaseData = await DiseaseModel.find(
                {
                    name: disease
                }
            )

           // console.log("diseaseData: ", diseaseData)

            if(diseaseData != undefined && diseaseData != null && diseaseData.length > 0){

                const departmentsByDisease = diseaseData[0].departments;
                console.log("departmentsByDisease: ", departmentsByDisease)

                const doctorsByDisease = await DoctorModel.find(
                    {
                        department: { $in: departmentsByDisease }
                    }
                )

                console.log("doctorsByDisease: ", doctorsByDisease)

                if(doctorsByDisease) {
                    doctorsByDisease.forEach(doctor => {
                        doctors.add(doctor)
                    })
                }

            }
            
            console.log("departmentByDisease Not Found :(")

        }

       

        if(department || location || specialty) {
            const doctorsByParams = await DoctorModel.find(
                {
                    $or: [
                        { department: department },
                        { speciality: specialty },
                        { location: location }
                    ]
                }
            )

            console.log("doctorsByParams: ", doctorsByParams)

            if(doctorsByParams) {
                doctorsByParams.forEach(doctor => {
                    doctors.add(doctor)
                })
            }

        }
        

        if(doctors.size === 0 && !doctors) {
            return NextResponse.json({
                status: "error",
                message: "No doctors found"
            
            }, 
            { status: 504 });
        }

        console.log("final doctors: ", Array.from(doctors))

        return NextResponse.json({
            status: "success",
            doctors: Array.from(doctors)
        },
        { status: 200 }
        );

        
        
    } catch (error) {
        console.log("Error in get-doctors route: ", error);
        return NextResponse.json({
            status: "error",
            message: "Error in get-doctors route",
            error: error
        },
        { status: 500 }
        );
    }

    
  
}