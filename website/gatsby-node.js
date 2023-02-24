const { createFilePath } = require("gatsby-source-filesystem");
const path = require("path");
const git = require("simple-git/promise");

/** @type import('gatsby').GatsbyNode["createPages"] */
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql(`
    {
      basic: allFile(
        limit: 1000
        filter: { sourceInstanceName: { eq: "basic" }, extension: { eq: "md" } }
      ) {
        pages: nodes {
          name
          relativeDirectory
          childMdx {
            fields {
              slug
            }
          }
        }
      }
      blog: allMdx(
        limit: 1000
        filter: { frontmatter: { path: { regex: "//blog(/.*)?/" } } }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        posts: nodes {
          fields {
            slug
          }
        }
        tags: group(field: frontmatter___tags) {
          fieldValue
        }
      }
      docs: allFile(
        limit: 1000
        filter: { sourceInstanceName: { eq: "docs" }, extension: { eq: "md" } }
      ) {
        pages: nodes {
          name
          relativeDirectory
          childMdx {
            fields {
              slug
            }
          }
        }
      }
      productsConfig: file(
        sourceInstanceName: { eq: "docs" }
        relativePath: { eq: "docs.json" }
      ) {
        products: childrenDocsJson {
          path
          latestStableVersion
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  createBasicPages(createPage, result.data.basic);
  createBlogArticles(createPage, result.data.blog);
  createDocPages(createPage, result.data.docs);

  const products = result.data.productsConfig.products;
  const latestHcVersion = products?.find(
    (product) => product?.path === "hotchocolate"
  )?.latestStableVersion;
  const latestSsVersion = products?.find(
    (product) => product?.path === "strawberryshake"
  )?.latestStableVersion;

  // temporary client-side redirects for missing product pages
  // need to be kept till the product pages are created
  // for SEO we have also configured redirects in NGINX
  createRedirect({
    fromPath: `/products/hotchocolate`,
    toPath: `/docs/hotchocolate/${latestHcVersion}`,
    redirectInBrowser: true,
    isPermanent: false,
  });
  createRedirect({
    fromPath: `/products/strawberryshake`,
    toPath: `/docs/strawberryshake/${latestSsVersion}`,
    redirectInBrowser: true,
    isPermanent: false,
  });
};

exports.onCreateNode = async ({ node, actions, getNode, reporter }) => {
  const { createNodeField } = actions;

  if (node.internal.type !== `Mdx`) {
    return;
  }

  // if the path is defined on the frontmatter (like for blogs) use that as slug
  let path = node.frontmatter && node.frontmatter.path;

  if (!path) {
    path = createFilePath({ node, getNode });

    const parent = getNode(node.parent);

    // if the current file is emitted from the docs directory
    if (parent && parent.sourceInstanceName === "docs") {
      path = "/docs" + path;
    }

    // remove trailing slashes
    path = path.replace(/\/+$/, "");
  }

  createNodeField({
    name: `slug`,
    node,
    value: path,
  });

  let authorName = "Unknown";
  let lastUpdated = "0000-00-00";

  // we only run "git log" when building the production bundle
  // for development purposes we fallback to dummy values
  if (process.env.NODE_ENV === "production") {
    try {
      const result = await getGitLog(node.fileAbsolutePath);
      const data = result.latest || {};

      if (data.authorName) {
        authorName = data.authorName;
      }

      if (data.date) {
        lastUpdated = data.date;
      }
    } catch (error) {
      reporter.error(
        `Could not retrieve git information for ${node.fileAbsolutePath}`,
        error
      );
    }
  }

  createNodeField({
    node,
    name: `lastAuthorName`,
    value: authorName,
  });
  createNodeField({
    node,
    name: `lastUpdated`,
    value: lastUpdated,
  });
};

function createBasicPages(createPage, data) {
  const component = path.resolve(`src/templates/basic-page-template.tsx`);

  data.pages.forEach((page) => {
    createPage({
      path: page.childMdx.fields.slug,
      component,
      context: {
        originPath: `${page.relativeDirectory}/${page.name}.md`,
      },
    });
  });
}

function createBlogArticles(createPage, data) {
  // Create Single Pages
  let component = path.resolve(`src/templates/blog-article-template.tsx`);

  data.posts.forEach((post) => {
    createPage({
      path: post.fields.slug,
      component,
      context: {},
    });
  });

  // Create List Pages
  const postsPerPage = 20;
  const numPages = Math.ceil(data.posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: path.resolve(`src/templates/blog-articles-template.tsx`),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });

  // Create Tag Pages
  component = path.resolve(`src/templates/blog-tag-template.tsx`);
  data.tags.forEach((tag) => {
    createPage({
      path: `/blog/tags/${tag.fieldValue}`,
      component,
      context: {
        tag: tag.fieldValue,
      },
    });
  });
}

function createDocPages(createPage, data) {
  const component = path.resolve(`src/templates/doc-page-template.tsx`);

  // Create Single Pages
  data.pages.forEach((page) => {
    const path = page.childMdx.fields.slug;
    const originPath = `${page.relativeDirectory}/${page.name}.md`;

    createPage({
      path,
      component,
      context: {
        originPath,
      },
    });
  });
}

function getGitLog(filepath) {
  const logOptions = {
    file: filepath,
    n: 1,
    format: {
      date: `%cs`,
      authorName: `%an`,
    },
  };

  return git().log(logOptions);
}
