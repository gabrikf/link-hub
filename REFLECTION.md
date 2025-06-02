```md
Throughout this project, I used AI tools like ChatGPT and GitHub Copilot to assist with boilerplate generation, API design suggestions, and debugging. For example, ChatGPT helped me set up the Fastify routes and gave insight into edge cases with drag-and-drop on mobile using `@dnd-kit`. Copilot was helpful in writing repetitive or predictable code, such as form input bindings or TypeScript types.

However, all key decisions and architectural work were done manually. I manually set up the Firebase integration, React Query caching strategy, and drag-and-drop reordering logic. I also designed the user flows and UI/UX based on my own judgment of what makes a good link dashboard.

Where I had to think critically was especially around:

- Ensuring `@dnd-kit` works well on both desktop and mobile.
- Managing optimistic updates when reordering or toggling link visibility.
- Structuring reusable and accessible components using `shadcn/ui` and `react-hook-form`.

Given more time, I would improve:

- The profile customization (profile name, description, custom avatar upload)
- Analytics per link (click count)
- Ability to group or categorize links
- Better error handling and loading states
- Implement zod validation on back-end

Overall, AI helped accelerate some tasks, but the success of the project depended on manual design, problem-solving, and polish.
```
