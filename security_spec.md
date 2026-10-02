# MediFlow Hospital Command Center - Security Specification

## 1. Data Invariants
1. **Patient Invariant**: Every patient record must have a valid `patientCode` (e.g. `P-1024`), numerical `severityScore` (0-100), `riskProbability` (0-100), and a recognized triage status (`Critical`, `High`, `Stable`).
2. **Bed Invariant**: Every bed document belongs to a recognized ward (`ICU`, `Emergency`, `General`, `Step-down`) with a valid status (`available`, `occupied`, `maintenance`).
3. **Alert Invariant**: Every alert must have a severity (`Critical`, `Warning`, `Info`) and an `acknowledged` boolean flag.
4. **Hospital Stats Invariant**: Singleton document (`live`) tracking operational overview metrics with non-negative patient and bed counts.

## 2. Dirty Dozen Threat Vectors
1. **Malicious Patient Injection**: Attempting to create a patient with negative or out-of-range severity score (>100 or <0).
2. **ID Poisoning Attack**: Submitting a patient ID exceeding 128 bytes with invalid characters.
3. **Phantom Field Exploitation**: Injecting shadow fields like `isAdmin: true` into patient or bed records.
4. **Negative Capacity Vulnerability**: Attempting to set `availableBeds` to negative numbers in hospital stats.
5. **Bed Ward Spoofing**: Setting an invalid ward name like `VipLounge` in the bed inventory.
6. **Alert Acknowledgment Tampering**: Corrupting alert status with non-boolean values.
7. **Patient Code Hijacking**: Attempting to alter immutable clinical identifier `patientCode` during update.
8. **Denial of Wallet Attack**: Sending 500KB JSON payload into clinical vitals or string fields.
9. **Status Enumeration Bypass**: Setting patient status to an invalid state like `DischargedWithoutNotice`.
10. **Unbounded List Injection**: Attempting to inject massive untyped arrays into patient risk factors.
11. **Timestamp Forgery**: Submitting client-spoofed ISO dates in `updatedAt`.
12. **Unauthorized Record Dropping**: Unchecked deletion of critical hospital beds or live statistics.
