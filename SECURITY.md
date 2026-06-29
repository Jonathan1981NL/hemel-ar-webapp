# Security Agent Checklist

Internal security checklist. This must not be displayed in the visible application UI.

## Stage 1B

- [x] No secrets or API keys in frontend code
- [x] No external JavaScript dependencies
- [x] Content Security Policy present in `index.html`
- [x] Camera access only after explicit user action
- [x] Location access only after explicit user action
- [x] Motion/orientation access only after explicit user action
- [x] No login, payment data or personal storage in this prototype
- [x] Security/debug information not exposed in the interface

## Stage 1C security tasks

- [ ] Review astronomy API/data-source security
- [ ] Decide whether backend proxy is needed
- [ ] Prevent API keys from entering frontend
- [ ] Add basic abuse/rate-limit strategy if external API is used
- [ ] Draft privacy notice before analytics or account features
