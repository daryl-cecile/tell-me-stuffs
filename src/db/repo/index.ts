import { cosineDistance, sql, gt, desc, getTableColumns } from "drizzle-orm";
import { generateEmbedding } from "../../ai/embed";
import { documentsTable } from "../schemas";
import db from "..";

export async function findRelevantDocuments(description: string) {
	const embedding = await generateEmbedding(description);
	const similarity = sql<number>`1 - (${cosineDistance(documentsTable.embedding, embedding)})`;
	const similarGuides = await db
		.select({
			...getTableColumns(documentsTable),
			similarity
		})
		.from(documentsTable)
		.where(gt(similarity, 0.5))
		.orderBy((t) => desc(t.similarity))
		.limit(5);
	return similarGuides;
}
