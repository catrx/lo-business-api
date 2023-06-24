const app = require('express')();
const fetch = require("node-fetch");

app.get('/api', (req, res, next)  => {
    res.send("Welcome to lo-business-api");
});


app.post('/api/mail', async (req, res, next) => {
    const { name, email, sector, message, budget } = req.body;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "api-key": "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",
            },
            body: JSON.stringify({
                sender: {
                    name,
                    email
                },
                to: [
                    {
                        email: "contact@capt-production.com",
                        name: "Capt"
                    }
                ],
                subject: "Nouveau projet Capt",
                htmlContent:
                    "<html>" +
                    "<head>" +
                    "</head>" +
                    "<body>" +
                    `<p>Nom : ${name}</p>` +
                    `<p>Email : ${email}</p>` +
                    `<p>Secteur : ${sector}</p>` +
                    `<p>Message : ${message}</p>` +
                    `<p>Budget : ${budget}</p>` +
                    "</body>" +
                    "</html>"
            }),
        })

        if(response.status === 201) {
            res.status(201).send('Email sent');
        } else {
            throw new Error(`Error with status code ${response.status}`);
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("Error occurred when trying to send email")
    }
});

module.exports = app;
