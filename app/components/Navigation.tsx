import { FC } from "hono/jsx";

const Navigation: FC = () => {
  return (
    <nav>
      <ul class="flex space-x-4">
        <li>
          <a href="/pages/profile" class="text-jade hover:text-jade-light">
            Profile
          </a>
        </li>
        <li>
          <a
            href="/feed.xml"
            class="text-jade hover:text-jade-light"
            title="RSS Feed"
          >
            RSS
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
