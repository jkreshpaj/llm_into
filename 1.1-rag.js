/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║      RAG (Retrieval-Augmented Generation) w/ LangChain        ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 *  ▸ “RAG” = combine *retrieval* (search your knowledge base) with
 *    *generation* (LLM) so answers stay grounded in your own data.
 *
 *  ▸ LangChain pipeline:
 *        ┌─────┐   ┌────────┐   ┌────────────────┐   ┌─────┐
 *        │Docs │ → │Embeds  │ → │   VectorStore  │ → │ LLM │
 *        └─────┘   └────────┘   └────────────────┘   └─────┘
 *                                    ↑  inject context  │
 *                                    └───── prompt──────┘
 *
 */

// ───────────────────────────────────────────────
// 0) ENV – set OPENAI_API_KEY before running
//    export OPENAI_API_KEY="sk-..."
//
//    LangChain will pick it up automatically.
// ──────────────────────────────────────────────

import 'dotenv/config';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RetrievalQAChain } from 'langchain/chains';

// ───────────────────────────────────────────────
// 1) YOUR “CORPUS” – any array of strings.
//    In production load PDFs, Markdown, DB rows, etc.
// ───────────────────────────────────────────────
const docs = [
  `
  CodeVider Sh.p.k. — Tirana-based outsourcing studio, founded 25 Apr 2019 (NIPT L91713020H). Share capital ALL 1 000 000 (~USD 10 k) and legal seat at Rr. “Sami Frashëri”, Pallati Teknoprojekt, Entrance 2, Apt. 1, Tirana 1010.
  `,
  `
  Leadership & Ownership: Administrator / co-founder Ervin Ziko oversees finance and compliance. Shareholders: Pasho Toska 51 %, Altin Luli 25 %, Erion Domi 19.6 %, Ervin Ziko 4.4 %.
  `,
  `
  Offices: Operational HQ at Rruga e Barrikadave, mbi Pasticeri “Mon Amour”, 2nd floor, near Skanderbeg Square, Tirana. Registered legal seat as above.
  `,
  `
  Workforce & Culture: 11–50 employees (~70 % engineers, 10 % design, 10 % QA/DevOps, 10 % business); ~33 % women; median tenure 2.8 years. Culture highlighted by #funatwork events and hackathons.
  `,
  `
  Service Lines & Stack: Custom web & mobile development, staff augmentation, maintenance & DevOps. Core tech: Node.js, React, Angular, Vue, Python/Django-Flask, PHP/Laravel, Java; DBs MySQL, PostgreSQL, MongoDB, Redis; Docker-based CI/CD on AWS & DigitalOcean.
  `,
  `
  Commercial Model: Hourly rate USD 25–49; agile engagement with daily stand-ups and weekly sprints. Client mix: 50 % start-ups, 20 % business services, 10 % education, 10 % logistics, 10 % fin-tech; majority EU & North-American customers.
  `,
  `
  Employees: Jul Kreshpaj — Software Engineer (NestJS, Mongoose, solar dashboards). Genci Likaj — Lead Developer (PHP, Node). Besiana F. — React Developer. Aurel Mirashi — Full-stack Dev. Artion M. — DevOps (Docker/K8s).
  `,
  `
  Hiring & Growth: Ongoing recruitment for Senior Backend (Python/Node); website careers page accepts open applications; Facebook shows frequent onboarding posts, signalling continued expansion.
  `
];

// ───────────────────────────────────────────────
// 2) BUILD VECTOR STORE
//    • Embed each document → high-dimensional vector.
//    • Persist to Chroma (here: in-memory for demo).
// ───────────────────────────────────────────────
const embeddings = new OpenAIEmbeddings();
const vectorstore = await MemoryVectorStore.fromTexts(docs, [], embeddings);

// ──────────────────────────────────────────────
// 3) RETRIEVAL-QA CHAIN
//    When you call .call({ query }), LangChain will:
//      a) Embed the query.
//      b) Retrieve top-k (k=4 default) similar docs.
//      c) Craft a prompt:   SYSTEM + retrieved context + user query.
//      d) Ask the LLM return the answer.
// ───────────────────────────────────────────────
const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.2,
});

const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever(4), {
  returnSourceDocuments: true, // helpful for debugging
});

export async function askRAG(query) {
  const result = await chain.call({ query });
  return {
    answer: result.text.trim(),
    cited: result.sourceDocuments.map(d => d.pageContent.trim().slice(0, 120) + '…'),
  };
}

/**
 * 1. Zero-Shot
 */
// await askRAG('Where is the headquarer of Codevider?')
//   .then(({ answer }) => console.log('\n🟢 Headquarter:', answer));

/**
 * 2. Few-Shot
 */
await askRAG(`Respond in bullet points: "List 5 employees of Codevider".`)
  .then(({ answer }) => console.log(`\n🟠 Employees (bullets):\n${answer}`));
