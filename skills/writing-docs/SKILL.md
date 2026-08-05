---
name: writing-docs
description: Use when drafting, rewriting, structuring, reviewing, or auditing documentation, including README files, tutorials, how-to guides, procedures, runbooks, reference material, API docs, policies, handbooks, knowledge bases, and conceptual explanations.
license: CC-BY-SA-4.0
metadata:
  author: local adaptation
  version: "1.0.0"
---

# Writing Docs

## Overview

Write for one reader need and one primary document type at a time. Pick the job the reader needs done, then shape the document around that job.

## Before writing

Identify these facts before you draft:

- reader
- reader competence
- immediate need
- success condition
- verified sources
- unresolved facts

If a fact matters and you cannot verify it, mark the gap in the draft or ask for it.

## Diataxis compass

Ask two questions:

1. Does the reader need action or cognition, which Diataxis treats as understanding?
2. Does the reader need to learn a skill or apply one?

| Need | Reader state | Type | Use it for |
|---|---|---|---|
| action | study | tutorial | guided learning |
| action | work | how-to | real task completion |
| cognition | work | reference | lookup and confirmation |
| cognition | study | explanation | context and reasoning |

## Type contracts

Give each document one ordered structure.

| Type | Ordered output structure |
|---|---|
| Tutorial | outcome, controlled prerequisites, tested steps, checkpoints, next step |
| How-to | goal, verified prerequisites, verified task steps, unresolved facts when needed, variations, verification or rollback |
| Reference | subject map, fields or commands, defaults, constraints, examples that stay labeled as examples; move advice or rationale to a labeled how-to or explanation block |
| Explanation | governing question, answer, context, causes or trade-offs, assumptions, separation from procedures, approval or decision boundaries when relevant, links to action material |

When one request pulls several types, produce one labeled block per type and let navigation hold them together.

## Mixed-purpose rule

Split linked sections or linked documents when purposes differ. If a request says "combine everything," keep the material together only through navigation, not through one blended section. A README can link a tutorial, a task section, a reference table, and an explanation page.

If a request asks for a final reference page, keep the reference block neutral. Put advice or rationale in a separate labeled how-to or explanation block, or say that it belongs in separate material when the page must stay pure. If the request says "reference page only," omit the advice block instead of forcing mixed-purpose content into the page.

## Evidence contract

Separate three classes of content:

1. supplied or verified facts
2. reasonable examples labeled as examples
3. unresolved details

Do not present invented commands, hosts, thresholds, owners, timing, outputs, or expected results as facts. Under deadline pressure, leave a visible verification marker such as `[verify command]` or ask for the missing fact.

In procedures and runbooks, separate verified commands from unresolved details. Do not invent wrappers, URLs, protocols, host placeholders, flags, time windows, monitoring periods, ticket fields, or escalation payloads.

If a source gives a method, path, or command but not the wrapper around it, preserve it as given. Do not turn `GET /health` into `curl`, a full URL, or a hostname placeholder unless the source gives that detail.

When unresolved facts block the next operational step, stop at the last verified step and mark the gap.

Do not infer healthy-service shortcuts, likely log symptoms, or required escalation contents unless the source states them.

In procedures and runbooks, do not add example names, paths, sample configurations, or sample commands unless the source provides them.

## Prose contract

Write direct active sentences. Name the actor, action, condition, and result. Use specific claims. Tell the reader what to do when the document gives instructions. Define a necessary technical term the first time you use it.

Cut filler, promotional claims, vague importance, manufactured emphasis, false agency, formulaic contrast, rhetorical setup, and dramatic fragments. Keep rhythm readable. Vary sentence length when it helps scanning.

## Compact example

Request pattern: an Acorn README needs first-run setup, a full `acorn init` option list, and an encryption explanation.

- Tutorial: **Create your first notebook**
  - outcome
  - prerequisite: Acorn installed
  - tested steps for `acorn init`
  - checkpoint: notebook created
- How-to: **Initialize a notebook in a chosen location**
  - goal
  - prerequisites
  - task steps for the requested setup task
  - verification status if command behavior is untested
- Reference: **`acorn init` options**
  - `--name <text>`
  - `--path <directory>`
  - `--encrypt`
  - defaults or constraints only when the source provides them
- Explanation: **Why Acorn uses one key per notebook**
  - governing question
  - scope of protection
  - limits

This split avoids invented notebook names, paths, command behavior, or outcomes.

## Common mistakes

- Mixed purposes in one section. Split tutorial, how-to, reference, and explanation.
- Filled missing details with made-up commands or operations. Mark gaps or ask.
- Answered a why request with compliance steps or policy summary. Use an explanation structure.
- Turned reference into advice or persuasion. Keep reference neutral and move guidance elsewhere.

## Red flags

- "fill missing details"
- "fill any missing operational details yourself"
- "combine everything"
- deadline pressure
- invented verification language
- buried audience or success condition

When these signals appear, slow down and check type purity and factual support.

## Delivery checklist

- type stays pure or split on purpose
- reader can complete the task or answer the question
- factual claims come from supplied or verified sources
- commands are tested or carry explicit verification status
- headings and links make the document easy to scan and find
- structure supports accessibility and reuse
- prose stays direct, specific, and readable

## Attribution

This skill adapts Daniele Procida's Diataxis, <https://diataxis.fr/start-here/>, licensed CC BY-SA 4.0. It also adapts Stop Slop by Hardik Pandya, Copyright (c) Hardik Pandya, licensed MIT, <https://github.com/hardikpandya/stop-slop>. This adaptation is licensed CC BY-SA 4.0.
