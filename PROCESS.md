**Live:** https://booklist-app-tawny.vercel.app/

---

## The Stack

Next.js for both the frontend and backend. It is flexible, I am more familiar with it, and it is easy to set up and use.

---

## The Design Problem

Users do not complete the books they track in reading list apps. Normal reading lists are boring and not interactive when the user finishes a number of pages, there is no response from the app. Users cannot feel any short-term achievement, which makes it hard to stay motivated.

---

## One Design Decision I Debated

I was thinking about making the user more interactive with the system and giving them a sense of challenge. I considered adding a simple progress bar so that the user could see the progress they made. I then decided to build a new feature called the "Knowledge Tree" an idea I took inspiration from an app called Forest, but with many changes to suit the concept of this system. After testing it, I felt that the system was genuinely interacting with me, which confirmed the decision.

---

## AI Tools Used

I used Claude Code as a coding agent. I gave it detailed instructions about my idea, the design, and the full concept in a markdown file, then asked it to write a task list for me to implement. It created the task list and a plan. I started by setting up the stack and installing all the libraries without AI assistance — because AI agents often default to outdated or unstable versions — and then used the agent for implementation.

---

## AI Suggestions I Rejected

1. **Dark, calm design** — I rejected this because I felt a dark theme would make the app feel heavy and distant, rather than something the user feels comfortable and excited to use.
2. **Google and GitHub OAuth providers** — I rejected this because it is too much for a smaller app.
3. **Next.js with PostgreSQL** — I rejected this because using PostgreSQL for a small project adds unnecessary complexity. SQLite gives more development speed and keeps the codebase more focused.
4. **Basic analytics dialog** — The AI suggested a plain numbers-only analytics view. I rejected this in favor of a per-day bar chart with colors, so the user feels excited to fill each day with achievements.

---

## Auth Choice and Tradeoffs

**What I used:** next-auth v4 with CredentialsProvider (email/password), bcrypt for password hashing, JWT sessions stored in cookies, 7-day expiry.

**Why:** Simple to set up, no third-party OAuth dependency, passwords are never stored in plain text, and sessions do not require a database lookup on every request.

**Protects against:** Password theft from the database (bcrypt), cross-user data access (every query is scoped to the authenticated user's ID), and session forgery (JWTs signed with a secret).

**Does not protect against:** Brute force login attempts (no rate limiting), and fake signups (no email verification — anyone can register with a fake email).

**What I would change for production:** Add rate limiting on the login endpoint to prevent brute force attacks, and add email verification to confirm real users.

---

## What I Would Cut and What I Would Add

**Add:** Book cover images, and more stages for the Knowledge Tree.
