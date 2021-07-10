# MS Teams - Archer Clone

This is a Fully Functional Real Time Video Calling Web
Application with Chat Application and User Authentication that I
created using the SCRUM framework of Agile Software Development.
I created this project as a part of the Microsoft Engage 2021
mentorship program.

## Features 📝

- Group Video Call of Four Individuals
- Chat Application accessed before, during and after the Call
- User Authentication via Mail
- Screen Presentation during Call
- Automated Mail invites from the Application
- List of Participants in the room
- Audio & Video Toggles

## Tech Stack 💻

**Client:** [React.js](https://reactjs.org/)

- Video Call & Present Screen : [Socket.io](https://socket.io/), [Simple-Peer](https://www.npmjs.com/package/simple-peer)
- Chat Feature : [Firestore](https://firebase.google.com/products/firestore?gclid=Cj0KCQjwiqWHBhD2ARIsAPCDzalOXhEYzt4WRYZadZZq8We9PwMK_QseRaS81MP0Mk4qodCj_x8sIAwaArUnEALw_wcB&gclsrc=aw.ds)
- User Authentication : [Firebase Authentication](https://firebase.google.com/products/auth?gclid=Cj0KCQjwiqWHBhD2ARIsAPCDzamR-zFkY4KxFnIb05vsM9HmkRAUVi6xsracUWSpi2vS6gCfYBRdcJYaAn-vEALw_wcB&gclsrc=aw.ds)
- Mail Invites : [Email.js](https://www.emailjs.com/)
- Styling : [Material UI](https://material-ui.com/)

**Server:** [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/)

**Deployment:** [Heroku](https://devcenter.heroku.com/articles/git)

## Run Locally

For running the application locally, all you need are 4 simple steps!

- Node Installation
- Yarn installation
- Cloning repository
- Run!

**1. Node Installation**

- Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer. Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

**2. Node Installation**

After installing node, this project will need yarn too, so just run the following command.

    $ npm install -g yarn

###

**3. Cloning the Repository**

    $ git clone https://github.com/archer1712/MS-Teams-Archer-Clone.git
    $ cd MS-Teams-Archer-Clone
    $ yarn install

###

**4. Run!**

To make the production variable false, remove `PROD=true`
in _start_ under _scripts_ in `package.json`. Also, replace
`'https://arcane-escarpment-21812.herokuapp.com'` with `'/'`
at Line 143 in `client\src\routes\Room.js`. Then run the following commands!

    $ yarn start
    $ cd client
    $ yarn start

That's it. Go to `http://localhost:3000/` to begin right away!

## Demo
