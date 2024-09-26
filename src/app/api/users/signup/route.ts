/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from '@/dfConfig/dbConfig';
import { sendMail } from '@/helpers/mailer';
import User from '@/models/userModel';
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from 'next/server';

connect()
export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json()
        const {firstname ,lastname, email, password} = reqBody
        console.log(reqBody);
        
        // validation
        const user = await User.findOne({email})
        if (user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        // hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password ,salt)

        const newUser = new User ({
            firstname,
            lastname,
            email,
            password:hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser);

        // send verification email
        await sendMail({email, emailType: "VERIFY", userId: savedUser._id})
        return NextResponse.json({message: "User register successfully", success:true,
        savedUser
        }
        )
    } catch (error: any) {
        return NextResponse.json({error:error.message},{ status: 500}
        )
    }
}