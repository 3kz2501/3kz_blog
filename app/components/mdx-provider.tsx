import Card from "./Card";

export function MDXProvider({ components, children }) {
  return children;
}

export const useMDXComponents = (components) => {
  return {
    Card,
    ...components,
  };
};
