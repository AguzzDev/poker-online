# Poker Online App

## Description

Welcome to **Poker Online App**, my platform for playing poker with friends and players from around the world. This application is designed to provide a seamless and engaging gaming experience, leveraging the latest web technologies to ensure high performance and an attractive user interface.

## Technologies Used

- **TypeScript**: Enables safe and efficient development through static typing and code predictability.
- **NestJS**: A robust backend framework that provides a scalable architecture using Node.js.
- **NextJS**: Enhances the frontend with server-side rendering and a dynamic user experience.
- **Socket.IO**: Manages real-time communication for smooth interaction between players.
- **TailwindCSS**: Simplifies styling with utility-first classes, creating a responsive and visually appealing interface.

## Functionalities

### Online Gaming

- **Game Tables**: Create or join online poker tables to compete against other players in real time.
- **Game Modes**: Currently supports Texas Hold'em.

### User Management

- **Registration and Authentication**: Secure registration and login using a custom user account system.

## Upcoming Updates

I'm working on several improvements and new features to enhance the application. Here's a preview of what's coming soon:

- **Periodic Token System**: Implementing a reward system where players receive tokens periodically.
- **Multi-language Support**: Adding multilingual support to make the platform accessible to a global audience.

## Contribute

I am open to contributions and ideas from the community. If you'd like to collaborate, feel free to reach out or submit a pull request!

## Installation Instructions

To set up the project locally, please follow these steps:

1. **Fork, clone, or download the project.**
2. **Install dependencies:**
   - Run `npm install` in the `client` folder.
   - Run `pnpm install` in the `server` folder.
3. **Add environment variables:**
   - Create a file named `.env.local` in the `client` folder with the following variables:
     ```
     NEXT_PUBLIC_API_URL
     GOOGLE_ID
     GOOGLE_SECRET
     NEXTAUTH_SECRET
     ```
   - Create a file named `.env` in the `server` folder with the following variables:
     ```
     MONGO_URL
     JWT_SECRET
     APP_URL
     EMAIL_PASS
     ```
4. **Run the development server:**
   - Execute `npm run dev` in both the `client` and `server` folders.

![Screenshot 1](./client/public/screenshots/1.png)
![Screenshot 2](./client/public/screenshots/2.png)



