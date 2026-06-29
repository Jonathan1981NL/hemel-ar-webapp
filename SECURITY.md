# Security Agent Checklist

Deze checklist hoort bij elke stage-gate review.

## Stage 1A

- [x] Geen secrets/API keys in frontend
- [x] Geen externe JavaScript dependencies
- [x] Content Security Policy toegevoegd
- [x] Locatie alleen na user permission
- [x] Geen accounts/login in prototype
- [x] Geen betaaldata in prototype
- [x] Geen persoonlijke data opslaan

## Volgende stages

- [ ] Backend alleen via veilige API
- [ ] Rate limiting
- [ ] Input validation
- [ ] Dependency scanning
- [ ] Secure payment provider
- [ ] Privacy policy
- [ ] Cookie/analytics review
- [ ] Admin access control
