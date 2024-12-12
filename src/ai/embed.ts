import { embed } from "ai";
import { ollamaProvider } from ".";

export async function generateEmbedding(value: string) {
	const input = value.replaceAll('\n', ' ');

	const { embedding } = await embed({
		model: ollamaProvider.embedding('mxbai-embed-large'),
		value: input,
	});

	return embedding;
};