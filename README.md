# Notes App with Tagging

## Features
- Create notes
- Add tags
- Search notes by tags
- Edit notes
- Delete notes

## Setup and Run Instructions:
1. Clone the repository
- git clone https://github.com/rakshitharajendra/notes-app.git
- cd notes-app

2. Backend setup
- cd server
- npm install
- node server.js
- Server will run on: http://localhost:5000

3. Frontend setup
- cd client
- npm install
- npm run dev
- Frontend will run on: http://localhost:5173

## Technology Stack Used
1. Frontend:
- React (Vite)
- Axios
- CSS
2. Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS
- dotenv

## Assumptions Made During Development
- Tags are entered as space-separated values
- Each note contains title, content, and tags
- MongoDB Atlas is used as cloud database
- No authentication system is implemented
- Single-user note management system
- Timestamp is handled using MongoDB createdAt and updatedAt

## AI Tools & Assisted Development

During the development of this project, I used multiple AI-assisted tools to improve productivity, debugging efficiency, and code quality.

This project was developed using AI-assisted development tools including ChatGPT and GitHub Copilot.

ChatGPT was primarily used for debugging API issues, fixing React state handling problems, resolving update functionality bugs, and improving backend route structure. It also helped in handling edge cases like tag formatting and ensuring proper data flow between frontend and backend.

GitHub Copilot assisted in writing boilerplate code faster, especially for React components and Express routes, which improved overall development speed.

These tools significantly reduced development time and helped in identifying and fixing errors more efficiently.


##  Impact of AI Usage

AI tools significantly improved development speed and reduced debugging time. They helped in:

- Faster identification and resolution of bugs  
- Better structuring of frontend and backend integration  
- Improved handling of API requests and database operations  
- Enhancing overall code quality and maintainability  

## Challenges Encountered
- Fixing update (PUT) functionality in React and Express integration
- Handling tag formatting consistently between frontend and backend
- Resolving MongoDB update timestamp not refreshing properly
- Debugging tags.trim is not a function issue in React state
- Managing state flow between edit mode and create mode
- Ensuring smooth UI navigation between create, edit, and view.