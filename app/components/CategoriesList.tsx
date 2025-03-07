import type { FC } from "hono/jsx";
import CategoryLabel from "./CategoryLabel";

type CategoriesListProps = {
  categories: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
};

const CategoriesList: FC<CategoriesListProps> = ({
  categories,
  size = "md",
  className = "",
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <CategoryLabel key={category} category={category} size={size} />
      ))}
    </div>
  );
};

export default CategoriesList;
