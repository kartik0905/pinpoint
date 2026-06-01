const { Resend } = require("resend");

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      // Resend provides this default address for testing without a custom domain
      from: "Pinpoint <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Pinpoint Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Pinpoint!</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 4px; color: #0891b2;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("🔥 Resend API Error:", error);
    throw error;
  }
};

module.exports = { sendOtpEmail };
