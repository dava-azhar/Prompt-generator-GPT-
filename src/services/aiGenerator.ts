import { SlashCommand, SkillLevel, AiPromptInput } from '../types/command';

// Helper to determine best category matching natural language
function guessCategoryFromPrompt(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('belajar') || p.includes('smk') || p.includes('sekolah') || p.includes('kuliah') || p.includes('feynman')) return 'study';
  if (p.includes('kurikulum') || p.includes('roadmap') || p.includes('skill') || p.includes('belajar dari nol')) return 'learning';
  if (p.includes('riset') || p.includes('jurnal') || p.includes('skripsi') || p.includes('tesis') || p.includes('ilmiah')) return 'research';
  if (p.includes('esai') || p.includes('artikel') || p.includes('cerita') || p.includes('novel') || p.includes('tulis')) return 'writing';
  if (p.includes('iklan') || p.includes('jual') || p.includes('copywriting') || p.includes('aida') || p.includes('sales')) return 'copywriting';
  if (p.includes('desain') || p.includes('ui') || p.includes('ux') || p.includes('figma') || p.includes('warna')) return 'design';
  if (p.includes('brand') || p.includes('logo') || p.includes('merek') || p.includes('tagline')) return 'branding';
  if (p.includes('poster') || p.includes('banner') || p.includes('pamflet')) return 'poster';
  if (p.includes('mindmap') || p.includes('peta konsep') || p.includes('mermaid')) return 'mindmap';
  if (p.includes('rpg') || p.includes('level') || p.includes('tree') || p.includes('jenjang')) return 'skill-tree';
  if (p.includes('python') || p.includes('koding') || p.includes('program') || p.includes('code') || p.includes('javascript') || p.includes('react') || p.includes('sql')) return 'code';
  if (p.includes('error') || p.includes('bug') || p.includes('debug') || p.includes('crash')) return 'debug';
  if (p.includes('webapp') || p.includes('aplikasi web') || p.includes('backend') || p.includes('frontend') || p.includes('api')) return 'webapp';
  if (p.includes('bisnis') || p.includes('canvas') || p.includes('investor') || p.includes('pitch')) return 'business';
  if (p.includes('marketing') || p.includes('sosmed') || p.includes('tiktok') || p.includes('instagram') || p.includes('ads')) return 'marketing';
  if (p.includes('produk') || p.includes('prd') || p.includes('feature') || p.includes('user story')) return 'produk';
  if (p.includes('ebook') || p.includes('buku') || p.includes('bab') || p.includes('pdf')) return 'ebook';
  if (p.includes('slide') || p.includes('presentasi') || p.includes('deck') || p.includes('bicara')) return 'presentation';
  if (p.includes('data') || p.includes('analisis') || p.includes('statistik') || p.includes('kpi') || p.includes('excel')) return 'data';
  if (p.includes('kuis') || p.includes('soal') || p.includes('ujian') || p.includes('trivia') || p.includes('hots')) return 'quiz';
  return 'code';
}

function cleanCommandSlug(text: string): string {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);
  return clean ? `/${clean}` : '/custom-command';
}

/**
 * Intelligent client-side synthesized command generator
 * Ensures instant, reliable generation even offline or when API is unreachable
 */
