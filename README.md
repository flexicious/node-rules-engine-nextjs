This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). We are using this to demonstrate features of Lambda Genie, which is a Node JS Rules Engine, 
Intelligent Feature Flags, and Configuration Management Platform. More information can be found at [Lambda Genie](https://app.lambdagenie.com/)

Although you can run this project as is, to fully utilize Lambda Genie, you will need to create an account and use your config file instead of the one included in this project. The config.json file is located in the root of the project. You can create an account [here](https://app.lambdagenie.com/) and learn more about Lambda Genie [here](https://lambdagenie.com/)

If you wish to get started as is, you can run the project with the following commands:

```bash
npm install
npm run dev
# or
yarn
yarn dev

```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start by registering a few accounts,

- username: test@test.com, password: test@test.com, email: test@test.com, birthdate: 01/01/2000, gender: Male
- username: test1@test.com, password: test1@test.com, email: test1@test.com, birthdate: 01/01/2000, gender: Female
- username: test3@test.com, password: test3@test.com, email: test3@test.com, birthdate: 01/01/2010, gender: Male
- username: test4@test.com, password: test4@test.com, email: test4@test.com, birthdate: 01/01/2010, gender: Female
- username: admin@abc.com, password: admin@abc.com, email: admin@abc.com, birthdate: 01/01/2000, gender: Female

Once you have registered, you can login with each of the credentials, and you should see personalized recommendations 
in the second slot of the top row of the page. You can also see the next generation features enabled for admin. 

All of this configuration is sourced from the config.json which we built using Lambda Genie using the instructions [here](https://lambdagenie.com/docs/intro)


## Learn More

You can learn more about Lambda Genie [here](https://lambdagenie.com)





