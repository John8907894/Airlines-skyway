# Troubleshooting AWS Deployment: SkyWay Airlines

This guide provides specific steps to solve the "Connection Refused" or "API Not Found" errors occurring on your AWS deployment.

---

## 1. Finding your AWS Public IP/DNS

Before updating settings, you need to know exactly where your server is living.

1.  Log into the [AWS Management Console](https://console.aws.amazon.com/ec2/).
2.  Go to **Instances** and select your running instance.
3.  In the **Details** tab below, look for:
    *   `Public IPv4 address` (e.g., `3.123.45.67`)
    *   `Public IPv4 DNS` (e.g., `ec2-3-123-45-67.compute-1.amazonaws.com`)
4.  Copy one of these. This will be the "heart" of your API URL.

---

## 2. Opening the AWS Firewall (Security Groups)

By default, AWS blocks port **5000** (where your backend runs). You must manually open it.

1.  In the EC2 Dashboard, click on **Security Groups** (found in the left sidebar or under the "Security" tab of your instance).
2.  Select the Security Group attached to your instance (usually named something like `launch-wizard-1`).
3.  Click **Edit inbound rules**.
4.  Click **Add rule**.
5.  Set the following:
    *   **Type**: `Custom TCP`
    *   **Port range**: `5000`
    *   **Source**: `Anywhere-IPv4` (`0.0.0.0/0`)
6.  Click **Save rules**.

---

## 3. Updating the Frontend Environment Variables

Now that the "gate" is open, tell the frontend where to go.

1.  Open [frontend/.env.production](file:///c:/Users/HP/Desktop/airlines/frontend/.env.production) in your editor.
2.  Replace `YOUR_AWS_PUBLIC_IP` with the IP/DNS you found in Step 1.
    *   **Example**: `VITE_API_URL=http://3.123.45.67:5000/api`
3.  **Save the file.**

---

## 4. Rebuilding the Frontend (CRITICAL)

The frontend is a "static" app once it's built. Changing the `.env` file **does nothing until you rebuild**.

1.  Open a terminal in the `frontend` directory.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  Redeploy the resulting `dist` folder to your static hosting (e.g., Netlify, S3, or wherever you host the frontend).

---

## Summary of Fixes

| Issue | Solution |
| :--- | :--- |
| **Wrong API URL** | Updated `.env.production` with Public IP. |
| **AWS Firewall** | Added Port 5000 to AWS Security Group. |
| **Missing Build Step** | Ran `npm run build` after changes. |
