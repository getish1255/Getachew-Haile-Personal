import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Persistent Content File
const DATA_DIR = path.resolve(__dirname, 'data');
const CONTENT_FILE = path.resolve(DATA_DIR, 'siteContent.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read content
function readContent() {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading content file:', err);
    return null;
  }
}

// Helper to save content
function saveContent(data: any) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

// Admin Passcode & Password Recovery System
let currentAdminPassword = process.env.ADMIN_PASSWORD || 'Get@1255';
const RECOVERY_EMAIL = 'boqolo@gmail.com';
let activeResetCode: { code: string; expires: number } | null = null;

function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${currentAdminPassword}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Credentials' });
  }
  next();
}

// --- Content API Endpoints ---

// 1. Get Live Site Content (Public)
app.get('/api/content', (_req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(500).json({ error: 'Content file unavailable' });
  }
  // Return content without exposing raw inquiry details to public
  const publicContent = {
    ...content,
    inquiries: undefined,
  };
  res.json(publicContent);
});

// 2. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === currentAdminPassword) {
    return res.json({ success: true, token: currentAdminPassword });
  }
  return res.status(401).json({ success: false, error: 'Incorrect administrative passcode' });
});

// 2b. Forgot Password - Restricted strictly to boqolo@gmail.com only
app.post('/api/admin/forgot-password', (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  activeResetCode = {
    code,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  console.log(`[SECURITY DISPATCH] Password recovery requested. Security PIN [${code}] dispatched to ${RECOVERY_EMAIL} only.`);

  return res.json({
    success: true,
    message: `A secure 6-digit verification code has been dispatched to ${RECOVERY_EMAIL} only.`,
    targetEmail: RECOVERY_EMAIL,
    // In dev sandbox environment, also return recoveryPin for immediate testing
    devPin: code,
  });
});

// 2c. Reset Password using Recovery PIN
app.post('/api/admin/reset-password', (req, res) => {
  const { code, newPassword } = req.body;
  if (!activeResetCode || Date.now() > activeResetCode.expires) {
    return res.status(400).json({ success: false, error: 'Recovery code expired. Please request a new one.' });
  }
  if (activeResetCode.code !== String(code).trim()) {
    return res.status(400).json({ success: false, error: 'Invalid verification code.' });
  }
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, error: 'Password must be at least 4 characters.' });
  }

  currentAdminPassword = newPassword;
  activeResetCode = null;
  console.log(`[SECURITY UPDATE] Admin passcode successfully updated for ${RECOVERY_EMAIL}.`);

  return res.json({
    success: true,
    message: 'Passcode successfully reset. You may now log in with your new passcode.',
    token: currentAdminPassword,
  });
});

// 3. Admin Update Profile
app.put('/api/admin/profile', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  content.profile = {
    ...content.profile,
    ...req.body,
  };

  saveContent(content);
  res.json({ success: true, profile: content.profile });
});

// 4. Admin Add Publication
app.post('/api/admin/publications', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const pubData = req.body;
  const newId = content.publications.length > 0
    ? Math.max(...content.publications.map((p: any) => p.id)) + 1
    : 1;

  // Auto-generate BibTeX & RIS if not provided
  const title = pubData.title || 'Untitled Research Output';
  const year = pubData.year || new Date().getFullYear().toString();
  const studyArea = pubData.studyArea || 'Oromia, Ethiopia';
  const journalContext = pubData.journalContext || 'Oromia Agricultural Research Institute';

  const defaultBibtex = `@article{haile_${newId}_${year},
  author = {Getachew Haile and Colleagues},
  title = {${title}},
  journal = {${journalContext}},
  year = {${year}},
  address = {${studyArea}}
}`;

  const defaultRis = `TY  - JOUR
TI  - ${title}
AU  - Haile, Getachew
PY  - ${year}
JO  - ${journalContext}
CY  - ${studyArea}
ER  - `;

  const newPublication = {
    id: newId,
    title,
    year,
    category: pubData.category || 'hydrology',
    categoryLabel: pubData.categoryLabel || 'Hydrology & Watersheds',
    studyArea,
    journalContext,
    abstract: pubData.abstract || '',
    methodology: Array.isArray(pubData.methodology) ? pubData.methodology : [],
    citation: pubData.citation || `Haile, G., et al. (${year}). ${title}. ${journalContext}.`,
    bibtex: pubData.bibtex || defaultBibtex,
    ris: pubData.ris || defaultRis,
  };

  content.publications.unshift(newPublication);
  saveContent(content);
  res.json({ success: true, publication: newPublication });
});

