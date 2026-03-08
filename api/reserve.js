const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metoda niedozwolona' });
    }

    const { name, email, classId, classDay, classTime, classDescription } = req.body;

    if (!name || !email || !classId || !classDay || !classTime) {
        return res.status(400).json({ error: 'Brakujące pola formularza' });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Nieprawidłowy adres email' });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const userMailOptions = {
        from: `"Little Yogini" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'Miejsce na macie dla Ciebie już prawie gotowe – poczekaj proszę na potwierdzenie',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #9D5B34; font-size: 24px;">Już niedługo widzimy się na macie, poczekaj proszę na potwierdzenie rezerwacji!</h1>
                <p>Cześć <strong>${name}</strong>,</p>
                <div style="background-color: #FDF1D3; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h2 style="color: #9D5B34; margin-top: 0;">Szczegóły rezerwacji:</h2>
                    <p><strong>Dzień:</strong> ${classDay}</p>
                    <p><strong>Godzina:</strong> ${classTime}</p>
                    <p><strong>Zajęcia:</strong> ${classDescription}</p>
                </div>
                <p>Adres studia:</p>
                <p>
                    She did it Building<br>
                    Statiestraat 5<br>
                    2600 Berchem, Antwerpen, België
                </p>
                <p>Do zobaczenia na macie! 🧘</p>
                <hr style="border: none; border-top: 1px solid #e9d3b1; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">Little Yogini · Nr firmowy: BE0791735180</p>
            </div>
        `,
    };

    const ownerMailOptions = {
        from: `"Little Yogini" <${process.env.SMTP_FROM}>`,
        to: process.env.OWNER_EMAIL,
        subject: `Nowa rezerwacja od ${name} – Little Yogini`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h1 style="color: #9D5B34; font-size: 24px;">Nowa rezerwacja!</h1>
                <p>Otrzymałaś nową rezerwację na zajęcia jogi.</p>
                <div style="background-color: #FDF1D3; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <h2 style="color: #9D5B34; margin-top: 0;">Szczegóły rezerwacji:</h2>
                    <p><strong>Imię i nazwisko:</strong> ${name}</p>
                    <p><strong>Email klienta:</strong> ${email}</p>
                    <p><strong>Dzień:</strong> ${classDay}</p>
                    <p><strong>Godzina:</strong> ${classTime}</p>
                    <p><strong>Zajęcia:</strong> ${classDescription}</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(ownerMailOptions);
        return res.status(200).json({ success: true, message: 'Rezerwacja wysłana! Sprawdź swoją skrzynkę email.' });
    } catch (error) {
        console.error('Błąd wysyłania emaila:', error);
        return res.status(500).json({ error: 'Nie udało się wysłać emaila potwierdzającego. Spróbuj ponownie.' });
    }
};
