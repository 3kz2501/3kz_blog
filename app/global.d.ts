import {} from "hono";

type Head = {
  title?: string;
  description?: string;
  frontmatter?: {
    title?: string;
    description?: string;
    date?: string;
    published?: boolean;
    tags?: string[];
    [key: string]: unknown;
  };
};

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: interface required for module augmentation
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>;
  }
}
