import { ollama } from 'ollama-ai-provider';
import { generateText, streamText, type CoreMessage, type CoreTool } from 'ai';

export const model = ollama('llama3.2');
export const ollamaProvider = ollama;

type Prompt = Pick<Parameters<typeof streamText>[0], 'system' | 'messages' | 'prompt' | 'topK'>;

export function getTextStream(prompt: Prompt) {
	const { textStream } = streamText({
		...prompt,
		model: ollama('llama3.2'),
	});

	if (isAsyncIterable(textStream)) {
		return textStream;
	}

	throw new Error('Expected textStream to be an AsyncIterable');
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isAsyncIterable<T>(obj: any): obj is AsyncIterable<T> {
	return Symbol.asyncIterator in obj;
}

export async function getText(query: string, tools?: Record<string, CoreTool>) {
	const { text, steps } = await generateText({
		model: model,
		prompt: query,
		tools: tools,
		maxSteps: 5
	});

	return text;
}