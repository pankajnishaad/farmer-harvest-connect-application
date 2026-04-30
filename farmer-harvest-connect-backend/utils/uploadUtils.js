const multer  = require('multer');
const path    = require('path');
const { v4: uuidv4 } = require('uuid');

const MAX_MB  = parseFloat(process.env.MAX_FILE_SIZE_MB || 5);
const MAX_SIZE = MAX_MB * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES   = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

/* ── Storage factory ────────────────────────────────────────────────────────── */
const makeStorage = (dest) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename:    (_req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${uuidv4()}${ext}`;
      cb(null, name);
    },
  });

/* ── Filter factory ─────────────────────────────────────────────────────────── */
const makeFilter = (allowedTypes) => (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

/* ── Uploader instances ─────────────────────────────────────────────────────── */

/** For crop listing images */
const cropImageUpload = multer({
  storage:  makeStorage(path.join(process.env.UPLOAD_PATH || './uploads', 'crops')),
  limits:   { fileSize: MAX_SIZE },
  fileFilter: makeFilter(ALLOWED_IMAGE_TYPES),
});

/** For purchase receipts (image or PDF) */
const receiptUpload = multer({
  storage:  makeStorage(path.join(process.env.UPLOAD_PATH || './uploads', 'receipts')),
  limits:   { fileSize: MAX_SIZE },
  fileFilter: makeFilter(ALLOWED_DOC_TYPES),
});

module.exports = { cropImageUpload, receiptUpload };
