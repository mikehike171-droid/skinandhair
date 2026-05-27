declare namespace Express {
  namespace Multer {
    interface File {
      /** Name of the form field associated with this file. */
      fieldname: string;
      /** Name of the file on the uploader's computer. */
      originalname: string;
      /** Value of the `Content-Transfer-Encoding` header for this file. */
      encoding: string;
      /** Value of the `Content-Type` header for this file. */
      mimetype: string;
      /** Size of the file in bytes. */
      size: number;
      /** `DiskStorage` only: The folder to which the file has been saved. */
      destination: string;
      /** `DiskStorage` only: The name of the file within the `destination`. */
      filename: string;
      /** `DiskStorage` only: The full path to the uploaded file. */
      path: string;
      /** `MemoryStorage` only: A Buffer containing the entire file. */
      buffer: Buffer;
    }
  }
}
