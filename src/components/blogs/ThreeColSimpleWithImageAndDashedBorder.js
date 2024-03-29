import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading as HeadingTitle,
  Subheading,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { ReactComponent as UserIcon } from "feather-icons/dist/icons/user.svg";
import { ReactComponent as TagIcon } from "feather-icons/dist/icons/tag.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/svg-decorator-blob-3.svg";
import { } from "react-router-dom";
import EmptyImage from '../../images/empty-image.png'
// const DOMPurify = require("dompurify");

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const ThreeColumn = tw.div`flex flex-col items-center lg:items-stretch lg:flex-row flex-wrap`;
const Column = tw.div`mt-24 lg:w-1/3`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;
const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center max-w-sm`;

const Card = tw.div`lg:mx-4 xl:mx-8 max-w-sm flex flex-col h-full`;
const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`bg-cover h-80 lg:h-64 rounded rounded-b-none`,
]);

const Details = tw.div`p-6 rounded border-2 border-t-0 rounded-t-none border-dashed border-black flex-1 flex flex-col items-center text-center lg:block lg:text-left`;
const MetaContainer = tw.div`flex items-center`;
const Meta = styled.div`
  ${tw`text-secondary-100 font-medium text-sm flex items-center leading-none mr-6 last:mr-0`}
  svg {
    ${tw`w-4 h-4 mr-1`}
  }
  ${props =>
    props.uppercase &&
    css`
      text-transform: uppercase;
    `}
`;

const Title = tw.h5`mt-4 leading-snug font-bold text-lg`;
const Description = tw.p`mt-2 text-sm text-secondary-100`;
const ReadMoreLink = styled(PrimaryButtonBase)`
  ${tw`inline-block mt-4 text-sm font-semibold cursor-pointer`}
`;

const DecoratorBlob1 = tw(
  SvgDecoratorBlob1
)`-z-10 absolute bottom-0 right-0 w-48 h-48 transform translate-x-40 -translate-y-8 opacity-25`;
const DecoratorBlob2 = tw(
  SvgDecoratorBlob2
)`-z-10 absolute top-0 left-0 w-48 h-48 transform -translate-x-32 translate-y-full opacity-25`;

export default ({
  subheading = "Blogs",
  heading = (
    <>
      We Love <span tw="text-black">Writing.</span>
    </>
  ),
  description = "Some amazing blog posts that are written by even more amazing people.",
}) => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([]);

  // useEffect(() => {
  //   const rssFeedUrl =
  //     "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@1aneebiqbal";

  //   // Fetch the RSS feed data
  //   fetch(rssFeedUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // Handle the fetched data here
  //       setBlogs(data.items.map((post) => {
  //         // Parse the HTML string for each post
  //         const parser = new DOMParser();
  //         const doc = parser.parseFromString(post.content, 'text/html');
  //         const content = doc.querySelector('p').textContent;
  //         const imgSrc = doc.querySelector('img').getAttribute('src');
  //         console.log(post.categories[0])

  //         return {
  //           ...post,
  //           content,
  //           imgSrc,
  //         };
  //       }));
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching RSS feed:", error);
  //     });
  // }, []);

  useEffect(() => {
    const rssFeedUrl =
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@1aneebiqbal";

    // Fetch the RSS feed data
    fetch(rssFeedUrl)
      .then((response) => response.json())
      .then((data) => {
        // Handle the fetched data here
        setBlogs(data.items.map((post) => {
          // Parse the HTML string for each post
          const parser = new DOMParser();
          const doc = parser.parseFromString(post.content, 'text/html');
          const content = doc.querySelector('p').textContent;
          const imgSrc = doc.querySelector('img').getAttribute('src');
          return {
            ...post,
            content,
            imgSrc,
          };
        }).sort((a, b) => {
          // Convert the pubDate strings to Date objects for comparison
          const dateA = new Date(a.pubDate);
          const dateB = new Date(b.pubDate);

          // Sort in descending order (most recent first)
          return dateB - dateA;
        }));
      })
      .catch((error) => {
        console.error("Error fetching RSS feed:", error);
      });
  }, []);


  const validImage = (str) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"]; // Add more extensions if needed
    return imageExtensions.some((ext) => str?.endsWith(ext));
  };

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.slice(0, length) + "...";
  };

  const formatDateTime = (dateTimeString) => {
    if (dateTimeString) {
      return dateTimeString
        .replace(/-/g, "") // Remove hyphens
        .replace(/ /g, "") // Remove spaces
        .replace(/:/g, ""); // Remove colons
    }
  }

  function toTitleCase(str) {
    if (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }

  return (
    <Container>
      <Content>
        <HeadingInfoContainer>
          {subheading && <Subheading>{subheading}</Subheading>}
          <HeadingTitle>{heading}</HeadingTitle>
          <HeadingDescription>{description}</HeadingDescription>
        </HeadingInfoContainer>
        <ThreeColumn>
          {blogs ? blogs.slice(0, 3).map((post, index) => (
            <Column key={index}>
              <Card>
                <Image imageSrc={validImage(post?.imgSrc) ? post?.imgSrc : EmptyImage} />
                <Details>
                  <MetaContainer>
                    <Meta>
                      <UserIcon />
                      <div>{post?.author}</div>
                    </Meta>
                    <Meta uppercase>
                      <TagIcon />
                      <p>{post?.categories?.length !== 0 ? post?.categories[0] : 'Random'}</p>
                    </Meta>
                  </MetaContainer>
                  <Title>{post?.title ? toTitleCase(post?.title) : ''}</Title>
                  <Description>{truncateText(post?.content, 100)}</Description>
                  <ReadMoreLink onClick={() => navigate(`/blogs/${formatDateTime(post.pubDate)}`)}>
                    Read More
                  </ReadMoreLink>
                </Details>
              </Card>
            </Column>
          )) : null}

        </ThreeColumn>
      </Content>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
