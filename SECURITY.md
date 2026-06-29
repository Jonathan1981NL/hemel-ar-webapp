# Security Agent Checklist

Internal only. Not shown in product UI.

## Stage 1D

- [x] No secrets or API keys in frontend code
- [x] No external JS dependencies
- [x] CSP present in index.html
- [x] Camera access only after explicit user action
- [x] Motion access only after explicit user action
- [x] Location access only after explicit user action
- [x] Local catalog only; no external data calls
- [x] No account, payment or persistent personal data
- [x] Security/debug details are not visible in the customer UI

## Next stage security work

- [ ] Real astronomy engine source review
- [ ] Backend proxy decision for protected APIs
- [ ] Privacy notice before analytics
- [ ] Premium unlock threat model
- [ ] PWA permissions review
