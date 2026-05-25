const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "collections";
const FIELD_NAMES = [
  "name",
  "category",
  "price",
  "label",
  "icon",
  "image",
  "images",
  "badge",
  "badge_tone",
  "sort_order",
  "is_active",
];

const SAMPLE_COLLECTIONS = [
  {
    name: "Kebaya Modern Elegan",
    category: "Kebaya · Formal",
    price: "",
    label: "Foto Produk 1",
    icon: "kebaya",
    image: "/products/product-1-1.jpeg",
    images:
      "/products/product-1-1.jpeg,/products/product-1-2.jpeg,/products/product-1-3.jpeg,/products/product-1-4.jpeg",
    badge: "",
    badge_tone: "rose",
    sort_order: "1",
    is_active: "true",
  },
  {
    name: "Dress Batik Casual",
    category: "Dress · Kasual",
    price: "",
    label: "Foto Produk 2",
    icon: "dress",
    image: "/products/product-2-1.jpeg",
    images:
      "/products/product-2-1.jpeg,/products/product-2-2.jpeg,/products/product-2-3.jpeg,/products/product-2-4.jpeg",
    badge: "",
    badge_tone: "terracotta",
    sort_order: "2",
    is_active: "true",
  },
  {
    name: "Blouse Tenun Premium",
    category: "Blouse · Semi-formal",
    price: "",
    label: "Foto Produk 3",
    icon: "blouse",
    image: "/products/product-3-2.jpeg",
    images:
      "/products/product-3-1.jpeg,/products/product-3-2.jpeg,/products/product-3-3.jpeg,/products/product-3-4.jpeg",
    badge: "",
    badge_tone: "",
    sort_order: "3",
    is_active: "true",
  },
  {
    name: "Gamis Brokat Mewah",
    category: "Gamis · Pesta",
    price: "",
    label: "Foto Produk 4",
    icon: "gamis",
    image: "/products/product-4-1.jpeg",
    images:
      "/products/product-4-1.jpeg,/products/product-4-2.jpeg,/products/product-4-3.jpeg,/products/product-4-4.jpeg,/products/product-4-5.jpeg",
    badge: "",
    badge_tone: "",
    sort_order: "4",
    is_active: "true",
  },
  {
    name: "Kemeja Bordir Eksklusif",
    category: "Kemeja · Formal",
    price: "",
    label: "Foto Produk 5",
    icon: "blouse",
    image: "/products/product-5-1.jpeg",
    images:
      "/products/product-5-1.jpeg,/products/product-5-2.jpeg,/products/product-5-3.jpeg,/products/product-5-4.jpeg",
    badge: "",
    badge_tone: "terracotta",
    sort_order: "5",
    is_active: "true",
  },
  {
    name: "Setelan Kulot Modern",
    category: "Setelan · Kasual",
    price: "",
    label: "Foto Produk 6",
    icon: "blouse",
    image: "/products/product-6-1.jpeg",
    images: "/products/product-6-1.jpeg,/products/product-6-2.jpeg",
    badge: "",
    badge_tone: "rose",
    sort_order: "6",
    is_active: "true",
  },
];

function doGet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureCollectionsSheet(spreadsheet);

  const rows = sheet.getDataRange().getDisplayValues();

  if (rows.length <= 1) {
    return jsonResponse({ data: [] });
  }

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow.map(normalizeHeader);
  const data = bodyRows
    .map((row) => mapRowToRecord(headers, row))
    .filter((record) => record.name);

  return jsonResponse({
    data,
    total: data.length,
    updatedAt: new Date().toISOString(),
  });
}

function setupCollectionsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureCollectionsSheet(spreadsheet);

  return jsonResponse({
    ok: true,
    sheetName: sheet.getName(),
    spreadsheetId: SPREADSHEET_ID,
    fields: FIELD_NAMES,
    sampleCount: SAMPLE_COLLECTIONS.length,
  });
}

function ensureCollectionsSheet(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  ensureHeaderFields(sheet);
  seedSampleRows(sheet);

  sheet.setFrozenRows(1);

  return sheet;
}

function ensureHeaderFields(sheet) {
  const lastColumn = sheet.getLastColumn();

  if (lastColumn === 0) {
    sheet.getRange(1, 1, 1, FIELD_NAMES.length).setValues([FIELD_NAMES]);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(normalizeHeader);
  const missingHeaders = FIELD_NAMES.filter((fieldName) => !currentHeaders.includes(fieldName));

  if (missingHeaders.length === 0) {
    return;
  }

  sheet
    .getRange(1, lastColumn + 1, 1, missingHeaders.length)
    .setValues([missingHeaders]);
}

function seedSampleRows(sheet) {
  if (sheet.getLastRow() > 1) {
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeHeader);
  const rows = SAMPLE_COLLECTIONS.map((item) => headers.map((header) => item[header] || ""));

  if (rows.length === 0) {
    return;
  }

  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function mapRowToRecord(headers, row) {
  return headers.reduce((record, header, index) => {
    record[header] = (row[index] || "").trim();
    return record;
  }, {});
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
