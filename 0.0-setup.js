/**
 * ───────────────────────────────────────────────────────────────
 *  LOCAL LLM TOOLKIT  ─  Ollama & LM Studio
 * ───────────────────────────────────────────────────────────────
 *
 *  Everything you need to spin up a **local** Large-Language-Model
 *  stack on macOS, Linux, or Windows—captured in one commented JS
 *  file so you can keep it next to your code and copy-paste at will.
 *
 *  ▸ Ollama (CLI daemon + OpenAI-compatible REST API)
 *  ▸ LM Studio (GUI model manager + optional API bridge)
 *
 */

// ───────────────────────────────────────────────
// 1.  FIRST-RUN EXAMPLES
// ───────────────────────────────────────────────

/**
 * Pull and chat with llama3-8b:
 *   ollama run llama3
 *
 * Stream JSON from a prompt:
 *   curl -s http://localhost:11434/api/generate -d '{
 *     "model": "llama3",
 *     "prompt": "Explain gravity in one sentence.",
 *     "stream": false
 *   }' | jq -r '.response'
 *
 * List installed models:
 *   ollama list
 *
 * Run a new model without adding it permanently:
 *   ollama run mistral:instruct
 *
 * Delete a big model to save disk:
 *   ollama rm llama3
 */

/**
 * Quick-start:
 * 1. Launch LM Studio, open the “Models” tab, and click “Download”
 *    on e.g. **Phi-3-mini-128k-instruct-Q4_K_M.gguf**.
 *
 * 2. Toggle **Serve model ➜ OpenAI Compatible**.  
 *    ▸ Default endpoint: http://localhost:1234/v1/chat/completions
 *    ▸ You can now reuse OpenAI SDKs by setting
 *        OPENAI_API_BASE = "http://localhost:1234/v1"
 *        OPENAI_API_KEY  = "lm-studio-no-key-needed"
 *
 * 3. Sample cURL:
 *    curl -s http://localhost:1234/v1/chat/completions -H "Content-Type: application/json" -d '{
 *      "model": "local",
 *      "messages": [{"role":"user","content":"List 3 uses of solar energy"}],
 *      "temperature": 0.4
 *    }' | jq -r '.choices[0].message.content'
 *
 * CLI wrapper (beta):
 *    lmstudio --download tinyllama --chat
 *
 * NOTE: LM Studio stores .gguf files in ~/Library/Application Support/lm-studio
 *       on macOS, %APPDATA%\\lm-studio on Windows.
 */
