# Lockness AI

## Inspiration
The Chronic Condition Warehouse (CCW) Virtual Research Data Center (VRDC) is the US government's central collection of ALL public healthcare records. Scientists, researchers, and policy makers regularly use this data for studies and policy recommendations. The VRDC is HIGHLY secure and restrictive (as it should be), and is comprised of thousands of tables (each with up to hundreds of columns). The problem is the documentation for the data structure in VRDC CCW is highly technical and dense, filled with cryptic codes and abbreviations, dispersed among hundreds of pages of PDFs. Even a simple query can cost several thousand dollars, easily ballooning a comprehensive study to the 6-figure range. This can be remedied by the power of generative AI, hosted in a private, secure environment.

## What it does
We made a (self-hostable) chat application where VRDC researchers can generate complex queries based on research questions in seconds. By automating the process of parsing hundreds of pages of documentation, we improve the efficiency of researchers dramatically. Unlike general code-generation solutions, we take the approach that LLMs are here to automate mundane tasks, but intelligence ultimately lies in the hands of the user. This empowers the user to provide context and necessary corrections to the LLM along the way, eliminating hallucinations and other common errors produced by LLMs. Here's how it works: First, the user inputs a research question. Next, the LLM asks the user for any clarifications/domain expertise necessary to properly build the query. Once sufficient context is supplied, the app provides a full plain-English outline of the query generation plan. Once the user is satisfied with the outline, the LLM generates the query step-by-step, following the outline, asking for user feedback along the way. Finally, the query is concatenated and aggregated for a final result. At every step of the way in the iterative development, the user has the power to clarify and fix any errors that the LLM might introduce. The end result is a fully-functional query and hours saved for the researcher.

## How we built it
After unanimously agreeing on the logical flow and design for the application, we split into two sub-teams. Ryan and Michael worked on data aggregation for the documentation, as well as prompt engineering and chaining to make the LLM pipeline. UV and Jason created on the frontend and backend architecture for the website. Since we want to make this application deployable to offline/restricted environments, we built our LLM solutions using Cohere's self-hostable Command-R-Plus model. We also used Google Cloud App Engine to host our Flask backend, and Vercel to statically host our React + Chakra UI frontend.
