const axios = require('axios');

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  timeoutMS: 5000,
};

function createStorage({ mongoose, sheetUrl, post = axios.post, logger = console }) {
  const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 254 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  }, {
    timestamps: { createdAt: 'created_at' },
    bufferCommands: false,
    writeConcern: { w: 'majority', wtimeout: 5000 },
  });
  const Message = mongoose.models.Message || mongoose.model('Message', schema);
  const isReady = () => mongoose.connection.readyState === 1;
  return {
    isReady,
    async save(values) {
      if (!isReady()) throw new Error('Storage unavailable.');
      // MongoDB is authoritative. Do not report success on a failed/unacknowledged write.
      await Message.create(values);
      if (!sheetUrl) return;
      try {
        const response = await post(sheetUrl, values, {
          timeout: 3000,
          signal: AbortSignal.timeout(3000),
          maxContentLength: 64 * 1024,
          maxBodyLength: 32 * 1024,
        });
        if (response.data?.success !== true) throw new Error('Sheet did not acknowledge the copy.');
      } catch {
        // The message is already durable; a failed optional copy must not invite resubmission.
        logger.warn('Google Sheets copy failed; the message remains saved in MongoDB.');
      }
    },
  };
}

module.exports = { createStorage, mongoOptions };
