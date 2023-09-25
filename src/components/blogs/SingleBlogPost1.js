import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { SectionHeading } from "components/misc/Headings";
import EmptyImage from '../../images/empty-image1.png'

const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const SinglePost = tw.div`mt-6 flex flex-col`;
const Image = styled.div`
  ${props => css`
    background-image: url("${props.imageSrc}");
    height: 400px; // Adjust the height as needed
    border-bottom: none !important; // Adjust the height as needed
  `}
  ${tw`w-full bg-cover rounded-lg rounded-b-none`}
  border-bottom: none; /* Remove border bottom */
`;


const SecImage = styled.div`
  ${props => css`
    background-image: url("${props.imageSrc}");
    height: 400px !important; // Adjust the height as needed
    width: 500px !important;
    border: none !important; // Adjust the height as needed
  `}
  ${tw`w-full bg-cover bg-center rounded-lg rounded-b-none`}
  border: none; /* Remove border bottom */
`;

const SecImageContainer = styled.div`
  ${tw`w-full h-full flex justify-center items-center py-4 mt-2`}
`;
const Info = styled.div`
  ${props => css`
    border-top: none !important; // Adjust the height as needed
  `}
  ${tw`p-8 border-2 rounded-lg pt-16 rounded-t-none`}
`;
const Category = tw.div`uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content after:block after:border-b-2 after:border-primary-500 after:w-8`;
const CreationDate = tw.div`uppercase text-gray-600 italic font-semibold text-xs`;
const Title = tw.div`font-black text-2xl text-gray-900 mt-4`;
const Description = tw.div`mt-2 text-gray-600 font-medium`;

export default function SingleBlogPost1() {
    const { id } = useParams()
    const [post, setPost] = useState({})

    useEffect(() => {
        const rssFeedUrl =
            "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@1aneebiqbal";

        // Fetch the RSS feed data
        fetch(rssFeedUrl)
            .then((response) => response.json())
            .then((data) => {
                const requiredPost = data.items.find(post => formatDateTime(post.pubDate) === id)
                const parser = new DOMParser();
                const doc = parser.parseFromString(requiredPost.description, 'text/html');
                // const content = doc.querySelector('p').textContent;
                // const paragraphs = Array.from(
                //     doc.querySelectorAll("p, h3")
                // ).map((element) => ({
                //     type: element.tagName.toLowerCase(), // 'p' or 'h3'
                //     content: element.textContent,
                // }));

                let paragraphs = []
                let firstImageProcessed = false;

                const contentElements = Array.from(doc.querySelectorAll("p, h3, figure"));

                contentElements.forEach((element) => {
                    if (element.tagName.toLowerCase() === "p") {
                        paragraphs.push({ type: "p", content: element.textContent });
                    } else if (element.tagName.toLowerCase() === "h3") {
                        paragraphs.push({ type: "h3", content: element.textContent });
                    } else if (!firstImageProcessed) {
                        firstImageProcessed = true;
                    } else if (element.tagName.toLowerCase() === "figure") {
                        // If a figure is found, associate the image source with the last paragraph
                        const assImgSrs = element.querySelector("img").getAttribute("src");
                        paragraphs.push({ type: "img", content: assImgSrs });

                    }
                });
                const imgSrc = doc.querySelector('img').getAttribute('src');

                setPost({
                    ...requiredPost,
                    content: paragraphs,
                    imgSrc
                })
            })
            .catch((error) => {
                console.error("Error fetching RSS feed:", error);
            });
    }, []);

    console.log(post)

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
            {
                post ? <Container>
                    <ContentWithPaddingXl>
                        <SinglePost>
                            <Image imageSrc={validImage(post?.imgSrc) ? post?.imgSrc : EmptyImage} />
                            <Info>
                                <Category>{post && post?.categories && post?.categories?.length !== 0
                                    ? post.categories[0]
                                    : 'Random'}</Category>
                                <CreationDate>{post?.pubDate ? formatDate(post?.pubDate) : ''}</CreationDate>
                                <Title>{post?.title ? toTitleCase(post?.title) : ''}</Title>
                                {post?.content?.map((item, itemIndex) => {
                                    if (item.type === "h3") {
                                        // Render heading
                                        return <Title key={itemIndex}>{item.content}</Title>;
                                    } else if (item.type === "p") {
                                        // Render paragraph
                                        return <Description key={itemIndex}>{item.content}</Description>
                                    }
                                    else if (item.type === "img") {
                                        // Render paragraph
                                        return <SecImageContainer key={itemIndex}>
                                            <SecImage imageSrc={item.content} />
                                        </SecImageContainer>

                                    }
                                    return null; // Ignore other types
                                })}
                                {/* <Description>{post?.content ? post?.content : 'Could not load the blog'}</Description> */}
                            </Info>
                        </SinglePost>
                    </ContentWithPaddingXl>
                </Container> : null
            }
            <Footer />
        </AnimationRevealPage>
    );
}
