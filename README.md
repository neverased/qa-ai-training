# Manual QA with GitHub Copilot

Spend a working day testing ColourHub, a fictional paint shop. You will reproduce a pricing issue, select a regression suite for a release and improve a training agent. Everyone completes all three exercises in their own local workspace. Exchange feedback with a neighbour after recording your own results.

## Open the shop and Copilot

You need a desktop browser and VS Code with access to GitHub Copilot Chat. Git enables the local commit exercise. The shop runs directly from a file. Node.js and npm are optional for the skills installer and engine tests.

1. Clone the repository and open its root in VS Code. If the `code` command is unavailable, use **File → Open Folder**. In an existing checkout choose a new personal branch name if the example is already taken.
   ```sh
   git clone https://github.com/neverased/qa-ai-training.git
   cd qa-ai-training
   git switch -c workshop-day2
   code .
   ```
2. In Finder or File Explorer open **shop/index.html** in a browser. Set **Build** to **3.2.0** and **Role** to **Buyer**. **Reset cart** starts a fresh order. Use fictional data only.
3. When VS Code opens the reviewed workshop folder in Restricted Mode, use **Manage Workspace Trust** to trust this folder. Open Copilot Chat in VS Code, sign in with your approved account and choose the **Copilot (SDK)** environment if the editor offers a choice. On VS Code 1.147, choose a workshop profile through **Chat → Add Context (+) → Agent…**, then select **Ticket reviewer** or **Risk coordinator**. Attach `inputs/product-rules.md` using **Add Context** or drag it into the chat. Ask: “Quote the rule for the quantity that first qualifies for a 10% discount. Name the file you read.” Match the reply against the file.
4. If Git is unavailable, choose **Code → Download ZIP** on GitHub, extract the folder and open it in VS Code. You can run the shop and edit your exercise files. Complete the commit on a Git-enabled machine. Copilot requires network access. The shop works offline.

[Open the complete copyable prompts for each exercise](WORKSHOP_PROMPTS.md) or [download the four-page Word reference](handouts/Participant_Quick_Reference_Day2_v3.docx).

## Exercise 1 — Reproduce a discount report

1. Read [the urgent order story](inputs/urgent-order-story.md) and [the rules](inputs/product-rules.md). Ask Copilot which two details need a decision from the product owner. Match its quotations to the two files.
2. In 3.2.0 as Buyer, add **Exterior coat, 5 L**. Test **199, 200 and 201** on separate orders or update the existing line. Record the build, item, displayed rate and total in [your evidence](outputs/evidence.md). Capture the cart yourself.
3. Attach your evidence and the rules. Ask Copilot to calculate the expected totals and identify differences. Use [the three practice reports](inputs/raw-notes.md) and [the queue guide](inputs/gcss-training.md) to fill in [your issue report](outputs/report.md). Attribute a colleague’s observation by role.
4. Compare [the public training issue](https://github.com/neverased/qa-ai-training/issues/1) with [the local ticket](inputs/ticket-no-observation.md). Find the source sentence supporting each claim. Exchange your report with a neighbour and record one correction.

## Exercise 2 — Choose the regression that fits 45 minutes

1. Select **3.2.1**. Repeat the earlier boundary check using the same product, size and role. Record the actual cart and order-summary amounts separately.
2. Attach [the release note](inputs/pricing-change.md), [rules](inputs/product-rules.md) and [case catalogue](inputs/regression.csv). Ask for a selection within 45 minutes including the original retest. Record the unique check names, their minutes, the remaining time and one deferred risk in [your regression plan](outputs/regression.md).
3. In a new chat choose **Risk coordinator**. Ask it to delegate to **Impact reviewer** and **Coverage reviewer** independently. Expand both activities and compare their sources. If your client lacks delegation, use two separate chats and record that method. Run one or two checks from the plan and record exactly what you saw.
4. Use two fresh chats and the same model to review [seven synthetic claims](inputs/review-fixtures.csv). First ask which expectations are wrong. In the second prompt also request the applicable rule and recalculation. Keep both original replies and score them against the instructor’s key in [your review](outputs/review.md).

## Exercise 3 — Improve an agent and reuse a prompt

1. In a fresh chat choose **Ticket reviewer**. Attach only [the request without a run](inputs/ticket-no-observation.md) and the rules. Use this exact prompt for every comparison:
   > Draft a manual test report using the attached ticket and product rules. Give the expected result, actual result, supporting evidence and your next question for the tester.
2. Save the verbatim actual-result field and the model in [your comparison](outputs/agent-comparison.md). Add one sentence to [.github/agents/ticket-reviewer.agent.md](.github/agents/ticket-reviewer.agent.md): “Fill in Actual result only when the ticket includes an observation from a test run. Otherwise leave it empty and ask for the evidence.” Open a new chat and select the updated profile. Repeat with identical attachments, model and prompt.
3. Repeat with [the observed ticket](inputs/ticket-with-observation.md). For a final control, attach a separate temporary copy containing only “Expect a 10% discount on 200 packs. The test is scheduled for tomorrow.” Compare the outcomes. Record a tie if both versions meet the rule. Review and commit the change **locally**.
   ```sh
   git diff -- .github/agents/ticket-reviewer.agent.md
   git add -- .github/agents/ticket-reviewer.agent.md outputs/agent-comparison.md
   git diff --cached
   git commit -m "Require run evidence in ticket reports"
   ```
4. Follow [the skill authoring instructions](.github/skills/README.md) to create `.github/skills/review-regression/SKILL.md`. Invoke `/review-regression` with the pricing note, product rules and catalogue. Check the arithmetic and add one question that improves the procedure.
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
