# Manual QA with the GitHub Copilot app

In three exercises you will investigate a pricing complaint, choose regression tests for a release and improve a reviewer that drafts test reports. Each person uses a local copy of ColourHub, a fictional paint shop, and records observations before comparing answers with a neighbour.

## Set up your local workshop

You need the standalone GitHub Copilot app with access to a model, Git, a browser and a text editor. The shop opens directly from its HTML file. Node.js and npm are optional for the skills installer and engine tests.

```sh
git clone https://github.com/neverased/qa-ai-training.git
cd qa-ai-training
git switch -c workshop-day2
```

1. Open the standalone **GitHub Copilot** app and sign in with the account approved for the workshop. Open the command menu (⌘K on the workshop Mac), type **Add repository** and press Enter. Choose **Local folder or repository…**, select your `qa-ai-training` clone and open it. Start a new session (⌘N on Mac), choose **qa-ai-training** and press Enter.
2. Below the message box, check **This computer**. Open **Workspace** (initially **New worktree** in the rehearsal) and choose **Current checkout**. Verify **qa-ai-training** and **workshop-day2** so Copilot reads the files you edit. Select a named model and keep it for each comparison. The rehearsal used **Claude Sonnet 5.5** with **Medium** effort. Use `@` in the message box to select each named file, or use `/attach-files`. Check the filenames before sending. For a named reviewer, type `/agent` in the message box, choose **Risk coordinator** or **Ticket reviewer**, and confirm your choice. In the standalone app you can open a new session for each independent test.
3. In Finder or File Explorer open **shop/index.html** in a browser. Set **Build** to **3.2.0** and **Role** to **Buyer**. **Reset cart** starts a fresh order. Keep the browser and the Copilot app visible. Use a text editor such as VS Code to save your observations and edit your local agent file.
4. Attach `inputs/product-rules.md` and try prompt 2. Open the named file yourself and match the returned words to the rule. The repo contains three builds of the same fictional shop. The build selector changes the behaviour of the shop while the shared rules describe the expectation.

If cloning is unavailable, use **Code → Download ZIP** on GitHub, extract the archive, then select the extracted root folder in the app. Complete the commit on a Git-enabled machine. The shop works offline. The Copilot conversations use a network connection.

[Open the complete copyable prompts for each exercise](WORKSHOP_PROMPTS.md) or [download the four-page Word reference](handouts/Participant_Quick_Reference_Day2_v3.docx).

## Exercise 1 — Reproduce a discount report

