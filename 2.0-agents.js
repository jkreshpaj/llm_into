/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║         AGENT BASICS – Planning • Tools • Memory (LangChain)  ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 *  “Agent” = LLM + extra super-powers:  
 *    1. **Planning / Reflection** – break big goals into steps.  
 *    2. **Tool Access**          – call APIs, DBs, code, calculators.  
 *    3. **Memory**               – store facts & learn from history.  
 *
 *    • Calculate       (built-in calculator tool)  
 *    • Fetch Wikipedia (simple “search” tool)  
 *    • Remember facts  (conversation memory)  
 */

import 'dotenv/config.js';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from '@langchain/community/tools/calculator';
import { DynamicTool } from 'langchain/tools';
import { BufferMemory } from 'langchain/memory';

// ───────────────────────────────────────────────────────────────
// 1)  LLM CORE
// ────────────────────────────────────────────────────────────────
const llm = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0.2 });


// ────────────────────────────────────────────────────────────────
// 2)  TOOLS  – calculators, APIs, DB calls, etc.
// ────────────────────────────────────────────────────────────────

// 2-a) Built-in calculator for quick maths
const calcTool = new Calculator();

// 2-b) Tiny “Wikipedia” search (fake: uses fetch + REST)
//      Demonstrates how agents call *external* resources.
const wikiTool = new DynamicTool({
    name: 'wikipedia_search',
    description: 'Searches Wikipedia and returns the first paragraph of a topic.',
    func: async (query) => {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            query,
        )}`;
        const res = await fetch(url).then((r) => r.json());
        return res.extract ?? 'No page found.';
    },
});

// Collect for the agent
const tools = [calcTool, wikiTool];

// ────────────────────────────────────────────────────────────────
// 3)  MEMORY  – keeps running conversation history
// ────────────────────────────────────────────────────────────────
const memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true,
});


// ────────────────────────────────────────────────────────────────
// 4)  AGENT EXECUTOR
//    Uses “OpenAI Functions” agent type (tool-calling via JSON).
// ────────────────────────────────────────────────────────────────
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: 'openai-functions',
    memory,
    verbose: true, // show agent reasoning
});


// ────────────────────────────────────────────────────────────────
// 5)  askAgent(prompt)
//    Payload = { input: string }
//    Response = { output: string }
// ────────────────────────────────────────────────────────────────
export async function askAgent(input) {
    const res = await executor.invoke({ input });
    return res.output.trim();
}

// ────────────────────────────────────────────────────────────────
// 6)  DEMO SCENARIOS  – show core prompting styles
//    (Ctrl-C anytime; memory survives until process exits.)
// ────────────────────────────────────────────────────────────────
// 1. Recommendation-system vibe
console.log(
    '\n🟢 Marketing Strategy (complex, multi-step with Wiki + maths):\n',
    await askAgent(
        `Create a 3-step marketing strategy to increase Albanian green-tea sales 
       by 20 % next quarter.  Use recent health-benefit data from Wikipedia 
       if relevant, and include a rough ROI estimation.`,
    ),
);

// 2.  Customer-support style
//console.log(
    //'\n🟠 Customer Support (Q&A remembers context):\n',
    //await askAgent(`My order #87421 arrived damaged, what can I do?`),
//);
//console.log(
    //await askAgent(`Actually the product was "Solar-Lite Panel A100".`), // agent recalls chat
//);

// 3.  Research / Reporting
//console.log(
    //'\n🟡 Quick Financial Analysis:\n',
    //await askAgent(
        //`Compare the GDP growth of Albania vs. Greece in the last 5 years. 
       //Provide numeric values and a short conclusion.`,
    //),
//);

/*─────────────────────────────────────────────────────────────────
  WHY AGENTS VS. “JUST” LLM?
  ─────────────────────────
  • **Planning & Reflection** – executor decomposes tasks (“need ROI? → calc”).
  • **Tool Access**           – calls Wikipedia & Calculator automatically.
  • **Memory**                – BufferMemory lets follow-ups use earlier facts.
  
  → Agents let you implement real-world use-cases cited in the lecture:
      • Recommendation engines     (personalised queries + DB lookups)
      • Customer-support chatbots  (context + ticket APIs)
      • Research assistants        (search tools + iterative reasoning)
      • Booking / E-commerce bots  (inventory DBs + payment APIs)
      • Financial analysis         (live market feeds + spreadsheet maths)
─────────────────────────────────────────────────────────────────*/
