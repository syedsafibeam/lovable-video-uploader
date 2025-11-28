/**
 * UploadThing Configuration
 * 
 * To complete the setup:
 * 
 * 1. Create an UploadThing account at https://uploadthing.com
 * 2. Get your API keys from the dashboard
 * 3. Add your keys as secrets in Lovable:
 *    - UPLOADTHING_SECRET
 *    - UPLOADTHING_APP_ID
 * 
 * 4. Create an edge function for the upload endpoint:
 *    File: supabase/functions/uploadthing/index.ts
 * 
 *    import { createUploadthing } from "uploadthing/server";
 * 
 *    const f = createUploadthing();
 * 
 *    export const uploadRouter = {
 *      videoUploader: f({
 *        video: { maxFileSize: "512MB", maxFileCount: 1 },
 *      }).onUploadComplete(async ({ file }) => {
 *        console.log("Upload complete:", file.url);
 *        return { url: file.url };
 *      }),
 *    };
 * 
 *    Deno.serve(async (req) => {
 *      const { createRouteHandler } = await import("uploadthing/server");
 *      const handler = createRouteHandler({ router: uploadRouter });
 *      return handler(req);
 *    });
 * 
 * 5. Update the API endpoint in Index.tsx with your actual API URL
 */

export const UPLOADTHING_CONFIG = {
  endpoint: "/api/uploadthing" as const,
  maxFileSize: "512MB" as const,
  maxFileCount: 1 as const,
};
