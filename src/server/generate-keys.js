// src/server/generate-keys.js
import webpush from 'web-push';
import { writeFile } from 'fs/promises';

const vapidKeys = webpush.generateVAPIDKeys();

await writeFile('./src/server/vapid.json', JSON.stringify(vapidKeys, null, 2));

console.log('✅ VAPID keys generated!');
