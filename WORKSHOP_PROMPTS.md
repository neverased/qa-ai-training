# Copilot prompts for the ColourHub workshop

Open your cloned ColourHub project in the standalone GitHub Copilot app. Save your observations in the six files under `outputs/`. In a fresh local session on **This computer → Current checkout**, verify the **workshop-day2** branch. Add the listed files with `@` or `/attach-files`. Choose the same named model for comparable runs. Inspect the tool activity to see which files, issues, agents or skills were actually used. If a question card appears, read it and reply before saving the final answer.

[Return to the workshop instructions](README.md)

## First run

### 1. Your first discount investigation

A new local session in the standalone GitHub Copilot app

> Reply with the words Ready for ColourHub.

### 2. Open your local copy of ColourHub

inputs/product-rules.md

> Read inputs/product-rules.md. Quote the rule for the quantity that first qualifies for a 10% line discount and name the file you read.

### 3. An urgent order conflicts with the product rules

inputs/urgent-order-story.md + inputs/product-rules.md

> Read inputs/urgent-order-story.md and inputs/product-rules.md. Identify two conflicts. For each, quote the relevant words from both files and draft one question for the product owner. Leave the decision open.

## Exercise 1  Reproduce a pricing issue

### 4. What changes at 200 packs

inputs/product-rules.md + your outputs/evidence.md

> Read inputs/product-rules.md and outputs/evidence.md. For each quantity calculate the expected line total in EUR. Compare it with my recorded value and report the difference. Mark missing observed values as unrecorded.

### 5. Write the report from the evidence

inputs/raw-notes.md + inputs/product-rules.md + inputs/gcss-training.md + your outputs/evidence.md

> Read inputs/gcss-training.md, inputs/raw-notes.md, inputs/product-rules.md and outputs/evidence.md. Draft three fictional work items. For the sprint discount issue use my evidence. For the other two use the supplied note and identify its reporter. Include fictional queue, title, environment and test context, steps or reported sequence, expected, actual and evidence still needed. Leave unknowns open. Use only the four named inputs. Reply in chat only. Leave all files unchanged.

### 6. Does the issue record an observed price?

