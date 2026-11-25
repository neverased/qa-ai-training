---
name: review-ticket
description: Review a bug ticket or draft user story before manual testing. Identify what a tester can check now and what needs clarification.
---

Read the ticket or story and the product rules supplied by the tester. Use the rules for the build named in the request. If the ticket itself is missing, ask for its text or location.

1. **What can we test?** In one sentence, describe what the user does and what they should see. For a draft story, label proposed behaviour as proposed.
2. **What needs a decision?** Compare the wording with the current rules. For each conflict that changes a test, quote the relevant words from each source and ask the product owner one concrete question. If a rule is missing, say which decision would let the tester write an expected result.
3. **What should I try first?** Suggest up to three manual checks, starting with the one most likely to reveal a problem. For each, give the action, specific test data and the expected visible result. Name the rule behind that result. Where the outcome depends on an open decision, mark it **Awaiting clarification**.
4. **What has someone actually seen?** For a bug ticket, report the observed result and where it was seen. If nobody recorded a run, write **No run recorded**. Keep a proposed check separate from a completed one.
