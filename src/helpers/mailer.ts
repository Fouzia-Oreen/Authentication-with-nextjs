/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async ({email, emailType, userId} : any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
            {$set :{ verifyToken: hashedToken, 
              verifyTokenExpiry: Date.now() + 3600000
            }}
        )
        }
        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, 
                {$set :{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}}
            )
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: process.env.AUTH_USER, 
            pass: process.env.AUTH_PASS
            // user:"be6a05b4838422",
            // pass:"8b1976603f6f95"
            }
        });
        const mailOptions = await transport.sendMail({
            from: 'fouziaoreen.dev@gmail.com', // sender 
            to: email, //  receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line of email
            html: `
            <h2>Welcome User !</h2></br> 
            <p>Thank you for joining the site! To activate your account and start exploring, please click the verification link below.</p></br>
            <p>Click <a href=${process.env.DOMAIN}/verifyemail?token=${hashedToken}> here </a>${emailType === "VERIFY" ? "to verify your email" : " to reset your password"} or copy and paste the link below in your browser.</br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p></br>
            Thank you for choosing Demodoo!</br>
            <p>Best Regards</p>,
            <p>Fouzia Oreen</p>`, // html body or mail body
          })
         const mailResponse =  await transport.sendMail(mailOptions) 
         return mailResponse
          // forgot email
          
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        throw new Error(error.message);
        
    }
}