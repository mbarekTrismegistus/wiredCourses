import { relations, sql } from "drizzle-orm";
import { boolean, index, integer, pgTable, real, text, timestamp, varchar } from "drizzle-orm/pg-core";




export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstname: varchar({ length: 255}).notNull(),
    lastname: varchar({ length: 255 }).notNull(),
    picture: text("picture"),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    dateJoined: timestamp("dateJoined").notNull().defaultNow()
},
    (table) => ({
        searchIndex: index("user_search_index").using('gin', sql`(
            setweight(to_tsvector('english', ${table.firstname}), 'A') ||
            setweight(to_tsvector('english', ${table.lastname}), 'B')
        )`)
    })
);


export const course = pgTable("course", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    description: text("description"),
    userId: integer("userId").references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    media: text("media").array(),
    thumbnail: text("thumbnail"),
    duration: real(),
    datePosted: timestamp("datePosted").notNull().defaultNow(),
    views: integer("views").notNull().default(0),
    rating: real()

},
    (table) => ({
        searchIndex: index("course_search_index").using('gin', sql`(
            setweight(to_tsvector('english', ${table.title}), 'A') ||
            setweight(to_tsvector('english', ${table.description}), 'B')
        )`)
    })
);


export const video = pgTable("video", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }),
    courseId: integer("courseId").references(() => course.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    duration: real(),
    size: real(),
    url: text("url")
});

export const rating = pgTable("rating", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    rate: real(),
    courseId: integer("courseId").references(() => course.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    userId: integer("userId").references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

});

export const comment = pgTable("comments", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    content: text("content").notNull(),
    dateCommented: timestamp("dateCommented").notNull().defaultNow(),
    userId: integer("userId").references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    courseId: integer("courseId").references(() => course.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    parrentId: integer('parrentId').references(() => comment.id, {onDelete: 'cascade'})
})

export const notifications = pgTable("notifications", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    notificationDate: timestamp("notificationDate").notNull().defaultNow(),
    content: text().notNull(),
    userId: integer("userId").references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    senderId: integer("senderId").references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    notifyLink: text(),
    isRead: boolean().default(false)

})



export const usersRelations = relations(users, ({ many }) => ({
    courses: many(course),
    comments: many(comment),
    notifications: many(notifications),
    ratings: many(rating)
}))


export const courseRelations = relations(course, ({ many, one }) => ({
    comments: many(comment),
    videos: many(video),
    ratings: many(rating),
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
        fields: [rating.courseId],
        references: [course.id]
    }),
    user: one(users, {
        fields: [rating.userId],
        references: [users.id]
    }),
}))

export const ratingRelations = relations(rating, ({ one }) => ({
    course: one(course, {
        fields: [video.courseId],
        references: [course.id]
    })
}))


export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id]
    }),
    sender: one(users, {
        fields: [notifications.senderId],
        references: [users.id]
    })
}))



