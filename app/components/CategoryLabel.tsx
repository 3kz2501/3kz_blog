import type { FC } from "hono/jsx";

type CategoryLabelProps = {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const CategoryLabel: FC<CategoryLabelProps> = ({
  category,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const href = `/categories/${encodeURIComponent(category)}`;
  const classes = `inline-block rounded-full bg-black border border-jade-dark text-jade-light hover:bg-jade-dark hover:text-black transition-colors ${sizeClasses[size]} ${className}`;

  return (
    <a href={href} className={classes}>
      {category}
    </a>
  );
};

export default CategoryLabel;
