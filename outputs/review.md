# My review of the regression plan

Open [your saved selection](regression.md). Follow one row as written. Which details did you need to look up? Score the **original wording** before you improve it. Use 0 for wrong or missing, 1 for partly usable and 2 for sufficient.

| Could I… | Score (0–2) | Words from the plan that explain my score |
| --- | ---: | --- |
| Check the expectation against the product rules? | | |
| Find checks for the affected behaviour? | | |
| Trace each chosen check to the change or rule? | | |
| Repeat a check from the written steps? | | |
| Explain why each check belongs in this release? | | |

**Total out of 10:** ___

**A step I tried and the detail I would add:** ___

## Compare two Copilot prompts

Use the same model and the same seven claims in two fresh chats. Paste both replies below before opening the answer key. The extra practice calculation stays outside the seven-row comparison.

**Model and files supplied:** ___

**Extra practice quantity, expected value and calculation:** ___

**Reply to prompt A:** ___

**Reply to prompt B:** ___

<details>
<summary>Open the answer key after saving both replies</summary>

Four rows contain errors. Use their names to count the flags in each reply.

| Incorrect row | Correct expectation |
| --- | --- |
| Cart at 199 packs | The discount is 5%. |
| Cart at 200 packs | The discount is 10%. |
| Approval after the line discount | 130 × EUR 40 × 0.95 is EUR 4,940 net. A standard-colour order at that value confirms automatically. |
| Two pack sizes of the same product | Each line has 30 packs. Neither line qualifies for a discount. |

The rows for 201, 50 and 49 packs are correct. Check the calculations against [the seven claims](../inputs/review-fixtures.csv) and [the original pricing and approval rules](../inputs/product-rules.md).

</details>

Count each row name once per reply. A **correct flag** names an erroneous row. An **extra flag** names a correct row. A **miss** is an erroneous row the reply left out. Precision = correct flags ÷ (correct + extra flags). Recall = correct flags ÷ 4. If a reply flags nothing, enter “undefined” for precision.

| Reply | Correct flags | Extra flags | Misses | Precision | Recall |
| --- | ---: | ---: | ---: | --- | --- |
| A | | | | | |
| B | | | | | |

**Which difference would matter most in a release review?** ___
