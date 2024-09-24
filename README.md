# Portfolio Website

This is my personal portfolio website showcasing my skills, projects, and experience. The website is built using modern web technologies such as Vite, ThreeJS and SCSS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Installation

To get started with this project, you need to have Node.js and npm (or yarn) installed on your machine.

1. Clone the repository:

   ```bash
   git clone https://github.com/nikobagaric/portfolio.git
   cd portfolio
   ```

2. Install the dependencies:

    ```
    npm install
    ```

    or if you prefer yarn:

       yarn install
        
## Usage

To run the project locally, use the following commmand:
```
npm run dev
```
or if you prefer yarn:
```
yarn dev
```
This will start the development server and you can view it at
>http://localhost:5173/

To build the project for production, use the following command:
```
npm run build
```

or if you prefer yarn:
```
yarn build
```

This will create a ```dist``` directory with the production build of the website

## Project structure

Here is an overview of the structure:
```
portfolio/
├── public/             # Static assets (images, fonts, etc.)
├── css/                # SCSS files
│   ├── style.scss      # Main SCSS file
├── js/                 # JavaScript files
│   ├── helper/         # Helper functions for gsap
│   │   ├── horizontalLoop.js
│   ├── canvas.js       # Canvas related scripts
│   ├── gsap.js         # GSAP animations
│   ├── cursor.js       # Custom cursor scripts
├── main.js             # Entry point for Vite
├── index.html          # Main HTML file
├── package.json        # NPM package file
├── .gitignore          # Git ignore file
├── README.md           # Project README file
```