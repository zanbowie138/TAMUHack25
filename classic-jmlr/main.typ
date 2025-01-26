#import "@preview/classic-jmlr:0.4.0": jmlr
#import "blindtext.typ": blindtext, blindmathpaper

#let affls = (
  one: (
    department: "Department of Computer Science and Engineering",
    institution: "Texas A&M University", 
    location: "College Station, TX 77840",
    country: "USA"),
)

#let authors = (
  (name: "TAMUHack Team",
   affl: "one",
   email: "team@tamu.edu"),
)

#show: jmlr.with(
  title: [Sentiment Analysis System Using LangChain and Arize],
  authors: (authors, affls),
  abstract: [
    We present an integrated system for analyzing customer car reviews using LangChain for orchestration and Arize for monitoring. The system processes natural language reviews to extract sentiment, categorize feedback, and provide actionable insights. By combining LangChain's structured chains with OpenAI's language models and Arize's observability tools, we achieve robust analysis with comprehensive monitoring capabilities. Our implementation demonstrates effective sentiment classification, consistent output formatting, and scalable review processing while maintaining production reliability.
  ],
 keywords: ("LangChain", "Arize", "sentiment analysis", "MLOps", "monitoring", "OpenAI"),
  bibliography: bibliography("main.bib"),
  appendix: include "appendix.typ",
  pubdata: (
    id: "24-0001",
    editor: "TAMU Hackathon",
    volume: 1,
    submitted-at: datetime(year: 2025, month: 1, day: 25),
    revised-at: datetime(year: 2025, month: 1, day: 25),
    published-at: datetime(year: 2025, month: 1, day: 26),
  ),
)

= Introduction

Our system addresses the challenge of analyzing customer car reviews at scale while maintaining high accuracy and operational visibility. The implementation leverages LangChain's structured prompting capabilities with OpenAI's language models and Arize's monitoring to create a robust pipeline for sentiment analysis and insight extraction.

= System Architecture

== LangChain Implementation
The core of our system uses LangChain's chain architecture to structure interactions with OpenAI's models. We implement a ReviewAnalyzer class that processes reviews through carefully crafted prompt templates and Pydantic models for consistent output formatting. The system uses zero-temperature inference to ensure deterministic outputs and employs structured prompting to guide the model toward specific analysis patterns.

== Data Processing Pipeline
Our implementation processes reviews through multiple stages:
1. Initial review collection and preprocessing
2. Categorization by vehicle aspects (performance, safety, etc.)
3. Sentiment analysis using LangChain chains
4. Structured output generation with Pydantic validation
5. Frontend visualization using spider charts and interactive components

== Monitoring and Observability
We integrate Arize's Phoenix framework for comprehensive monitoring:
- Distributed tracing for request flows
- Performance metrics collection
- Model output validation
- Error tracking and alerting

The monitoring setup includes:
- Real-time performance dashboards
- Custom metric tracking for model latency and throughput
- Automated alerting thresholds for error rates
- Historical trend analysis for model drift detection
- Integration with existing DevOps tooling


== OpenAI Integration
The system leverages OpenAI's language models through a structured interface, ensuring consistent output formatting using Pydantic models:
- Custom ReviewAnalysis schema for structured outputs
- Zero-temperature inference for deterministic results
- Prompt templating for consistent model interactions
- Error handling with graceful fallbacks
- Rate limiting and request batching for efficiency

== Arize Monitoring
We implement comprehensive monitoring using Arize's Phoenix framework:
- Model performance tracking across different review categories
- Latency and throughput metrics for each analysis stage
- Input/output distribution monitoring
- Custom dashboards for sentiment analysis accuracy
- Automated reporting for stakeholder updates

#set math.equation(numbering: none)  // There are no numbers in sample paper.
#blindmathpaper

Here is a citation @chow68.


= Results and Analysis

Our system demonstrates robust performance across several key metrics:

== Sentiment Analysis Accuracy
The implementation shows strong performance in categorizing reviews:
- Precise positive/negative mention counting
- Contextual sentiment understanding
- Representative quote extraction
- Category-specific insight generation

== Frontend Visualization
The system presents analysis results through:
- Interactive spider charts showing category performance
- Detailed review breakdowns with sentiment scores
- Quote highlighting for key insights
- Real-time analysis updates

== Scalability and Performance
The architecture handles varying loads efficiently:
- Batch processing capabilities
- Structured output caching
- Optimized API interactions
- Robust error handling

= Future Work

Planned improvements include:
- Enhanced multi-language support
- More granular sentiment analysis
- Advanced bias detection
- Expanded monitoring metrics
- Real-time analysis streaming
- Integration with additional data sources

= Acknowledgments and Disclosure of Funding

This work was developed during the Texas A&M Hackathon 2024. We acknowledge the support of the OpenAI, LangChain, and Arize teams in providing the tools and documentation that made this implementation possible. The project received no external funding and was created purely as an educational exercise.

