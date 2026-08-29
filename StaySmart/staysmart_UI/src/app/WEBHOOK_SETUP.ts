/**
 * GOOGLE APPS SCRIPT WEBHOOK - Complete Setup Guide
 * 
 * This file contains the exact Google Apps Script code needed to handle
 * order inquiries, log them to Google Sheets, and send confirmation emails.
 */

/*
 * ============================================================================
 * STEP 1: CREATE GOOGLE SHEET
 * ============================================================================
 * 
 * 1. Go to Google Drive: https://drive.google.com
 * 2. Click "Create" → "Google Sheet"
 * 3. Name it "DTF Order Inquiries"
 * 4. Add the following column headers in row 1:
 *    A1: Timestamp
 *    B1: Customer Name
 *    C1: Email
 *    D1: Phone
 *    E1: Product ID
 *    F1: Product Name
 *    G1: Size
 *    H1: Image URL
 * 5. Copy the Sheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
 *    (You'll need this in the Google Apps Script below)
 */

/*
 * ============================================================================
 * STEP 2: CREATE GOOGLE APPS SCRIPT
 * ============================================================================
 * 
 * 1. Go to Google Apps Script: https://script.google.com
 * 2. Click "Create Project" or open existing project
 * 3. Replace all code in the editor with the code below:
 */

// ============================================================================
// GOOGLE APPS SCRIPT CODE - Copy this entire section
// ============================================================================

/*

function doPost(e) {
  try {
    // Parse incoming JSON payload
    const data = JSON.parse(e.postData.contents);
    
    // Open Google Sheet and get the "Inquiries" sheet
    // Make sure you have a sheet named "Inquiries" or create one
    const spreadsheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
    const sheet = spreadsheet.getSheetByName('Inquiries');
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      spreadsheet.insertSheet('Inquiries');
      const newSheet = spreadsheet.getSheetByName('Inquiries');
      newSheet.appendRow([
        'Timestamp',
        'Customer Name',
        'Email',
        'Phone',
        'Product ID',
        'Product Name',
        'Size',
        'Image URL'
      ]);
      const newSheet2 = spreadsheet.getSheetByName('Inquiries');
      sheet = newSheet2;
    }
    
    // Append new row with inquiry data
    sheet.appendRow([
      new Date().toLocaleString(),
      data.userName || '',
      data.userEmail || '',
      data.userPhone || '',
      data.productId || '',
      data.productName || '',
      data.size || '',
      data.imageUrl || ''
    ]);
    
    // Generate reference code
    const timestamp = Date.now();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceCode = `ORD-${timestamp}-${randomCode}`;
    
    // Send confirmation email to customer
    if (data.userEmail) {
      try {
        const emailBody = buildEmailBody(data, referenceCode);
        GmailApp.sendEmail(
          data.userEmail,
          `Stock Inquiry Confirmation - ${data.productId}`,
          emailBody,
          {
            htmlBody: getHTMLEmailTemplate(data, referenceCode)
          }
        );
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    }
    
    // Send notification email to studio (optional)
    // Uncomment and add your email address:
    // sendStudioNotification(data, referenceCode);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      referenceCode: referenceCode,
      message: `Inquiry received! Reference code: ${referenceCode}. We'll notify you shortly.`,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error processing inquiry:', error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      referenceCode: 'ERR-' + Date.now(),
      message: 'An error occurred processing your inquiry. Please try again.',
      timestamp: new Date().toISOString(),
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON)
      .setHttpResponseCode(500);
  }
}

// Helper function to build plain text email body
function buildEmailBody(data, referenceCode) {
  return `
Hi ${data.userName},

Thank you for your stock inquiry!

=== INQUIRY DETAILS ===
Reference Code: ${referenceCode}
Product: ${data.productName} (${data.productId})
Size: ${data.size}
Phone: ${data.userPhone}
Time: ${new Date().toLocaleString()}

We've received your inquiry and will review your request.
Our studio team will contact you within 24 hours to discuss
product availability, minimum order quantities, and pricing.

If you have any questions, feel free to reply to this email.

Best regards,
DTF Studio Team
`;
}

// Helper function to build HTML email template
function getHTMLEmailTemplate(data, referenceCode) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: white;
      margin: 0 auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #09090b;
      font-size: 24px;
    }
    .ref-code {
      background: #f59e0b;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      display: inline-block;
      font-weight: bold;
      font-family: monospace;
      margin: 10px 0;
    }
    .details {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .detail-row {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    .detail-label {
      font-weight: bold;
      color: #666;
      min-width: 150px;
    }
    .detail-value {
      color: #333;
      flex: 1;
      text-align: right;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .cta {
      background: #f59e0b;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      margin: 20px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Inquiry Received!</h1>
      <p>Thank you for your stock inquiry. Here's your confirmation details:</p>
    </div>
    
    <div class="ref-code">
      Reference: ${referenceCode}
    </div>
    
    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Product:</span>
        <span class="detail-value">${data.productName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Product ID:</span>
        <span class="detail-value">${data.productId}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Size:</span>
        <span class="detail-value">${data.size}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Submitted:</span>
        <span class="detail-value">${new Date().toLocaleString()}</span>
      </div>
    </div>
    
    <p>
      Our studio team has received your inquiry and will review your request.
      We'll contact you within <strong>24 hours</strong> to discuss:
    </p>
    <ul>
      <li>Product availability</li>
      <li>Minimum order quantities (MOQ)</li>
      <li>Pricing and bulk discounts</li>
      <li>Production timeline</li>
    </ul>
    
    <p>
      <strong>Keep this reference code handy:</strong> ${referenceCode}
    </p>
    
    <div class="footer">
      <p>You'll receive updates at ${data.userEmail}</p>
      <p>© DTF Studio. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}

// Optional: Function to send notification to studio
function sendStudioNotification(data, referenceCode) {
  // Replace with your studio email address
  const studioEmail = 'studio@example.com';
  
  const subject = `[NEW INQUIRY] ${data.productName} - Size ${data.size}`;
  
  const body = `
NEW STOCK INQUIRY RECEIVED

Customer: ${data.userName}
Email: ${data.userEmail}
Phone: ${data.userPhone}
Reference: ${referenceCode}

Product: ${data.productName}
SKU: ${data.productId}
Size: ${data.size}

Timestamp: ${new Date().toLocaleString()}

Action: Log into Google Sheets to view details.
`;
  
  try {
    GmailApp.sendEmail(studioEmail, subject, body);
  } catch (error) {
    console.error('Studio notification failed:', error);
  }
}

// Optional: Test function - comment out after testing
function test() {
  const testData = {
    userName: "Test Customer",
    userEmail: "your-email@gmail.com", // Change to your email
    userPhone: "+91 98300XXXXX",
    productId: "TS-KOL-009",
    productName: "Oversized Minimalist DTF Graphic Tee",
    size: "L",
    imageUrl: "https://via.placeholder.com/400x400"
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const response = doPost(e);
  Logger.log(response.getContent());
}

*/

