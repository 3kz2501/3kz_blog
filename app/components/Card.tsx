// app/components/Card.tsx
import type { FC } from "hono/jsx";

type CardProps = {
  url: string;
  img: string;
  title: string;
  children?: any;
};

const Card: FC<CardProps> = ({ url, img, title, children }) => {
  return (
    <div className="card my-6 border border-jade-dark rounded-lg overflow-hidden bg-black">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-4">
          <a href={url} target="_blank" rel="noreferrer">
            <img
              src={img}
              alt={title}
              className="w-full h-auto object-cover rounded-md"
            />
          </a>
        </div>
        <div className="md:w-2/3 p-4">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-jade-light text-xl font-bold underline mb-2 block"
          >
            {title}
          </a>
          <div className="text-jade mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
