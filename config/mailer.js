async function sendEmail(to, subject, text) {

    try {

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: { name: "Shiv Shambu PATEZ", email: process.env.EMAIL_USER },
                to: [{ email: to }],
                subject: subject,
                textContent: text,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Brevo email failed:", errorData);
        } else {
            console.log("✅ Email sent successfully to", to);
        }

    } catch (error) {
        console.error("Email send error:", error.message);
    }

}

module.exports = sendEmail;