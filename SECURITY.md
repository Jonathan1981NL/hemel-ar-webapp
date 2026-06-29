# Security Agent Checklist

Internal only. Do not display this inside the product UI.

## Stage 1C

- [x] No secrets or API keys in frontend
- [x] No external dependencies
- [x] Content Security Policy in index.html
- [x] Camera requires explicit user action
- [x] Motion/orientation requires explicit user action
- [x] Location requires explicit user action
- [x] No persistent personal data storage
- [x] No visible security/debug panel in customer UI
- [x] No account or payment handling yet

## Next security gates

- [ ] Review astronomy API / calculation source
- [ ] Avoid exposing paid API keys in frontend
- [ ] Add privacy notice before analytics
- [ ] Threat-model premium feature unlocking
- [ ] Decide backend proxy architecture
