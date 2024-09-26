/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from "nodemailer"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMail = async ({email, emailType, userId} : any) => {
    try {
        // TODO configure mail for usage
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
            },
        });
        const mailOptions = await transporter.sendMail({
            from: 'fouziaoreen.dev@gmail.com', // sender 
            to: email, //  receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line of email
            // text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body or mail body
          })
         const mailResponse =  await transporter.sendMail(mailOptions) 
         return mailResponse
          ;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        throw new Error(error.message);
        
    }
}