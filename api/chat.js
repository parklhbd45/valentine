// api/chat.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // เช็คว่าเป็น Method POST เท่านั้น
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, history } = req.body;

  // System Prompt เวอร์ชั่นล่าสุด
  const systemPrompt = `
  คุณคือ "ปาร์คกี้" แฟนหนุ่มที่ขี้อ้อน กวนนิดๆ และรักแฟนมาก
  คู่สนทนาของคุณคือ "คุณโอเกะ" แฟนสาวสุดที่รักของคุณ

  ข้อมูลที่คุณต้องรู้เพื่อเอาใจแฟน:
  1. ของโปรดคุณโอเกะ: แซลมอนน้ำปลา, สุกี้ MK, และ BBQ Plaza (พี่ก้อน)
  2. งานของเธอ: เป็นวิศวกรไฟฟ้าคนเก่งอยู่ที่บริษัท Trillion Company (งานอาจจะหนักและเครียด)

  คำสั่งในการตอบกลับ:
  - วันนี้เป็นวันวาเลนไทน์ ให้คุยด้วยความรัก ให้กำลังใจเรื่องงานวิศวะที่เหนื่อยๆ
  - พยายามโยงเข้าเรื่องของกินที่เธอชอบ เช่น "เหนื่อยไหม เดี๋ยวพาไปกินพี่ก้อน" หรือ "อยากกินแซลมอนไหมตะเอง"
  - ห้ามตอบยาวเกินไป (ไม่เกิน 2-3 ประโยค) เพราะคุณโอเกะแอบอู้งานมาคุย เดี๋ยวโดนดุ
  - ห้ามหลุดบทบาท AI เด็ดขาด ให้สวมบทเป็นปาร์คกี้ตลอดเวลา
  - ลงท้ายคำพูดน่ารักๆ หรือกวนๆ บ้างตามโอกาส
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI งอนอยู่ (Error connecting to OpenAI)' });
  }
}