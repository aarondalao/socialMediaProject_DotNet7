# socialMediaProject_DotNet7
A brief Personal Portfolio Project using .Net 7 and React - Typescript

## Multiple Project Solution Structure 
- API
- Application
- Domain
- Persistence
- client-app

## API Layer | solution
Dependent on Application layer, contains the startup project and the controller of the whole project. 
- [Microsoft.EntityFrameworkCore.Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design/) - Shared design-time components for Entity Framework Core tools.
- CORS - cross origin resource sharing

## Application Layer | solution
Dependent on Domain solution. these were the services used on this solution:
- [Mediatr](https://www.nuget.org/packages/MediatR#readme-body-tab) -  a solid implementation of Mediator pattern with CQRS (Command and Query Responsibility Segregation)
- [AutoMapper](https://www.nuget.org/packages/AutoMapper.Extensions.Microsoft.DependencyInjection/) - converter of an object into another
- [FluentValidation](https://docs.fluentvalidation.net/en/latest/aspnet.html) - will be used as my validator on the incomming mediatr requests. NOTE: AUTOMATIC Validation is being used.

## Domain Layer | Solution
Dependent on the Persistence layer.This solution has the **Model/Entity** of the the Application Layer.

## Persistence Layer | Solution
Dependent on Application layer and provider of data in the domain layer.
This solution has our data context and migrations. responsible for storing data to database.
this solution will be using the following: 
- [Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/8.0.0-preview.4.23259.3) - SQLite database provider for Entity Framework Core.

i will be transitioning to better options

## Client App Layer (React - Typescript)
This solution will be using the following:
- [React](https://react.dev/reference/react) - main Frontend Library for creating components
- [Typescript](https://www.typescriptlang.org/docs/) - safe and stricter type checking
- [Semantic UI](https://semantic-ui.com/introduction/getting-started.html) - used for faster prototyping of css files
- [Axios](https://axios-http.com/docs/intro) - HTTP API fetching 
- [MobX](https://mobx.js.org/react-integration.html) - for state management 
- [react-router](https://reactrouter.com/en/main) - for routing
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction) - React Package for toasting alerts . will be used for error, validation, and request handling. Toasts are lightweight notifications designed to mimic the push notifications that have been popularized by mobile and desktop operating systems. They’re built with flexbox, so they’re easy to align and position.
