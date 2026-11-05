import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI on server with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route for generating Slash Commands using Gemini
app.post('/api/gemini/generate-command', async (req: Request, res: Response) => {
  try {
    const { promptText, level, categoryPreference } = req.body;

    if (!promptText || typeof promptText !== 'string') {
      res.status(400).json({ error: 'promptText is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ 
        error: 'API key not configured on server',
        fallback: true 
      });
      return;
    }

    const systemInstruction = `Anda adalah Arsitek Prompt Profesional di HarrisDev Studio.
Tugas Anda: Buat sebuah Slash Command GPT profesional dalam Bahasa Indonesia berdasarkan deskripsi kebutuhan pengguna.
Format output WAJIB mengikuti struktur:
- Nama command (diawali /kebab-case)
- Role (Peran AI)
- Objective (Tujuan)
- Context (Konteks)
- Instructions (Instruksi terperinci 1, 2, 3...)
- Parameters (Variabel masukan format [PARAM: detail])
- Output Format (Format hasil)
- Quality Control (Standar kualitas)
- Examples (Contoh pemanggilan)`;

    const prompt = `Deskripsi Pengguna: "${promptText}"
Tingkat Kesulitan: "${level || 'Intermediate'}"
Kategori Preferensi: "${categoryPreference || 'otomatis'}"`;

    let responseText: string | undefined;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Nama slash command diawali slash e.g. /study-math' },
              category: { type: Type.STRING, description: 'Kategori slug e.g. study, code, marketing' },
              description: { type: Type.STRING, description: 'Ringkasan fungsi command 1-2 kalimat' },
              role: { type: Type.STRING, description: 'Peran spesifik AI' },
              objective: { type: Type.STRING, description: 'Tujuan utama' },
              context: { type: Type.STRING, description: 'Konteks dan target audiens' },
              instructions: { type: Type.STRING, description: 'Instruksi terperinci langkah demi langkah' },
              parameters: { type: Type.STRING, description: 'Parameter masukan dengan format [NAMA: deskripsi]' },
              outputFormat: { type: Type.STRING, description: 'Format susunan hasil akhir' },
              qualityControl: { type: Type.STRING, description: 'Standar mutu dan verifikasi' },
              examples: { type: Type.STRING, description: 'Contoh cara memanggil command beserta argumen' },
            },
            required: ['name', 'category', 'description', 'role', 'objective', 'instructions', 'outputFormat'],
          },
        },
      });
      responseText = response.text;
    } catch (primaryErr) {
      console.warn('Primary model error, attempting fallback to gemini-flash-latest:', primaryErr);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `${systemInstruction}\n\n${prompt}\n\nJawab dalam format JSON sesuai spesifikasi.`,
      });
      responseText = fallbackResponse.text;
    }

    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const cleanJson = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    res.json(parsed);
  } catch (error: any) {
    console.error('Server Gemini Error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to generate command with Gemini',
      fallback: true
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HarrisDev Server running at http://0.0.0.0:${port} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
