async function sendEmail(to, subject, text) {

    try {

        const apiKey = (process.env.BREVO_API_KEY || "").trim();

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                sender: { name: "Shiv Shambu PATEZ", email: process.env.EMAIL_USER },
                to: [{ email: to }],
                subject: subject,
                textContent: text,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Brevo email failed:", data);
        } else {
            console.log("✅ Email sent successfully to", to);
        }

    } catch (error) {
        console.error("Email send error:", error.message);
    }

}

module.exports = sendEmail;