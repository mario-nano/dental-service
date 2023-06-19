<div align="center">
  ![Dentsemo](https://cdn.discordapp.com/attachments/1017822557514248263/1061618183838117908/logo_sm_trans.png){:height="200" width="200"}
  <br>
</div>

# Dentsemo
Appointment management system for Dental offices booking and its management 

- [Introduction](#introduction)
- [How to use](#how-to-use)
- [License](#license)

## Introduction

The dental service is a microservice that is responsible for managing information about dental offices and thier informations. It communicates with other microservices using the pub/sub messaging system, through which it can publish messages to be routed to subscribed services. The dental service is accessible to external clients through the API Gateway.

## How to use

To build, run or test the source package for the dental service, you need to install NodeJS package manager first. 
Please refer to [GET NPM](https://www.npmjs.com/get-npm) page to download and install npm. <br /><br />
To run this project, launch Command prompt or terminal and navigate to dental service folder. And run:

    $ npm install

To run the service to use it, run:

    $ npm start


For more information about the website please click [here](https://git.chalmers.se/courses/dit355/dit356-2022/t-13/frontend)


## License
MIT © Team-13 for DIT356
The source code for the site is licensed under the MIT license, which you can find in the MIT-LICENSE.txt file.

