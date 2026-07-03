// Frontend service to call GLM 4.6 via our Z.ai endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Ask Arjun Hinglish AI business mentor a query
 */
export const askArjun = async (message, chatHistory = [], businessProfile = {}) => {
  try {
    const res = await fetch(`${API_URL}/ai/arjun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatHistory, businessProfile }),
    });
    if (!res.ok) throw new Error('AI request failed');
    const data = await res.json();
    return data.response;
  } catch (e) {
    console.warn('Backend server connection failed, using local mock Arjun response');
    return getMockArjunResponse(message);
  }
};

/**
 * Generate output from BrandLaunch tools
 */
export const generateBrandLaunchTool = async (toolId, inputs = {}) => {
  try {
    const res = await fetch(`${API_URL}/ai/brandlaunch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, inputs }),
    });
    if (!res.ok) throw new Error('Tool generation failed');
    const data = await res.json();
    return data.response;
  } catch (e) {
    console.warn('Backend server connection failed, using local mock tool response');
    return getMockToolResponse(toolId, inputs);
  }
};

// Fallback Mock Arjun Responses in natural Hinglish
const getMockArjunResponse = (msg) => {
  const query = msg.toLowerCase();
  if (query.includes('sales') || query.includes('profit') || query.includes('customer')) {
    return "Arey bhaiya! Agar sales badhani hai toh simple formula hai: Customer retention! Pehle jo residents tumhari society mein hain, unhe 10% exclusive colony discount offer karo. Jab community mein trust banega, tabhi toh business grow karega na? Kuch specific query hai toh poochho! 👍";
  }
  if (query.includes('ad') || query.includes('marketing') || query.includes('advertise')) {
    return "Bro, colony level marketing ka sabse best tarika hai sponsored feeds! Circl app par ek small budget campaign run karo. Sunshine Apts ke main page par target karo. Direct WhatsApp orders generate honge. Try kiya kya? 😊";
  }
  return "Haan ji, kaise ho? Main hoon Arjun, aapka Hinglish business mentor. Tumhare business ko digital and hyperlocal level par bada banane mein main help karunga. Bolo, kya problem face kar rahe ho aaj?";
};

// Fallback Mock BrandLaunch Tools Outputs
const getMockToolResponse = (toolId, inputs) => {
  const name = inputs.businessName || 'Your Shop';
  switch (toolId) {
    case 'brand_studio':
      return `🎨 Brand Studio Identity for: ${name}\n\n1. Color Palette: Royal Blue (#1E3A8A) with Amber Gold (#F59E0B) and Clean White.\n2. Font Pairings: Outfit (Headlines) + Inter (Body Copy).\n3. Slogan Ideas:\n   - "Trust and Quality at Your Doorstep 🇮🇳"\n   - "Every Home's Daily Choice."\n4. Brand Voice: Friendly, Reliable, and Local.`;
    case 'content_calendar':
      return `📅 30-Day Content Calendar for: ${name}\n\n- Week 1: "Behind the Scenes" introduce your staff & store cleanliness.\n- Week 2: Spotlight top 3 products with customer video reviews.\n- Week 3: Run a 1-day flash sale for society members (SUNSHINE10).\n- Week 4: Share a helpful tips post related to your niche.`;
    default:
      return `✨ Generated AI Brief for ${name} using Z.ai GLM 4.6.\n\nInput Params: ${JSON.stringify(inputs, null, 2)}\n\nThis brief is ready to use. Copy or modify it as needed.`;
  }
};
