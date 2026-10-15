---
name: execute-task
description: Executes tasks strictly from .agents/current_task.md following zero scope creep policy
---

# Instruction for Task Execution

When invoked via `@execute-task` or instructed to execute the current task:

1. **Read Task Specification**:
   - Always read `.agents/current_task.md` first.
   - Strictly follow the steps, files, and contracts defined in that file.

2. **Zero Scope Creep (Strict Rules)**:
   - Make ONLY changes explicitly stated in the task specification.
   - Do NOT refactor surrounding working code.
   - Do NOT add unrequested dependencies, external scrapers, or speculative features.
   - Never use stub comments like `// rest of code remains the same`. Write atomic, complete replacements.

3. **Verification**:
   - Verify linting, types, imports, and execution after changes.

4. **Completion Report**:
   - Provide a concise list of modified files with bullet points of exact changes.
   - Conclude with a single git command:
     `git add . && git commit -m "..." && git push origin main`
