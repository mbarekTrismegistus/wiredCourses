import { relations } from "drizzle-orm";
import { integer, pgTable, real, text, timestamp, varchar } from "drizzle-orm/pg-core";




export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstname: varchar({ length: 255}).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    picture: text("picture"),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    dateJoined: timestamp("dateJoined").notNull().defaultNow()
});


export const course = pgTable("course", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    description: text("description"),
    userId: integer("userId").references(() => users.id),
    media: text("media").array(),
    thumbnail: text("thumbnail"),
    duration: real(),
    datePosted: timestamp("datePosted").notNull().defaultNow()

});


export const video = pgTable("video", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    courseId: integer("courseId").references(() => course.id),
    duration: real(),
    size: real(),
    url: text("url")
});

export const comment = pgTable("comments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    content: text("content").notNull(),
    dateCommented: timestamp("dateCommented").notNull().defaultNow(),
    userId: integer("userId").references(() => users.id),
    courseId: integer("courseId").references(() => course.id),
    parrentId: integer('parrentId').references(() => comment.id, {onDelete: 'cascade'})
})

export const notifications = pgTable("notifications", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    notificationDate: timestamp("notificationDate").notNull().defaultNow(),
    content: text().notNull(),
    userId: integer("userId").references(() => users.id),
    notifyLink: text()

})



export const usersRelations = relations(users, ({ many }) => ({
    courses: many(course),
    comments: many(comment),
    notifications: many(notifications)
}))


export const courseRelations = relations(course, ({ many, one }) => ({
    comments: many(comment),
    videos: many(video),
    user: one(users, {
        fields: [course.userId],
        references: [users.id]
    })
}))



export const commentRelations = relations(comment, ({ one, many }) => ({
    user: one(users, {
        fields: [comment.userId],
        references: [users.id]
    }),
    course: one(course, {
        fields: [comment.courseId],
        references: [course.id]
    }),
    parrent: one(comment, {
        fields: [comment.parrentId],
        references: [comment.id],
        relationName: "childrenComment"
    }),
    childrens: many(comment, {
        relationName: "childrenComment"
    })


}))


export const videoRelations = relations(video, ({ one }) => ({
    course: one(course, {
        fields: [video.courseId],
        references: [course.id]
    })
}))


export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
    })
}))



