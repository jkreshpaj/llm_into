/**
 * ───────────────────────────────────────────────────────────────
 *  PROMPT-ENGINEERING 
 * ───────────────────────────────────────────────────────────────
 *
 *  1. Zero-Shot Prompting          – give the task, get an answer.
 *  2. Few-Shot Prompting           – provide 1-N worked examples.
 *  3. Chain-of-Thought Prompting   – “Let’s think step by step …”.
 *  4. Tree-of-Thought Prompting    – branch into multiple ideas,
 *                                    then pick the best.
 */

import { askLmStudio } from './0.2-interact.js';

let prompt = null;
let systemPrompt = null;

/*─────────────────────────────────────────────────────────────────
  1) ZERO-SHOT   – “Just answer the question.”
─────────────────────────────────────────────────────────────────*/
prompt = 'What are the primary health benefits of drinking green tea?';

// console.log('\n🟢 Zero-Shot Response:\n', await askLmStudio(prompt));

/*─────────────────────────────────────────────────────────────────
  2) FEW-SHOT   – Give exemplars, then a new query.
────────────────────────────────────────────────────────────────*/
systemPrompt = 'You are an assistant translating English to French.'

prompt = `
English: Hello, how are you?
French: Bonjour, comment ça va ?

English: I love programming.
French: J'adore la programmation.

English: Where is the train station?
French:
`.trim(); // the final English sentence is the “query”

// console.log('\n🟠 Few-Shot Response:\n', await askLmStudio(prompt, systemPrompt));

/*─────────────────────────────────────────────────────────────────
  3) CHAIN-OF-THOUGHT   – Ask the model to reveal reasoning.
─────────────────────────────────────────────────────────────────*/
prompt = `
A bookshelf has 5 shelves that each hold 12 books.
You have already placed 38 books.
How many more can fit?
Let’s think step by step.
`.trim();

console.log('\n🟡 Chain-of-Thought Response:\n', await askLmStudio(prompt));

/*─────────────────────────────────────────────────────────────────
  4) TREE-OF-THOUGHT   – Generate multiple solution branches,
                         evaluate them, then recommend the best.
─────────────────────────────────────────────────────────────────*/
systemPrompt = 'You are an expert sustainability planner.';

prompt = `
Task: Reduce household energy consumption by 20 % within one year.

1. Produce three distinct solution paths (Plan A, Plan B, Plan C).
2. List the concrete steps for each path.
3. Analyse pros & cons of each path.
4. Conclude with your recommended plan and a short rationale.
`;

//console.log('\n🔵 Tree-of-Thought Response:\n', await askLmStudio(prompt, systemPrompt));
