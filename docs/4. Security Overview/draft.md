# OWASP TOP 10 Documentation

## Introduction

This documentation aims to provide a high-level breakdown of how each of the top 10 OWASP vulnerabilities were addressed, if they were relevant e.g. CI/CD prevention methods will not be followed if our development approach was more akin to a waterfall method. There will be dot points simplifying and summing up the OWASP prevention methods as mentioned in the official website. With the text in green, the implementations explained at a high-level.

## OWASP #1 Broken Access Control

To quote directly from the website “94% of applications were tested for some form of broken access control”. Which is one of the major factors for why it is ranked as the #1 vulnerability.

To prevent broken access control this is the recommended:

- **Deny access by default, except for public resources:**
  
  By default, no one should have access to resources unless explicitly allowed. Only resources meant to be public should be open to all. 

  This has been addressed by protected routing, meaning that no one has access to the SIEM pages unless they are logged and have the correct role permissions. Additionally, they cannot navigate to restricted pages by URLs alone.

  ![image](https://github.com/user-attachments/assets/f842d77c-fe0e-4204-91d6-dce90c1c5d3d)


- **Centralize and reuse access control mechanisms across the application:**

  Implement access control rules in one place and apply them consistently throughout the app. Limit cross-site access (CORS) to only what's necessary to reduce risks.

  Only have access to the backend if you’re from ssiem.dev or localhost3000 which is necessary.

- **Enforce ownership and business rules in data models:**

  Ensure that users can only manage records they own (e.g., edit or delete their own data).

  Users can only access and manage resources they have access to (analyst and admins) with admins only being able to delete and create users.

  - Logged in as Analyst and do not have access to Admin page.
  - Logged in as an Admin and do have access to Admin page.

- **Secure the web server by disabling directory listings and protecting sensitive files:**

  Prevent users from seeing the contents of server folders and ensure sensitive files (e.g., backups, metadata like .git) are not publicly accessible.

  Log storage and passwords storage is done outside of the application and it privatized.

  ![Image](https://cdn.discordapp.com/attachments/1285138814876258325/1295322532915970099/image.png?ex=670e3a9d&is=670ce91d&hm=a363336ba9aff1364f6e7503b7c3f1d0556aa2dc832e574a6bccd8c659875171&)

- **Monitor access control failures and alert admins when needed:**

  Log any failed attempts to access restricted resources and notify admins if there are repeated failures, which could indicate an attack.

  The auditing/logging system captures logins/login failures, user creations and editing of user attributes.

  REFER TO OWASP #9 FOR MORE INFO.

- **Rate limit API requests and log users out securely:**

  Limit the number of API requests users can make to prevent automated attacks. Ensure session IDs are invalidated after logout and make short-lived tokens (like JWTs) to reduce the risk of misuse. For longer-lasting tokens, follow standards to revoke access when necessary.

  We have a rate limit in place as well as an expiry of tokens after a day.

  [GitHub Link](https://github.com/kylerobertson84/i14-ssiem/blob/develop/backend/siem/settings.py) line 92-97

## OWASP #2 Cryptographic Failures

- **Always use encryption for sensitive data:**

  Always encrypt sensitive information (like passwords, credit card numbers) both when it's stored and when it's being sent over the internet.

  Passwords are encrypted in the database; this is the only sensitive data we store. Via a built-in function in Django.

- **Avoid outdated or weak algorithms:**

  Use modern, secure encryption methods like AES (Advanced Encryption Standard) and avoid old, broken ones like MD5 or SHA-1.

  We are not using outdated algorithms or encryptions, we are using PBKDF2, SHA256 hash as built into Django.

  For more information refer to the Django documentation: [Django Password Documentation](https://docs.djangoproject.com/en/5.1/topics/auth/passwords/)

- **Use proper key management:**

  Keep encryption keys safe by storing them securely, never hardcoding them into your app, and rotating them regularly.

  Environmental variables aka secrets, these values are not hard coded into our application.

  [GitHub Link](https://github.com/kylerobertson84/i14-ssiem/blob/develop/.env)

- **Enable HTTPS (SSL/TLS) for all data transmission:**

  Always use HTTPS to make sure that data sent between users and your site is encrypted and secure.

  Our website has https enabled as well as an SSL cert.

  For proof go on to [SSIM](https://ssiem.dev/) and refer to the certificate.

- **Do not rely on custom or homegrown cryptography:**

  Don’t try to create your own encryption methods—use well-tested and trusted libraries and standards.

  We are using industry standard encryptions and have not created custom encryptions. 

  As mentioned earlier we are using Django in-built encryption.

- **Avoid exposing unnecessary sensitive data:**

  Only collect and store data that you absolutely need. Don’t expose sensitive information unless it's necessary.

  We do not store anything that is not needed for the functioning of the website (logs and passwords) directly onto the application itself. No sensitive information is exposed as you are required to login to view logs and alerts.

## OWASP #3 Injection

- **Use parameterized queries:**

  Avoid putting user input directly into your database queries. Instead, use placeholders (parameters) to keep user input separate from the actual code.

  We are using parameterized queries in the backend.

  [GitHub Link](https://github.com/kylerobertson84/i14-ssiem/blob/develop/backend/logs/views.py) (Entire page has parameterized queries)

- **Use safe APIs and libraries:**

  Always use well-established libraries or frameworks that protect against injection attacks. Avoid building your own database queries from scratch.

  We are using REST API Framework, Django, React.js, and other well-documented and established tools.

- **Validate and sanitize user inputs:**

  Make sure that all data users provide is properly cleaned and checked before it’s used in your application (e.g., limiting input to expected characters like letters and numbers).

  We are using DOMFury to sanitize the frontend user inputs before they are sent to the backend. In addition to this we have backend validation/sanitization as well. E.g. Date input by users is not valid unless it is in a valid date format.

  Below is a quick test of the DOMFury in action:

Within the development environment of the SSIEM, a simple test was made. Two images rendered with unsafe HTML. One is sanitized, and the other is not.

Inserting image...

When clicking on the sanitized HTML, nothing appears but when clicking on the unsafe tag, the following alert is shown to demonstrate that possible XSS can be done.

Here is the source code for how the test is done.

- **Disable dangerous database features:**

  Turn off or avoid using database features that can be exploited, such as dynamic queries or stored procedures without input validation.

  While we are using dynamic queries, they are all parameterized.

  [GitHub Link](https://github.com/kylerobertson84/i14-ssiem/blob/develop/backend/logs/views.py)

- **Keep your software up to date:**

  Regularly update your software (databases, libraries, etc.) to fix known vulnerabilities that could be used in injection attacks.

  We are using NPM to ensure our tools are up to date as well as dependabot from GitHub. Although it is important to note, we are shipping this solution as an ‘out of box’ experience, therefore post-shipping of this application, updating is not our responsibility.

Using NPM, we can see packages that need to be updated.

We can do an automated update of all these packages, when the command is run again it confirms that everything is up to date.

## OWASP #4 Insecure Design

- **User Authentication and Authorization**

  Implement strong authentication and authorization mechanisms to ensure that only authorized users can access sensitive data and resources.

  All data retrieved by the web app via the API requires a valid token associated with their account, ensuring that data is only accessible to those who are authorized.

- **Encrypted Communication**

  Use cryptographic functions and protocols to protect data in transit and at rest, such as HTTPS and encryption.

  Traefik manages an ACME DNS challenge to generate a Let's Encrypt certificate for HTTPS communication. The systems administrator can configure LUKS or BitLocker depending on their environment to ensure data is encrypted at rest.

- **Internal Network Isolation**

  Ensure internal and external systems are isolated from one another.

  External-reaching services are placed behind a reverse proxy and on its own Docker network, while internal services are on a non-exposed Docker private network.

- **Least Privilege and Separation of Duties**

  Least Privilege is a security principle that states that users should only be given the minimum amount of access necessary to perform their job. This means that users should only be given access to the resources they need to do their job, and no more.

  Users have limited access; only authenticated users can access and modify data, role-based access control ensures separation of duties by limiting permissions based on user roles. This ensures the principle of Least Privilege and separation of duties, reducing the likelihood of unauthorized access to sensitive resources.

## OWASP #5 Security Misconfiguration

- **Keep software and systems up to date:**

  Regularly update your software, libraries, and systems to protect against newly discovered vulnerabilities.

  As mentioned earlier, tools will be up to date to the point of shipment of this application.

- **Remove or restrict unnecessary access:**

  Only give access to those who need it, and remove any user accounts, permissions, or APIs that aren’t in use.

  To call APIs, tokens are required which need to be authenticated.

- **Don’t show too much error detail:**

  When errors happen, don’t display detailed information that could help attackers understand your system’s inner workings.

  We have very limited details regarding data, e.g. “Error, data failed to load” which does not explain anything further to a potential bad actor.

## OWASP #6 Vulnerable and Outdated Components

- **Keep all software and components up to date:**

  Regularly update your app, frameworks, libraries, and any software you rely on to protect against known security flaws.

  As mentioned earlier, tools will be up to date to the point of shipment of this application.

- **Remove unused components:**

  If you’re not using certain libraries, plugins, or services, remove them to reduce the number of things that can go wrong.

  We do not have unnecessary components sitting within our final version of the product.

- **Use trusted sources for components:**

  Only download software, libraries, and packages from official, trustworthy sources to avoid installing something malicious.

  While we used npm to install components, which does not do major checks against components. The components used in this project are from well-established developers with proper documentation of their tools, in addition to this, the tools used are popular enough to have tutorials and study courses made on them. E.g. MUI.

## OWASP #7 Identification and Authentication Failures

- **Use strong, unique passwords:**

  Require users to create strong passwords that are hard to guess. Avoid allowing common or weak passwords.

  Our password requirements are the following, which can be labelled as strong:

  - 16 characters minimum
  - 1 special character
  - 1 uppercase character
  - 1 number

- **Enable multi-factor authentication (MFA):**

  Add an extra layer of security by requiring users to verify their identity with something they have (like a phone) in addition to their password.

  Due to some time-restrictions, MFA is unable to be implemented, according to the Australian Cyber Security Centre (ACSC), when MFA is unable to be implemented, consider using strong passwords/passphrases.

  Source: [ACSC - Securing Your Accounts](https://www.cyber.gov.au/protect-yourself/securing-your-accounts/passphrases)

- **Store passwords securely:**

  Never store passwords in plain text. Always hash and salt passwords before saving them, so they’re unreadable if accessed.

  Passwords are secured and encrypted at rest.

  ![Image](https://cdn.discordapp.com/attachments/1285138814876258325/1295322532915970099/image.png?ex=670e3a9d&is=670ce91d&hm=a363336ba9aff1364f6e7503b7c3f1d0556aa2dc832e574a6bccd8c659875171&)

- **Use secure session management:**

  Ensure that sessions (when a user is logged in) expire after a period of inactivity. Don’t allow session IDs to be reused or hijacked by attackers.

  Session tokens only last 1 day, meaning that you need to re-login every day.

  [GitHub Link](https://github.com/kylerobertson84/i14-ssiem/blob/develop/backend/siem/settings.py)

## OWASP #8 Software and Data Integrity Failures

- **Use trusted sources for updates and libraries:**

  Only download and install software, updates, and libraries from verified, official sources to avoid introducing malicious code.

  Tools and software were installed from the official websites or the instructions from the websites were followed for downloading the tools.

  E.g. `npm install @mui/material @emotion/react @emotion/styled`

- **Monitor and audit code changes:**

  Keep track of all changes made to code and data, and regularly audit those changes to catch any unauthorized or suspicious activity.

  We have implemented a logging of the software as mentioned earlier and in OWASP #9.

## OWASP #9 Security Logging and Monitoring Failures

- **Logging application events**

  Ensure all login, access control, and server-side input validation failures can be logged with sufficient user context to identify suspicious or malicious accounts and held for enough time to allow delayed forensic analysis.

  Currently, the system logs account activities such as failed or successful logins, data retrieved by a user and any modifications that an administrator user may to do other user accounts i.e. creation, deletion or modification.

- **Logging system events.**

  Logging server side events that can be used for analysis after breach.

  The system also logs any SQL queries that are performed on the database allowing for further visibility and the ability to cross-reference any malicious events that may occur.

## OWASP #10 Server-Side Request Forgery (SSRF)

As stated in the official documentation ([OWASP SSRF](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)) for OWASP #10 SSRF “occurs when fetching remote resources”. However, due to the containerized nature of this product, it does not fetch anything remote, the data comes in from trusted APIs and no external resources are accessed. As such this OWASP vulnerability is not relevant to this project. In the future if it is decided that external resources will be used in conjunction with the product then this OWASP should be mitigated as this attack vector opens.
