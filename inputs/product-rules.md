# ColourHub product rules

ColourHub is a fictional trade shop. These rules are the reference for the manual tests. Prices in this exercise are net amounts in EUR, before any line discount. The later tint change applies only when a task selects build 3.3.0.

## Cart and prices

A Buyer selects a product, pack size and whole number of packs. Quantities range from 1 to 500 on each line. An order can have at most 20 lines.

| Product | 1 L | 5 L | 20 L |
| --- | ---: | ---: | ---: |
| Exterior coat (EC-220) | 9 | 40 | 150 |
| Interior matt (IN-310) | 7 | 31 | 115 |
| Solvent primer (XP-100) | unavailable | 28 | 96 |
| Solvent varnish (XP-140) | 14 | 62 | unavailable |

For a single line of the same product and pack size, quantities 1–49 get no discount, 50–199 get 5%, and 200–500 get 10%. Apply the line rate to every pack on that line. Different products or pack sizes do not pool their quantities for a discount.

Multiply the pack price by the number of packs, then apply that line's discount. The cart and order summary show the sum of the discounted lines. The confirmation PDF for a confirmed order shows that same net order amount.

## Roles and approval

A Viewer reads orders. A Buyer creates and submits them. An Approver may approve somebody else's order. When the Buyer submits, a net total above EUR 5,000.00 requires approval. A total of EUR 5,000.00 or less confirms automatically under the original approval rule. Use the amount after line discounts. A Buyer may cancel an order before it becomes Confirmed.

## Tint and delivery

Custom tint is available on 1 L and 5 L packs. Enter a colour code in the form CH-NNNN-NN, such as CH-1180-02. Tinted lines cannot be returned.

A solvent product is hazardous. An order containing a hazardous line cannot use Express. Before submitting, the Buyer must acknowledge the safety data sheet for that line.

Count a submission after 14:00 Warsaw time as arriving the following working day. The earliest delivery is two working days after the effective order date. The latest is 30 calendar days after that date. Working days exclude weekends and Polish public holidays.
