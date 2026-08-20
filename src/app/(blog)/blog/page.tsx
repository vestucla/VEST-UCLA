"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

// Mock data - replace with your CMS data
const blogPosts = [
  {
    id: 1,
    title: "Understanding Venture Capital",
    excerpt:
      "A comprehensive guide to understanding how venture capital works...",
    date: "2024-01-15",
    image: "/blog/vc-101.jpg",
    category: "Education",
  },
  {
    id: 2,
    title: "Top Startup Trends in 2024",
    excerpt:
      "Exploring the most promising startup trends that are shaping the future...",
    date: "2024-01-10",
    image: "/blog/trends.jpg",
    category: "Trends",
  },
  // Add more mock posts
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <Header>
          <h1>
            VEST <span className="italic">Blog</span>
          </h1>
          <p>Insights from UCLA&apos;s premier Startup community</p>
        </Header>

        <SearchBar>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <Categories>
          {["All", "Education", "Trends", "Startups", "VC"].map((category) => (
            <CategoryButton
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </Categories>

        <BlogGrid>
          {filteredPosts.map((post) => (
            <BlogCard key={post.id}>
              <Link href={`/blog/${post.id}`}>
                <ImageContainer>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </ImageContainer>
                <CardContent>
                  <Category>{post.category}</Category>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </CardContent>
              </Link>
            </BlogCard>
          ))}
        </BlogGrid>
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
  max-width: 1236px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;

  h1 {
    font-family: var(--header-font-regular);
    font-size: var(--header-size-page);
    font-weight: 400;
    line-height: 1;
    margin-bottom: 24px;
    background: var(--header-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    .italic {
      font-family: var(--header-font-italic);
      font-style: italic;
      font-weight: 400;
    }
  }

  p {
    color: rgba(239, 239, 239, 0.8);
    font-size: var(--text-xxl);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
    
    h1 {
      font-size: var(--header-size-page-mobile);
    }
    p {
      font-size: var(--text-lg);
    }
  }
`;

const SearchBar = styled.div`
  margin-bottom: 32px;

  input {
    width: 100%;
    padding: 16px 24px;
    border-radius: 16px;
    border: 1px solid rgba(239, 239, 239, 0.1);
    background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
    color: #efefef;
    font-size: var(--text-lg);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &::placeholder {
      color: rgba(239, 239, 239, 0.5);
    }

    &:focus {
      outline: none;
      border-color: rgb(0, 140, 255);
      box-shadow: 0 0 20px rgba(0, 140, 255, 0.2);
    }
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => (props.$active ? "rgb(0, 140, 255)" : "rgba(239, 239, 239, 0.2)")};
  background: ${(props) => (props.$active ? "linear-gradient(180deg, #0074e1 0%, #1f00ff 100%)" : "transparent")};
  color: #efefef;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$active ? "0px 0px 20px 0px rgba(120, 67, 255, 0.5)" : "none")};

  &:hover {
    border-color: rgb(0, 140, 255);
    transform: translateY(-2px);
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BlogCard = styled.article`
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  padding: 24px;

  h2 {
    font-size: var(--text-xxl);
    font-weight: 600;
    line-height: 1.5;
    margin: 8px 0 16px;
    color: #efefef;
  }

  p {
    color: rgba(239, 239, 239, 0.7);
    font-size: var(--text-base);
    line-height: 1.5;
  }
`;

const Category = styled.span`
  color: rgb(0, 140, 255);
  font-size: var(--text-sm);
  font-weight: 500;
`;

export default BlogPage;
