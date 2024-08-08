const nodemailer = require("nodemailer");

const OtpTempate = (otp) => {
    return `
    <div div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Ebuy</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Your Ebuy. Use the following OTP to complete your Sign Up procedures. OTP is valid for
            5 minutes</p>
        <h2
            style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
            ${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Your Ebuy</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Ebuy Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>USA</p>
        </div>
    </div>
    </div>`
}

module.exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f1cca267d908ae",
            pass: "546752b1e1ad91"
        }
    });
    await transporter.sendMail({
        from: 'noreply@ebuy.com',
        to: options.email,
        subject: options.subject,
        html: OtpTempate(options.code),
    });
};