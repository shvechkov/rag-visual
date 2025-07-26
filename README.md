

# This is Demo code for a blog article published here: https://medium.com/@shvechkovs/65577a32f1b8


A React application for imaginable online store featuring category selection, order placement, and an AI assistant chat interface powered by OpenAI. The app includes interactive navigation with a wand cursor for highlighting and clicking elements, built with modular components and styled using Tailwind CSS.

## Features
- Browse categories (Cats, Dogs, Flowers) and view product details.
- Place orders with quantity selection and view confirmation modals.
- Navigate through Categories, Stories, and Misc sections.
- Interact with an AI assistant via a chat interface, powered by OpenAI.
- Automated navigation and highlighting using a wand cursor.

## Prerequisites
- **Node.js**: Version 18 or higher (download from [nodejs.org](https://nodejs.org/)).
- **OpenAI Account**: Required for the AI chat feature (see [OpenAI Setup](#openai-setup) below).
- **Git**: To clone the repository (install from [git-scm.com](https://git-scm.com/)).

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shvechkov/rag-visual.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd rag-visual
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Set Up Environment Variables**:
   - Create a `.env.local` file in the project root:
     ```bash
     touch .env.local
     ```
   - Add your OpenAI API key and Assistant ID (see [OpenAI Setup](#openai-setup) for how to obtain these):
     ```env
     OPENAI_API_KEY=sk-XXX-YOUR-KEY
     ASSISTANT_ID=asst_XXX_YOUR_ASSISTANT_ID
     ```

## OpenAI Setup
The AI chat feature requires an OpenAI API key and an Assistant ID. Follow these steps to set up a free OpenAI account and obtain the necessary credentials:

1. **Create an OpenAI Account**:
   - Visit [platform.openai.com/signup](https://platform.openai.com/signup).
   - Sign up with your email, Google, or Microsoft account.
   - Verify your email and phone number as prompted.
   - Note: OpenAI offers a free trial with limited credits for new accounts (as of July 2025). Check [OpenAI Pricing](https://openai.com/pricing) for current details.

2. **Obtain an API Key**:
   - Log in to the [OpenAI Platform](https://platform.openai.com/).
   - Navigate to **API Keys** in the dashboard (usually under **Settings** or **API**).
   - Click **Create new secret key**.
   - Copy the key (e.g., `sk-XXX-YOUR-KEY`) and store it securely.
   - Paste it into your `.env.local` file as `OPENAI_API_KEY`.
   - Guide: [OpenAI API Keys Documentation](https://platform.openai.com/docs/api-reference/authentication).

3. **Create an Assistant**:
   - Go to the [OpenAI Assistants Dashboard](https://platform.openai.com/assistants).
   - Click **Create Assistant**.
   - Configure the assistant:
     - **Name**: e.g., "Store Assistant".
     - **Model**: Choose a model like `gpt-4o-mini` (recommended for cost-effective use).
     - **Instructions**: Define the assistant’s behavior, e.g., "You are a helpful store assistant that guides users through product selection and answers questions about the store."
     - **Tools**: Enable any required tools (e.g., Code Interpreter if your assistant needs to process data).
   - Save the assistant and copy its **Assistant ID** (e.g., `asst_XXX_YOUR_ASSISTANT_ID`).
   - Paste it into your `.env.local` file as `ASSISTANT_ID`.
   - Guide: [OpenAI Assistants API Documentation](https://platform.openai.com/docs/assistants/overview).

   Here is an example of system prompt that you may enter:
```
you are a helpful web store assistant who helps customers with questions about web site and about placing orders; Answer questions only about things mentioned in the attached PDF  

If user "asks show me how to perform an action in UI " or semantically similar question asking for help in finding things in web app UI then you should  respond with  specially formed action sequence which looks like this:

'<action>
      {   "question" : "how to get order a cat picture",
           "steps" : ["step1", "step","step3"]
       }
</action>'

This response will be parsed by Fronted and will help to navigate user in UI
First time ask for permission to execute the action (i.e. Do you want me to show you ..) 
If user responds yes and adds "don't ask for permissions" , next time you perform actions without asking for permission - with one exception -  always ask for permission before placing  order (i.e. before issuing action for clicking  "Place Order" !)

For creating action sequences/responses use the following map

question:"Show me categories", steps:["categories"]
question:"Show me how to order dogs", steps:["categories", "dogs"]
question:"Show me how to order cats", steps:["categories", "cats"]
question:"Help to order cats", steps:["categories", "cats", "Add Item","Place Order"]
question:"Place order", steps:["Place Order"]
question:"Add Item", steps:["Add Item"]
question:"Show me how to order flowers", steps:["categories","flowers"]
question:"Show me customers feedbacks or stories", steps:["stories"]
question:"Store hours and contacts", steps:["Misc"]

If user asks to add multiple items into the order/ basket then make sure you append "Add Item" step as many as a number of items requested by user
Important: always ask user for permission to click "Place order" - no exceptions! 
Important: ensure that JSON format is correct (quote both keys names and values properly)
Do not respond with Action sequence for any other questions not listed above
```


4. **Verify Credits**:
   - Check your OpenAI account’s **Usage** or **Billing** section to ensure you have sufficient credits.
   - If credits are low, add a payment method to continue using the API (free tier may have limits).

## Running the Application
1. **Start the Development Server**:
   - Run the following command, replacing `sk-XXX-YOUR-KEY` and `asst_XXX_YOUR_ASSISTANT_ID` with your actual OpenAI credentials:
     ```bash
     OPENAI_API_KEY=sk-XXX-YOUR-KEY ASSISTANT_ID=asst_XXX_YOUR_ASSISTANT_ID npm run dev
     ```
   - Alternatively, if you’ve set the variables in `.env.local`, simply run:
     ```bash
     npm run dev
     ```
   - The app will be available at `http://localhost:3000` (or another port if configured).
2. **Test the App**:
   - Navigate through Categories, Stories, and Misc sections.
   - Select products (Cats, Dogs, Flowers) and place orders.
   - Use the chat interface to interact with the OpenAI-powered assistant.
   - Verify the wand cursor highlights and clicks elements as guided by the assistant.

## Project Structure
```
src/
├── ButtonPanelApp.jsx        # Main app component
├── ActionHandler.js          # Navigation, highlighting, and clicking logic
├── components/
│   ├── Header.jsx            # Navigation bar
│   ├── CategoryPanel.jsx     # Category selection buttons
│   ├── CategoryDetails.jsx   # Product details and order form
│   ├── Stories.jsx           # Customer stories section
│   ├── Misc.jsx              # Miscellaneous information
│   ├── OrderModal.jsx        # Order confirmation modal
│   ├── Chat.jsx              # AI assistant chat interface
public/
├── index.html
├── pointinghand.png           # Wand cursor image
├── thinking.gif              # Chat loading animation
```

## Dependencies
- [Next.js](https://nextjs.org/) (React framework)
- [React](https://react.dev/) (UI library)
- [PropTypes](https://www.npmjs.com/package/prop-types) (Prop type checking)
- [Tailwind CSS](https://tailwindcss.com/) (Styling utility)
- OpenAI SDK (assumed for chat integration, e.g., `@openai/api`)

## Building for Production
1. Build the project:
   ```bash
   npm run build
   ```
   This generates the `.next/` directory with optimized assets.
2. Start the production server:
   ```bash
   npm run start
   ```
3. Note: Do **not** commit the `.next/` directory to GitHub (it’s included in `.gitignore`).

## Notes
- **Assets**: Ensure `pointinghand.png` and `thinking.gif` are in the `public/` directory.
- **Environment Variables**: Store sensitive data in `.env.local` (see `.env.example` for reference). Do **not** commit `.env.local` to GitHub.
- **Tailwind CSS**: Styles are applied via Tailwind classes. Ensure Tailwind is configured in `tailwind.config.js` and `postcss.config.js`.
- **OpenAI Costs**: Monitor API usage in the OpenAI dashboard to avoid exceeding free tier quotas. See [OpenAI Usage](https://platform.openai.com/usage).

## Troubleshooting
- **Build Errors**: Check terminal output during `npm run build` for missing dependencies or syntax errors. Install missing packages (e.g., `npm install prop-types openai`).
- **Chat Not Working**: Verify `OPENAI_API_KEY` and `ASSISTANT_ID` are correct and that your OpenAI account has credits.
- **Assets Not Loading**: Confirm `pointinghand.png` and `thinking.gif` are in `public/`.
- **Tailwind Issues**: Ensure `tailwind.config.js` includes `content: ['./src/**/*.{jsx,js}']` and CSS file has `@tailwind` directives.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

