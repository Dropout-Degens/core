# Revenue Allocation

**Last Updated:** February 6, 2026
**Owner:** Dax (CEO)

---

## Overview

All Dropout Degens revenue is split into two pools each month:
- **Bonus Funds (20%):** Business reinvestment — marketing, operating costs, reserves
- **Operational Pool (80%):** Staff compensation and founder take

All percentages and allocations are calculated on a monthly cycle.

---

## Revenue Sources

### Subscription Revenue
- **Current pricing:** $15/month per premium member
- **March 2026 pivot:** $50/month (early March target, pending EV tool launch)
- **Collection:** Stripe
- **Free trials:** 3-day (no payment info required) or 7-day (Stripe, payment info required)
- **Current subscriber count:** Sub-50 premium members
- **Current monthly subscription revenue:** ~$300-$400 (as of February 2026)

### Partnership Revenue
- **Partners:** ~40 active partnerships
- **CPA per conversion:** ~$50 (varies by partner)
- **Revenue recognition:** Monthly, when claimed from partners
- **Current monthly partnership revenue:** ~$400-$600 (as of February 2026)
- **Customer LTV:** ~$1,500 across all available partner conversions (projected $2,000-$2,500 once major sportsbooks are available after Dax turns 21)

### Total Revenue Definition
- **Total Monthly Revenue = Subscription Revenue + Partnership Revenue**
- This is the number all percentage calculations are based on
- As of February 2026: projected ~$1,000/month total

---

## The 20% Bonus Funds

### What It Is
A reinvestment fund for the business. This is NOT distributed to staff. It is a business operating reserve.

### What It Covers
- Marketing expenses (paid acquisition, social media ads — planned but not yet active)
- Server and infrastructure costs
- Tool subscriptions (OddsJam, AI tools, etc.)
- Any other business operating costs

### Current Operating Costs
- Google Cloud: included in operating costs
- AI subscriptions: included in operating costs
- Total monthly operating burden: minimal, under $50/month as of February 2026
- Most of the 20% will accumulate as reserve until marketing spend begins

### Deficit Handling
- If monthly expenses exceed the 20% allocation (bonus funds go negative), Dax covers the shortfall out of pocket
- When bonus funds recover in future months (surplus from 20% exceeding expenses), Dax is reimbursed from the surplus
- No interest or penalty on the deficit — simple reimbursement
- This means staff compensation is never reduced by operating cost overruns

### Clarification: This Is Not the Staff Bonus Pool
Earlier meeting notes (JP January 28, Kaiden February 3) used imprecise language describing "20% bonus pool distributed by conversion points." This was conflating two separate concepts:
- **20% Bonus Funds** = business reinvestment reserve (this document)
- **5% Staff Bonus Pool** = separate allocation distributed to staff by conversion points (see `conversion-bonus-system.md`)

These are two distinct allocations. The 20% bonus funds are not distributed to staff.

---

## The 80% Operational Pool

### What It Is
The remaining 80% of total monthly revenue after bonus funds are deducted. This is the pool from which all staff compensation is paid.

### How Staff Percentages Relate
Staff base compensation percentages (e.g., analyst 2%, JP 4%) are calculated on **total revenue**, not on the 80% pool. This was explicitly confirmed by Dax — the math works out equivalently either way:
- 2% of $1,000 total revenue = $20
- The 80% pool is $800, and the $20 payout comes from within that $800
- The percentage is applied to total for simplicity, but the payment comes from the operational pool

### What Happens to the Remainder
After all staff base percentages and the 5% staff bonus pool are paid out, the remainder of the operational pool is founder compensation (Dax).

---

## Monthly Flow (Step by Step)

1. **Calculate total revenue** for the month (subscription + partnership)
2. **Deduct 20%** off the top → Bonus Funds
3. **Remaining 80%** → Operational Pool
4. **Pay staff base percentages** from the operational pool (see `staff-compensation.md`)
5. **Distribute 5% staff bonus pool** based on conversion points (see `conversion-bonus-system.md`)
6. **Remainder** → Dax (founder compensation)

---

## Worked Example

**Scenario:** $1,000 total monthly revenue

| Step | Amount | Description |
|------|--------|-------------|
| Total Revenue | $1,000 | Subscription ($400) + Partnership ($600) |
| Bonus Funds (20%) | $200 | Business reinvestment reserve |
| Operational Pool (80%) | $800 | Available for compensation |
| JP base (4%) | $40 | Head moderator |
| Mark base (2%) | $20 | Analyst (if 5+ conversions) |
| Zach base (2%) | $20 | Developer |
| 5% Bonus Pool | $50 | Distributed by conversion points |
| Remainder to Dax | $670 | Founder compensation |

**Note:** Dante's 4% is currently unallocated (he opted out). Kaiden's base is TBD. As more staff are added, the remainder to Dax decreases.

---

## Change Log

| Date | Change | Source |
|------|--------|--------|
| Jan 2026 | 20% bonus funds structure established | JP 2026-01-28 meeting |
| Feb 2026 | Deficit handling clarified (Dax covers, gets reimbursed) | Multiple meetings |
| Feb 2026 | Clarified: 20% bonus funds ≠ 5% staff bonus pool (separate allocations) | Dax confirmation, Feb 2026 |
| Feb 2026 | Revenue projections updated (~$1,000/month) | Mark 2026-02-06 meeting |

---

## Cross-References

- `staff-compensation.md` — How base percentages work per role
- `conversion-bonus-system.md` — How the separate 5% staff bonus pool is distributed
