// src/server/server.js
import express from 'express';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const __dirname = path.resolve();
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Path setup
const vapidPath = path.join(__dirname, 'src/server/vapid.json');
const subsPath = path.join(__dirname, 'src/server/subscriptions.json');

// Load VAPID keys
const { publicKey, privateKey } = JSON.parse(
    fs.readFileSync(vapidPath, 'utf-8'),
);

webpush.setVapidDetails('mailto:admin@contoh.com', publicKey, privateKey);

// Helper: Load subscriptions
function getSubscriptions() {
    if (!fs.existsSync(subsPath)) return [];
    return JSON.parse(fs.readFileSync(subsPath));
}

// Helper: Save subscriptions
function saveSubscriptions(subs) {
    fs.writeFileSync(subsPath, JSON.stringify(subs, null, 2));
}

// Endpoint: Subscribe
app.post('/notifications/subscribe', (req, res) => {
    const newSub = req.body;
    console.log('[SUBSCRIBE] Request:', newSub);

    if (!newSub?.endpoint) {
        return res
            .status(400)
            .json({ error: true, message: 'Invalid subscription' });
    }

    const subs = getSubscriptions();
    const exists = subs.find((s) => s.endpoint === newSub.endpoint);
    if (!exists) {
        subs.push(newSub);
        saveSubscriptions(subs);
        console.log('[SUBSCRIBE] Saved subscription.');
    } else {
        console.log('[SUBSCRIBE] Already subscribed.');
    }

    res.status(201).json({ success: true });
});

// Endpoint: Unsubscribe
app.delete('/notifications/subscribe', (req, res) => {
    const { endpoint } = req.body;
    if (!endpoint)
        return res
            .status(400)
            .json({ error: true, message: 'Endpoint required' });

    const subs = getSubscriptions().filter((s) => s.endpoint !== endpoint);
    saveSubscriptions(subs);
    console.log('[UNSUBSCRIBE] Removed subscription:', endpoint);
    res.json({ success: true });
});

// Endpoint: Send Notification
app.post('/notifications/send', async (req, res) => {
    const { title = 'Hello!', message = 'Pesan dari server 🚀' } = req.body;
    const subs = getSubscriptions();
    const payload = JSON.stringify({ title, message });

    const results = await Promise.allSettled(
        subs.map((sub) => webpush.sendNotification(sub, payload)),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`[SEND] Sent: ${sent}, Failed: ${failed}`);
    res.json({ success: true, sent, failed });
});

// Run server
app.listen(PORT, () => {
    console.log(`🚀 Push server running at http://localhost:${PORT}`);
});

for (const sub of subs) {
    try {
        await webpush.sendNotification(sub, payload);
    } catch (err) {
        console.error('[ERROR] Failed to send push:', err.message);
    }
}
