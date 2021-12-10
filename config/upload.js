export default {
  maxUploadSize: 10 * 1024 * 1024, // 10 Mb
  bucket: process.env.AWS_BUCKET || 'jobboard-epitech',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID
}