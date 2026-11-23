# Pricing change in build 3.2.1

The release note says the 10% discount now starts at exactly 200 packs of the same product and pack size. The calculation moved into a shared pricing service.

The cart, the order summary, the confirmation PDF and the order's approval decision consume the shared calculation. The approval check uses the discounted net amount. Product eligibility for Express and the permitted delivery dates retain their existing rules.

Plan a retest of the reported quantity and a targeted manual regression. Record the release note as a source for scope. Add the outcome of a check only after someone runs it.
