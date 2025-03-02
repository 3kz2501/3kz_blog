import type { FC } from "hono/jsx";
import { LINK } from "../constants";

const SnsButton: FC<{ title: string }> = ({ title }) => {
  if (typeof window === "undefined") {
    return (
      <div class="flex items-center justify-center mt-10 gap-3">
        <div role="status" class="max-w-sm animate-pulse w-full">
          <div class="h-11 bg-gray-800 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div class="flex items-center justify-center mt-10 gap-3">
      <a
        href={`https://twitter.com/share?text=${encodeURI(title)}&url=${
          window.location.href
        }`}
        target={"_blank"}
        rel={"noreferrer"}
        class="bg-[#0f1419] text-jade-light flex items-center text-sm rounded-3xl py-3 px-4 border border-jade-dark"
      >
        <img
          src="/static/twitter-alt.svg"
          alt="xにシェアする"
          class="w-4 h-4 mr-1"
        />
        Post
      </a>
    </div>
  );
};

export default SnsButton;
