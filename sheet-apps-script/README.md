# Google Sheet setup for Form Builder (no Cloud required)

This folder contains the **Apps Script** that receives form submissions and appends them to a Google Sheet.

## Quick setup

### 1. Create the sheet and add headers (optional)

- Create a **new Google Sheet** at [sheets.new](https://sheets.new).
- **(Optional)** To pre-fill the header row: **File → Import → Upload** and choose the project file **`form-responses-headers.csv`** (in the form-builder folder). Import into the first sheet.  
  If you skip this, the script will write the header row on the first submission.

### 2. Add the script

- In the sheet: **Extensions → Apps Script**.
- Delete any sample code, then open **`FormResponses.gs`** in this folder and **copy its full contents** into the Apps Script editor.
- Click **Save** (disk icon).

### 3. Deploy as web app

- **Deploy → New deployment**.
- Click the gear icon → **Web app**.
- **Execute as:** Me  
- **Who has access:** Anyone  
- Click **Deploy**, then approve permissions if asked.
- **Copy the Web app URL** (e.g. `https://script.google.com/macros/s/.../exec`).

### 4. Connect the Form Builder

In the Form Builder project `.env`:

```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

Restart the app. New form submissions will appear as rows in the sheet. File uploads will show as links in their columns.

---

**Regenerating the template:** If you change the form fields, run from the project root:

```bash
npm run generate-sheet
```

Then re-import **`form-responses-headers.csv`** if you want an updated header row, or leave the sheet as is and let the script write headers on first submit.