// ============================================================================
// END GOOGLE APPS SCRIPT CODE
// ============================================================================

/*
 * ============================================================================
 * STEP 3: DEPLOY AS WEB APP
 * ============================================================================
 * 
 * 1. In Google Apps Script editor, click "Deploy" button
 * 2. Select "New deployment"
 * 3. Choose deployment type: "Web app"
 * 4. Fill in details:
 *    - Execute as: YOUR_EMAIL@gmail.com
 *    - Who has access: "Anyone"
 * 5. Click "Deploy"
 * 6. Copy the deployment URL (format: https://script.google.com/macros/d/{ID}/usercallback)
 * 7. Save this URL in your Angular app
 */

/*
 * ============================================================================
 * STEP 4: UPDATE ANGULAR APPLICATION
 * ============================================================================
 * 
 * In src/app/services/inquiry.service.ts, update:
 * 
 * private readonly WEBHOOK_URL = 'https://script.google.com/macros/d/{YOUR_SCRIPT_ID}/usercallback';
 * 
 * Replace {YOUR_SCRIPT_ID} with your actual deployment ID
 */

/*
 * ============================================================================
 * STEP 5: CONFIGURE SHEET ID
 * ============================================================================
 * 
 * In the Google Apps Script code above, replace:
 * 
 * const spreadsheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
 * 
 * With your actual Google Sheet ID (found in the URL).
 */

/*
 * ============================================================================
 * STEP 6: TEST THE WEBHOOK
 * ============================================================================
 * 
 * 1. In Google Apps Script, click the play button (▶) to run the test() function
 * 2. Check your email for the test confirmation email
 * 3. Open your Google Sheet and verify the test row was added
 * 4. In the Angular app, click "REQUEST STOCK INQUIRY" and test end-to-end
 */

