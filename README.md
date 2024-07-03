# Instaz0rd - Project Documentation

**Instaz0rd** is a social network inspired by Instagram, developed by [enz0rd](https://github.com/enz0rd/instaz0rd). This project is a web platform that allows users to share memories and interact with others.

## Prerequisites

To set up and run the Instaz0rd project, you will need the following tools installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [XAMPP](https://www.apachefriends.org/index.html)

## Cloning the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/enz0rd/instaz0rd.git
cd instaz0rd
```

## Installing Dependencies

Install the project dependencies using npm:

```bash
npm install
```

## Configuring XAMPP

1. Download and install XAMPP.
2. Start Apache and MySQL through the XAMPP control panel.
3. Configure the database according to the instructions provided in the repository or in the project's configuration file.

## Available Scripts

The following npm commands are available to start the project:

### Start the frontend development environment:

```bash
npm run dev
```

This command starts the frontend development server using Vite.

### Start the API and create the database:

```bash
npm run start-api
```

This command performs two tasks:

1. Creates the necessary database for the application (command createdb).
2. Starts the API development server (command api-dev).

## Contributing

If you want to contribute to the project, feel free to open issues and pull requests on the Instaz0rd repository.

## License

> MIT License
>
> Copyright (c) 2024 Enzo Rossi Daltoé
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
