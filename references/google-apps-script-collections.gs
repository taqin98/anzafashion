const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const ANZA_SECRET = "";
const COLLECTIONS_SHEET_NAME = "collections";
const COLLECTION_FIELDS = [
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
const CONTACT_REQUESTS_SHEET_NAME = "contact_requests";
const CONTACT_REQUEST_FIELDS = [
  "submitted_at",
  "full_name",
  "phone_number",
  "service_type",
  "description",
  "status",
  "source",
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

function doPost(event) {
  try {
    const payload = parseJsonBody(event);

    if (payload.action !== "create-contact-request") {
      return jsonResponse({
        ok: false,
        message: "Unsupported action.",
      });
    }

    validateContactSecret(payload.secret);
    validateContactPayload(payload);

    delete payload.secret;

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ensureContactRequestsSheet(spreadsheet);
    const submittedAt = new Date().toISOString();
    const row = CONTACT_REQUEST_FIELDS.map((fieldName) => {
      if (fieldName === "submitted_at") return submittedAt;
      if (fieldName === "status") return "new";
      if (fieldName === "source") return "website";

      return payload[fieldName] || "";
    });

    sheet.appendRow(row);

    return jsonResponse({
      ok: true,
      message: "Pesan berhasil disimpan.",
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error && error.message ? error.message : "Failed to store contact request.",
    });
  }
}

function setupCollectionsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureCollectionsSheet(spreadsheet);

  return jsonResponse({
    ok: true,
    sheetName: sheet.getName(),
    spreadsheetId: SPREADSHEET_ID,
    fields: COLLECTION_FIELDS,
    sampleCount: SAMPLE_COLLECTIONS.length,
  });
}

function setupContactRequestsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureContactRequestsSheet(spreadsheet);

  return jsonResponse({
    ok: true,
    sheetName: sheet.getName(),
    spreadsheetId: SPREADSHEET_ID,
    fields: CONTACT_REQUEST_FIELDS,
  });
}

function ensureCollectionsSheet(spreadsheet) {
  const sheet =
    spreadsheet.getSheetByName(COLLECTIONS_SHEET_NAME) ||
    spreadsheet.insertSheet(COLLECTIONS_SHEET_NAME);

  ensureHeaderFields(sheet, COLLECTION_FIELDS);
  seedSampleRows(sheet);

  sheet.setFrozenRows(1);

  return sheet;
}

function ensureContactRequestsSheet(spreadsheet) {
  const sheet =
    spreadsheet.getSheetByName(CONTACT_REQUESTS_SHEET_NAME) ||
    spreadsheet.insertSheet(CONTACT_REQUESTS_SHEET_NAME);

  ensureHeaderFields(sheet, CONTACT_REQUEST_FIELDS);
  sheet.setFrozenRows(1);

  return sheet;
}

function ensureHeaderFields(sheet, fieldNames) {
  const lastColumn = sheet.getLastColumn();

  if (lastColumn === 0) {
    sheet.getRange(1, 1, 1, fieldNames.length).setValues([fieldNames]);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(normalizeHeader);
  const missingHeaders = fieldNames.filter((fieldName) => !currentHeaders.includes(fieldName));

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

function parseJsonBody(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Request body is missing.");
  }

  const payload = JSON.parse(event.postData.contents);

  return {
    action: normalizeString(payload.action),
    secret: normalizeString(payload.secret),
    full_name: normalizeString(payload.fullName),
    phone_number: normalizeString(payload.phoneNumber),
    service_type: normalizeString(payload.serviceType),
    description: normalizeString(payload.description),
  };
}

function validateContactSecret(secret) {
  if (!ANZA_SECRET) {
    return;
  }

  if (secret !== ANZA_SECRET) {
    throw new Error("Invalid contact form secret.");
  }
}

function validateContactPayload(payload) {
  if (!payload.full_name) {
    throw new Error("Field fullName is required.");
  }

  if (!payload.phone_number) {
    throw new Error("Field phoneNumber is required.");
  }

  if (!payload.service_type) {
    throw new Error("Field serviceType is required.");
  }

  if (!payload.description) {
    throw new Error("Field description is required.");
  }
}

function mapRowToRecord(headers, row) {
  return headers.reduce((record, header, index) => {
    record[header] = (row[index] || "").trim();
    return record;
  }, {});
}

function normalizeString(value) {
  return String(value || "").trim();
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
