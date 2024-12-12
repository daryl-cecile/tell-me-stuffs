import { getTextStream } from './ai';
import { findRelevantDocuments } from './db/repo/index';
import { loadFilesIntoKnowledgeBase } from './db/intake/index';

// Attempt to load all md files into the knowledge base - will skip if already loaded
await loadFilesIntoKnowledgeBase();

// Prompt the user for a query
const query = prompt('Enter your prompt below:\n');

// Exit if no query is provided
if (!query) process.exit(0);


// Find relevant documents based on the query from the embeddings of the KB in the DB
const relevantDocuments = await findRelevantDocuments(query);
const documentContent = relevantDocuments.map(d => d.content).join('\n\n');

const context = documentContent || 'No relevant knowledgebase documents found.';

console.log('Got Context:', documentContent.trim().length > 0 ? 'Yes' : 'No');

const systemInstructions = `
You are a highly intelligent assistant designed to provide accurate and concise answers by using only the provided context. Always prioritize the information in the provided context when available. If the context does not contain relevant information, you SHOULD tell the user you DO NOT KNOW.

#### Task:
Respond to the query using the context provided below. Clearly indicate where the information is sourced from in the context. Avoid making assumptions beyond the provided context.

#### Context:
<context>
${context}
</context>

#### Query:
<query>
${query}
</query>

#### Instructions:
1. Summarize the most relevant information from the context to answer the query.
2. If context is incomplete, dont supplement it with your own knowledge; just say you dont know.
3. Keep responses concise and factually accurate.

`

const answer = getTextStream({ prompt: systemInstructions, topK: 50 });

// Write the answer to the terminal as it comes in chunk by chunk
for await (const chunk of answer) {
	process.stdout.write(chunk);
}

