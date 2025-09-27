# Proximate Front

A React TypeScript application with a comprehensive set of reusable components.

## Features

- **Modern React Setup**: Built with React 18, TypeScript, and Create React App
- **Component Library**: Includes Header, Footer, Button, and Card components
- **Responsive Design**: Mobile-first approach with modern CSS
- **TypeScript Support**: Full type safety and IntelliSense support

## Components

### Header
- Navigation bar with customizable title
- Responsive design
- Clean, modern styling

### Footer
- Site footer with links
- Consistent branding

### Button
- Multiple variants: primary, secondary, danger
- Three sizes: small, medium, large
- Disabled state support
- TypeScript props interface

### Card
- Content container with optional title
- Hover effects
- Flexible content area

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── Header.css      # Header styles
│   ├── Footer.tsx      # Site footer
│   ├── Footer.css      # Footer styles
│   ├── Button.tsx      # Button component
│   ├── Button.css      # Button styles
│   ├── Card.tsx        # Card component
│   ├── Card.css        # Card styles
│   └── index.ts        # Component exports
├── App.tsx             # Main application component
├── App.css             # Main application styles
├── index.tsx           # Application entry point
├── index.css           # Global styles
└── logo.svg            # React logo
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.
