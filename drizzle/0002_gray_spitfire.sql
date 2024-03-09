CREATE TABLE IF NOT EXISTS "pendek" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"url" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pendek_slug_unique" UNIQUE("slug")
);
