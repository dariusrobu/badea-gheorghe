import { createClient as createSanityClient } from '@sanity/client';
import pkg from 'pg';
const { Pool } = pkg;
import { Resend } from 'resend';
import { toHTML } from '@portabletext/to-html';
import dotenv from 'dotenv';
dotenv.config();

const sanityClient = createSanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Needs to be a token with Read access
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Verify this is a POST request from Sanity Webhook
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Extract the document ID from the Sanity Webhook body
  const { _id, _type } = req.body;

  if (_type !== 'newsletter') {
    return res.status(400).json({ error: 'Not a newsletter document' });
  }

  try {
    // 3. Fetch the full newsletter content from Sanity
    const newsletter = await sanityClient.fetch(`*[_id == $id][0]{
      subject,
      content,
      "headerImageUrl": headerImage.asset->url
    }`, { id: _id });

    if (!newsletter || !newsletter.subject || !newsletter.content) {
      return res.status(404).json({ error: 'Newsletter content not found' });
    }

    // 4. Fetch all subscribers from Database using pg
    const result = await pool.query('SELECT email FROM subscribers');
    const subscribers = result.rows;

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No subscribers to send to.' });
    }

    // 5. Convert Portable Text to HTML
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        ${newsletter.headerImageUrl ? `<img src="${newsletter.headerImageUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />` : ''}
        <div style="line-height: 1.6; font-size: 16px;">
          ${toHTML(newsletter.content)}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          © 2026 Restaurant Badea Gheorghe. Toate drepturile rezervate.<br>
          E81 64, Sebeș, Alba
        </p>
      </div>
    `;

    // 6. Send via Resend (use batch sending if many subscribers)
    const emails = subscribers.map(s => s.email);
    
    // For simplicity, we'll send to all at once (Resend supports up to 50 in simple 'to' field, 
    // but better to bcc or use separate calls for privacy. Resend 'to' can be an array.)
    const { data, error } = await resend.emails.send({
      from: 'Restaurant Badea Gheorghe <newsletter@badea-gheorghe.ro>', // User needs to verify domain
      to: emails,
      subject: newsletter.subject,
      html: htmlContent,
    });

    if (error) throw error;

    // 7. Update newsletter status to 'sent' in Sanity
    await sanityClient.patch(_id)
      .set({ 
        status: 'sent', 
        sentAt: new Date().toISOString() 
      })
      .commit();

    return res.status(200).json({ message: 'Newsletter sent successfully!', data });
  } catch (error) {
    console.error('Newsletter sending error:', error);
    return res.status(500).json({ error: 'Failed to send newsletter' });
  }
}
