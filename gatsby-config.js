module.exports = {
  siteMetadata: {
    title: "Gatsby Default Starter"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-remark-copy-linked-files"]
      }
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `c13roiy3qazu`,
        accessToken: `5e51869f232a40b0944897df939db19648be79ff0299d7ffd07fd82e4d9eff06`
      }
    }
  ]
};
