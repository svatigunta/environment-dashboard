# Environment Dashboard

A modern, responsive Angular application that provides a real-time overview of application environments with Material Design components and Tailwind CSS styling.

## 🚀 Features

- **Environment Management**: View applications across different environments (dev, qa, stage, prod)
- **Search & Filter**: Quick search functionality to find specific applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme switching support
- **Copy to Clipboard**: One-click URL copying with Material Design snackbar feedback
- **Modern UI**: Clean, professional interface with Material Design components

## 🛠️ Tech Stack

- **Angular 20** - Latest Angular framework with standalone components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Angular Material** - Material Design components
- **ESLint + Prettier** - Code quality and formatting
- **GitHub Actions** - CI/CD pipeline

## 📋 Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/environment-dashboard.git
cd environment-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run format:lint` - Format and lint in one command

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Business logic services
│   ├── app.component.*     # Main application component
│   └── app.config.ts       # Application configuration
├── assets/                 # Static assets
├── styles.scss            # Global styles
└── index.html             # Main HTML file
```

## 🔧 Configuration

### Environment Configuration

The application uses hardcoded data for demonstration. In production, replace the data in `src/app/services/application-data.service.ts` with real API calls.

### Styling

- **Tailwind CSS**: Utility classes for rapid UI development
- **Angular Material**: Pre-built Material Design components
- **Custom SCSS**: Additional styling in component files

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

## 📦 Building for Production

Build the application for production:

```bash
npm run build -- --configuration=production
```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

The project includes GitHub Actions workflows for automated deployment:

- **CI/CD Pipeline**: Runs on every push and PR
- **Production Build**: Optimized build for production
- **Security Audit**: Automated security checks
- **Dependency Review**: Monitors dependency updates

### GitHub Pages

The application is configured to deploy to GitHub Pages automatically when pushing to the main branch.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

- All code must pass ESLint checks
- Code must be formatted with Prettier
- Tests must pass before merging
- Follow Angular style guide

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Material Design team for the design system
- Tailwind CSS team for the utility-first approach
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

**Happy coding! 🎉**
