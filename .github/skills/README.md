# Skills you can try in Copilot

A skill is a saved set of instructions for a task you repeat. Each folder here contains a file named `SKILL.md`. Open one to see what Copilot will be asked to do.

| Skill | Try it when you want to… |
| --- | --- |
| [review-ticket](review-ticket/SKILL.md) | Compare a user story with the product rules and decide what to test first. |
| [explain-code](explain-code/SKILL.md) | Understand a piece of code in plain language. |

To try the ticket review, open a local Copilot chat in this project and enter:

> /review-ticket Review inputs/urgent-order-story.md against inputs/product-rules.md. What should I ask the product owner?

## Create your own regression skill

In [the reusable skill exercise](../../WORKSHOP_PROMPTS.md), create `review-regression/SKILL.md` inside this folder. Copy the starter from the exercise and add your own review question. Open a fresh local project chat and try `/review-regression` on the pricing change. Compare its plan with the test catalogue, refine the question, then try the same skill on the tint change. Record how it performed in [your handover](../../outputs/handover.md).
