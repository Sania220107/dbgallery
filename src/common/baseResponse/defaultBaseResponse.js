const defaultBaseResponse = (
  statusCode,
  success,
  message,
  data = null,
  error = null
) => {
  return {
    statusCode, // kode status HTTP
    success, // Status keberhasilan
    message, // Pesan yang menjelaskan respons
    data, // Data yang dikembalikan (bisa null)
    error, // Informasi kesalahan (bisa null)
    timestamp: new Date().toISOString(), // waktu saat respones dibuat
  };
};

module.exports = defaultBaseResponse;