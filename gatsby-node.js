const _ = require("lodash");
const parseFilePath = require("parse-filepath");
const path = require("path");
const slash = require("slash");
const { kebabCase, uniq, get, compact, times } = require("lodash");
const { GraphQLString } = require(`graphql`);

// Don't forget to update hard code values into:
// - `templates/blog-page.tsx:23`
// - `pages/blog.tsx:26`
// - `pages/blog.tsx:121`
// const POSTS_PER_PAGE = 10;
// const cleanArray = arr => compact(uniq(arr));
function kebabcase(str) {
  result = str.toLowerCase();

  // Convert non-alphanumeric characters to hyphens
  result = result.replace(/[^-'a-z0-9]+/g, "-");
  result = result.replace(/'/, "");
  // Remove hyphens from both ends
  result = result.replace(/^-+/, "").replace(/-$/, "");

  result = result.replace(/(-)\1{1,}/, "-");

  return result;
}
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const PostTemplate = path.resolve(`src/templates/blogPostTemplate.jsx`);
    const ContentTemplate = path.resolve(`src/templates/contentTemplate.jsx`);
    resolve(
      graphql(
        `
          {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    title
                    permalink
                  }
                  fields {
                    slug
                  }
                  fileAbsolutePath
                }
              }
            }
          }
        `
      )
        .then(result => {
          if (result.errors) {
            reject(result.errors);
          }

          result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            if (node.fileAbsolutePath) {
              const slug = node.fields.slug;
              const absPath = node.fileAbsolutePath.split("/");
              createPage({
                path: slug,
                component: ContentTemplate,
                context: {
                  path: slug,
                  fileSlug: node.fields.slug
                }
              });
            }
          });
        })
        .then(() => {
          graphql(
            `
              {
                allContentfulBlogPost {
                  edges {
                    node {
                      id
                      tags
                      slug
                    }
                  }
                }
              }
            `
          ).then(result => {
            _.each(result.data.allContentfulBlogPost.edges, edge => {
              if (edge.node.tags.includes("blog")) {
                createPage({
                  path: `/blog/${edge.node.slug}`,
                  component: PostTemplate,
                  context: {
                    id: edge.node.id
                  }
                });
              }
            });
          });
        })
    );
  });
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  let slug;
  switch (node.internal.type) {
    case `MarkdownRemark`:
      const fileNode = getNode(node.parent);
      if (fileNode.relativePath) {
        const parsedFilePath = parseFilePath(fileNode.relativePath);
        const name = node.frontmatter.title;
        const kebabName = kebabcase(name);
        if (
          parsedFilePath.name !== `index` &&
          parsedFilePath.dirname !== "" &&
          !node.frontmatter.permalink
        ) {
          slug = `/${parsedFilePath.dirname}/${kebabName}/`;
        } else if (
          parsedFilePath.name !== `index` &&
          !node.frontmatter.permalink
        ) {
          slug = `/${kebabName}/`;
        } else if (parsedFilePath.name !== `index`) {
          slug = node.frontmatter.permalink;
        } else {
          slug = `/${parsedFilePath.dirname}/`;
        }
      }
      break;
  }
  if (slug) {
    createNodeField({ node, name: `slug`, value: slug });
  }
};
