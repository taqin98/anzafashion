const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const ANZA_SECRET = "";
const COLLECTIONS_SHEET_NAME = "collections";
const COLLECTION_FIELDS = [
  "id",
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
    id: "collection-001",
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
    id: "collection-002",
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
    id: "collection-003",
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
    id: "collection-004",
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
    id: "collection-005",
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
    id: "collection-006",
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
  {
    id: "collection-007",
    name: "Setelan Baju Adat",
    category: "Setelan · Formal",
    price: "",
    label: "Foto Produk 7",
    icon: "blouse",
    image: "/products/product-7-1.jpeg",
    images:
      "/products/product-7-1.jpeg,/products/product-7-2.jpeg,/products/product-7-3.jpeg,/products/product-7-4.jpeg,/products/product-7-5.jpeg,/products/product-7-6.jpeg,/products/product-7-7.jpeg,/products/product-7-8.jpeg,/products/product-7-9.jpeg,/products/product-7-10.jpeg",
    badge: "",
    badge_tone: "rose",
    sort_order: "7",
    is_active: "true",
  },
];

function doGet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureCollectionsSheet(spreadsheet);
  const data = listCollectionRecords(sheet, false);

  return jsonResponse({
    data: data,
    total: data.length,
    updatedAt: new Date().toISOString(),
  });
}

function doPost(event) {
  try {
    const payload = parseJsonBody(event);

    if (payload.action !== "create-contact-request") {
      return handleAdminCollectionAction(payload);
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
  ensureCollectionDefaults(sheet);

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
    id: normalizeString(payload.id),
    name: normalizeString(payload.name),
    category: normalizeString(payload.category),
    price: normalizeString(payload.price),
    label: normalizeString(payload.label),
    icon: normalizeString(payload.icon),
    image: normalizeString(payload.image),
    images: normalizeImages(payload.images),
    badge: normalizeString(payload.badge),
    badge_tone: normalizeString(payload.badgeTone || payload.badge_tone),
    sort_order: normalizeString(payload.sortOrder),
    is_active: normalizeBooleanString(payload.isActive),
    full_name: normalizeString(payload.fullName),
    phone_number: normalizeString(payload.phoneNumber),
    service_type: normalizeString(payload.serviceType),
    description: normalizeString(payload.description),
  };
}

function handleAdminCollectionAction(payload) {
  validateContactSecret(payload.secret);

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ensureCollectionsSheet(spreadsheet);

  if (payload.action === "admin-list-collections") {
    return jsonResponse({
      ok: true,
      data: listCollectionRecords(sheet, true),
    });
  }

  if (payload.action === "admin-create-collection") {
    validateCollectionPayload(payload);

    const headers = getSheetHeaders(sheet);
    const record = buildCollectionRecord(payload, sheet.getLastRow());
    const rowValues = headers.map((header) => record[header] || "");

    sheet.appendRow(rowValues);

    return jsonResponse({
      ok: true,
      data: record,
      message: "Koleksi berhasil ditambahkan.",
    });
  }

  if (payload.action === "admin-update-collection") {
    validateCollectionPayload(payload);

    const rowIndex = findCollectionRowIndex(sheet, payload.id);

    if (rowIndex === -1) {
      throw new Error("Data koleksi tidak ditemukan.");
    }

    const headers = getSheetHeaders(sheet);
    const record = buildCollectionRecord(payload, rowIndex - 1);
    const rowValues = headers.map((header) => record[header] || "");

    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);

    return jsonResponse({
      ok: true,
      data: record,
      message: "Koleksi berhasil diperbarui.",
    });
  }

  if (payload.action === "admin-delete-collection") {
    const rowIndex = findCollectionRowIndex(sheet, payload.id);

    if (rowIndex === -1) {
      throw new Error("Data koleksi tidak ditemukan.");
    }

    sheet.deleteRow(rowIndex);

    return jsonResponse({
      ok: true,
      message: "Koleksi berhasil dihapus.",
    });
  }

  return jsonResponse({
    ok: false,
    message: "Unsupported action.",
  });
}

function getSheetHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(normalizeHeader);
}

function listCollectionRecords(sheet, includeInactive) {
  const rows = sheet.getDataRange().getDisplayValues();

  if (rows.length <= 1) {
    return [];
  }

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow.map(normalizeHeader);

  return bodyRows
    .map((row) => mapRowToRecord(headers, row))
    .filter((record) => record.name)
    .filter((record) => includeInactive || record.is_active !== "false")
    .sort((left, right) => Number(left.sort_order || "0") - Number(right.sort_order || "0"));
}

function findCollectionRowIndex(sheet, id) {
  if (!id) {
    return -1;
  }

  const rows = sheet.getDataRange().getDisplayValues();

  if (rows.length <= 1) {
    return -1;
  }

  const [headerRow, ...bodyRows] = rows;
  const headers = headerRow.map(normalizeHeader);
  const idColumnIndex = headers.indexOf("id");

  if (idColumnIndex === -1) {
    return -1;
  }

  for (var index = 0; index < bodyRows.length; index += 1) {
    if (normalizeString(bodyRows[index][idColumnIndex]) === id) {
      return index + 2;
    }
  }

  return -1;
}

function buildCollectionRecord(payload, fallbackOrder) {
  const images = payload.images.length > 0 ? payload.images : payload.image ? [payload.image] : [];

  return {
    id: payload.id || Utilities.getUuid(),
    name: payload.name,
    category: payload.category,
    price: payload.price,
    label: payload.label,
    icon: payload.icon,
    image: payload.image || images[0] || "",
    images: images.join(","),
    badge: payload.badge,
    badge_tone: payload.badge_tone,
    sort_order: payload.sort_order || String(Math.max(1, fallbackOrder)),
    is_active: payload.is_active || "true",
  };
}

function ensureCollectionDefaults(sheet) {
  const headers = getSheetHeaders(sheet);

  if (headers.length === 0 || sheet.getLastRow() <= 1) {
    return;
  }

  const idColumnIndex = headers.indexOf("id");
  const sortOrderColumnIndex = headers.indexOf("sort_order");
  const isActiveColumnIndex = headers.indexOf("is_active");
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  var hasUpdates = false;

  for (var index = 0; index < rows.length; index += 1) {
    if (idColumnIndex !== -1 && !normalizeString(rows[index][idColumnIndex])) {
      rows[index][idColumnIndex] = Utilities.getUuid();
      hasUpdates = true;
    }

    if (sortOrderColumnIndex !== -1 && !normalizeString(rows[index][sortOrderColumnIndex])) {
      rows[index][sortOrderColumnIndex] = String(index + 1);
      hasUpdates = true;
    }

    if (isActiveColumnIndex !== -1 && !normalizeString(rows[index][isActiveColumnIndex])) {
      rows[index][isActiveColumnIndex] = "true";
      hasUpdates = true;
    }
  }

  if (hasUpdates) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
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

function validateCollectionPayload(payload) {
  if (!payload.name) {
    throw new Error("Field name is required.");
  }

  if (!payload.category) {
    throw new Error("Field category is required.");
  }

  if (!payload.label) {
    throw new Error("Field label is required.");
  }

  if (!payload.icon) {
    throw new Error("Field icon is required.");
  }

  if (!payload.image && payload.images.length === 0) {
    throw new Error("Field image or images is required.");
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

function normalizeImages(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }

  const normalizedValue = normalizeString(value);

  if (!normalizedValue) {
    return [];
  }

  return normalizedValue
    .split(/[\n,]/)
    .map(normalizeString)
    .filter(Boolean);
}

function normalizeBooleanString(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (["true", "1", "yes", "active"].includes(normalizedValue)) {
    return "true";
  }

  if (["false", "0", "no", "inactive"].includes(normalizedValue)) {
    return "false";
  }

  return "";
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
