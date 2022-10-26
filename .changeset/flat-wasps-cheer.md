---
"ynab-sync-cli": patch
---

Fixes issue where account type for St George accounts would not be parsed properly from env variables, resulting in every amount being treated as positive
