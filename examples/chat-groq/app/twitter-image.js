import { join } from 'path';
import { readFileSync } from 'fs';

// This is a special file that Next.js uses to generate the Twitter card image
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// This is a direct export of the binary image data
export default function Image() {
  // Read the image file directly
  const imagePath = join(process.cwd(), 'app', '(chat)', 'twitter-image.png');
  const imageData = readFileSync(imagePath);
  return new Response(imageData, {
    headers: { 'Content-Type': 'image/png' }
  });
}