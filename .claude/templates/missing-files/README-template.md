# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🚀 Quick Start

### Prerequisites
{{#BACKEND_DOTNET}}
- .NET 8.0 SDK or later
- Visual Studio 2022 or VS Code
{{/BACKEND_DOTNET}}
{{#FRONTEND_ANGULAR}}
- Node.js 18+ 
- npm or yarn
- Angular CLI 20+
{{/FRONTEND_ANGULAR}}
{{#DATABASE_POSTGRESQL}}
- PostgreSQL 13+ 
{{/DATABASE_POSTGRESQL}}

### Installation

1. **Clone the repository**
   ```bash
   git clone {{REPO_URL}}
   cd {{PROJECT_FOLDER_NAME}}
   ```

2. **Setup Backend**
   {{#BACKEND_DOTNET}}
   ```bash
   cd src/{{BACKEND_FOLDER}}
   dotnet restore
   dotnet build
   ```
   {{/BACKEND_DOTNET}}

3. **Setup Frontend** 
   {{#FRONTEND_ANGULAR}}
   ```bash
   cd src/{{FRONTEND_FOLDER}}
   npm install
   ```
   {{/FRONTEND_ANGULAR}}

4. **Configure Database**
   {{#DATABASE_POSTGRESQL}}
   ```bash
   # Update connection string in appsettings.json
   dotnet ef database update
   ```
   {{/DATABASE_POSTGRESQL}}

5. **Run the Application**
   {{#BACKEND_DOTNET}}
   ```bash
   # Terminal 1 - Backend
   cd src/{{BACKEND_FOLDER}}
   dotnet run
   ```
   {{/BACKEND_DOTNET}}
   {{#FRONTEND_ANGULAR}}
   ```bash
   # Terminal 2 - Frontend
   cd src/{{FRONTEND_FOLDER}}
   ng serve
   ```
   {{/FRONTEND_ANGULAR}}

6. **Access the Application**
   - Frontend: http://localhost:4200
   - Backend API: {{#BACKEND_DOTNET}}http://localhost:5000{{/BACKEND_DOTNET}}
   - API Documentation: {{#BACKEND_DOTNET}}http://localhost:5000/swagger{{/BACKEND_DOTNET}}

## 🏗️ Architecture

{{PROJECT_NAME}} is built with a modern {{#ARCHITECTURE_TYPE}}{{ARCHITECTURE_TYPE}}{{/ARCHITECTURE_TYPE}} architecture:

{{#BACKEND_DOTNET}}
**Backend (.NET {{DOTNET_VERSION}})**
- ASP.NET Core Web API
- Entity Framework Core
- {{#AUTH_JWT}}JWT Authentication{{/AUTH_JWT}}
- {{#DATABASE_TYPE}}{{DATABASE_TYPE}} Database{{/DATABASE_TYPE}}
{{/BACKEND_DOTNET}}

{{#FRONTEND_ANGULAR}}
**Frontend (Angular {{ANGULAR_VERSION}}+)**
- Standalone Components
- Signals for State Management
- {{#STYLING_FRAMEWORK}}{{STYLING_FRAMEWORK}} for Styling{{/STYLING_FRAMEWORK}}
- TypeScript with Strict Mode
{{/FRONTEND_ANGULAR}}

```
{{#ARCHITECTURE_DIAGRAM}}
{{ARCHITECTURE_DIAGRAM}}
{{/ARCHITECTURE_DIAGRAM}}
```

## 📁 Project Structure

```
{{PROJECT_FOLDER_NAME}}/
{{#BACKEND_DOTNET}}
├── src/{{BACKEND_FOLDER}}/              # Backend (.NET)
│   ├── Controllers/                     # API Controllers
│   ├── Services/                        # Business Logic
│   ├── Models/                          # Data Models
│   ├── Data/                            # Entity Framework
│   └── {{PROJECT_NAME}}.csproj          # Project file
{{/BACKEND_DOTNET}}
{{#FRONTEND_ANGULAR}}
├── src/{{FRONTEND_FOLDER}}/             # Frontend (Angular)
│   ├── src/app/                         # Angular Application
│   │   ├── components/                  # UI Components
│   │   ├── services/                    # Angular Services
│   │   ├── models/                      # TypeScript Interfaces
│   │   └── app.component.ts             # Root Component
│   ├── angular.json                     # Angular Configuration
│   └── package.json                     # Dependencies
{{/FRONTEND_ANGULAR}}
├── docs/                                # Documentation
├── tests/                               # Test Files
└── README.md                            # This file
```

## 🧪 Testing

{{#BACKEND_DOTNET}}
**Backend Tests**
```bash
cd src/{{BACKEND_FOLDER}}
dotnet test
```
{{/BACKEND_DOTNET}}

{{#FRONTEND_ANGULAR}}
**Frontend Tests**
```bash
cd src/{{FRONTEND_FOLDER}}
ng test                    # Unit tests
ng e2e                     # End-to-end tests
```
{{/FRONTEND_ANGULAR}}

## 🚀 Deployment

### Development
{{#DOCKER_SUPPORT}}
```bash
docker-compose up -d
```
{{/DOCKER_SUPPORT}}

### Production
{{#DEPLOYMENT_AZURE}}
1. Configure Azure App Service
2. Set up CI/CD with GitHub Actions
3. Update production connection strings
{{/DEPLOYMENT_AZURE}}

## 🛠️ Development Commands

{{#BACKEND_DOTNET}}
**Backend (.NET)**
```bash
dotnet run                 # Run application
dotnet build              # Build project
dotnet test               # Run tests
dotnet ef migrations add <name>  # Add migration
dotnet ef database update        # Update database
```
{{/BACKEND_DOTNET}}

{{#FRONTEND_ANGULAR}}
**Frontend (Angular)**
```bash
ng serve                  # Development server
ng build --prod          # Production build
ng generate component <name>    # Generate component
ng test                   # Run unit tests
ng lint                   # Run linting
```
{{/FRONTEND_ANGULAR}}

## 📖 API Documentation

{{#API_DOCUMENTATION}}
- **Swagger UI**: {{API_DOCUMENTATION_URL}}
- **Postman Collection**: Available in `/docs/api/`
{{/API_DOCUMENTATION}}

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established coding standards
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📞 Support

- **Documentation**: [{{DOCS_URL}}]({{DOCS_URL}})
- **Issues**: [GitHub Issues]({{REPO_URL}}/issues)
- **Discussions**: [GitHub Discussions]({{REPO_URL}}/discussions)

## 📄 License

This project is licensed under the {{LICENSE_TYPE}} License - see the [LICENSE](LICENSE) file for details.

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**{{PROJECT_NAME}}** - {{PROJECT_TAGLINE}}