# Security Policy

## Reporting Vulnerabilities

**IMPORTANT**: Please do not open public issues to report security vulnerabilities.

If you discover a security vulnerability in AtopAI, please **report it directly via email** to:

📧 **lugarbayo@gmail.com**

### What to include in your report

1. **Description**: What the vulnerability is and its impact.
2. **Location**: File, line of code, or affected component.
3. **Severity**: Critical, High, Medium, or Low.
4. **Steps to Reproduce**: How to verify the vulnerability.
5. **Proposed Fix** (optional): If you have a solution.

## Response Process

1. **Acknowledgment**: You will receive a response within 48 hours.
2. **Investigation**: We will evaluate the report and its severity.
3. **Fix**: We will work on a patch or mitigation.
4. **Coordination**: We will notify you when the fix is published.
5. **Disclosure**: Recognition in a security advisory (optional).

## Our Commitment

- ✅ We investigate all reported vulnerabilities.
- ✅ We will not publish details until a fix is available.
- ✅ We prioritize critical severity reports.
- ✅ We acknowledge responsible researchers.

## Security Practices in AtopAI

### Authentication
- JWT tokens with 24h expiration.
- Validation on every API endpoint.
- Role-Based Access Control (RBAC).

### Data
- Local processing options to maintain data sovereignty.
- Secure vector database communication (Qdrant).
- Input sanitization before indexing and searching.

### Dependencies
- Regularly updated libraries.
- Dependency auditing using automated tools.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.1.x   | ✅ Yes     |
| 1.0.x   | ⚠️ Limited |

## Security Contact

**Email**: lugarbayo@gmail.com
**Expected Response Time**: 48 hours
