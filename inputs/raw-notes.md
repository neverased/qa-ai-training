# Three practice reports

All three reports were written for this fictional exercise. Separate the supplied reporter's account from observations you make in the local shop.

## A quantity change during a sprint check

A sprint tester working as Buyer in the staging shop on build 3.2.0 flagged the discount for exactly 200 five-litre packs of Exterior coat. The tester asks a colleague to compare the adjacent quantities 199 and 201 and record the three cart displays. Use your own entries in `outputs/evidence.md` for actual values when drafting this work item.

## An approval during a business acceptance session

A sales representative tried 130 five-litre packs of Exterior coat at EUR 40 per pack in staging during business acceptance of build 3.2.0. The order summary showed EUR 4,940 net after the discount. The representative submitted the order and saw **Awaiting approval**. The representative did not save a screen capture. The approver's account was never opened.

## Express shipping in a live order

A support colleague checked a dispatch record in the fictional live shop. A shipment of 20 L Solvent primer went out by Express. The colleague supplied the dispatch method but did not see which delivery options appeared to the Buyer during checkout.

A product specialist provided these follow-up observations:

| Sample | Environment | Hazard flag on the product record | Observed Express behaviour |
| --- | --- | --- | --- |
| Solvent primer | Live | Empty | Named dispatch above used Express |
| Solvent varnish, control product | Live | Yes | Express unavailable when the control was selected |
| Solvent primer | Staging | Yes | Express unavailable when the primer was selected |

An import into the live catalog last week included the primer in a batch of 40 products. The pre-import record, mapping specification, change history and execution log have not been supplied.
