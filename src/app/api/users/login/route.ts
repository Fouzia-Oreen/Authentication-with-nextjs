/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from '@/dfConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password}  = reqBody
        console.log(reqBody);

        const user = await User.findOne({email})
        if (!user) {
            return NextResponse.json({error: "User doesnot exist"}, {status: 400})
        }
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({error: "Check your credentials"}, {status: 400})
        }
        /// jwt token
        const tokenData = {
            id:user._id,
            firstname:user.firstname,
            email:user.email
        }
        const jwtToken = await jwt.sign({tokenData},process.env.TOKEN_SECRET!, {expiresIn : "1d"})
        const response = NextResponse.json({
            message:"Logged in success",
            success: true
        })
        const cookies = response.cookies.set("token", jwtToken, {
            httpOnly:true
        })
        return cookies
    } catch (error: any) {
        return NextResponse.json({error:error.message},{ status: 500})
    }
}