/*
 * ============================================================================
 * SECURITY & BEST PRACTICES
 * ============================================================================
 * 
 * 1. EMAIL VALIDATION
 *    Add email validation before sending:
 *    if (!isValidEmail(data.userEmail)) { return error; }
 * 
 * 2. RATE LIMITING
 *    Implement rate limiting to prevent spam:
 *    - Log requests by IP
 *    - Limit to X requests per hour per IP
 * 
 * 3. DATA VALIDATION
 *    Validate all required fields:
 *    - userName (required, max 100 chars)
 *    - userEmail (required, valid email)
 *    - productId (required, format validation)
 *    - size (required, must be S|M|L|XL|XXL)
 * 
 * 4. ERROR HANDLING
 *    Implement comprehensive error handling:
 *    - Log to Google Sheet with timestamp
 *    - Send admin alerts for critical errors
 * 
 * 5. CORS HEADERS
 *    Google Apps Script handles CORS automatically
 *    If issues arise, add CORS header handling:
 *    
 *    function doOptions() {
 *      return HtmlService.createTextOutput('')
 *        .setHeader('Access-Control-Allow-Origin', '*')
 *        .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
 *        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
 *    }
 * 
 * 6. SHEET LIMITS
 *    Google Sheets has limits:
 *    - Max 10 million cells per sheet
 *    - ~300K rows for typical data
 *    - Archive old data periodically
 * 
 * 7. QUOTA LIMITS
 *    Google Apps Script quotas:
 *    - 20,000 API calls per day
 *    - 6 minutes total execution time per day
 *    - Monitor usage in executions dashboard
 */

/*
 * ============================================================================
 * TROUBLESHOOTING
 * ============================================================================
 * 
 * ISSUE: "Permission denied" error
 * SOLUTION:
 * 1. Check that you deployed the script as "Anyone"
 * 2. Verify the deployment URL is correct
 * 3. Redeploy as a new version
 * 
 * ISSUE: Emails not being sent
 * SOLUTION:
 * 1. Check Gmail quota in Apps Script dashboard
 * 2. Verify email address is valid
 * 3. Check spam folder
 * 4. Look at execution logs in Apps Script
 * 
 * ISSUE: Data not appearing in Sheet
 * SOLUTION:
 * 1. Verify SHEET_ID is correct
 * 2. Check that user has edit access to Sheet
 * 3. Verify sheet name is exactly "Inquiries"
 * 4. Check execution logs for errors
 * 
 * ISSUE: CORS error in browser console
 * SOLUTION:
 * 1. This is expected for GET requests to private sheets
 * 2. POST requests should work from any origin
 * 3. If POST fails, redeploy as new version
 * 
 * ISSUE: Reference code not generated
 * SOLUTION:
 * 1. Check that script executed successfully
 * 2. Look at execution logs for errors
 * 3. Verify timestamp is available
 */

/*
 * ============================================================================
 * ADVANCED FEATURES
 * ============================================================================
 * 
 * 1. ADD ATTACHMENTS
 *    
 *    const blob = Utilities.newBlob(imageData, 'image/jpeg');
 *    GmailApp.sendEmail(
 *      email,
 *      subject,
 *      body,
 *      { attachments: [blob] }
 *    );
 * 
 * 2. SEND TEMPLATED EMAILS
 *    
 *    Use HTMLService to render templates:
 *    const template = HtmlService.createTemplate(htmlString);
 *    template.data = { name: 'John' };
 *    GmailApp.sendEmail(email, subject, '', { htmlBody: template.evaluate().getContent() });
 * 
 * 3. LOG TO SEPARATE SHEET
 *    
 *    Create a "Logs" sheet and append error messages:
 *    logsSheet.appendRow([new Date(), errorType, errorMessage]);
 * 
 * 4. SEND SLACK NOTIFICATIONS
 *    
 *    Use UrlFetchApp to POST to Slack webhook:
 *    UrlFetchApp.fetch(slackWebhook, {
 *      method: 'post',
 *      payload: JSON.stringify({ text: 'New inquiry received!' })
 *    });
 * 
 * 5. TRIGGER-BASED WORKFLOWS
 *    
 *    Set up time-based triggers to:
 *    - Archive old data
 *    - Send daily summary emails
 *    - Clean up duplicate entries
 */

export {};
