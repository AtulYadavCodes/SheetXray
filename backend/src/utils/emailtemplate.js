const emailtemplate = (otp) => {
  return `
  <div style="background:#f3f4f6;padding:30px 0;font-family:Arial,sans-serif;">
    
    <div style="max-width:600px;margin:auto;background:#ffffff;
    border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      
      <!-- HEADER -->
      <div style="padding:20px;text-align:center;border-bottom:1px solid #e5e7eb;">
        <h2 style="margin:0;color:#111827;">SheetXray</h2>
      </div>

      <!-- BODY -->
      <div style="padding:30px;text-align:center;">

        <p style="color:#374151;font-size:15px;">
          Use the following OTP to verify your account:
        </p>

        <!-- SHEET STYLE BOX -->
        <div style="margin:25px auto;width:fit-content;
        background:
        linear-gradient(#e5e7eb 1px, transparent 1px),
        linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
        background-size:40px 40px;
        padding:20px;border-radius:6px;">
          
          <div style="background:#ffffff;border:1px solid #9ca3af;
          padding:10px 20px;">
            <span style="font-size:28px;font-weight:bold;
            letter-spacing:6px;color:#111827;">
              ${otp}
            </span>
          </div>

        </div>

        <p style="font-size:13px;color:#6b7280;">
          Valid for 4 minutes.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          © 2026 SheetXray
        </p>
      </div>

    </div>
  </div>
  `;
};


const welcomemailtemplate = `
<div style="background:#f3f4f6;padding:30px 0;font-family:Arial,sans-serif;">

  <div style="max-width:600px;margin:auto;background:#ffffff;
  border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">

    <!-- HEADER -->
    <div style="padding:20px;text-align:center;border-bottom:2px solid #22c55e;">
      <h2 style="margin:0;color:#111827;">SheetXray</h2>
    </div>

    <!-- BODY -->
    <div style="padding:30px;">

      <h3 style="text-align:center;color:#111827;">Welcome 👋</h3>

      <p style="color:#374151;font-size:15px;text-align:center;">
        You're ready to explore your spreadsheets with intelligence.
      </p>

      <!-- SHEET VISUAL -->
      <div style="margin:25px 0;
      background:
      linear-gradient(#e5e7eb 1px, transparent 1px),
      linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
      background-size:50px 40px;
      padding:20px;border-radius:6px;">

        <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:center;">
          <tr style="background:#f0fdf4;">
            <th style="border:1px solid #d1d5db;padding:6px;">A</th>
            <th style="border:1px solid #d1d5db;padding:6px;">B</th>
            <th style="border:1px solid #d1d5db;padding:6px;">C</th>
          </tr>
          <tr>
            <td style="border:1px solid #d1d5db;padding:6px;">Upload</td>
            <td style="border:1px solid #d1d5db;padding:6px;">Analyze</td>
            <td style="border:1px solid #d1d5db;padding:6px;">Insights</td>
          </tr>
        </table>

      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:20px;">
        <a href="#" style="background:#22c55e;color:#ffffff;
        padding:10px 20px;border-radius:5px;
        text-decoration:none;font-size:14px;">
          Open Dashboard
        </a>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="padding:15px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        © 2026 SheetXray
      </p>
    </div>

  </div>

</div>
`;
export { emailtemplate, welcomemailtemplate };