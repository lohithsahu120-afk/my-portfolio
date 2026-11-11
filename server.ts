import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const LOHITH_SYSTEM_PROMPT = `
You are the interactive AI Career & Research Assistant representing Lohith Sahu (Student ID: 2026BTAI036).
You speak accurately, professionally, and enthusiastically about Lohith's technical work, machine learning research, system architecture, and availability.

Lohith Sahu's Profile Summary:
- Name: Lohith Sahu
- Roll Number: 2026BTAI036
- Degree: B.Tech in Artificial Intelligence (Batch 2022 - 2026)
- Current CGPA: 9.22 / 10.0 (Top 2% of cohort, Dean's List)
- Email: lohithsahu120@gmail.com
- Status: Available for Summer 2026 Internship & Graduating Full-Time AI/ML Engineering & Research Roles (2026).
- Core Specializations: Computer Vision, Multimodal Diagnostic Systems, Agentic RAG & Graph Neural Networks, Edge AI & TensorRT optimization, MLOps, Distributed LLM fine-tuning.

Key Featured Projects:
1. NeuroVision-X (Medical Diagnostic Multimodal Vision):
   - DenseNet-121 + Clinical ViT ensemble for 14 pathology classifications from chest X-rays.
   - Integrated Grad-CAM explainability localized anomaly heatmaps.
   - Benchmark: 96.4% AUC-ROC, 115ms inference latency on NVIDIA A100 / RTX 4090.
2. Omnix-RAG (Enterprise Knowledge Graph & Agentic Retrieval):
   - Hybrid dense vector search (Qdrant) + Neo4j property knowledge graph.
   - Dynamic query routing with self-reflection and chunk re-ranking.
   - Benchmark: 42% reduction in hallucination rates compared to naive vector RAG on technical docs.
3. EdgeNano-Detect (Embedded Robotic Spatial Perception):
   - Real-time low-power object detection & tracking pipeline using custom YOLOv10 quantized to INT8 with TensorRT.
   - Tested on NVIDIA Jetson Orin Nano & Raspberry Pi 5 with camera feeds.
   - Benchmark: Sustained 48.2 FPS within a strict 5W thermal envelope.
4. VoiceSynth-Indic (Cross-Lingual Dialect Speech Synthesis):
   - Fine-tuned Whisper encoder + HiFi-GAN neural vocoder for phonetic alignment across 4 Indian regional languages and accents.
   - Low word-error-rate (WER) under noisy acoustic conditions.
5. AutoTrain-Ops (Distributed LLM Fine-Tuning Pipeline):
   - QLoRA + DeepSpeed ZeRO-3 pipeline for parameter-efficient adaptation of 7B-70B parameter open-weights models (Llama 3, Mistral) on multi-GPU setups.
   - Automated evaluation harness with Triton Inference Server packaging.

Skills & Stacks:
- Languages: Python, C++, TypeScript, SQL, CUDA C basics
- AI/ML Frameworks: PyTorch, Hugging Face (Transformers, PEFT, TRL), TensorFlow, JAX, ONNX, TensorRT, vLLM
- Data & Retrieval: LangChain, LlamaIndex, Qdrant, ChromaDB, Neo4j, FAISS, Pandas, NumPy, OpenCV
- Cloud & MLOps: Docker, Kubernetes, AWS SageMaker, GCP Vertex AI, MLflow, Weights & Biases, Git/GitHub CI/CD

Keep answers structured, concise, and technical when appropriate. If asked how to reach Lohith, provide lohithsahu120@gmail.com.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Offline / Intelligent fallback response mode
      const query = message.toLowerCase();
      let reply = '';

      if (query.includes('hire') || query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('interview')) {
        reply = `You can reach Lohith directly at lohithsahu120@gmail.com. He is actively interviewing for Summer 2026 roles and 2026 full-time AI/ML Engineering & Research positions. You can also click the "Get in Touch" or "Schedule Call" actions in this portfolio!`;
      } else if (query.includes('project') || query.includes('neurovision') || query.includes('rag') || query.includes('vision') || query.includes('edgenano')) {
        reply = `Lohith's portfolio highlights 5 flagship systems:
1. **NeuroVision-X**: Multimodal medical imaging platform (96.4% AUC, Grad-CAM anomaly heatmaps).
2. **Omnix-RAG**: Enterprise hybrid Knowledge Graph + Vector RAG reducing hallucinations by 42%.
3. **EdgeNano-Detect**: TensorRT-accelerated low-power spatial robotics vision running at 48 FPS on 5W.
4. **VoiceSynth-Indic**: Cross-lingual dialect speech synthesis and fine-tuned phonetic alignment.
5. **AutoTrain-Ops**: Distributed QLoRA + DeepSpeed ZeRO-3 LLM fine-tuning infrastructure.

Check out the interactive Lab tab above to experiment with live heatmap exploration and vector similarity reranking!`;
      } else if (query.includes('skill') || query.includes('stack') || query.includes('python') || query.includes('pytorch')) {
        reply = `Lohith specializes in:
- **Core Frameworks**: PyTorch, Hugging Face Transformers, TensorRT, vLLM, OpenCV, scikit-learn.
- **Languages**: Python (production-grade), C++, TypeScript, SQL.
- **Agentic & RAG**: LlamaIndex, LangChain, Qdrant, Neo4j, hybrid dense/sparse embeddings.
- **MLOps & Infrastructure**: Docker, Kubernetes, MLflow, AWS SageMaker, GCP Vertex AI, DeepSpeed ZeRO-3.`;
      } else if (query.includes('education') || query.includes('gpa') || query.includes('college') || query.includes('roll') || query.includes('2026btai036')) {
        reply = `Lohith Sahu (Roll No: 2026BTAI036) is pursuing a B.Tech in Artificial Intelligence (Batch 2022–2026). He holds a 9.22 CGPA (Dean's Honor List) with advanced coursework in Deep Learning, Computer Vision, Distributed Systems, Reinforcement Learning, and Algorithmic Information Theory.`;
      } else {
        reply = `Hi! I'm Lohith's Portfolio AI Assistant. Lohith is a B.Tech AI engineer (Class of 2026, ID: 2026BTAI036) specializing in Computer Vision, Multimodal LLMs, and Edge MLOps. Feel free to ask me about his flagship projects (NeuroVision-X, Omnix-RAG, EdgeNano), research publications, technical stack, or recruitment availability!`;
      }

      return res.json({ reply, source: 'fallback' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${LOHITH_SYSTEM_PROMPT}\n\nVisitor Question: ${message}` }
          ]
        }
      ]
    });

    const replyText = response.text || "Thank you for inquiring! Please feel free to reach Lohith at lohithsahu120@gmail.com.";
    return res.json({ reply: replyText, source: 'gemini' });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: 'Failed to process AI query',
      reply: "Lohith's assistant is momentarily recalculating. You can contact him directly at lohithsahu120@gmail.com or view his projects below!"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
