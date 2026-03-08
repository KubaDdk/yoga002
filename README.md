Konfiguracja hostingu – Little Yogini
GitHub

Repo: KubaDdk/yoga002
Push do main → Vercel automatycznie deployuje

Vercel

Projekt: yoga002, plan Hobby (darmowy)
Domeny: www.littleyogini.eu (produkcja), littleyogini.eu → redirect do www
Serverless function: api/rezerwacja.js wysyła maile przez Gmail SMTP (Nodemailer)
Environment Variables: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, OWNER_EMAIL

OVHcloud (DNS dla littleyogini.eu)

A @ → 216.198.79.1 (Vercel IP)
CNAME www → yoga002.vercel.app
MX, SPF, NS — zostawić, potrzebne do poczty

Gmail App Password
Google Account → Security → 2-Step Verification → App Passwords → wklej jako SMTP_PASS w Vercel
