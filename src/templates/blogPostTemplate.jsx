import Link from "gatsby-link";
import * as React from "react";
import { Helmet } from "react-helmet";
import SocialLinks from "../components/SocialLinks";
import { eventLogger } from "../EventLogger";
import { RootQueryType } from "../graphql-types";

export default class ContentfulTemplate extends React.Component {
  constructor(props) {
    super(props);
  }

  logSelectDockercommand() {
    if (
      document.getSelection().baseNode &&
      document.getSelection().baseNode.parentNode &&
      document.getSelection().baseNode.parentNode.nodeName === "CODE" &&
      document
        .getSelection()
        .baseNode.parentNode.textContent.includes("docker run")
    ) {
      eventLogger.trackInstallServerCommandHighlighted("blog");
    }
  }

  componentDidMount() {
    if (document) {
      document
        .getElementsByTagName("body")[0]
        .setAttribute("style", "background-image:none");
      document.addEventListener("mouseup", this.logSelectDockercommand);
    }
  }

  render() {
    const md = this.props.data.contentfulBlogPost;
    const title = md.title;
    const author = md.author;
    const content = md.body.childMarkdownRemark.html;
    const date = md.publishDate;
    const excerpt = md.body.childMarkdownRemark.excerpt;
    const tags = md.tags;
    const image = `https:${md.heroImage.file.url}`;

    let slug = md.slug;
    let readMoreLink;
    if (tags.includes("graphql")) {
      slug = "graphql/" + slug;
      readMoreLink = "/graphql";
    } else if (tags.includes("gophercon") || tags.includes("dotGo")) {
      slug = "go/" + slug;
      readMoreLink = "/go";
    } else {
      slug = "blog/" + slug;
      readMoreLink = "/blog";
    }
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta
            property="og:url"
            content={`https://about.sourcegraph.com/${slug}`}
          />
          <meta property="og:description" content={excerpt} />
          <meta property="og:image" content={image} />
          <meta property="og:type" content="website" />

          <meta name="twitter:site" content="@srcgraph" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:description" content={excerpt} />
          <meta name="description" content={excerpt} />
        </Helmet>
        <div>
          <section className="tc pv4">
            <h1 className="mt0">{title}</h1>
            <p>
              By {author} on {date}
            </p>
          </section>
          <section className="bg-light-12 pa3">
            <div
              className="measure-medium center f5"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <hr className="measure-medium mt4" />
            <div className="flex flex-column measure-medium center f5 mt4">
              <div className="mb4">
                <SocialLinks
                  url={`https://about.sourcegraph.com/${slug}`}
                  title={title}
                />
              </div>
              <Link to={readMoreLink}>
                <span className="dib dim link mr3 pv2 ph3 f5 br2 ba b--blue-3 blue-5">
                  Read more posts
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export const pageQuery = graphql`
  query contentfulTemplate($id: String) {
    contentfulBlogPost(id: { eq: $id }) {
      title
      slug
      author
      heroImage {
        file {
          url
        }
      }
      tags
      publishDate(formatString: "MMMM D, YYYY")
      body {
        childMarkdownRemark {
          html
          excerpt
        }
      }
    }
  }
`;
