# ColourHub

ColourHub is the fictional trade paint shop used in the manual QA workshop. The [product rules](inputs/product-rules.md) and the change note for the selected build describe how an order should behave.

## Language

### Packs and pricing

**Pack size**: The volume of paint in one pack, in litres. Four 5 L packs have a pack size of 5 L and a quantity of 4.

**Quantity**: The number of packs on one order line. This is the number used to determine the line discount.

**Order line**: One entry in an order for a single product and pack size, with its own quantity and optional custom tint. The shop displays it as a cart line while the Buyer edits the order.

**Pack price**: The catalogue price in EUR for one pack of the selected size, before the line discount.

**Line discount**: The percentage reduction that applies to every pack on one order line. Each line qualifies independently.

**Net order amount**: The sum of all order lines after their line discounts, in EUR. The cart and the order summary show this amount.

### Checkout and delivery

**Buyer**: The person who creates and submits an order.

**Viewer**: A person with read-only access to orders.

**Approver**: A person authorised to approve an order submitted by someone else.

**Saved draft**: An order the Buyer has saved and can reopen for editing before submission.

**Order summary**: The checkout view where the Buyer reviews the lines, net order amount and delivery details before submitting.

**Awaiting approval**: The state of a submitted order that requires an Approver’s decision.

**Confirmed**: The state of an accepted order for which the shop makes a confirmation PDF available.

**Confirmation PDF**: The downloadable record of a confirmed order, including its net order amount.
_Avoid_: Invoice.

**Custom tint**: A colour the Buyer requests for an order line by entering a ColourHub colour code.

**Express**: A delivery method offered at checkout for orders eligible for expedited shipping. Selecting it records the Buyer’s choice.

**Hazardous product**: A solvent product subject to delivery restrictions and a safety data sheet acknowledgement.

### Reporting a test

**Expected result**: The outcome the applicable product rule or approved change calls for in the build under test.

**Actual result**: What a tester observed in an identifiable run or what a named reporter observed and described. A report attributes the observation to its source.

**Engineering queue**: The destination for issues a development-team tester finds while checking a change during a sprint.

**Field review queue**: The destination for issues a business representative raises during release acceptance or support receives about a live order. The [issue routing guide](inputs/gcss-training.md) treats the environment as a separate report field.
