# AI Document Analysis Platform

## Table of Contents

* [Overview](#overview)
* [Setup & Installation](#setup--installation)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Design Decisions & Trade-offs](#design-decisions--trade-offs)
* [Known Limitations](#known-limitations)
* [Time Breakdown](#time-breakdown)
* [Screenshots / GIFs](#screenshots--gifs)
* [Future Improvements](#future-improvements)

---

## Overview

This platform allows users to submit text documents, perform AI-based analysis (summarization, sentiment analysis, and named entity recognition), and view results in real-time using a streaming interface.

---

## Setup & Installation

### Prerequisites

* Node.js >= 20
* npm or yarn
* Hugging Face API token (for AI inference)
* Git

### Installation

```bash
git clone https://github.com/<your-username>/ai-document-analysis.git
cd ai-document-analysis
npm install
```

* Improve NER visualization with color-coded entities
* Retry logic for rate-limit / network errors

### Environment Variables

Create a `.env` file in the root directory:

```
HUGGINGFACE_API_TOKEN=<your_huggingface_api_token>
```

### Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the platform.

---

## Tech Stack

| Technology                 | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| Next.js 14                 | Server-side rendering & edge runtime     |
| shadcn                     | Component-based UI                       |
| Tailwind CSS               | Styling                                  |
| Zustand                    | Global state management                  |
| Zod                        | Form validation                          |
| Hugging Face Inference API | AI tasks (summarization, sentiment, NER) |
| Sonner                     | Toast notifications                      |

**Reasoning:**

* Zustand keeps state management simple and lightweight, avoiding Redux boilerplate.
* Zod ensures robust validation with minimal overhead.

---

## Architecture

### Frontend

* **HomePage**: Main container
* **InputCard**: Handles text input & file upload
* **DocumentList & DocumentCard**: Display documents & results
* **TaskSelector & FileActions**: Reusable UI components

### State Management

* **useDocumentsStore**: Global state for documents

### Backend / API

* **POST /api/documents/analyze**: Streams AI analysis results using server-sent events

### Streaming

* Each task streams partial results to provide real-time feedback.

---

## Design Decisions & Trade-offs

* **Zustand vs Redux**: Chose Zustand for simplicity; Redux was overkill.
* **Streaming via SSE**: Real-time feedback but slightly more complex than simple fetch.
* **Text Chunking**: Streams words for summarization to avoid freezing the UI.

---

## Known Limitations

* Hugging Face free-tier API limits → may hit 429 rate-limit errors.
* Large documents (>5000 chars) are truncated.
* NER may produce overlapping or partial entities.
* No authentication implemented.

---

## Time Breakdown

| Task                                  | Hours Spent |
| ------------------------------------- | ----------- |
| Project setup & architecture          | 3           |
| UI development (components & styling) | 8           |
| Zustand store & hooks                 | 4           |
| SSE backend streaming                 | 6           |
| Hugging Face API integration          | 4           |
| Validation & error handling           | 3           |
| README & documentation                | 2           |

---

## Screenshots / GIFs

**Submit Document:**
![Submit Document](https://github.com/user-attachments/assets/55ede0ec-003e-4c7a-b039-98622ad3d136)

**Re-analyze / Document Results:**
![Re-analyze Document](https://github.com/user-attachments/assets/f435ca6f-cf10-43bf-89e2-5f67adf0b52b)

---

## Future Improvements

* Implement authentication & user management
* Allow larger document uploads with pagination or chunking
* Enhance NER visualization with color-coded entities
* Retry logic for rate-l





Dark mode support
