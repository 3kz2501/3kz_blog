import { readFile, writeFile } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";

const MIN_TITLE_LENGTH = 1;
const MIN_DESCRIPTION_LENGTH = 1;
const POSTS_DIR = "./app/routes/posts";
const PAGES_DIR = "./app/routes/pages";
const __dirname = resolve();
const templatePath = join(__dirname, "./app/libs/posts/template.mdx");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Main function to generate a new blog post or page.
 */
function generatePost() {
  function askTitle() {
    rl.question("title: ", (title) => {
      if (title.length < MIN_TITLE_LENGTH) {
        console.error("Please enter a title");
        askTitle();
      } else {
        askDescription(title);
      }
    });
  }

  /**
   * Asks the user for the description of the post and validates the input.
   */
  function askDescription(title) {
    rl.question("description: ", (description) => {
      if (description.length < MIN_DESCRIPTION_LENGTH) {
        console.error("Please enter a description");
        askDescription(title);
      } else {
        askCategories(title, description);
      }
    });
  }

  /**
   * Asks the user for categories for the post.
   */
  function askCategories(title, description) {
    rl.question(
      "categories (comma separated, e.g. rust,programming,tech): ",
      (categoriesInput) => {
        let categories = ["general"];
        if (categoriesInput.trim()) {
          categories = categoriesInput.split(",").map((cat) => cat.trim());
        }
        askIsPage(title, description, categories);
      },
    );
  }

  /**
   * Asks the user if this is a page or a blog post.
   */
  function askIsPage(title, description, categories) {
    rl.question("Is this a page? (y/n, default: n): ", (isPage) => {
      const isPageValue = isPage.toLowerCase() === "y";
      askFilePath(title, description, categories, isPageValue);
    });
  }

  /**
   * Asks the user for the file path where the post should be saved.
   * Uses a generated filename based on the date if the input is left blank.
   */
  function askFilePath(title, description, categories, isPage) {
    rl.question("filepath (leave blank for default): ", (inputPath) => {
      let filename;
      if (inputPath.trim() === "") {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
        filename = `generated-${isPage ? "page" : "post"}-${date.replace(
          /\//g,
          "-",
        )}.mdx`;
      } else {
        filename = `${inputPath}.mdx`;
      }

      // Determine the directory based on whether this is a page or a post
      const directory = isPage ? PAGES_DIR : POSTS_DIR;

      writePost(title, description, categories, filename, directory, isPage);
    });
  }

  function writePost(
    title,
    description,
    categories,
    filename,
    directory,
    isPage,
  ) {
    const filePath = join(__dirname, `${directory}/${filename}`);

    // 現在の日付を yyyy/mm/dd 形式で取得
    const currentDate = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");

    readFile(templatePath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      // テンプレートのプレースホルダを実際の値に置き換え
      const categoriesJson = JSON.stringify(categories);
      const updatedData = data
        .replace(/{{title}}/g, title)
        .replace(/{{description}}/g, description)
        .replace(/{{date}}/g, currentDate)
        .replace(/\["general"\]/, categoriesJson)
        .replace(/page: false/, `page: ${isPage}`);

      writeFile(filePath, updatedData, (err) => {
        if (err) {
          throw err;
        }
        console.log(
          `🎉 Successfully created ${filename} as a ${
            isPage ? "page" : "post"
          } with title, description, categories, and date! 🎉`,
        );
        rl.close();
      });
    });
  }

  askTitle();
}

generatePost();
