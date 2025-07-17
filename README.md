# Wellness Dashboard

A modern, stylish web dashboard built with React and Tailwind CSS that displays wellness metrics from the Exist.io API.

## Features

- **Modern Design**: Clean, minimalist interface with elegant typography
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Charts**: Beautiful line charts using Recharts library
- **Real-time Data**: Ready for Exist.io API integration

## Metrics Displayed

- **Daily Steps**: Track your daily step count
- **Sleep Time**: Monitor your sleep duration
- **Meditation**: Track meditation sessions
- **Productive Time**: Monitor productive work hours

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Inter Font** for modern typography

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Header with title and theme toggle
│   └── MetricCard.tsx      # Reusable metric card component
├── data/
│   └── mockData.ts         # Mock data for development
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main application component
├── index.tsx              # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## Exist.io API Integration

The dashboard is designed to work with the Exist.io API. To integrate real data:

1. **Get API Access**: Sign up at [exist.io](https://exist.io) and get your API credentials
2. **Environment Variables**: Create a `.env` file with your API key:
   ```
   REACT_APP_EXIST_API_KEY=your_api_key_here
   ```
3. **API Service**: Replace mock data with real API calls in a new service file
4. **Authentication**: Implement OAuth flow for user authentication

### API Endpoints to Use

- `/api/1/users/$self/attributes/` - Get user attributes
- `/api/1/users/$self/attributes/steps/` - Get steps data
- `/api/1/users/$self/attributes/sleep/` - Get sleep data
- `/api/1/users/$self/attributes/meditation/` - Get meditation data
- `/api/1/users/$self/attributes/productivity/` - Get productivity data

## Customization

### Colors

The dashboard uses a custom color palette defined in `tailwind.config.js`:

- **Steps**: Green (`#10b981`)
- **Sleep**: Purple (`#8b5cf6`)
- **Meditation**: Orange (`#f59e0b`)
- **Productivity**: Blue (`#3b82f6`)

### Adding New Metrics

1. Add the metric type to `src/types/index.ts`
2. Add mock data to `src/data/mockData.ts`
3. Create a new MetricCard component instance in `App.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own wellness tracking needs!

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers. 