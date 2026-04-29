import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/config";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File | Buffer,
  folder: string = "storekit"
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              url: result!.secure_url,
              publicId: result!.public_id,
              width: result!.width,
              height: result!.height,
            });
        }
      )
      .end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  }
): string {
  // If it's not a Cloudinary URL, return as-is
  if (!url.includes("res.cloudinary.com")) return url;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transforms: string[] = [];
  if (options?.width || options?.height) {
    transforms.push(`w_${options.width || "auto"},h_${options.height || "auto"},c_limit`);
  }
  if (options?.quality) {
    transforms.push(`q_${options.quality}`);
  } else {
    transforms.push("q_auto");
  }
  if (options?.format) {
    transforms.push(`f_${options.format}`);
  } else {
    transforms.push("f_auto");
  }

  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}

export { cloudinary };
