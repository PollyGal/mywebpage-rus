export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { company, task, email, phone, message } = req.body;

    if (!company || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Server misconfigured' });
    }

    const text = [
        '📋 Новая заявка с сайта',
        '',
        `🏢 Компания: ${company}`,
        `📌 Задача: ${task || '—'}`,
        `📧 Email: ${email}`,
        phone   ? `📞 Телефон: ${phone}`     : null,
        message ? `\n💬 Сообщение:\n${message}` : null,
    ].filter(Boolean).join('\n');

    const tgRes = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text }),
        }
    );

    if (!tgRes.ok) {
        return res.status(502).json({ error: 'Telegram error' });
    }

    return res.status(200).json({ ok: true });
}
