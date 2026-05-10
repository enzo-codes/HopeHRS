# HopeHRS Project Compliance
    
## QA Checklist
- [ ] No Hard Deletes (Search for 'DELETE' keyword)
- [ ] Soft-delete sets record_status = 'INACTIVE'
- [ ] Audit stamp updated on every change (Edit/Add)
    
## Role Validation
- [ ] SUPERADMIN: Full Access (All 17 Rights)
- [ ] ADMIN: Restricted Access
- [ ] USER: View Only (Hide 'INACTIVE' records)