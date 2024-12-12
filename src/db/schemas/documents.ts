import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";

export const documentsTable = pgTable('documents', {
	id: uuid().defaultRandom().primaryKey(),
	title: text('title'),
	content: text('content').notNull(),
	url: text('url').notNull().unique(),
	embedding: vector('embedding', { dimensions: 1024 }),
}, table => [
	index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops'))
]);

