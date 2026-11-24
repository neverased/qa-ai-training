# My review of the proposed tests

Follow one row from your saved plan, then score the plan as originally written. Use 0 for missing or wrong, 1 for partly usable and 2 for sufficient. Quote a row and explain your score.

| Criterion | Score out of 2 | Evidence from the plan | Improvement |
| --- | ---: | --- | --- |
| Grounding in the supplied rules | | | |
| Coverage of affected behaviour | | | |
| Traceability to a change or rule | | | |
| Reproducibility from the written steps | | | |
| Relevance to this release | | | |

**Total out of 10:**
**Original step, rewritten step and why the change matters:**

### Comparing two review prompts

Start two fresh Default agent chats with the same named model and the same two files: `inputs/product-rules.md` and `inputs/review-fixtures.csv`. Both chats score the same seven rows. Paste each complete response here before the answer key is shown. Keep any additional synthetic practice row out of the scored set.

**Model and files:**
**Practice row, expected value and arithmetic check:**
**Raw response A and its exact flagged row names:**
**Raw response B and its exact flagged row names:**

After the trainer reveals the key, count each named row once.

| Run | Correct flags | Extra flags | Missed errors | Precision | Recall |
| --- | ---: | ---: | ---: | --- | --- |
| A | | | | | |
| B | | | | | |

Precision is correct flags divided by all flags. Recall is correct flags divided by all erroneous rows in the key. Write “undefined” for a zero denominator.

**Most consequential missed or unnecessary flag:**