Start a new standalone app session in **qa-ai-training → This computer → Current checkout**. Clear any previously selected reviewer by clicking the **×** on its chip. Make sure the app shows **Default agent**. The workshop clone includes the [read-only Workshop Issues connector](https://github.com/neverased/qa-ai-training/blob/main/.github/mcp.json).

> Use only workshop-issues/issue_read with method get, owner neverased, repo qa-ai-training and issue_number 1. Return the issue title and the exact sentence requesting the check. Was a run recorded? If this tool is unavailable, say exactly what is missing. Leave the issue unchanged.

Expand the activity group and then **Workshop Issues · Get issue details**. Under **Arguments**, confirm `method: get`, owner `neverased`, repository `qa-ai-training` and issue number `1`. In the returned issue, check the title and find the sentence about a recorded run in its body. Compare the result with [issue #1 on GitHub](https://github.com/neverased/qa-ai-training/issues/1) and `inputs/ticket-no-observation.md`.

If the chat lists only file tools, check the agent chip. If the connector is still unavailable in Default, check that your clone contains `.github/mcp.json`, reopen that local checkout and follow any approved sign-in prompt. If your account cannot use the connector, read the issue in the browser and record **browser** as your source.

## Exercise 2  Choose a targeted regression

### 9. Why did the primer ship by Express?

inputs/raw-notes.md + inputs/gcss-training.md (separate shipping report)

> Read inputs/raw-notes.md and inputs/gcss-training.md. For the primer that shipped by Express, give two possible causes. Cite evidence for and against each. What should the tester and product-data owner check next?

### 10. Which checks fit before release?

inputs/pricing-change.md + inputs/product-rules.md + inputs/regression.csv

> Use inputs/product-rules.md, inputs/pricing-change.md and inputs/regression.csv. Choose named cases for a 45-minute release window. Include the 200-pack retest. Return case, minutes, affected surface and reason. Add the total, unused minutes, uncovered risks and what you would defer. Leave execution status as planned. Reply in chat only. Leave all files unchanged.

### 12. How the coordinator assigns a review

Choose **Risk coordinator**. Add `inputs/pricing-change.md`.

> Ask Impact reviewer to read inputs/pricing-change.md and name the surfaces that use shared pricing. Give it read-only work. Return its findings and source filename.

### 13. Two workers review the same release

Choose **Risk coordinator**. Add `inputs/pricing-change.md`, `inputs/product-rules.md` and `inputs/regression.csv`. Inspect each named worker activity after the run.

> Use two subagents in parallel with read-only access to inputs/pricing-change.md, inputs/product-rules.md and inputs/regression.csv. Impact reviewer: choose cases within a 45-minute budget including the retest. Coverage reviewer: independently identify high-risk consumers, boundaries and missing checks. In your reply, name each worker’s findings, resolve one trade-off and total one deduplicated plan.

### 16. Try two prompts on the same review sheet

New chats A and B, same model + inputs/product-rules.md + inputs/review-fixtures.csv

In a separate session, attach `inputs/product-rules.md` for the scratch calculation.

> Invent one pack quantity close to 200 and calculate its discount using EUR 40 per pack. Use only the attached product rules and show the calculation.

Leave this generated row outside the seven fixed rows.

**Session A**

> Read inputs/product-rules.md and inputs/review-fixtures.csv. Which claims have an incorrect expected result? Return the row names.

**Session B**

> Read inputs/product-rules.md and inputs/review-fixtures.csv. Check each claim against the applicable quantity, per-line discount or approval rule. Recalculate any amounts. Return each incorrect row name once, with the rule and corrected expectation.

## Exercise 3  Change a reviewer and build a reusable skill

### 18. Which information may the agent use?

Ticket reviewer + inputs/untrusted-comment.md + inputs/product-rules.md

> Summarise the supplied comment as evidence for a tester. Separate the reported observations from requests made by the commenter. Identify what needs verification.

### 19. What does the reviewer write when evidence is missing?

Select **Ticket reviewer**. Paste the prompt below into the project session. It names the two allowed files. Save the reply and the tool activity before editing the profile.

> Read only inputs/ticket-no-observation.md and inputs/product-rules.md. Draft a manual test report. Give the expected result, actual result, supporting evidence and your next question for the tester. Reply in chat only. Leave all files unchanged.

### 20. Change one rule and repeat the same ticket

In a fresh session select the revised **Ticket reviewer**, then select the same model and keep both file paths unchanged. Compare the exact text in the actual-result field and the files used.

Add this rule to the body of the profile before the second run:

> Fill in Actual result only when the ticket includes an observation from a test run. Otherwise leave it empty and ask for the evidence.

> Read only inputs/ticket-no-observation.md and inputs/product-rules.md. Draft a manual test report. Give the expected result, actual result, supporting evidence and your next question for the tester. Reply in chat only. Leave all files unchanged.

### 21. Does the reviewer preserve a genuine observation?

For each fresh session select the revised **Ticket reviewer**. Paste the appropriate prompt below. Check the tool activity for exactly those two file reads.

**Observed ticket**

> Read only inputs/ticket-with-observation.md and inputs/product-rules.md. Draft a manual test report. Give the expected result, actual result, supporting evidence and your next question for the tester. Reply in chat only. Leave all files unchanged.

**Scheduled test**

Create `inputs/ticket-future-check.md` containing only “Expect a 10% discount on 200 packs. The test is scheduled for tomorrow.” Open a new session with the same reviewer and model.

> Read only inputs/ticket-future-check.md and inputs/product-rules.md. Draft a manual test report. Give the expected result, actual result, supporting evidence and your next question for the tester. Reply in chat only. Leave all files unchanged.

### 23. Give your regression prompt a reusable name

Your review-regression skill + pricing-change.md + product-rules.md + regression.csv

Save this starter in .github/skills/review-regression/SKILL.md, then add your own review question.

```markdown
---
name: review-regression
description: Select manual regression checks for a supplied change and time budget.
---
Read the change, business rules and test durations. Choose checks that fit the budget. For each choice give its affected behaviour and minutes. Total the minutes. List one deferred risk. Leave actual results empty until a tester supplies observations.
```

> /review-regression Use the attached pricing change, product rules and test catalog. We have 45 minutes. Give us a shortlist and one risk left open.

### 24. Find and install one additional skill

Optional external skill. Check the app’s skill list after the project-scoped install. If the skill appears, invoke it on the synthetic report and verify a skill activity for `diagnosing-bugs`. If it is unavailable, continue with your local `review-regression` skill.

> /diagnosing-bugs We saw the wrong discount on the 200-pack order. Begin by identifying the smallest repeatable observation and the evidence we still need. Keep this discussion read-only.

### 25. Can a saved draft bypass tint approval?

inputs/tint-change.md + inputs/product-rules.md

> Read the tint change and product rules. Which observable outcome should the two order paths share? Give a reason for that prediction and one question still open before execution.

### 26. Can another tester reuse your skill?

Open a fresh session with a peer’s reviewed revision of the skill. Add `inputs/tint-change.md`, `inputs/product-rules.md` and `inputs/regression.csv`. Keep your own skill text to restore after the comparison.

> /review-regression The change makes every submitted tinted order require approval. Use the attached catalog and a 45-minute budget. Flag missing paths separately. Which case would detect a draft edited to add tint?

### 27. What can we tell the release owner?

Your completed `outputs/handover.md` and `inputs/tint-change.md`. Record both observed order states before you send the prompt.

> Using only outputs/handover.md and inputs/tint-change.md, draft three sentences for the release owner. Name the checked paths, the business risk and the next action. Label missing evidence.
