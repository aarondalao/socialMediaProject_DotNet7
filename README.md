# socialMediaProject_DotNet7
A brief Personal Portfolio Project using .Net 7 and React - Typescript

## Project Solution Structure 
- API
- Application
- Domain
- Persistence
- client-app

## API Layer | solution
used Mediator pattern + CQRS (Command and Query Responsibility Segregation) for the API controller endpoints.

## Application Layer | solution
A lot of dependencies are used here but i will updating this as soon as possible.

## Domain Layer | Solution
This solution has the Model/Entity of the the API Layer.

## Persistence Layer | Solution
This solution has our data context and migrations. responsible for storing data to your database. at the development stage i will be using SQLite but ill transition to other better options.

## Client App Layer (React - Typescript)
This solution will be using the following:
- [React](https://react.dev/reference/react) - main Frontend Library for creating components
- [Typescript](https://www.typescriptlang.org/docs/) - safe and stricter type checking
- [Semantic UI](https://semantic-ui.com/introduction/getting-started.html) - used for faster prototyping of css files
- [Axios](https://axios-http.com/docs/intro) - HTTP API fetching 
- [MobX](https://mobx.js.org/react-integration.html) - for state management 
- [react-router](https://reactrouter.com/en/main) - for routing
