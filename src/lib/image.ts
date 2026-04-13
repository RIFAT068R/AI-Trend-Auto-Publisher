export type ImagePlaceholder = {
  provider: string;
  message: string;
};

export async function getImagePlaceholder(): Promise<ImagePlaceholder> {
  return {
    provider: "placeholder",
    message: "Image generation module is ready for a real API connection."
  };
}
