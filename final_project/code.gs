// code from ChatGPT
// This file shouldn't be here, but I don't know how to put it in Google Docs (it seems to only allow me to share the Google Sheet that contains it).
// So I am just copying and pasting it here.

const SHEET_NAME = 'Sheet1';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME);
}

// Handle GET: return all pins as JSON
function doGet(e) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();

  // First row is header
  const headers = values[0];
  const rows = values.slice(1);

  const data = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST: add one new pin
function doPost(e) {
  try {
    const sheet = getSheet_();

    // Parse JSON body sent from your website
    const body = JSON.parse(e.postData.contents);

    const lat = body.lat;
    const lng = body.lng;
    const emoji = body.emoji || '';
    const image = body.image || '';
    const description = body.description || '';

    // Use server timestamp (you don't need to send timestamp from client)
    const timestamp = new Date();

    // Append row in the same order as your headers
    sheet.appendRow([
      lat,
      lng,
      timestamp,
      emoji,
      image,
      description
    ]);

    const result = { status: 'ok' };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const result = {
      status: 'error',
      message: err.toString()
    };
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
