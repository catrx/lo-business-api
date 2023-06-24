const fetch = require("node-fetch");

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}


async function handler(req, res, next) {
    const { name, email, sector, message, budget } = req.body;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "api-key": process.env.API_KEY,
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
            console.log(response)
            throw new Error(`Error with status code ${response.status}`);
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("Error occurred when trying to send email")
    }
}

module.exports = allowCors(handler)