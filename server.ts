import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if key exists
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for prompt optimization
  app.post("/api/optimize", async (req: express.Request, res: express.Response) => {
    try {
      const { prompt, category, variables } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Missing or invalid prompt" });
      }

      if (!ai) {
        // Fallback prompt optimization if no API key is provided
        const sampleOptimized = `[DEMO MODE - Configure GEMINI_API_KEY in Secrets for Live AI Optimization]

Role: Expert Prompt Engineer / AI Advisor specializing in ${category || 'General'} tasks.

Context:
- The user is seeking a high-quality, professional-grade result for their inquiry.
- Target Model: Advanced LLM / AI Generator

Core Objective:
"${prompt}"

Structure & Constraints:
1. Provide a step-by-step analytical breakdown of the answer.
2. Avoid generic summaries or filler text. Dive straight into highly technical or context-rich solutions.
3. If formatting is required, present data in Markdown tables or lists to maximize legibility.
4. Output Tone: Professional, authoritative, and precise.

Variables & Style Preferences:
${JSON.stringify(variables || {}, null, 2)}`;

        return res.json({
          optimizedPrompt: sampleOptimized,
          explanation: "This is an expert-structured template. Add a real GEMINI_API_KEY in 'Settings > Secrets' for state-of-the-art AI-powered custom optimization tailored specifically to your prompt.",
          tips: [
            "Adopt a specific persona: Explicitly tell the AI to act as a Senior Engineer, Copywriter, or Academic.",
            "Set strict negative constraints: Include 'DO NOT' rules to prevent common AI hallucinations or repetitive phrases.",
            "Use few-shot examples: Providing 1 or 2 examples of desired inputs and outputs greatly improves AI consistency."
          ]
        });
      }

      const categoryInstructions = {
        chatgpt: "Optimize for conversational LLMs. Structure it with an explicit Role, Context, Task description, Constraints, and desired Output Format.",
        json: "Optimize for JSON generation. Specify the exact JSON schema required, use double quotes, and command the model to only output raw valid JSON without markdown formatting, keeping it fully parseable.",
        image: "Optimize for image models like Midjourney, DALL-E 3, or Imagen. Rewrite it to use vivid sensory descriptions, camera angles, photographic styles, volumetric lighting, detail keywords, medium (e.g. oil painting, photorealistic, 3D render), and aspect ratios.",
        video: "Optimize for video generation models like Veo, Sora, or Runway. Focus on camera movement (e.g., pan, tracking, zoom), fluid motion details, atmospheric lighting, frames-per-second, and visual style.",
        coding: "Optimize for coding, programming, debugging, or architecture. Add requirements for clean code, detailed comments, edge-case testing, performance constraints, and secure programming practices.",
        general: "Optimize for general clarity and response quality. Add structured elements: Role, Clear Goal, Step-by-Step Instructions, Negative Constraints (what to avoid), and formatting guidelines."
      };

      const systemInstruction = `You are an elite Prompt Engineer specializing in creating world-class, highly effective prompts for AI models (LLMs, Image generators, Video generators, and Code models).
Your job is to take a raw, basic user prompt and rewrite/optimize it into a highly detailed, professional, structured, and extremely effective prompt.

Analyze the user's raw prompt and the selected category: "${category}".
Guidelines for category:
${categoryInstructions[category as keyof typeof categoryInstructions] || categoryInstructions.general}

Always output a JSON object containing:
1. "optimizedPrompt": The final, fully rewritten and optimized prompt that the user can copy and paste directly. Ensure it is extremely detailed, structured, clear, and utilizes advanced prompt engineering techniques (like shot prompting structure, clear boundaries, role prompting, etc.).
2. "explanation": A brief, high-level overview explaining why you structured it this way and how it improves the raw prompt.
3. "tips": An array of 3 actionable, specific prompt engineering tips/recommendations for the user to further customize this prompt in the future.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Optimize this raw user prompt: "${prompt}"\n\nAdditional contextual details/variables if any: ${JSON.stringify(variables || {})}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedPrompt: { type: Type.STRING, description: "The completely rewritten and optimized prompt." },
              explanation: { type: Type.STRING, description: "Short explanation of the improvements made." },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly relevant prompt engineering tips for this specific prompt."
              }
            },
            required: ["optimizedPrompt", "explanation", "tips"]
          }
        }
      });

      const jsonText = response.text ? response.text.trim() : "{}";
      const result = JSON.parse(jsonText);
      return res.json(result);

    } catch (error: any) {
      console.error("Gemini optimization error:", error);
      return res.status(500).json({ error: error.message || "Failed to optimize prompt" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
