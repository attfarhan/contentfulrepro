import Link from "gatsby-link";
import * as React from "react";
import { Helmet } from "react-helmet";

export default class ContentTemplate extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (document) {
      document
        .getElementsByTagName("body")[0]
        .setAttribute("style", "background-image:none");
    }

    if (window.location.pathname.includes("/docs/server")) {
      const results = document.getElementsByClassName("see-result");
      const res = Array.from(results);
      if (res.length > 0) {
        res.map(el => {
          el.addEventListener("click", () => {
            this.toggleCodeBlock(el);
          });
        });
      }
    }
  }

  toggleCodeBlock(el) {
    const sibling = el.nextElementSibling;
    const style = sibling.getAttribute("style");
    if (style === "display:none") {
      el.nextElementSibling.setAttribute("style", "display:block");
    } else if (style === "display:block") {
      el.nextElementSibling.setAttribute("style", "display:none");
    }
  }

  render() {
    const md = this.props.data.markdownRemark;
    const content = md.html;
    const excerpt = md.excerpt;
    const title = md.frontmatter.title;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={excerpt} />
          <meta property="og:description" content={excerpt} />
          <meta name="description" content={excerpt} />
        </Helmet>
        <section className="tc pv4">
          <h1 className="tc mt0">{title}</h1>
        </section>
        <section className="bg-light-12 pa3">
          <div
            className="measure-wide center"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      </div>
    );
  }
}

export const pageQuery = graphql`
  query contentTemplate($fileSlug: String) {
    markdownRemark(fields: { slug: { eq: $fileSlug } }) {
      frontmatter {
        title
      }
      html
      excerpt
      fields {
        slug
      }
    }
  }
`;
