# Send Form Data to Google Sheets Without Google Cloud

You can send form submissions to a **Google Sheet** using **Google Apps Script**—no Google Cloud project, no service account, and no API keys.

---

## How it works

1. You add a short script to your Google Sheet and deploy it as a **web app**.
2. The Form Builder sends each submission to that web app URL.
3. The script appends a row to the sheet. Attachments stay as **links** in the row (same as with the Cloud setup).

---

## 1. Create or open a Google Sheet

- Create a new sheet or open the one you want form responses in.
- The script will use the **first sheet tab** (you can rename it if you like).

---

## 2. Create the sheet and add the script

**Option A – Use the project’s template and script (recommended)**

1. Create a **new Google Sheet** (e.g. at [sheets.new](https://sheets.new)).
2. **(Optional)** To pre-fill the header row: **File → Import → Upload** the file **`form-responses-headers.csv`** from the form-builder folder. Import into the first sheet. If you skip this, the script will add headers on the first submission.
3. In the sheet: **Extensions → Apps Script**. Delete any sample code, then open the file **`sheet-apps-script/FormResponses.gs`** in this project, copy its **entire contents**, and paste into the Apps Script editor.
4. Click **Save** (disk icon) and name the project if you like.

**Option B – Manual script**

1. Create a new Google Sheet.
2. **Extensions → Apps Script**, delete sample code, and paste the script from **`sheet-apps-script/FormResponses.gs`** (same file as above).
3. Save. The script will write the header row on the first form submission.

---

## 3. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to “Select type” and choose **Web app**.
3. Set:
   - **Description:** e.g. “Form Builder”
   - **Execute as:** **Me** (your Google account)
   - **Who has access:** **Anyone** (so your Form Builder server can POST to it)
4. Click **Deploy**. Approve the permissions if asked (review access, then allow).
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/xxxxx/exec`).

---

## 4. Configure the Form Builder

In your project `.env` file add:

```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec
```

Use the URL you copied. Restart the app.

---

## 5. Test

Submit the form once. A new row should appear in the first sheet tab. The first row will be the headers; each submission adds one row. File-upload fields will show as links in their columns.

---

## Other options (no Google at all)

If you don’t need a Google Sheet specifically:

| Option | Notes |
|--------|--------|
| **CSV export** | Use the admin page to view submissions and export CSV, then import into any spreadsheet (Excel, Sheets, etc.) when you want. |
| **Zapier / Make** | Form Builder could send to a webhook; Zapier/Make receives it and adds a row to Sheets (or Airtable, Notion, etc.). You connect your Google account in the automation tool—no Cloud project. |
| **Airtable** | Use Airtable’s API or a Zap/Make automation to create records from form submissions; similar idea, different product. |

The **Apps Script** method above keeps everything in Google (Sheet + optional Drive for files) without any Google Cloud Console setup.