1. Read [the urgent order story](inputs/urgent-order-story.md) and [the rules](inputs/product-rules.md). Ask Copilot which two details need a decision from the product owner. Match its quotations to the two files.
2. In 3.2.0 as Buyer, add **Exterior coat, 5 L**. Test **199, 200 and 201** on separate orders or update the existing line. Record the build, item, displayed rate and total in [your evidence](outputs/evidence.md). Capture the cart yourself.
3. Use prompt 4 with your evidence and the rules. Recalculate the expected totals and match every reported difference to a cart reading. With prompt 5, request the three drafts in chat and decide which text to transfer yourself. Use [the three practice reports](inputs/raw-notes.md) and [the queue guide](inputs/gcss-training.md) to fill in [your issue report](outputs/report.md). Attribute a colleague’s observation by role.
4. Compare [the public training issue](https://github.com/neverased/qa-ai-training/issues/1) with [the local ticket](inputs/ticket-no-observation.md). Expand the activity that retrieved the remote issue. Compare its number, title and body with the issue page. Does the ticket describe a price someone saw, or a check someone wants performed? If your organisation disables the issue tool, compare the public issue page manually and record that source. Exchange your report with a neighbour and record one correction.

## Exercise 2 — Choose the regression that fits 45 minutes

1. Select **3.2.1**. Repeat the earlier boundary check using the same product, size and role. Record the actual cart and order-summary amounts separately.
2. Attach [the release note](inputs/pricing-change.md), [rules](inputs/product-rules.md) and [case catalogue](inputs/regression.csv). Write your own shortlist, then use prompt 10 for a second opinion in chat. If a question card appears, read the proposed choices and reply to any open question. Check the local diff before transferring your final selection. Record the unique check names, their minutes, the remaining time and one deferred risk in [your regression plan](outputs/regression.md).
3. In a new chat choose **Risk coordinator**. Ask it to delegate to **Impact reviewer** and **Coverage reviewer** independently. Open both worker activities and verify their names, inputs and returned findings. If the parent handled the work alone, record that as a single review. If your client lacks delegation, use two separate chats and record that method. Run one or two checks from the plan and record exactly what you saw.
4. Use two fresh chats and the same model to review [seven synthetic claims](inputs/review-fixtures.csv). First ask which expectations are wrong. In the second prompt also request the applicable rule and recalculation. Keep both original replies and score them against the instructor’s key in [your review](outputs/review.md).

## Exercise 3 — Improve an agent and reuse a prompt

1. In a fresh chat choose **Ticket reviewer**. Attach only [the request without a run](inputs/ticket-no-observation.md) and the rules. Use the same prompt, model and two source attachments for each paired run. Check the activity for any extra file reads. Repeat a run that used other evidence.
   > Draft a manual test report using the attached ticket and product rules. Give the expected result, actual result, supporting evidence and your next question for the tester. Use only the two attached files. Do not open other files. Reply in chat only.
2. Save the verbatim actual-result field and the model in [your comparison](outputs/agent-comparison.md). Add this rule to [.github/agents/ticket-reviewer.agent.md](.github/agents/ticket-reviewer.agent.md): “Fill in Actual result only when the ticket includes an observation from a test run. Otherwise leave it empty and ask for the evidence.” Open a new chat and select the updated profile. Repeat with identical attachments, model and prompt.
3. Repeat with [the observed ticket](inputs/ticket-with-observation.md). For a final control, attach a separate temporary copy containing only “Expect a 10% discount on 200 packs. The test is scheduled for tomorrow.” Compare the outcomes. Score evidence and formatting separately. A field saying “not recorded” contains no invented price, but still contains text. Record a tie if both profiles meet the same criterion. Review and commit the change **locally**.
   ```sh
   git diff -- .github/agents/ticket-reviewer.agent.md
   git add -- .github/agents/ticket-reviewer.agent.md outputs/agent-comparison.md
   git diff --cached
   git commit -m "Require run evidence in ticket reports"
   ```
4. Follow [the skill authoring instructions](.github/skills/README.md) to create `.github/skills/review-regression/SKILL.md`. Invoke `/review-regression` with the pricing note, product rules and catalogue. Open the activity to confirm the skill ran. If it asks a question, answer it and check the revised shortlist. Recalculate the minutes and add a question that improves the procedure.
5. Switch the shop to **3.3.0**. Read [the tint change](inputs/tint-change.md). Compare a new order with a saved untinted draft reopened and edited to add the same tint. For both paths use 20 × 1 L and 3 × 5 L Exterior coat. Tint the 1 L line with **CH-1180-02**. Submit each separately and capture its status and value. Ask a neighbour to try your skill on the change and review [your release handover](outputs/handover.md).

## Optional commands

To inspect Matt Pocock’s available skills and install only the selected one in the local project, use Node.js with npm and run the following in the repository root. Review the source of [diagnosing-bugs](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnosing-bugs) first.

```sh
npx skills add mattpocock/skills --list
npx skills add mattpocock/skills --skill diagnosing-bugs -a github-copilot
npx skills list -a github-copilot
```

To check the training engine using Node.js, run `node --test tests/engine.test.js`. These are the maintainer’s fixture tests. Do your manual runs before looking at their assertions. The training releases deliberately behave differently.

Keep your work in the six Markdown templates under `outputs/`. Keep real tickets, company documents, customer identifiers and private screenshots in your organisation’s own systems.

[GitHub guide to the desktop app](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) · [Local sessions and workspaces](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) · [Custom agents and skills](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app)
