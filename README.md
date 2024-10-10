# Poker Online

## Description

Welcome to **Poker Online**, an immersive multiplayer poker platform where you can play and chat with friends and players from all around the world in real-time. This application is designed for a seamless gaming experience, leveraging cutting-edge technologies to provide high performance and a visually appealing user interface.

## Technologies Used

- **TypeScript**: Ensures reliability and scalability through static typing.
- **NestJS**: A powerful, modular backend framework built on top of Node.js.
- **Next.js**: Delivers an optimized, server-rendered frontend for better performance.
- **Socket.IO**: Powers real-time communication for seamless multiplayer interactions.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs without sacrificing responsiveness.
- **MongoDB**: A non-relational database for efficient and flexible data storage.

## Upcoming Updates

Here are some features and improvements that are coming soon:

- **Periodic Token System**: Players will receive tokens at regular intervals as part of our reward system.
- **Multi-language Support**: Expanding our platform to support multiple languages and enhance accessibility for a global audience.

## Contribute

I’m open to contributions and ideas from the community. Whether it's reporting issues, suggesting improvements, or submitting pull requests, your feedback is welcome! Feel free to fork the project or open an issue on GitHub.

## Installation Instructions

To set up the project locally, follow these steps:

1. **Fork, clone, or download the project.**
2. **Install dependencies:**
   - Run `npm install` in the `client` folder.
   - Run `pnpm install` in the `server` folder.
3. **Create a MongoDB database:**
   - Set up a MongoDB database locally or use a cloud service like MongoDB Atlas.
4. **Add environment variables:**
   - In the `client` folder, create a `.env.local` file with the following variables:
     ```env
     NEXT_PUBLIC_API_URL=
     GOOGLE_ID=
     GOOGLE_SECRET=
     NEXTAUTH_SECRET=
     ```
   - In the `server` folder, create a `.env` file with the following variables:
     ```env
     MONGO_URL=
     JWT_SECRET=
     APP_URL=
     EMAIL_PASS=
     ```
5. **Run the development servers:**
   - Open two terminals:
     - In the first, navigate to the `client` folder and run `npm run dev`.
     - In the second, navigate to the `server` folder and run `pnpm dev`.

## Screenshots

Here are some screenshots showcasing the platform:

  ![Screenshot 1](./client/public/screenshots/1.png)
  ![Screenshot 2](./client/public/screenshots/2.png)

## License

This project is licensed under the MIT License.



