# dsh-session-fork

English | [简体中文](docs/README.zh.md)

dsh-session-fork uses a Git-like branch model to make parallel development across dsh sessions practical. Instead of forcing several large, mostly unrelated tasks through one linear conversation, each task can evolve in its own branch and later be brought back together with `merge`-style operations such as `squash` and `rebase`.

This is a plugin for `DeepSeek Harness`; it cannot run standalone.

![branch_tab](docs/media/branch_tab.png)

## Why branches for parallel development?

The branch model mirrors how programmers already handle parallel work with Git. Independent tasks can progress in separate branches without stopping after every change to resolve conflicts. When the work is ready to come together, `squash` or `rebase` provides a path from parallel development back to a unified history.

This makes branches useful when you want to work on several large, relatively independent tasks at the same time.

## Branches are not sub-agents

A branch is not simply a way to split one large task into several smaller tasks.

Sub-agents remain useful for small, lightweight tasks where saving context and keeping the work close to the parent session matters. Branches are intended for larger tasks that are relatively independent and need their own ongoing session context.

The two approaches can also coexist: sub-agents can work within the same ecosystem while branches provide a clearer boundary between larger parallel tasks.

## Keep thinking while your agents work

One practical benefit of parallel branches is that they reduce the time spent waiting for a single conversation to finish before starting the next task.

The project was motivated in part by the familiar joke that vibe coding means "chat once, then spend ten minutes on your phone." With parallel branches, that waiting time can instead be used to keep thinking about other tasks.

In the maintainer's experience, using roughly 5× the token consumption produced roughly 4× the efficiency.

## Let AI handle session management

Managing independent sessions is harder than managing sub-agents. Sessions are not inherently bound to one main session, and their lifecycles and identities are more difficult to control.

dsh-session-fork addresses this by providing a complete set of branch management commands, together with agent-callable tool versions of those commands. Combined with the recommended governance approach, this allows the AI to handle the session-management details while the developer focuses on the work.

## DeepSeek Harness integration

The plugin is designed to integrate with dsh's existing behavior rather than replacing it with a separate model.

`squash` produces a summary message that remains compatible with dsh's `compact`-style summary behavior, and sub-agents can continue to work alongside the branch-based workflow.

## AI secretary direction

The branch model also opens the possibility of an "AI secretary" workflow.

A root branch can maintain a board and a clean context while the secretary coordinates the developer's current tasks and handles the connections between them. The goal is for the AI to have the same operational capabilities as the developer for organizing and managing the work, while keeping the developer's current task at the center.

This direction is part of the project's longer-term v0.3.0 vision.

## Quick start

Install (requires a web-app-based dsh profile):

```sh
dsh plugin --profile web add dsh-session-fork

After that, just let your agent use the plugin freely. Every command also ships as an agent-callable tool.

Core features
branch operations give every session a name, an ancestry, and an index, and provide commands for managing them.
fork hardens the native experience and provides the ancestry primitive.
squash and rebase provide two forms of cross-branch merging.
send_message_by_branch strengthens communication between sessions.
The branch tab provides visual management of branches.
Join us

What we want to build next:

Branch-scoped project memory. Existing long-term memory models are project-grained, which can cause memory to leak across branches and pollute context. Branch-grained memory management is intended to make the model more robust.
Ongoing maintenance. Open Issues to find long-term improvements and bugs waiting for contributions.

We take an open stance on AI collaboration: feel free to use AI to contribute code, write commit messages, and draft PRs. But we expect you to own your code, review it yourself, and treat AI as your tool in communication rather than letting it talk to us on your behalf.

License

MIT
