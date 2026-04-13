export type MetadataPlaceholder = {
  provider: string;
  message: string;
};

export async function getMetadataPlaceholder(): Promise<MetadataPlaceholder> {
  return {
    provider: "placeholder",
    message: "AI metadata generation module is ready for future integration."
  };
}
