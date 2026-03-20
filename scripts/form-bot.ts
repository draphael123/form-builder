import { chromium } from 'playwright';
import path from 'path';

const TEST_DATA = {
  // Demographic Info
  fullLegalName: 'John Michael Test',
  anyOtherNamesUsed: 'No',
  dateOfBirth: '1990-05-15',
  placeOfBirth: 'New York, NY, USA',
  genderPronouns: 'Male: He/Him',
  socialSecurityNumber: '123-45-6789',
  citizenshipStatus: 'U.S. Citizen',
  raceEthnicity: 'White (Not Hispanic or Latino)',
  homeMailingAddress: '123 Test Street',
  cityStateZip: 'New York, NY 10001',
  preferredPhoneNumber: '555-123-4567',
  personalEmailAddress: 'test.bot@example.com',
  emergencyContactName: 'Jane Test',
  emergencyContactNumber: '555-987-6543',

  // Languages
  speaksOtherLanguages: 'No',

  // Clinical question
  isClinicalStaff: 'No',

  // Non-clinical signature
  printedName: 'John Michael Test',
};

async function fillSelect(page: any, id: string, value: string) {
  try {
    const select = page.locator(`select#${id}`);
    if (await select.isVisible({ timeout: 2000 })) {
      await select.selectOption(value);
      await page.waitForTimeout(100);
      console.log(`  Filled select ${id}: ${value}`);
      return true;
    }
  } catch (e) {
    // Silent fail - field may not be on current page
  }
  return false;
}

async function fillInput(page: any, id: string, value: string) {
  try {
    const input = page.locator(`input#${id}`);
    if (await input.isVisible({ timeout: 2000 })) {
      await input.fill(value);
      await page.waitForTimeout(100);
      console.log(`  Filled input ${id}: ${value}`);
      return true;
    }
  } catch (e) {
    // Silent fail - field may not be on current page
  }
  return false;
}

async function uploadFile(page: any, labelText: string, filePath: string) {
  try {
    // Find the file input inside the label - it's sr-only (screen reader only)
    // The structure is: label with text -> contains input[type="file"]
    const label = page.locator(`label:has-text("${labelText}")`).first();
    const container = label.locator('..').locator('..'); // Go up to the main container
    const fileInput = container.locator('input[type="file"]');

    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(filePath);
      // Wait for upload to complete (the component shows a spinner)
      await page.waitForTimeout(3000);
      console.log(`  Uploaded file for ${labelText}`);
      return true;
    }
  } catch (e) {
    console.log(`  Could not upload file for ${labelText}: ${e}`);
  }
  return false;
}

async function clickContinue(page: any) {
  try {
    // Look for Continue or Review Answers button with specific class
    const continueBtn = page.locator('button.btn.btn-primary:has-text("Continue")').first();
    const reviewBtn = page.locator('button.btn.btn-primary:has-text("Review Answers")').first();

    if (await reviewBtn.isVisible({ timeout: 500 })) {
      await reviewBtn.click();
      await page.waitForTimeout(500);
      return 'review';
    } else if (await continueBtn.isVisible({ timeout: 500 })) {
      await continueBtn.click();
      await page.waitForTimeout(500);
      return 'continue';
    }
  } catch (e) {
    console.log('Could not click continue:', e);
  }
  return null;
}

