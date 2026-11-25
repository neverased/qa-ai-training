# Manual QA with GitHub Copilot

Investigate a price in ColourHub, a fictional paint shop. Use your findings to plan a short regression test. Then teach Copilot how to handle a ticket that has no test results.

## Start here

1. Get your own copy. On GitHub choose **Code → Download ZIP**, then extract the whole folder. If you use Git, run the commands below in a terminal instead.
2. Open **shop/index.html** from the extracted folder or clone in a browser. You should see **Trade order desk**. Choose build **3.2.0**, role **Buyer**, then **Reset cart**. The shop runs locally.
3. In the standalone **GitHub Copilot** app, sign in and choose **Add repository → Local folder or repository**. Select the folder containing this README. Start a chat in that project. Choose **This computer → Current checkout** so the chat can read the same files you edit. Use **Default agent** to start. Copilot requires a network connection.
4. Open the [step-by-step exercises](WORKSHOP_PROMPTS.md). Work down the page. Paste the quoted prompts into Copilot. When a step names a file to attach, select it with the chat attachment control and check its name before sending.

```sh
git clone https://github.com/neverased/qa-ai-training.git
cd qa-ai-training
git switch -c my-qa-practice
```

## Where your work goes

Open the same project folder in a text editor. **inputs/** contains the rules, tickets and sample data you read. **outputs/** is your personal workbook. Each Markdown file opens as plain text. Open the named file, type your findings into it and save. It is normal for its tables to be empty when you start.

| Exercise | What you will do | Where to save your work |
| --- | --- | --- |
| 1. Investigate a discount | Check three quantities in the shop and write up what you see. | [Cart readings and screenshots](outputs/evidence.md) and [issue reports](outputs/report.md) |
| 2. Choose a regression | Retest the fix, select checks within 45 minutes and judge the quality of the plan. | [Regression plan](outputs/regression.md) and [review notes](outputs/review.md) |
| 3. Improve a reviewer | Compare two versions of an agent, create a reusable skill and try it on a different release. | [Agent comparison](outputs/agent-comparison.md) and [release handover](outputs/handover.md) |

**Your first screenshot.** At 200 packs, save an image of your own cart as `outputs/cart-200.png`. Open the image to confirm the rate and net amount are readable. Type those numbers into the 200 row in your evidence file. A link in a worksheet lets you reopen your capture. To ask Copilot about the picture itself, attach the image directly if your chat supports images.

## Reference

- [ColourHub glossary](GLOSSARY.md) and [product rules](inputs/product-rules.md)
- [Printable quick reference](handouts/Participant_Quick_Reference_Day2_v3.pdf) and [editable Word copy](handouts/Participant_Quick_Reference_Day2_v3.docx)
- [How to create a project skill](.github/skills/README.md)

### Where to find Express delivery and the confirmation PDF

Open `shop/index.html` in a browser from your clone or fully extracted ZIP. The first screen is **Trade order desk**. If you see HTML source on github.com, open the local file from Finder or File Explorer.

1. Select build **3.2.1** and role **Buyer**. Start with an empty cart. Choose **Exterior coat**, **5 L**, quantity **1**, then **Add to cart**.
2. In **Your cart**, choose **Review order**. On **Order summary**, open **Delivery method** below the net total. Change **Standard** to **Express**.
3. Choose **Submit order**. On **Order received**, this €40 order shows **Confirmed**. Choose **Download confirmation PDF**. Orders marked **Awaiting approval** have no download button.

<details>
<summary>Show the two checkout screens</summary>

![Order summary with Express selected under Delivery method](docs/checkout/delivery-method.png)

![Confirmed order with the Download confirmation PDF button](docs/checkout/download-confirmation.png)

</details>

## Check the shop installation

If you have Node.js, run `node --test tests/engine.test.js` from the project folder to check the example builds. Some builds deliberately give the wrong price or approval status so you can practise detecting a defect.
