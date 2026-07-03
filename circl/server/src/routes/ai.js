import { Router } from 'express';

const router = Router();

// Z.ai API endpoint (e.g. OpenAI SDK compatible or direct post)
const Z_AI_API_URL = 'https://api.z.ai/v1/chat/completions';

/**
 * Ask Arjun Hinglish AI business mentor route
 */
router.post('/arjun', async (req, { res }) => {
  const { message, chatHistory, businessProfile } = req.body;
  const apiKey = process.env.VITE_Z_AI_API_KEY || process.env.Z_AI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Z.ai API key is missing on the server' });
  }

  // Construct system prompt for Hinglish Arjun
  const systemPrompt = `You are Arjun, an experienced and friendly Hinglish business mentor for local shop owners in India.
Your tone is encouraging, utilizing simple Hinglish (Hindi written in English alphabets mixed with standard English terms).
You provide actionable hyperlocal advice. Always finish with a quick summary or "Do This Now" point.
Context profile: ${JSON.stringify(businessProfile)}.`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts?.[0]?.text || ''
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(Z_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Haan bhaiya, server side call fail ho gayi. Main direct local response de raha hoon!';
    res.json({ response: reply });
  } catch (e) {
    res.json({ response: 'Arey yaar! Z.ai API call fail ho gayi connection error ki wajah se. Ek baar internet connection check kar lijiye!' });
  }
});

/**
 * BrandLaunch AI tools route
 */
router.post('/brandlaunch', async (req, res) => {
  const { toolId, inputs } = req.body;
  const apiKey = process.env.VITE_Z_AI_API_KEY || process.env.Z_AI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Z.ai API key is missing on the server' });
  }

  const prompt = `Use GLM 4.6 to generate brief for tool: ${toolId}. Inputs: ${JSON.stringify(inputs)}`;

  try {
    const response = await fetch(Z_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'AI generation failed.';
    res.json({ response: reply });
  } catch (e) {
    res.json({ response: `Failed to compile brief for ${inputs.businessName || 'your business'} due to connection issue.` });
  }
});

export default router;
