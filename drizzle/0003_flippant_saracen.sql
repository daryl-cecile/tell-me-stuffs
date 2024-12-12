ALTER TABLE "documents" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_url_unique" UNIQUE("url");