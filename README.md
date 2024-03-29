# How-to-Club
A Social media platform and brief Personal Portfolio Project using .Net 7 and React with Typescript

## Multiple Project Solution Structure 
- API
- Application
- Domain
- Persistence
- client-app

## API Layer | solution
Dependent on the Application layer, contains the startup project and the controller of the whole project. 
- [Microsoft.EntityFrameworkCore.Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design/) - 
Shared design-time components for Entity Framework Core tools.
- CORS - cross-origin resource sharing

## Application Layer | solution
Dependent on Domain solution. these were the services used in this solution:
- [Mediatr](https://www.nuget.org/packages/MediatR#readme-body-tab) -  a solid implementation of Mediator pattern with 
CQRS (Command and Query Responsibility Segregation)
- [AutoMapper](https://www.nuget.org/packages/AutoMapper.Extensions.Microsoft.DependencyInjection/) - converter of an 
object into another
- [FluentValidation](https://docs.fluentvalidation.net/en/latest/aspnet.html) - will be used as my validator on the 
incoming Mediatr requests. NOTE: AUTOMATIC Validation is being used.
- [Asp.Net Identity Core](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-7.0&tabs=visual-studio) - Authentication management

## Domain Layer | Solution
Dependent on the Persistence layer. This solution has the **Models/Entities** like the activities and users of the Application Layer.

## Persistence Layer | Solution
Dependent on the Application layer and provider of data in the domain layer.
This solution has our data context and migrations. responsible for storing data in the database.
this solution will be using the following: 
- [Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/8.0.0-preview.4.23259.3) - SQLite database provider for Entity Framework Core.

I will be transitioning to better options

## Infrastructure Layer | Solution
TODO: will be updating this.
new solution with purpose of getting username via IUserAccessor.cs and image via IPhotoAccessor.cs from the application layer.
- [cloudinary](https://cloudinary.com/) - SaaS tech that provides cloud-based image and video management services. I'll use this to upload, store, manage, and manipulate images for this project.



## Client App Layer (React - Typescript)
This solution will be using the following:
- [React](https://react.dev/reference/react) - main Frontend Library for creating components
- [Typescript](https://www.typescriptlang.org/docs/) - safe and stricter type checking
- [Vite](https://v3.vitejs.dev/) - A much better Frontend tooling, performance-wise to replace Create-React-App, which 
    is abandoned as of the 1st quarter of 2023.
- [Semantic UI](https://semantic-ui.com/introduction/getting-started.html) - used for faster prototyping of CSS files
- [Axios](https://axios-http.com/docs/intro) - HTTP API fetching 
- [MobX](https://mobx.js.org/react-integration.html) - for state management 
- [react-router](https://reactrouter.com/en/main) - for routing
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction) - React Package for toasting alerts. will be used for error, validation, and request handling. Toasts are lightweight notifications designed to mimic the push notifications that have been popularized by mobile and desktop operating systems.
- [Formik](https://formik.org/docs/overview) - a famous helper library to implement forms with built-in validations
- [Yup](https://github.com/jquense/yup) - an object validation schema library that works seamlessly with Formik.
- [react-datepicker](https://reactdatepicker.com/) - A simple and reusable datepicker component for React.
- [date-fns](https://date-fns.org/docs/Getting-Started) - JavaScript date object manipulator 
- [react-dropzone](https://github.com/react-dropzone/react-dropzone) - simple drag-and-drop image/file uploader for react hooks
- [react-cropper](https://github.com/react-cropper/react-cropper) - Cropperjs as React component
- [react-infinite-scroller](https://www.npmjs.com/package/react-infinite-scroller) - lightweight implementation of infinte scroller to load grid or list of items.


### TODOs

- Security
    - [X] reseach about asymmetric security keys and implement it here to support HTTPS
    - [ ] refresh tokens and token validation to chech token expiry. currently the token is valid for 7 DAYS.
    - [ ] 

- Data Persistence
    - [X] - research about better data store than SQLite
    - [ ] - seed.cs |  remove line 21 -24 and remember not to use that in prod. 
    - [ ] - horizontal scaling

- client
    - [ ] - agent.ts |  if possible, convert line 19-68 into async -await instead of promise -> then chaining
    - [ ] - Homepage.tsx | background change into stock video\
    - [ ] - make the app responsive 
    - [ ] - optional: link to google login
    - [ ] - optional: link to facebook login