export function synthesizeCommandOffline(input: AiPromptInput): SlashCommand {
  const category = input.categoryPreference || guessCategoryFromPrompt(input.promptText);
  const words = input.promptText.split(' ').filter(w => w.length > 2);
  const keyword = words.slice(0, 3).join('-') || 'command';
  const name = cleanCommandSlug(`${category}-${keyword}`);

  const levelDescriptions: Record<SkillLevel, { depth: string; persona: string; standard: string }> = {
    Beginner: {
      depth: 'Penjelasan bertahap step-by-step, ramah pemula, analogi kehidupan sehari-hari, dan glosarium istilah sederhana.',
      persona: 'Tutor Penyabar & Mentor Pedagogis Pemula',
      standard: 'Hindari asumsi pembaca sudah mengerti jargon. Berikan contoh yang bisa dipraktikkan dalam 5 menit.'
    },
    Intermediate: {
      depth: 'Penerapan praktis, penanganan skenario dunia nyata, pencegahan kesalahan umum, dan efisiensi waktu kerja.',
      persona: 'Praktisi Senior & Konsultan Terapan',
      standard: 'Fokus pada praktik terbaik industri (best practices) dan solusi yang scalable.'
    },
    Advanced: {
      depth: 'Arsitektur mendalam, analisis trade-off, edge cases ekstrem, optimalisasi performa, dan pertimbangan keamanan tingkat tinggi.',
      persona: 'Principal Architect & Technical Fellow',
      standard: 'Analisis berbasis bukti empiris, metrik terukur, dan standar arsitektur tingkat lanjut.'
    },
    Expert: {
      depth: 'Tingkat mahir/visioner, perancangan metodologi orisinil, paradigma inovatif, mitigasi risiko sistemik, dan kepemimpinan strategis.',
      persona: 'Distinguished Fellow & Thought Leader Global',
      standard: 'Zero tolerance terhadap hal klise; fokus pada kebaruan teoretis (novelty) dan dampak transformatif.'
    }
  };

  const currentLevel = levelDescriptions[input.level];

  const role = `${currentLevel.persona} spesialis ${category.toUpperCase()}`;
  const objective = `Menyelesaikan instruksi pengguna: "${input.promptText}" dengan standar ${input.level}.`;
  const context = `Pengguna membutuhkan panduan sistematis, teruji, dan langsung dapat dieksekusi untuk target: ${input.promptText}. Tingkat kesulitan: ${input.level}.`;
  
  const instructions = `1. Analisis kebutuhan inti dari: "${input.promptText}".
2. ${currentLevel.depth}
3. Berikan rencana aksi berurutan Fase 1 sampai Fase 3 dengan milestone pencapaian terukur.
4. Identifikasi 3 perangkap umum (common pitfalls) dan cara pencegahannya.
5. Tunjukkan contoh konkret eksekusi yang langsung dapat disalin atau diterapkan.`;

  const parameters = `[TOPIK_SPESIFIK: fokus detail permasalahan]\n[BATASAN: kendala waktu / biaya / sumber daya]\n[TARGET_OUTPUT: ekspektasi format akhir]`;
  
  const outputFormat = `1. Ringkasan Eksekutif (1 Paragraf Singkat)
2. Peta Konsep / Alur Logika Utama
3. Langkah Eksekusi Terinci (Fase 1, Fase 2, Fase 3)
4. Checklist Verifikasi & Quality Control
5. Tindakan Selanjutnya (Next Actionable Steps)`;

  const qualityControl = `Standar Level ${input.level}: ${currentLevel.standard} Pastikan keluaran bebas dari informasi usang dan memiliki alur bernalar runut.`;

  const examples = `${name} [TOPIK_SPESIFIK: Pemula tanpa dasar coding, TARGET_OUTPUT: 1 Aplikasi pertama dalam 7 hari]`;

  return {
    commandId: `custom-ai-${Date.now()}`,
    userId: 'user',
    name,
    category,
    description: `Slash command berbasis AI untuk: ${input.promptText} (Tingkat ${input.level}).`,
    role,
    objective,
    context,
    instructions,
    parameters,
    outputFormat,
    qualityControl,
    examples,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 1,
    isFavorite: false,
    tags: [category, input.level.toLowerCase(), 'ai-generated']
  };
}

/**
 * Generate full slash command using server-side Gemini endpoint (/api/gemini/generate-command)
 * Never exposes API keys to the browser, and seamlessly falls back to offline synthesis if needed.
 */
export async function generateCommandWithAi(input: AiPromptInput): Promise<SlashCommand> {
  try {
    const response = await fetch('/api/gemini/generate-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      console.warn(`Server responded with ${response.status}, falling back to offline synthesizer`);
      return synthesizeCommandOffline(input);
    }

    const parsed = await response.json();
    if (parsed && parsed.name && parsed.instructions) {
      return {
        commandId: `custom-server-${Date.now()}`,
        userId: 'user',
        name: parsed.name.startsWith('/') ? parsed.name : `/${parsed.name}`,
        category: parsed.category || input.categoryPreference || guessCategoryFromPrompt(input.promptText),
        description: parsed.description || input.promptText,
        role: parsed.role || 'Senior AI Specialist',
        objective: parsed.objective || input.promptText,
        context: parsed.context || '',
        instructions: parsed.instructions || '',
        parameters: parsed.parameters || '',
        outputFormat: parsed.outputFormat || '',
        qualityControl: parsed.qualityControl || '',
        examples: parsed.examples || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 1,
        isFavorite: false,
        tags: [input.level.toLowerCase(), 'server-gemini']
      };
    }

    return synthesizeCommandOffline(input);
  } catch (error) {
    console.warn('Network or server error calling /api/gemini/generate-command, falling back to offline synthesizer:', error);
    return synthesizeCommandOffline(input);
  }
}
