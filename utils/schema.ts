import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mock_interviews", {
  id: serial("id").primaryKey(),
  jsonMockResponse: text("json_mock_response").notNull(),
  interviewTitle: varchar("interview_title", { length: 255 }).notNull(),
  jobRole: varchar("job_role", { length: 255 }).notNull(),
  yearsOfExperience: varchar("years_of_experience", { length: 50 }).notNull(),
  whyInterviewing: text("why_interviewing").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  mockId: varchar("mock_id", { length: 255 }).notNull(),
});