async function runFormBot() {
  console.log('========================================');
  console.log('FORM BOT STARTING');
  console.log('========================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the form
    console.log('Navigating to form at http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for form to load
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('Form loaded successfully!\n');

    // Dismiss any draft banner if present
    const dismissBtn = page.locator('button:has-text("Start Fresh")');
    if (await dismissBtn.isVisible({ timeout: 1000 })) {
      await dismissBtn.click();
      await page.waitForTimeout(500);
    }

    // Get test PDF path
    const testPdfPath = path.resolve(__dirname, '../../npdb_test.pdf');
    console.log('Using test file:', testPdfPath);

    let currentSection = 1;
    let maxSections = 10; // Non-clinical path should be short

    while (currentSection <= maxSections) {
      console.log(`\n--- Section ${currentSection} ---`);
      await page.waitForTimeout(300);

      // Fill all possible fields on current page
      // Text inputs
      await fillInput(page, 'fullLegalName', TEST_DATA.fullLegalName);
      await fillInput(page, 'placeOfBirth', TEST_DATA.placeOfBirth);
      await fillInput(page, 'socialSecurityNumber', TEST_DATA.socialSecurityNumber);
      await fillInput(page, 'homeMailingAddress', TEST_DATA.homeMailingAddress);
      await fillInput(page, 'cityStateZip', TEST_DATA.cityStateZip);
      await fillInput(page, 'preferredPhoneNumber', TEST_DATA.preferredPhoneNumber);
      await fillInput(page, 'personalEmailAddress', TEST_DATA.personalEmailAddress);
      await fillInput(page, 'emergencyContactName', TEST_DATA.emergencyContactName);
      await fillInput(page, 'emergencyContactNumber', TEST_DATA.emergencyContactNumber);
      await fillInput(page, 'printedName', TEST_DATA.printedName);
      await fillInput(page, 'dateOfBirth', TEST_DATA.dateOfBirth);

      // Signature date (today)
      const today = new Date().toISOString().split('T')[0];
      await fillInput(page, 'signatureDate', today);

      // Select dropdowns
      await fillSelect(page, 'anyOtherNamesUsed', TEST_DATA.anyOtherNamesUsed);
      await fillSelect(page, 'genderPronouns', TEST_DATA.genderPronouns);
      await fillSelect(page, 'citizenshipStatus', TEST_DATA.citizenshipStatus);
      await fillSelect(page, 'raceEthnicity', TEST_DATA.raceEthnicity);
      await fillSelect(page, 'speaksOtherLanguages', TEST_DATA.speaksOtherLanguages);
      await fillSelect(page, 'isClinicalStaff', TEST_DATA.isClinicalStaff);

      // File uploads (using label text)
      await uploadFile(page, "Driver's License / Government ID", testPdfPath);
      await uploadFile(page, 'Resume / CV', testPdfPath);

      // Try to continue to next page
      const result = await clickContinue(page);

      if (result === 'review') {
        console.log('\nReached Review Page!');
        break;
      } else if (result === 'continue') {
        currentSection++;
      } else {
        // Check for validation errors
        const errorText = await page.locator('.error-summary').textContent().catch(() => null);
        if (errorText) {
          console.log('Validation errors:', errorText.substring(0, 100));
          // Take screenshot for debugging
          await page.screenshot({ path: path.resolve(__dirname, '../validation-errors.png'), fullPage: true });
        }

        // Try clicking continue again
        await page.waitForTimeout(1000);
        const retryResult = await clickContinue(page);
        if (retryResult === 'review') {
          console.log('\nReached Review Page!');
          break;
        } else if (retryResult === 'continue') {
          currentSection++;
        } else {
          console.log('Cannot proceed. Taking screenshot...');
          await page.screenshot({ path: path.resolve(__dirname, '../stuck-state.png'), fullPage: true });
          break;
        }
      }
    }

    // Now on Review Page - click Submit
    console.log('\n--- Submitting Form ---');
    await page.waitForTimeout(1000);

    // Check if we're on review page
    const reviewTitle = page.locator('h2:has-text("Review Your Answers")');
    const submitBtn = page.locator('button:has-text("Submit Application")');

    if (await reviewTitle.isVisible({ timeout: 2000 })) {
      console.log('Review page confirmed');
    }

    if (await submitBtn.isVisible({ timeout: 5000 })) {
      console.log('Clicking Submit Application...');
      await submitBtn.click();

      // Wait for redirect to success page
      console.log('Waiting for submission to complete...');
      await page.waitForURL('**/success**', { timeout: 60000 });

      const finalUrl = page.url();
      console.log('\n========================================');
      console.log('SUBMISSION SUCCESSFUL!');
      console.log('========================================');
      console.log('Success Page URL:', finalUrl);

      // Extract submission ID
      const urlParams = new URLSearchParams(new URL(finalUrl).search);
      const submissionId = urlParams.get('id');

      if (submissionId) {
        console.log('\nSubmission ID:', submissionId);
        console.log('\nDirect Link to Answers:');
        console.log(`http://localhost:3000/success?id=${submissionId}`);
      }

      // Take screenshot of success page
      await page.waitForTimeout(2000);
      const screenshotPath = path.resolve(__dirname, '../submission-success.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('\nScreenshot saved:', screenshotPath);

    } else {
      console.log('Submit button not found. Taking screenshot...');
      await page.screenshot({ path: path.resolve(__dirname, '../no-submit-button.png'), fullPage: true });
    }

  } catch (error) {
    console.error('\nError running form bot:', error);
    const screenshotPath = path.resolve(__dirname, '../error-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Error screenshot saved:', screenshotPath);

  } finally {
    console.log('\nKeeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    await browser.close();
    console.log('Browser closed.');
  }
}

runFormBot().catch(console.error);
