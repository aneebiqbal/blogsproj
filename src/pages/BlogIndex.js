import React, { useState, useEffect } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton } from "components/misc/Buttons";
import EmptyImage from '../images/empty-image.png'
import { Link } from "react-router-dom";

const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const Posts = tw.div`mt-6 sm:-mr-8 flex flex-wrap`;
const PostContainer = styled.div`
  ${tw`mt-10 w-full sm:w-1/2 lg:w-1/3 sm:pr-8`}
  ${props =>
    props.featured &&
    css`
      ${tw`w-full!`}
      ${Post} {
        ${tw`sm:flex-row! h-full sm:pr-4`}
      }
      ${Image} {
        ${tw`sm:h-96 sm:min-h-full sm:w-1/2 lg:w-2/3 sm:rounded-t-none sm:rounded-l-lg`}
      }
      ${Info} {
        ${tw`sm:-mr-4 sm:pl-8 sm:flex-1 sm:rounded-none sm:rounded-r-lg sm:border-t-2 sm:border-l-0`}
      }
      ${Description} {
        ${tw`text-sm mt-3 leading-loose text-gray-600 font-medium`}
      }
    `}
`;
const Post = tw.div`cursor-pointer flex flex-col bg-gray-100 rounded-lg`;
const Image = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 w-full bg-cover rounded-t-lg`}
`;
const Info = tw.div`p-8 border-2 border-t-0 rounded-lg rounded-t-none`;
const Category = tw.div`uppercase text-black text-xs font-bold tracking-widest leading-loose after:content after:block after:border-b-2 after:border-black after:w-8`;
const CreationDate = tw.div`mt-4 uppercase text-gray-600 italic font-semibold text-xs`;
const Title = tw.div`mt-1 font-black text-2xl text-gray-900 group-hover:text-black transition duration-300`;
const Description = tw.div``;

const ButtonContainer = tw.div`flex justify-center`;
const LoadMoreButton = tw(PrimaryButton)`mt-16 mx-auto`;

export default ({
  headingText = "Blog Posts",
}) => {

  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(7);
  const onLoadMoreClick = () => {
    setVisible(v => v + 6);
  };

  useEffect(() => {
    const rssFeedUrl =
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@1aneebiqbal";

    // Fetch the RSS feed data
    fetch(rssFeedUrl)
      .then((response) => response.json())
      .then((data) => {
        // Handle the fetched data here
        setPosts(data.items.map((post, index) => {
          // Parse the HTML string for each post
          const parser = new DOMParser();
          const doc = parser.parseFromString(post.content, 'text/html');
          const content = doc.querySelector('p').textContent;
          const imgSrc = doc.querySelector('img').getAttribute('src');

          const isFeatured = index === 0;
          return {
            ...post,
            content,
            imgSrc,
            isFeatured
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

  const formatDateTime = (dateTimeString) => {
    if (dateTimeString) {
      return dateTimeString
        .replace(/-/g, "") // Remove hyphens
        .replace(/ /g, "") // Remove spaces
        .replace(/:/g, ""); // Remove colons
    }
  }

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.slice(0, length) + "...";
  };

  const formatDate = (date) => {
    if (date) {
      const newDate = new Date(date)
      const options = { year: "numeric", month: "short", day: "numeric" };
      return newDate.toLocaleDateString(undefined, options);
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
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <HeadingRow>
            <Heading>{headingText}</Heading>
          </HeadingRow>
          {posts ?
            <>
              <Posts>
                {posts.slice(0, visible).map((post, index) => (
                  <PostContainer key={index} featured={post?.isFeatured}>
                    <Link to={`/blogs/${formatDateTime(post?.pubDate)}`}>
                      <Post className="group">
                        <Image imageSrc={validImage(post?.imgSrc) ? post?.imgSrc : EmptyImage} />
                        <Info>
                          <Category>{post?.categories?.length !== 0 ? post?.categories[0] : 'Random'}</Category>
                          <CreationDate>{formatDate(post?.pubDate)}</CreationDate>
                          <Title>{post?.title ? toTitleCase(post?.title) : ''}</Title>
                          {post?.isFeatured && post?.content && <Description>{truncateText(post.content, 300)}</Description>}
                        </Info>
                      </Post>
                    </Link>
                  </PostContainer>
                ))}
              </Posts>
              {visible < posts.length && (
                <ButtonContainer>
                  <LoadMoreButton onClick={onLoadMoreClick}>Load More</LoadMoreButton>
                </ButtonContainer>
              )}
            </>
            : null}

        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
