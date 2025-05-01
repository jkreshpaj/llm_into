/**
 * ───────────────────────────────────────────────────────────────
 *  LOCAL LLM API WRAPPERS
 * ───────────────────────────────────────────────────────────────
 *
 */

import settings from './0.1-settings.js';
import fetch from 'node-fetch';

/*─────────────────────────────────────────────────────────────────
  1) OLLAMA – single-message “/api/generate” endpoint
  -----------------------------------------------------------------
  Endpoint docs: https://github.com/ollama/ollama/blob/main/docs/api.md
  
  PAYLOAD FIELDS
  ──────────────
  • model        (string)  – local model name/tag, e.g. 'llama3'.
  • prompt       (string)  – *single* prompt string.
  • stream       (bool)    – true = Server-Sent-Events chunked stream,
                              false = 1 JSON blob (easier for demos).
────────────────────────────────────────────────────────────────*/
export async function askOllama(prompt) {
    const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3',      // pull/run the model automatically if missing
            prompt,               // the user’s question
            stream: false,        // turn on if you want tokens as they arrive
            ...settings,
        }),
    });
    const { response } = await res.json(); // { response: "text..." }
    return response.trim();
}

// ─── Example ───
// askOllama('What is the capital of Albania?')
//     .then(answer => console.log(`\n🟢 Llama3 Response:\n${answer}`));

/*─────────────────────────────────────────────────────────────────
  2) LM STUDIO – OpenAI compatible “/v1/chat/completions”
  -----------------------------------------------------------------
  MESSAGE ROLES
  ─────────────
  • system    – sets behaviour or persona
  • user      – actual question/request from end-user
  • assistant – model’s previous answer(s) if you’re continuing a chat
  • tool      – optional, for Function-calling spec

  PAYLOAD FIELDS
  ──────────────────────
  • model        (string)  – can literally be "local".
  • messages     (array)   – at least one { role, content } object.
─────────────────────────────────────────────────────────────────*/
export async function askLmStudio(userPrompt, systemPrompt = null) {
    const messages = [{
        role: 'user', content: userPrompt,
    }];

    if (systemPrompt) messages.unshift({
        role: 'system', content: systemPrompt,
    })

    const res = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'local',               // LM Studio maps to the served model
            messages,
            ...settings,
        }),
    });

    const json = await res.json();        // OpenAI-style envelope
    /*
    {
      id, object, created, model,
      choices: [
        { index, message: { role, content }, finish_reason }
      ],
      usage: { prompt_tokens, completion_tokens, total_tokens }
    }
    */
    return json.choices[0].message.content.trim();
}

// ─── Example ───
askLmStudio('\nList 3 uses of solar energy.')
    .then(answer => console.log(`\n🟢 Gemma2 Response:\n${answer}`)); 
