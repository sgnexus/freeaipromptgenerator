interface CompileOptions {
  tone: string;
  length: string;
  role?: string;
  context?: string;
  constraints?: string;
}

export function compilePromptLocally(prompt: string, category: string, options: CompileOptions) {
  const tone = options.tone || 'Professional';
  const length = options.length || 'Medium';

  let optimizedPrompt = '';
  let explanation = '';
  let tips: string[] = [];

  switch (category) {
    case 'chatgpt':
      optimizedPrompt = `# ROLE
Act as an elite expert ${options.role || 'Advisor / Specialist'} trained in highly analytical and structured reasoning.

# CONTEXT & BACKGROUND
${options.context || 'The user is seeking to address a professional task or gather insightful data.'}

# CORE OBJECTIVE
Execute the following primary task with maximum clarity:
"${prompt}"

# STYLE & TONE Guidelines
- **Tone:** ${tone}
- **Length:** Target a ${length} depth response. Avoid generic filler words or introductory remarks.
- **Execution:** Break down complex items step-by-step. Provide practical, real-world examples.

# OUTPUT FORMAT
Provide a beautifully structured markdown response with bold headings, clean bullet points, and high contrast lists.`;
      
      explanation = "Utilized the CO-STAR prompting framework. Established a firm persona, injected situational context, formulated a precise objective, and commanded specific stylistic/structural constraints to prevent AI drift.";
      tips = [
        "Incorporate few-shot learning: Give the model 1-2 examples of your ideal output structure.",
        "Add strict negative bounds: Explicitly tell the AI what NOT to include to avoid generic fluff.",
        "Force self-correction: End your prompt with 'Reflect on your draft and refine it before outputting.'"
      ];
      break;

    case 'json':
      optimizedPrompt = `# OBJECTIVE
Convert the following concept or data request into a strictly structured, highly optimized JSON Schema:
"${prompt}"

# EXPECTED SCHEMA & CONSTRAINTS
- **Structure:** Provide an organized array or root-object mapping key variables dynamically.
- **Data Types:** Ensure strictly typed properties (strings, integers, booleans, nested arrays).
- **Style:** Use valid double-quotes and correct comma placement.

# RETURN FORMAT RULES (STRICT)
1. Output ONLY the raw, parseable JSON block.
2. DO NOT wrap the output in markdown codeblocks like \`\`\`json.
3. Absolutely zero conversational introductions, explanations, or trailing commentary.`;

      explanation = "Configured strict schema enforcement boundaries. Injected deterministic formatting instructions and strict return rules to prevent conversational AI filler and ensure direct code parseability.";
      tips = [
        "Provide a sample template: Add a small mock JSON structure so the model can match your key names.",
        "Define optional vs required: Explicitly state which object fields are mandatory to output.",
        "Command schema validation: Ask the model to double-check that every list element contains matching fields."
      ];
      break;

    case 'image':
      optimizedPrompt = `# VISUAL CONCEPT
"${prompt}"

# RENDER SPECIFICATIONS
- **Medium / Style:** High-fidelity digital art, modern photorealistic render.
- **Lighting & Atmosphere:** Dramatic volumetric rays, golden hour glow, subtle lens flare.
- **Camera & Optics:** Shot on 85mm lens, f/1.4 aperture, deep depth of field, sharp focus.
- **Detail Enhancements:** Ultra-fine skin textures, intricate background structures, micro-reflections.

# COMPOSITION & ANGLE
- **Subject:** Detailed foreground focus.
- **Colors:** Vibrant, balanced, cinematic color grading.
- **Aspect Ratio:** --ar 16:9

# NEGATIVE PROMPT (AVOID)
deformed, blurry, low resolution, extra limbs, mutated, worst quality, signatures, watermarks, text overlay.`;

      explanation = "Translated the raw idea into Midjourney/DALL-E 3 optimized vocabulary. Added photographic specs (aperture, focal length), cinematic lighting directives, composition guides, and negative constraints.";
      tips = [
        "Reference artistic mediums: Specify 'oil painting', 'vector graphic', or '3D clay render' for cohesive styles.",
        "Use famous artists: Hint at visual styles by naming legendary photographers or digital concept designers.",
        "Adjust aspect ratio parameters: Append '--ar 9:16' for mobile screens or '--ar 4:3' for standard frames."
      ];
      break;

    case 'video':
      optimizedPrompt = `# TEMPORAL SCENE DIRECTIVE
"${prompt}"

# CAMERA MOVEMENT (FLUID & DYNAMIC)
- **Primary Motion:** Slow cinematic tracking shot, panning gently from left to right.
- **Optics:** Zooming in gradually, maintaining focus on the central subject.

# VISUAL & ATMOSPHERIC CONDITIONS
- **Style:** Cinematic 8K video, high frames-per-second, fluid physical simulation.
- **Lighting:** Moody backlighting, ambient mist glowing with warm ray diffusion.
- **Composition:** Perfectly centered focus, clean rule-of-thirds alignment.

# MOTION SPEED & PACE
Smooth, atmospheric, 60fps render, realistic fluid dynamics and particle physics.`;

      explanation = "Formatted using key directors' cinematography guidelines. Prescribed active camera movements, frame pacing, ambient conditions, and physical simulation details for modern AI video systems.";
      tips = [
        "Incorporate temporal transitions: Specify the exact pacing (e.g., 'starts with a close-up, then slowly transitions into a wide shot').",
        "Control physical simulations: Define the behavior of smoke, rain, wind, or dust particles.",
        "Specify lens behavior: Use terms like 'anamorphic bokeh' or 'handheld camera shake' to invoke realistic rendering."
      ];
      break;

    case 'coding':
      optimizedPrompt = `# ROLE & INSTRUCTION
Act as a Principal Staff Software Engineer specializing in modern clean architecture and secure coding patterns.

# CONTEXT / TASK
${options.context || 'Implement a secure, high-performance module.'}
"${prompt}"

# CODE QUALITY SPECIFICATIONS
- **Language/Framework:** Modern optimized standards.
- **Modularity:** Ensure separation of concerns, descriptive naming, and single responsibility principles.
- **Performance:** Optimize loops, minimize layout recalculations, and leverage proper asynchronous handling.
- **Security:** Sanitize inputs, enforce type safety, and check for potential injection vectors.

# EXPECTED OUTPUT FORMAT
1. Write 100% complete, runnable code blocks with zero placeholders, dummy code, or comments like "// implement here".
2. Add comprehensive JSDoc / TSDoc comments explaining complex functions or type mappings.
3. Include brief inline documentation covering unit test cases and edge cases.`;

      explanation = "Formulated an elite developer persona. Mandated strict clean code directives (modular design, secure coding, full implementation without placeholders), error catching, and complete annotations.";
      tips = [
        "Request test suites: Ask the model to include standard Jest/Vitest unit tests covering edge cases.",
        "Demand typing systems: Command explicit TypeScript typing/interfaces to prevent runtime bug replication.",
        "Ask for a code walkthrough: Request a brief paragraph explaining complexity metrics (Big O) and architectural choices."
      ];
      break;

    default: // general
      optimizedPrompt = `# USER OBJECTIVE
"${prompt}"

# CONTEXTUAL DATA
${options.context || 'General inquiry designed for comprehensive, multi-angle resolution.'}

# PRINCIPLES OF EXCELLENCE
1. **Persona:** Elite research assistant with a background in linguistic clarity and logical rigor.
2. **Tone:** ${tone}
3. **Pacing:** Provide a direct, step-by-step walkthrough. Skip introductory pleasantries and start with immediate value.
4. **Formatting:** Use structured lists, clear tables, and dynamic code sections where appropriate.

# CONSTRAINTS
${options.constraints || 'Provide direct, clear, and actionable feedback.'}`;

      explanation = "Built an optimized multi-purpose structure. Injected custom tone rules, contextual mapping fields, and standard formatting specifications to streamline any general task.";
      tips = [
        "Adopt progressive refinement: If the first response is draft-heavy, ask the AI to 'critique and polish.'",
        "Establish step boundaries: Ask the model to 'show its scratchpad reasoning before printing the final answer.'",
        "Control response length: Explicitly command page counts, paragraph counts, or maximum list sizes."
      ];
      break;
  }

  return {
    optimizedPrompt,
    explanation,
    tips
  };
}