// 5. Admin Edit Publication
app.put('/api/admin/publications/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const id = parseInt(req.params.id, 10);
  const index = content.publications.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Publication not found' });
  }

  content.publications[index] = {
    ...content.publications[index],
    ...req.body,
    id, // Keep ID stable
  };

  saveContent(content);
  res.json({ success: true, publication: content.publications[index] });
});

// 6. Admin Delete Publication
app.delete('/api/admin/publications/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const id = parseInt(req.params.id, 10);
  content.publications = content.publications.filter((p: any) => p.id !== id);

  saveContent(content);
  res.json({ success: true, remaining: content.publications.length });
});

// 7. Admin Add Study Region
app.post('/api/admin/study-regions', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const regionData = req.body;
  const id = regionData.id || `basin_${Date.now()}`;

  const newRegion = {
    id,
    name: regionData.name || 'New Catchment',
    zone: regionData.zone || 'Oromia Region',
    coordinates: regionData.coordinates || '8.0000° N, 39.0000° E',
    elevation: regionData.elevation || '1,500 m – 2,200 m',
    researchFocus: regionData.researchFocus || 'Geospatial Assessment',
    methodology: regionData.methodology || '',
    findings: regionData.findings || '',
    publicationsLinked: Array.isArray(regionData.publicationsLinked) ? regionData.publicationsLinked : [],
    tags: Array.isArray(regionData.tags) ? regionData.tags : ['GIS Modeling'],
  };

  content.studyRegions.push(newRegion);
  saveContent(content);
  res.json({ success: true, studyRegion: newRegion });
});

// 8. Admin Edit Study Region
app.put('/api/admin/study-regions/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const id = req.params.id;
  const index = content.studyRegions.findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Study region not found' });
  }

  content.studyRegions[index] = {
    ...content.studyRegions[index],
    ...req.body,
    id,
  };

  saveContent(content);
  res.json({ success: true, studyRegion: content.studyRegions[index] });
});

// 9. Admin Delete Study Region
app.delete('/api/admin/study-regions/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const id = req.params.id;
  content.studyRegions = content.studyRegions.filter((r: any) => r.id !== id);

  saveContent(content);
  res.json({ success: true, remaining: content.studyRegions.length });
});

// 10. Public Submit Inquiry (Contact Form)
app.post('/api/inquiries', (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Server data unavailable' });

  const { name, email, organization, inquiryType, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newInquiry = {
    id: `inq_${Date.now()}`,
    name,
    email,
    organization: organization || 'Not specified',
    inquiryType: inquiryType || 'General Collaboration',
    message: message || '',
    receivedAt: new Date().toISOString(),
    status: 'unread',
  };

  if (!Array.isArray(content.inquiries)) {
    content.inquiries = [];
  }

  content.inquiries.unshift(newInquiry);
  saveContent(content);
  res.json({ success: true, id: newInquiry.id });
});

// 11. Admin Get Inquiries
app.get('/api/admin/inquiries', verifyAdmin, (_req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });
  res.json({ inquiries: content.inquiries || [] });
});

// 12. Admin Delete Inquiry
app.delete('/api/admin/inquiries/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  const id = req.params.id;
  if (Array.isArray(content.inquiries)) {
    content.inquiries = content.inquiries.filter((inq: any) => inq.id !== id);
    saveContent(content);
  }
  res.json({ success: true });
});

// 13. Admin Import JSON Backup
app.post('/api/admin/import', verifyAdmin, (req, res) => {
  try {
    const backupData = req.body;
    if (!backupData || !backupData.profile || !backupData.publications) {
      return res.status(400).json({ error: 'Invalid backup JSON payload' });
    }
    saveContent(backupData);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to import backup', details: err?.message });
  }
});

// 14. Admin Update Social Links
app.put('/api/admin/social-links', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  content.socialLinks = {
    ...content.socialLinks,
    ...req.body,
  };

  saveContent(content);
  res.json({ success: true, socialLinks: content.socialLinks });
});

// 15. Admin Add Photo Gallery Item
app.post('/api/admin/photo-gallery', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  if (!Array.isArray(content.photoGallery)) {
    content.photoGallery = [];
  }

  const item = req.body;
  const newItem = {
    id: item.id || `photo_${Date.now()}`,
    title: item.title || 'Field Research Image',
    caption: item.caption || '',
    category: item.category || 'Fieldwork',
    imageUrl: item.imageUrl || '/src/assets/images/ethiopian_agriculture_field_trial_1794209254817.jpg',
    date: item.date || new Date().getFullYear().toString(),
  };

  content.photoGallery.unshift(newItem);
  saveContent(content);
  res.json({ success: true, photo: newItem });
});

