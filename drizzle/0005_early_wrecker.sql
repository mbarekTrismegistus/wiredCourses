CREATE TABLE IF NOT EXISTS "rating" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rating_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"rate" real,
	"courseId" integer,
	"userId" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_courseId_course_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
