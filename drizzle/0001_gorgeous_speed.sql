CREATE TABLE IF NOT EXISTS "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"notificationDate" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"userId" integer,
	"senderId" integer,
	"notifyLink" text,
	"isRead" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "parrentId" integer;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "duration" real;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dateJoined" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_parrentId_comments_id_fk" FOREIGN KEY ("parrentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_index" ON "course" USING gin ((
            setweight(to_tsvector('english', "title"), 'A') ||
            setweight(to_tsvector('english', "description"), 'B')
        ));