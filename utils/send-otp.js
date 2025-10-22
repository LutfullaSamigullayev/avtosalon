const nodemailer = require("nodemailer")

module.exports = async function(email, otp) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "samigullayevlutfulla@gmail.com",
                pass: process.env.APP_PASS
            }
        })
        await transport.sendMail({
            from: "samigullayevlutfulla@gmail.com",
            to:email,
            subject: "Avto Salon",
            text: "Verification code from Avto Salon",
            html: `<p style="font-size: 24px">Verify code: <strong style="color: green">${otp}</strong></p>`
        })
    } catch (error) {
        throw new Error(error)
    }
}

