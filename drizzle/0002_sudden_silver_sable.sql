DROP INDEX IF EXISTS "search_index";--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "course_search_index" ON "course" USING gin ((
            setweight(to_tsvector('english', "title"), 'A') ||
            setweight(to_tsvector('english', "description"), 'B')
        ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_search_index" ON "users" USING gin ((
            setweight(to_tsvector('english', "firstname"), 'A') ||
            setweight(to_tsvector('english', "lastname"), 'B')
        ));