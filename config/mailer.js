async function sendEmail(to, subject, text) {

    try {

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Shiv Shambu PATEZ <onboarding@resend.dev>",
                to: [to],
                subject: subject,
                text: text,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend email failed:", data);
        } else {
            console.log("✅ Email sent successfully to", to);
        }

    } catch (error) {
        console.error("Email send error:", error.message);
    }

}

module.exports = sendEmail;