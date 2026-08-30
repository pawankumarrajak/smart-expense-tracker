const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, name, verificationUrl) => {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Verify your Smart Expense Tracker account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to Smart Expense Tracker, ${name}!</h2>

        <p>
          Thanks for creating your account.
          Please verify your email address to activate your account.
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify Email
          </a>
        </p>

        <p>
          This verification link will expire in 15 minutes.
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>
    `
  });

  if (error) {
    throw new Error("Unable to send verification email");
  }
};

module.exports = {
  sendVerificationEmail
};
