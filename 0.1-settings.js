/**
 * ───────────────────────────────────────────────────────────────
 *  LLM SETTINGS
 * ───────────────────────────────────────────────────────────────
 *
 *  This file gathers the **six most common knobs** you’ll pass to
 *  Large-Language-Model APIs (OpenAI, Anthropic, Cohere, etc.).
 *  Each constant is documented with “why it matters” guidance
 *  distilled from the prompt-engineering article you provided.
 *
 *  Quick-start best practices:
 *  • Vary **either** `temperature` **or** `top_p` – not both.
 *  • Vary **either** `frequency_penalty` **or** `presence_penalty`.
 *  • Use `max_length` + `stop_sequence` to keep costs predictable.
 *
 *  Import this file, tweak the values, and pass them straight to
 *  your API call – or surface them in a UI if you need sliders.
 *  (See export options at the bottom.)
 */

/**
 * TEMPERATURE  ∈ [0, 2]  
 * • 0   → deterministic (fundamentally factual, concise).  
 * • 0-0.7 → balanced factual + slight creativity (FAQ bots).  
 * • 1   → default “chatty” creativity (what ChatGPT uses).  
 * • 1-2 → poetic / brainstorming / “wild” mode.  
 *
 *  Lower it for legal / medical QA, raise it for poetry.
 */
const temperature = 1.0;

/**
 * TOP-P (nucleus sampling) ∈ [0, 1]  
 *  Only tokens comprising the cumulative probability mass `p`
 *  are considered.  
 * • 0.1-0.3 → very confident, “boring but safe”.  
 * • 0.8-1   → wide vocabulary, playful language.  
 *
 *  **Use this OR temperature**
 */
const top_p = 1.0;

/**
 * MAX LENGTH (tokens)  
 *  Upper bound on how many tokens the model may *generate*  
 *  (excludes your prompt tokens in most APIs).  
 *  Tighten it to avoid runaway cost or tangent essays.
 */
const max_tokens = 2048;

/**
 * STOP SEQUENCE(S) – string or string[] or `null`  
 *  Generation halts as soon as the model outputs one of these
 *  substrings.  
 *  ↳ Example: enforce an unordered list ≤ 10 items by adding `"11"`.
 */
const stop_sequence = null;

/**
 * FREQUENCY PENALTY ∈ [-2, 2]  
 *  Applies a penalty proportional to **how many times** the token
 *  already appeared. High value ⇒ fewer repeats of frequent words.  
 *
 *  Pair with low temperature for crisp, non-repetitive answers.
 */
const frequency_penalty = 0.0;

/**
 * PRESENCE PENALTY ∈ [-2, 2]  
 *  Flat penalty if the token is already present (regardless of count).  
 *  Encourages the model to introduce new topics / vocabulary.  
 *
 *  Use **either** presence- or frequency-penalty, not both.
 */
const presence_penalty = 0.0;

export default {
    temperature,
    top_p,
    max_tokens,
    stop_sequence,
    frequency_penalty,
    presence_penalty,
};
