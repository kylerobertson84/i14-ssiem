# Troubleshooting

**Container Communication Troubleshooting:**

- https://github.com/siemens/ghostwire

	- Allows for Wireshark to intercept the communication between containers to further troubleshoot network connectivity issues
<br>
- **Logs to check:**
<br>
- In backend/syslogs is an accounts.log file with account related information

	- Useful for troubleshooting account lockouts, auditing accounts and failed sign ins.
<br>
- Backend/debug.log contains SQL queries that have been sent to the database

	- Useful for tracking down unexpected data returned by queries