Eye
=================

simple but cool solution for reporting frontend errors, blink blink.

Prerequisites

- firebase account and created database
- js app
- patience to solve your clients' errors

The idea

- get console.logs, errors, warnings
- get js exceptions
- get user environment
- save them to localStorage
- when the exception occurs (you specify when), send the data to firebase
- observe your user behaviour and steps in a nice form

Code style
- I don't care how you code, it should integrate seamlessly
- insert :: to separate the title of an event and description. console.log("CustomersAction :: user entered this weird screen");
- the only dependency is a firebase client

Inspiration
- meet.js meeting
- trackjs.com
- getsentry
- keen.io 

Todo
- client app in Angular
- quota exceeded err
- support apps that use localStotage, dont be greedy
