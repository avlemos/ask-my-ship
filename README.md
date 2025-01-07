This is a simple web application, using Next.js, that leverages on [WebLLM](https://webllm.mlc.ai/) to pull llm, and run them in the browser.

To make it fun, it connects with the World of Warships API, gets recent statistics for an authorized player, and then roasts them.

## Getting Started

First, make sure you have all of the dependencies, by running:

```bash
npm i
```

Then, you need to create a .env.local file, that looks something like this:

NEXT_PUBLIC_WARGAMING_APP_ID=you_need_to_register_with_wargaming_for_this
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback

mind you, that pointing to anything other than localhost, without https, may lead to weird behaviours (cache wise)


Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.