"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { ArrowLeft } from "@phosphor-icons/react";

const blogPosts = {
  1: {
    title: "Understanding Venture Capital",
    content: `
      <h2>Introduction to Venture Capital</h2>
      <p>Venture capital (VC) is a form of private equity financing that is provided by venture capital firms or funds to startups, early-stage, and emerging companies that have been deemed to have high growth potential or which have demonstrated high growth.</p>
      
      <h2>How Venture Capital Works</h2>
      <p>VCs typically invest in companies that have a novel technology or business model in high-growth industries like IT, clean technology, or biotechnology. The investment comes with active involvement in the company's operations, often including a board seat.</p>
      
      <h2>The Investment Process</h2>
      <p>The VC investment process typically includes several stages:</p>
      <ul>
        <li>Deal Sourcing</li>
        <li>Due Diligence</li>
        <li>Investment Decision</li>
        <li>Portfolio Management</li>
        <li>Exit Strategy</li>
      </ul>
    `,
    date: "2024-01-15",
    author: "John Doe",
    authorRole: "VC Associate",
    authorImage: "/team/john.jpg",
    coverImage: "/blog/vc-101.jpg",
    category: "Education",
    readTime: "5 min read",
  },
  // Add more blog posts
};

const BlogPost = () => {
  const params = useParams();
  const post = blogPosts[Number(params.id) as keyof typeof blogPosts];

  if (!post) {
    return (
      <Wrapper>
        <BackgroundGlow />
        <Inner>
          <h1>Post not found</h1>
          <BackLink href="/blog">
            <ArrowLeft size={20} weight="bold" />
            <span>Back to blog</span>
          </BackLink>
        </Inner>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <BackLink href="/blog">
          <ArrowLeft size={20} weight="bold" />
          <span>Back to blog</span>
        </BackLink>

        <Header>
          <Category>{post.category}</Category>
          <h1>{post.title}</h1>
          <MetaInfo>
            <AuthorInfo>
              <AuthorImage>
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={40}
                  height={40}
                />
              </AuthorImage>
              <div>
                <AuthorName>{post.author}</AuthorName>
                <AuthorRole>{post.authorRole}</AuthorRole>
              </div>
            </AuthorInfo>
            <PostInfo>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <Dot>•</Dot>
              <span>{post.readTime}</span>
            </PostInfo>
          </MetaInfo>
        </Header>

        <CoverImage>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </CoverImage>

        <Content dangerouslySetInnerHTML={{ __html: post.content }} />
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  padding-top: 160px;
  padding-bottom: 100px;
  position: relative;
  
  @media (max-width: 768px) {
    padding-top: 120px;
    padding-bottom: 60px;
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 0;
  left: -200px;
  width: 1600px;
  height: 800px;
  background: radial-gradient(ellipse at center, rgba(31, 0, 255, 0.15) 0%, rgba(0, 116, 225, 0.08) 40%, transparent 70%);
  pointer-events: none;
  z-index: 0;
`;

const Inner = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgb(0, 140, 255);
  margin-bottom: 32px;
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Header = styled.header`
  margin-bottom: 48px;

  h1 {
    font-family: var(--header-font-regular);
    font-size: var(--header-size-section);
    font-weight: 400;
    line-height: 1;
    margin: 16px 0 24px;
    background: var(--header-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    margin-bottom: 32px;
    
    h1 {
      font-size: var(--header-size-section-mobile);
    }
  }
`;

const Category = styled.span`
  color: rgb(0, 140, 255);
  font-size: var(--text-sm);
  font-weight: 500;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AuthorImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(0, 76, 255, 0.3) 0%, rgba(39, 0, 147, 0.3) 100%);
`;

const AuthorName = styled.div`
  font-weight: 500;
  color: #efefef;
`;

const AuthorRole = styled.div`
  color: rgba(239, 239, 239, 0.7);
  font-size: var(--text-sm);
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(239, 239, 239, 0.7);
  font-size: var(--text-sm);
`;

const Dot = styled.span`
  color: rgba(239, 239, 239, 0.5);
`;

const CoverImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 48px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);

  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 32px;
  }
`;

const Content = styled.div`
  color: #efefef;
  font-size: var(--text-lg);
  line-height: 1.5;

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.5;
    margin: 48px 0 24px;
    color: #efefef;
  }

  p {
    margin-bottom: 24px;
    color: rgba(239, 239, 239, 0.8);
  }

  ul {
    margin: 16px 0 24px 32px;
    color: rgba(239, 239, 239, 0.8);

    li {
      margin-bottom: 8px;
    }
  }

  @media (max-width: 768px) {
    font-size: var(--text-base);

    h2 {
      font-size: 1.375rem;
      margin: 32px 0 16px;
    }
  }
`;

export default BlogPost;
