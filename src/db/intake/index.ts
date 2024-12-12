import db from "..";
import { generateEmbedding } from "../../ai/embed";
import { documentsTable } from "../schemas";
import matter from 'gray-matter';

import { Glob } from "bun";
import { countDistinct } from "drizzle-orm";

export async function loadFilesIntoKnowledgeBase() {
	const files = await getAllFilesInDirectory('./kb/**/*.md');
	const count = files.length;
	let i = 0;

	const countInDB = await db.select({
		count: countDistinct(documentsTable.url)
	}).from(documentsTable).then(r => r[0].count);

	if (countInDB === count) {
		console.log('All files are already in the database');
		return;
	}

	const failedPaths = [];

	for (const filePath of files) {
		console.log(`Processing file ${++i} of ${count}: ${filePath}`);

		const file = Bun.file(filePath);
		const content = await file.text();
		const title = extractTitleFromContent(content);

		if (!title) {
			failedPaths.push(filePath);
		}

		await db.insert(documentsTable).values({
			title,
			url: filePath,
			content: content,
			embedding: await generateEmbedding(content)
		}).onConflictDoNothing();

	}
}

async function getAllFilesInDirectory(globPattern: string) {
	const glob = new Glob(globPattern);
	const scanner = glob.scan({
		cwd: process.cwd(),
	});
	return Array.fromAsync(scanner);
}

function extractTitleFromContent(content: string) {
	try {
		const { data } = matter(content);
		return data.title;
	}
	catch (e) {
		const err = new Error('Failed to extract title from content', { cause: e });
		console.error(err);
	}
}