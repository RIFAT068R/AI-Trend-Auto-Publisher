export type PostPlaceholder = {
  provider: string;
  message: string;
};

export async function getPostPlaceholder(): Promise<PostPlaceholder> {
  return {
    provider: "placeholder",
    message: "Posting module is ready for your publishing destination."
  };
}
