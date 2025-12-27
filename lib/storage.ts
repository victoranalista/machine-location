import { Storage } from '@google-cloud/storage';

export const uploadFile = async (
  fileBuffer: Buffer,
  path: string,
  contentType: string,
  cacheControl = 'public, max-age=31536000'
): Promise<string> => {
  const bucket = getBucket();
  const blob = bucket.file(path);
  await blob.save(fileBuffer, {
    contentType,
    metadata: { cacheControl }
  });
  return `gs://${bucket.name}/${path}`;
};

const getBucket = () => {
  const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  if (!bucketName) throw new Error('GOOGLE_CLOUD_BUCKET_NAME não configurado');
  return getStorage().bucket(bucketName);
};

const getStorage = () => {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const serviceAccountKey = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY;
  if (!projectId) throw new Error('GOOGLE_CLOUD_PROJECT_ID não configurado');
  if (!serviceAccountKey)
    throw new Error('GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY não configurado');
  const credentials = JSON.parse(
    Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
  );
  return new Storage({ projectId, credentials });
};

export const getSignedUrl = async (
  path: string,
  expiresInMinutes = 15
): Promise<string> => {
  const bucket = getBucket();
  const blob = bucket.file(path);
  const [url] = await blob.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000
  });
  return url;
};

export const deleteFile = async (path: string): Promise<void> => {
  const bucket = getBucket();
  const blob = bucket.file(path);
  const [exists] = await blob.exists();
  if (exists) await blob.delete();
};

export const extractPathFromGsUrl = (gsUrl: string): string | null => {
  const match = gsUrl.match(/gs:\/\/[^/]+\/(.+)$/);
  return match?.[1] || null;
};

export const validateFileBuffer = (
  buffer: Buffer,
  options: {
    allowedMimeTypes: string[];
    maxSizeBytes: number;
    mimeType: string;
  }
): void => {
  if (!options.allowedMimeTypes.includes(options.mimeType))
    throw new Error(
      `Tipo de arquivo não permitido. Permitidos: ${options.allowedMimeTypes.join(', ')}`
    );
  if (buffer.length > options.maxSizeBytes) {
    const maxSizeMB = (options.maxSizeBytes / (1024 * 1024)).toFixed(2);
    throw new Error(`Arquivo deve ter no máximo ${maxSizeMB}MB`);
  }
};