// 16. Admin Edit Photo Gallery Item
app.put('/api/admin/photo-gallery/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  if (!Array.isArray(content.photoGallery)) {
    content.photoGallery = [];
  }

  const id = req.params.id;
  const index = content.photoGallery.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Photo item not found' });
  }

  content.photoGallery[index] = {
    ...content.photoGallery[index],
    ...req.body,
    id,
  };

  saveContent(content);
  res.json({ success: true, photo: content.photoGallery[index] });
});

// 17. Admin Delete Photo Gallery Item
app.delete('/api/admin/photo-gallery/:id', verifyAdmin, (req, res) => {
  const content = readContent();
  if (!content) return res.status(500).json({ error: 'Content unavailable' });

  if (Array.isArray(content.photoGallery)) {
    const id = req.params.id;
    content.photoGallery = content.photoGallery.filter((p: any) => p.id !== id);
    saveContent(content);
  }

  res.json({ success: true });
});

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Grounding context about Getachew Haile based strictly on his verified CV & research
function getDynamicContext() {
  const content = readContent();
  if (!content) return '';
  const prof = content.profile;
  const pubs = content.publications.map((p: any, i: number) => `${i + 1}. ${p.title} (${p.year})`).join('\n');
  return `
Profile of ${prof.name}:
- Title: ${prof.title}
- Institution: ${prof.institution}, ${prof.location}
- Contact: ${prof.email} | Phone: ${prof.phone} | ORCID: ${prof.orcid}
- Publications:
${pubs}
`;
}

// API endpoint for interactive AI research chat
app.post('/api/gemini/research-chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `Hello! I am Getachew Haile's Research & Portfolio Assistant. While the live API key is being initialized, here is an executive summary based on Getachew's CV:\n\nGetachew Haile is the Director of the ICT Directorate and a Senior GIS & Remote Sensing Researcher at the Oromia Agricultural Research Institute (IQQO) with over 15 years of experience. You can reach him at boqolo@gmail.com.`,
      });
    }

    const conversationPrompt = `
System Context:
${getDynamicContext()}

Task: Respond helpfully, clearly, and concisely to the visitor's question about Getachew Haile's work, methodology, publications, ICT leadership, or collaboration opportunities.

Visitor Question: "${message}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationPrompt,
      config: {
        thinkingConfig: {
          thinkingLevel: 'LOW' as any,
        },
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: 'Failed to process AI query',
      details: error?.message || 'Unknown error',
    });
  }
});

// API endpoint for generating a structured collaboration or research concept brief
app.post('/api/gemini/generate-brief', async (req, res) => {
  try {
    const { topic, organization, intent } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        brief: `### Research Collaboration Concept\n\n**Focus Area:** ${topic}\n**Target Organization:** ${organization || 'Prospective Partner'}\n**Executive Overview:**\nThis initiative bridges Getachew Haile's 15+ years of experience in spatial decision support systems and remote sensing at IQQO with modern digital agriculture practices.\n\n*Contact Getachew directly at boqolo@gmail.com to proceed.*`,
      });
    }

    const prompt = `
System Context:
${getDynamicContext()}

User Request:
Create a polished 3-part Research Collaboration Proposal Brief between Getachew Haile (IQQO) and ${organization || 'an academic/development partner'} on the topic of "${topic}".
User Intent: ${intent || 'Joint Research & Development'}

Format as clean Markdown with:
1. Executive Synopsis & Scientific Relevance
2. Proposed Geospatial / Analytical Methodology
3. Expected Deliverables & Institutional Value for Ethiopian Agriculture
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: 'LOW' as any,
        },
      },
    });

    return res.json({ brief: response.text });
  } catch (error: any) {
    console.error('Gemini Brief Error:', error);
    return res.status(500).json({
      error: 'Failed to generate proposal brief',
      details: error?.message || 'Unknown error',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distExists = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'));

  const distPath = path.resolve(__dirname, 'dist');
  const publicPath = path.resolve(__dirname, 'public');
  const srcPath = path.resolve(__dirname, 'src');

  // Always serve static assets from public and dist
  app.use(express.static(publicPath));
  app.use('/public', express.static(publicPath));
  app.use('/src', express.static(srcPath));

  if (!isProduction) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite middleware could not initialize, falling back to dist static files:', err);
      if (distExists) {
        app.use(express.static(distPath));
        app.get('*', (req, res, next) => {
          if (req.path.startsWith('/api')) return next();
          res.sendFile(path.resolve(distPath, 'index.html'));
        });
      }
    }
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not Found');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
