// app/components/Card.tsx
import type { FC } from "hono/jsx";

const Card: FC<any> = (props) => {
  // This component exists only to satisfy any lingering import references
  // It will not actually be used in your MDX file since you've replaced it with inline JSX
  return <>{props.children}</>;
};

export default Card;
