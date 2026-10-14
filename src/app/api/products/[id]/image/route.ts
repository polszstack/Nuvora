import { prisma } from "@/lib/prisma";

const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#eceee4"/><g fill="none" stroke="#677867" stroke-width="4"><path d="m220 255 80-40 80 40v90l-80 40-80-40zM220 255l80 40 80-40M300 295v90"/></g><text x="300" y="440" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#677867">Image coming soon</text></svg>`;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    select: { imageUrl: true },
  });
  if (!product) return new Response(null, { status: 404 });

  const headers = {
    "Cache-Control": "public, max-age=300, s-maxage=300",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  };
  const image = product.imageUrl;
  if (image && (/^https?:\/\//i.test(image) || /^\/images\//.test(image))) {
    return new Response(null, { status: 307, headers: { ...headers, Location: image } });
  }
  const data = image?.match(/^data:(image\/(?:png|jpeg|webp|gif|avif|bmp|x-icon|vnd\.microsoft\.icon|svg\+xml));base64,([A-Za-z0-9+/=\s]+)$/);
  if (data) {
    return new Response(new Uint8Array(Buffer.from(data[2], "base64")), {
      headers: { ...headers, "Content-Type": data[1] },
    });
  }
  return new Response(placeholder, { headers: { ...headers, "Content-Type": "image/svg+xml" } });
}
