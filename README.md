# GymPT - AI-Powered Gym Assistant

A modern web application that provides personalized workout plans, nutrition advice, and fitness guidance using AI.

## Features

- 🤖 AI-powered chat assistant for fitness advice
- 💪 Personalized workout generator
- 🥗 Nutrition guidance and meal planning
- 📊 Progress tracking
- 🏋️ Equipment recommendations

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Webpack dependencies:**
   ```bash
   npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin copy-webpack-plugin css-loader style-loader file-loader
   ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
GymPT/
├── src/
│   ├── js/
│   │   └── main.js          # Main JavaScript entry point
│   ├── css/
│   │   └── styles.css       # Global styles
│   ├── gambar/              # Images directory
│   ├── index.html           # Home page
│   ├── workout.html         # Workout generator page
│   ├── nutrisi.html         # Nutrition page
│   └── alatgym.html         # Equipment page
├── dist/                    # Built files (generated)
├── webpack.config.js        # Webpack configuration
├── package.json             # Dependencies and scripts
└── netlify.toml            # Netlify deployment config
```

## Deployment to Netlify

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

### Option 2: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to deploy

## Environment Variables

For the AI chat functionality to work, you'll need to set up environment variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following environment variable:
   - `GOOGLE_AI_API_KEY`: Your Google AI API key (optional, will use default if not set)

## API Setup

The application uses Netlify Functions to handle AI requests. The functions are located in `netlify/functions/`:

- `chat.js`: Handles AI chat and workout generation requests

Make sure to deploy with the functions directory included.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start dev server and open browser

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome
- **Build Tool:** Webpack
- **Deployment:** Netlify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License. 