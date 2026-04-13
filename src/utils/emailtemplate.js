const emailtemplate=(otp)=>{
    return `
          <div style="background-color: #f9fafb; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
              
              <div style="background: linear-gradient(135deg, #ab66f1 0%, #ab0112 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">SheetXray</h1>
              </div>

              <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #111827; font-size: 22px; margin-top: 0;">Verify your identity</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Hello! To keep your account secure, please use the following one-time password (OTP) to complete your verification.
                </p>

                <div style="margin: 35px 0;">
                  <div style="display: inline-block; background: #f3f4f6; border: 2px dashed #6366f1; border-radius: 12px; padding: 15px 30px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #4338ca; letter-spacing: 8px;">
                      ${otp}
                    </span>
                  </div>
                </div>

                <p style="color: #6b7280; font-size: 14px;">
                  This code is valid for <b>4 minutes</b>. <br>
                  If you didn't request this code, you can ignore this email.
                </p>
              </div>

              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  &copy; 2026 SheetXray Intelligence. All rights reserved.
                </p>
                <div style="margin-top: 10px;">
                </div>
              </div>
            </div>
            </div>`
}
const welcomemailtemplate=`
          <div style="background-color: #f9fafb; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
              <div style="background: linear-gradient(135deg, #ab66f1 0%, #ab0112 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">SheetXray</h1>
              </div>
              <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #111827; font-size: 22px; margin-top: 0;">Welcome to SheetXray!</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  We're thrilled to have you on board. SheetXray is your intelligent assistant for all things spreadsheet-related. Whether you're looking to analyze data, automate tasks, or simply get insights from your sheets, we've got you covered.
                </p>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  To get started, simply log in to your account and explore the powerful features we offer. If you have any questions or need assistance, our support team is here to help.
                </p>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Thank you for choosing SheetXray. We look forward to helping you unlock the full potential of your spreadsheets!
                </p>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  &copy; 2026 SheetXray Intelligence. All rights reserved.
                </p>
                <div style="margin-top: 10px;">
                </div>
              </div>
            </div>
            </div>`
export {emailtemplate,welcomemailtemplate};