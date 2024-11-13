import { password } from "bun";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";




export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstname: varchar({ length: 255}).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
});


export const course = pgTable("course", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    description: text("description"),
    userId: integer("userId"),
    media: text("media").array(),
    thumbnail: text("thumbnail"),
    datePosted: timestamp("datePosted").notNull().defaultNow()

});

export const comment = pgTable("comments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    content: text("content").notNull(),
    dateCommented: timestamp("dateCommented").notNull().defaultNow(),
    userId: integer("userId"),
    courseId: integer("courseId")
})



export const userCourses = relations(users, ({ many }): any => {
    courses: many(course)
})

export const userComments = relations(users, ({ many }): any => {
    comments: many(comment)
})

export const courseComments = relations(course, ({ many }): any => {
    comments: many(comment)
})


export const courseRelation = relations(course, ({ one }): any => {
    user: one(users, {
        fields: [course.userId],
        references: [users.id]
    })


})


export const commentUser = relations(comment, ({ one }): any => {
    user: one(users, {
        fields: [comment.userId],
        references: [users.id]
    })


})

export const commentCourse = relations(comment, ({ one }): any => {
    course: one(course, {
        fields: [comment.courseId],
        references: [course.id]
    })
})


