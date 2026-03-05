# Sending Form Answers to Google Sheets (Including Attachments)

This app can send every form submission to a **Google Sheet**. Fields that require file uploads are stored as **links** in the sheet—each link opens the uploaded file (in Google Drive or your site).

---

## 1. One-time setup: Google Cloud & APIs

### 1.1 Create a project and enable APIs

1. Open **[Google Cloud Console](https://console.cloud.google.com)**.
2. Create a **new project** (or pick an existing one).
3. Enable **both** of these APIs:
   - **Google Sheets API**  
     - Go to **APIs & Services → Library**, search “Google Sheets API”, open it, click **Enable**.
   - **Google Drive API**  
     - Same place, search “Google Drive API”, open it, click **Enable**.  
     - Required so file uploads can be stored in Drive and linked from the sheet.

### 1.2 Create a Service Account

1. Go to **APIs & Services → Credentials**.
2. Click **Create credentials → Service account**.
3. Give it a name (e.g. “Form Builder”), then **Create and continue** (you can skip optional steps).
4. Open the new service account.
5. Go to the **Keys** tab → **Add key → Create new key** → choose **JSON** → **Create**.  
   - A JSON file will download. Keep it safe; you’ll use it in the next section.

### 1.3 Get env values from the JSON

From the downloaded JSON you need:

- **`client_email`** → use as `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **`private_key`** → use as `GOOGLE_PRIVATE_KEY` (keep the `\n` as literal backslash-n in the env file, or use real newlines—see below)

---

## 2. Google Sheet setup

1. Create a **new Google Sheet** (or use an existing one).
2. **Rename the first sheet tab** to exactly: **`Form Responses 1`**.  
   - The app writes to this tab name. You can leave the sheet otherwise empty; the app will add the header row on first submission.
3. **Share the sheet** with the service account:
   - Open the sheet → **Share**.
   - Add the **service account email** (the `client_email` from the JSON) as **Editor**.
   - This allows the app to append rows.

4. **Get the Spreadsheet ID**:
   - With the sheet open, look at the URL:  
     `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`  
   - Copy the long string between `/d/` and `/edit`. That is your **`GOOGLE_SPREADSHEET_ID`**.

---

## 3. App env configuration

In the Form Builder project root, copy the example env file and edit it:

```bash
cp .env.example .env
```

Edit **`.env`** and set:

```env
# Required for answers to go to the Google Sheet
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-from-url

# Required for attachments to be stored and linked from the sheet
# (Uses same service account; no extra keys needed)
GOOGLE_DRIVE_FOLDER_NAME=Form Uploads
```

**Private key notes:**

- Paste the full `private_key` value from the JSON, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.
- If you use **quotes** in `.env`, keep the key on one line and use `\n` for newlines (as in the example above).
- Alternatively, put the key in the file with **real line breaks** and quote the whole value in one string.

Restart the app after changing `.env`.

---

## 4. How answers get into the sheet

- On each form **submit**, the app:
  1. Saves the submission locally (always).
  2. If the three Google variables above are set, it also:
     - Ensures the first row of **Form Responses 1** has headers (Timestamp + one column per form field).
     - Appends one new row with: timestamp and every field value in column order.

- **Every form field** is included, including:
  - Short text, long text, dropdowns, checkboxes, etc.
  - **File-upload fields**: the stored value is the **link** to the file (see below).

So “getting answers into a Google Sheet” is done by: **setting the three env vars and using a sheet whose first tab is named `Form Responses 1`**.

---

## 5. How attachments are “carried over” to the sheet

- **Required (or optional) file-upload questions** in the form upload files when the user selects them.
- If **Google Drive is configured** (same service account, Drive API enabled):
  - Files are uploaded to a **Google Drive folder** (default name: **Form Uploads**).
  - The form stores the **file link** (e.g. “View in Drive” style link) in that field’s value.
- If Drive is **not** configured:
  - Files are saved under the app’s **local** `public/uploads` folder and the form stores the **public URL** of the file.

When the submission is written to the sheet:

- For each **file-upload** field, the cell gets that **link** (Drive link or site URL).
- So “attachments” are **carried over** as **links in the Google Sheet**; clicking the link opens the file. The sheet does not store the binary file itself—it stores the URL.

To have attachments fully “in” Google:

1. Use the **same** Google Cloud project and service account.
2. Enable **Google Drive API** and set **`GOOGLE_DRIVE_FOLDER_NAME`** (and optionally **`GOOGLE_DRIVE_PARENT_FOLDER_ID`** if you want a specific folder).
3. Share the **Form Uploads** folder (or that parent folder) with the service account email if you use a pre-created folder.

Then:

- **Answers** → go to the **Google Sheet** (Form Responses 1).
- **Attachments** → go to **Google Drive** and their **links** appear in the sheet in the corresponding columns.

---

## 6. Quick checklist

| Step | Action |
|------|--------|
| 1 | Create/select Google Cloud project; enable **Sheets API** and **Drive API**. |
| 2 | Create a **Service Account**, download JSON key. |
| 3 | Create/use a Google Sheet; **rename first tab to `Form Responses 1`**. |
| 4 | **Share** the sheet with the service account email (Editor). |
| 5 | Set **`.env`**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`, and `GOOGLE_DRIVE_FOLDER_NAME` (for attachments). |
| 6 | Restart the app and submit a test form. |

After that, answers will appear in the Google Sheet and any file-upload fields will show links that open the attachments (in Drive or on your site).
