import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { SectionHeading } from "components/misc/Headings";

const HeadingRow = tw.div`flex`;
const Heading = tw(SectionHeading)`text-gray-900`;
const SinglePost = tw.div`mt-6 flex flex-col`;
const Image = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 w-full bg-cover bg-center rounded-lg`}
`;
const Info = tw.div`p-8 border-2 rounded-lg`;
const Category = tw.div`uppercase text-primary-500 text-xs font-bold tracking-widest leading-loose after:content after:block after:border-b-2 after:border-primary-500 after:w-8`;
const CreationDate = tw.div`mt-4 uppercase text-gray-600 italic font-semibold text-xs`;
const Title = tw.div`mt-1 font-black text-2xl text-gray-900`;
const Description = tw.div`mt-4 text-gray-600 font-medium`;

const sampleData = {
    imageSrc:
        "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
    category: "Travel Tips",
    date: "April 21, 2020",
    title: "Safely Travel in Foreign Countries",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

export default function SingleBlogPost() {
    const { imageSrc, category, date, title, description } = sampleData;

    return (
        <AnimationRevealPage>
            <Header />
            <Container>
                <ContentWithPaddingXl>
                    <SinglePost>
                        <Image imageSrc={imageSrc} />
                        <Info>
                            <Category>{category}</Category>
                            <CreationDate>{date}</CreationDate>
                            <Title>{title}</Title>
                            <Description>{description}</Description>
                        </Info>
                    </SinglePost>
                </ContentWithPaddingXl>
            </Container>
            <Footer />
        </AnimationRevealPage>
    );
}
