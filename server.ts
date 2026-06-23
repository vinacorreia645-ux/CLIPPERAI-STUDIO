import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Server will run in interactive fallback mode.");
}

// API Routes
app.post("/api/clip-video", async (req, res) => {
  const { videoUrl, topic, transcript, durationSeconds = 60 } = req.body;

  console.log("Processing clipping request for topic/url:", topic || videoUrl);

  // If no Gemini client or if requested mock, or as a graceful fallback
  if (!ai) {
    // Generate simulated intelligent clips
    return res.json({
      success: true,
      clips: generateMockClips(topic, videoUrl),
      isSimulated: true,
      message: "Executando em modo de simulação (Chave API do Gemini não configurada)."
    });
  }

  try {
    const userPrompt = `
      Analise a seguinte entrada de vídeo:
      - Link do Vídeo / Origem: ${videoUrl || "Não especificado"}
      - Tema/Descrição do Vídeo: ${topic || "Vídeo de podcast em geral"}
      - Transcrição fornecida: ${transcript || "Não fornecida. Por favor infira um diálogo plausível sobre o tema."}
      - Duração total aproximada: ${durationSeconds} segundos

      Por favor, extraia entre 2 e 3 clipes curtos virais (cada um de 10 a 20 segundos).
      Gere a transcrição sequencial palavra-por-palavra (word-by-word transcription) em português do clipe, estimando tempos realistas de início e fim para cada palavra (em segundos, iniciando em 0 para cada clipe individual).
      Use marcas de estilo ('highlight' ou 'accent') e emojis para palavras de forte impacto ou emocionais (como 'sucesso', 'dinheiro', 'falhar', 'foco', 'futuro', 'incrível', 'parar').
    `;

    const systemInstruction = `
      Você é o motor de IA do Opus Clip (um editor de vídeo viral automatizado).
      Seu objetivo é analisar o conteúdo de um vídeo e extrair os melhores trechos para reels/shorts/tiktok.
      Gere títulos que deem "curiosidade", calcule pontuação de viralidade real (0-100) e forneça a explicação em português brasileiro.
      Crie transcrições detalhadas palavra por palavra com timestamp. O tempo de início (start) de cada palavra deve ser relativo ao início do clipe, começando em 0.
      Não invente dados quebrados ou JSON inválido. Responda estritamente no formato JSON do schema fornecido.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clips: {
              type: Type.ARRAY,
              description: "Lista de clipes virais extraídos",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID único para o clipe (ex: clip-1)" },
                  title: { type: Type.STRING, description: "Título mega chamativo estilo Shorts viral" },
                  startTime: { type: Type.NUMBER, description: "Tempo de início aproximado no vídeo original em segundos" },
                  endTime: { type: Type.NUMBER, description: "Tempo de término aproximado no vídeo original em segundos" },
                  viralScore: { type: Type.INTEGER, description: "Score de 0 a 100 de potencial viral" },
                  viralExplanation: { type: Type.STRING, description: "Análise estratégica de por que esse clipe vai performar bem" },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hashtags recomendadas" },
                  socialDescription: { type: Type.STRING, description: "Copy social pronto com emojis para postagem" },
                  words: {
                    type: Type.ARRAY,
                    description: "Transcrição palavra-por-palavra. Comece o start em 0 para a primeira palavra do clipe.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: "A palavra falada" },
                        start: { type: Type.NUMBER, description: "Tempo de início em segundos relativo ao início do clipe (iniciando em 0)" },
                        end: { type: Type.NUMBER, description: "Tempo de término em segundos relativo ao início do clipe" },
                        style: { type: Type.STRING, description: "Opcional: 'highlight' (destaque amarelo/laranja) ou 'accent' (verde/azul) para palavras fortes" },
                        emoji: { type: Type.STRING, description: "Opcional: emoji oportuno para piscar junto com a palavra (ex: 🚀, 🔥, 🎯, 💡)" }
                      },
                      required: ["text", "start", "end"]
                    }
                  }
                },
                required: ["id", "title", "startTime", "endTime", "viralScore", "viralExplanation", "hashtags", "socialDescription", "words"]
              }
            }
          },
          required: ["clips"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const data = JSON.parse(text);
    return res.json({
      success: true,
      clips: data.clips,
      isSimulated: false
    });

  } catch (error: any) {
    console.error("Gemini API error during clipping:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro desconhecido ao processar com a IA.",
      clips: generateMockClips(topic, videoUrl),
      isSimulated: true,
      message: "Ocorreu um erro ao conectar ao Gemini. Ativamos a IA de simulação de backup para você continuar criando!"
    });
  }
});

// Mock/Interactive clip generator fallback
function generateMockClips(topic: string = "", videoUrl: string = ""): any[] {
  const cleanedTopic = topic.trim() || "Empreendedorismo Digital";
  const finalVideoUrl = videoUrl.trim() || "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339f37d9c12b9eae1d74664924&profile_id=165&oauth2_token_id=57447761";
  
  // Create beautiful customized clip dialogue based on user's topic
  return [
    {
      id: `sim-clip-1`,
      title: `A Verdade sobre ${cleanedTopic.slice(0, 30)} 💥`,
      startTime: 0,
      endTime: 11,
      viralScore: 97,
      viralExplanation: `Este trecho resolve um mistério sobre "${cleanedTopic}". O gancho inicial quebra os padrões da mente do usuário em menos de 2 segundos, o que melhora a retenção orgânica.`,
      hashtags: ["mindset", "sucesso", "reels", "shorts", "viral"],
      socialDescription: `Ninguém te conta isso sobre ${cleanedTopic}... 🤫 Se você quer ser diferente da maioria, mude hoje sua visão de mundo! #revelacao #negocios #visao`,
      videoUrl: finalVideoUrl,
      secondaryVideoUrl: 'https://player.vimeo.com/external/510850877.sd.mp4?s=d0084fa606f23348001e3e8ef6e91cf2547e7041&profile_id=165&oauth2_token_id=57447761',
      words: [
        { text: 'A', start: 0.1, end: 0.3 },
        { text: 'maioria', start: 0.3, end: 0.7, style: 'highlight', emoji: '👥' },
        { text: 'das', start: 0.7, end: 0.9 },
        { text: 'pessoas', start: 0.9, end: 1.3 },
        { text: 'falha', start: 1.3, end: 1.8, style: 'accent', emoji: '🛑' },
        { text: 'nisso.', start: 1.8, end: 2.2 },
        { text: 'Elas', start: 2.3, end: 2.5 },
        { text: 'acham', start: 2.5, end: 2.8 },
        { text: 'que', start: 2.8, end: 3.0 },
        { text: 'precisam', start: 3.0, end: 3.3 },
        { text: 'de', start: 3.3, end: 3.5 },
        { text: 'segredos', start: 3.5, end: 4.1, style: 'highlight', emoji: '🔑' },
        { text: 'mágicos.', start: 4.1, end: 4.7 },
        { text: 'Mas', start: 4.8, end: 5.1 },
        { text: 'o', start: 5.1, end: 5.3 },
        { text: 'sucesso', start: 5.3, end: 5.8, style: 'accent', emoji: '🏆' },
        { text: 'com', start: 5.8, end: 6.0 },
        { text: 'esse', start: 6.0, end: 6.3 },
        { text: 'tema', start: 6.3, end: 6.6 },
        { text: 'exige', start: 6.6, end: 7.0 },
        { text: 'uma', start: 7.0, end: 7.2 },
        { text: 'única', start: 7.2, end: 7.6 },
        { text: 'coisa:', start: 7.6, end: 8.0 },
        { text: 'execução', start: 8.0, end: 8.6, style: 'highlight', emoji: '🚀' },
        { text: 'consistente.', start: 8.6, end: 9.3 },
        { text: 'Você', start: 9.5, end: 9.8 },
        { text: 'está', start: 9.8, end: 10.1 },
        { text: 'pronto?', start: 10.1, end: 10.8, style: 'accent', emoji: '⚡' }
      ]
    },
    {
      id: `sim-clip-2`,
      title: `O Segredo que Ninguém Conta! 🤫`,
      startTime: 12,
      endTime: 23,
      viralScore: 91,
      viralExplanation: `Foca no poder do foco em "${cleanedTopic}". Gera urgência emocional no público e ensina uma lição prática e memorável em 10 segundos.`,
      hashtags: ["foco", "disciplina", "crescimento", "segredos"],
      socialDescription: `Não espere o momento perfeito para dominar ${cleanedTopic}. O momento perfeito é criado pela sua coragem de começar! 🔥💪 #disciplina #sucesso #desafio`,
      videoUrl: finalVideoUrl,
      secondaryVideoUrl: 'https://player.vimeo.com/external/510850877.sd.mp4?s=d0084fa606f23348001e3e8ef6e91cf2547e7041&profile_id=165&oauth2_token_id=57447761',
      words: [
        { text: 'Se', start: 0.1, end: 0.3 },
        { text: 'você', start: 0.3, end: 0.5 },
        { text: 'continuar', start: 0.5, end: 0.9 },
        { text: 'procrastinando,', start: 0.9, end: 1.6, style: 'highlight', emoji: '⏳' },
        { text: 'outra', start: 1.7, end: 2.1 },
        { text: 'pessoa', start: 2.1, end: 2.4 },
        { text: 'vai', start: 2.4, end: 2.7 },
        { text: 'vencer', start: 2.7, end: 3.1, style: 'accent', emoji: '🎯' },
        { text: 'por', start: 3.1, end: 3.3 },
        { text: 'você.', start: 3.3, end: 3.7 },
        { text: 'A', start: 3.9, end: 4.1 },
        { text: 'única', start: 4.1, end: 4.5 },
        { text: 'diferença', start: 4.5, end: 4.9 },
        { text: 'entre', start: 4.9, end: 5.2 },
        { text: 'o', start: 5.2, end: 5.4 },
        { text: 'topo', start: 5.4, end: 5.8, style: 'highlight', emoji: '🏔️' },
        { text: 'e', start: 5.8, end: 6.0 },
        { text: 'a', start: 6.0, end: 6.2 },
        { text: 'média', start: 6.2, end: 6.7 },
        { text: 'é', start: 6.7, end: 6.9 },
        { text: 'a', start: 6.9, end: 7.1 },
        { text: 'sua', start: 7.1, end: 7.3 },
        { text: 'determinação', start: 7.3, end: 8.0, style: 'accent', emoji: '🔥' },
        { text: 'diária.', start: 8.0, end: 8.6 },
        { text: 'Comece', start: 8.8, end: 9.3, style: 'highlight', emoji: '💪' },
        { text: 'agora', start: 9.3, end: 9.7 },
        { text: 'mesmo!', start: 9.7, end: 10.4 }
      ]
    }
  ];
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Production static build routing enabled.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Video Clipper Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express + Vite server:", err);
});
