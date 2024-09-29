
Prerequisites
NodeJS v20+ (use only even versions)

NPM

MySQL (v5+) or PostgreSQL (12.5+)

Redis (v6+)

Getting Started
Installation & Setup
TIP

The setup doesn't work in Windows PowerShell or cmd.exe. If you're using Windows, please use a bash command line like Git Bash or cygwin

Create a Chartbrew database
Chartbrew works with both MySQL and PostgreSQL. You can use any of the two, but you need to create a database first.

Follow the instruction here.

Get and setup the project
sh
git clone 
npm run setup
Set up the environmental variables
All the environmental variables that need to be set are found in the .env-template file in the root folder of the project. If you ran the setup above, you should already have a .env file there as well. If not, copy the template file and rename it .env.

Make sure you fill out the production and development sections accordingly.

See the full list of variables here

Run the project locally
Open two terminals, one for front-end and the other for back-end.

sh
# frontend
cd client/
npm run start

# backend
cd server/
npm run start-dev
Set up Redis for automatic dataset updates
Chartbrew uses queues to update datasets automatically and it uses Redis to achieve this. In order for your datasets and charts to update automatically, you need to set up Redis first.

Find out how to set up Redis on various platforms here..

Tech stack
Backend

NodeJS
ExpressJS
Sequelize ORM
Nodemailer
BullMQ
Redis
Frontend

ReactJS
Redux
NextUI
ChartJs
Docs

Vitepress
Environmental variables
The table below shows the production variables. The development variables have the same naming, but they are appended with _DEV (example: CB_DB_NAME -> CB_DB_NAME_DEV)

Variable	Default value	Description
CB_DB_NAME

required	chartbrew	The name of the database
CB_DB_USERNAME

required	No default	The username of the user that has access to the database
CB_DB_PASSWORD	No default	The password associated with the database user
CB_DB_HOST

required	localhost	The host address where the database is located
CB_DB_PORT	3306	The port of the hosting address
CB_DB_DIALECT

required	mysql	Which database to use between mysql and postgres
CB_DB_CERT	No default	If your DB requires an SSL connection, use this variable to provide the string value of the certificate
CB_ENCRYPTION_KEY

required	A key will be generate for you during the first run	A secure 32 bytes string which is used to encrypt the data in the database. Click here to see how you can generate a key.
CB_REDIS_HOST	localhost	The host address where the Redis server is located
CB_REDIS_PORT	6379	The port of the Redis server
CB_REDIS_PASSWORD	No default	The password for the Redis server, if required
CB_REDIS_DB	0	The Redis database number to use
CB_REDIS_CA	No default	The string value of the certificate
CB_API_HOST

required	localhost	The address where the server app is running from. This variable is used internally by the server app.
This value is overwritten by the PORT variable (if set)
CB_API_PORT

required	4019	The port where the server app is running from. This variable is used internally by the server app
VITE_APP_CLIENT_HOST

required	http://localhost:4018	The full address where the client app is running from. This variable is used in the client app and it's populated during the building process.

Note The app needs to be restarted/rebuilt when this value is changed.
VITE_APP_CLIENT_PORT

required	4018	The port where the client app is running from. This variable is used in the client app and it's populated during the building process.

Note The app needs to be restarted/rebuilt when this value is changed.
VITE_APP_API_HOST

required	http://localhost:4019	The full address where the server app is running. This variable is used by the client app.

Note The app needs to be restarted/rebuilt when this value is changed.
CB_MAIL_HOST	smtp.gmail.com	The server host of the email provider
CB_MAIL_USER	No default	The username used to log in on the email server
CB_MAIL_PASS	No deafult	The password used to log in on the email server
CB_MAIL_PORT	465	The port used to connect to the email server
CB_MAIL_SECURE	true	true - Use SSL to connect to the email server

false - Use TLS to connect to the email server
CB_ADMIN_MAIL	hello@example.com	The email address used to send the emails from
CB_RESTRICT_TEAMS	0	0 - New users will have their own team created on sign-up.

1 - New users don't have a team on signup and can't create their own.
CB_RESTRICT_SIGNUP	0	0 - Anyone can create accounts from the signup page

1 - New users can only sign up using invite links
CB_GOOGLE_CLIENT_ID	No default	Google app Client ID generated from the Console

(Needed for Google integrations)
CB_GOOGLE_CLIENT_SECRET	No default	Google app Client Secret generated from the Console

(Needed for Google integrations)
CB_BACKEND_WORKERS	4	Some background tasks in Chartbrew will use workers to spread work on multiple threads. Still testing, but for best performance, set this to the number of threads your CPU has
Generate the encryption key
You will need a 32 bytes AES encryption key for the CB_ENCRYPTION_KEY variable. Chartbrew generates both CB_ENCRYPTION_KEY and CB_ENCRYPTION_KEY_DEV for you during the first run, but if you wish to have control over the value, you can generate it yourself.

Run the following command to generate a valid key:

sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
//-----------------------------------------------------------------------------------------------------------------------------------------------------

Database configuration
MySQL
You can install MySQL from multiple places. You can install it using Xampp, for example. Download it from here >>

After you download it, make sure the MySQL and Apache services are running in the console, then head over to localhost/phpmyadmin or 127.0.0.1/phpmyadmin and create a new database using the UI.

PostgreSQL
As an alternative to MySQL, Chartbrew now supports PostgreSQL. After you download & install Postgres, you will have to create a new database that Chartbrew can use. You can create a new database using:

pgAdmin4
SQL language
Environmental variables
The environmental variables below need to be set in the .env file in the root folder. If the file is not there, create it yourself and use the .env-template file as a guide.

sh
### PRODUCTION

CB_DB_NAME= # Database name
CB_DB_USERNAME= # Database username
CB_DB_PASSWORD= # Database password
CB_DB_HOST= # Database host
CB_DB_PORT= # The port on which your database server runs
CB_DB_DIALECT= # 'mysql' or `postgres`
# If your database requires an SSL connection
CB_DB_CERT= # String format of the certificate 

### DEVELOPMENT

CB_DB_NAME_DEV= # Database name
CB_DB_USERNAME_DEV= # Database username
CB_DB_PASSWORD_DEV= # Database password
CB_DB_HOST_DEV= # Database host
CB_DB_PORT_DEV= # The port on which your database server runs
CB_DB_DIALECT_DEV= # 'mysql' or `postgres`
# If your database requires an SSL connection
CB_DB_CERT_DEV= # String format of the certificate

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

Structure
|-- server
    |-- .eslintrc.json          # eslint configuration
    |-- .gitignore
    |-- index.js                # Server entry file
    |-- package-lock.json
    |-- package.json
    |-- settings-dev.js         # Global dev app settings
    |-- settings.js             # Global production app settings
    |-- api                     # All the routes are placed in this folder
    |   |-- UserRoute.js        # Example route for the /user
    |-- charts                  # Chart configurations
    |   |-- BarChart.js
    |   |-- LineChart.js
    |   |-- PieChart.js
    |-- controllers             # Controllers that interact directly with the models
    |   |-- UserController.js
    |-- models                  # All database-related files
    |   |-- config              # DB configration
    |   |   |-- config.js
    |   |-- models
    |   |   |-- User.js         # Example User model
    |   |-- migrations          # DB migration files
    |   |-- seeders             # If any data needs to be placed in the database
    |-- modules                 # Misc modules (AKA Services, Middlewares)
How it works
Basically, a Model needs a Controller and if any data needs to be exposed through the API, then a Route is needed as well. The next part of the documentation will show a practical example on how to create a new model, controller, route and middleware.

Models
Check out the Sequelize documentation to find out all the possible options for a model.

To create a new model run the following command in server/models:

sh
npx sequelize-cli model:generate --name Brew --attributes name:string
...where Brew is the model name and name is a string attribute.

Important! make sure that the generated migration contains all the fields created in the model.

Check the other models to learn how to create associations.

Code style used by the models:

javascript
// any fields that define a relation will use snake_case
user_id: { // snake_case here
  type: Sequelize.INTEGER,
  allowNull: false,
  reference: {
    model: "Team",
    key: "id",
    onDelete: "cascade",
  },
},

// any other fields, camelCase
name: { // camelCase here
  type: Sequelize.STRING,
},
Now let's see how a new model can be integrated with the app. In the example below we will create a Brew model.

javascript
module.exports = (sequelize, DataTypes) => {
  const Brew = sequelize.define("Brew", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "Team",
        key: "id",
        onDelete: "cascade",
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    flavour: {
      type: DataTypes.String,
      defaultValue: "Charty",
    },
  }, {
    freezeTableName: true, // ! important to set this !
  });

  Brew.associate = (models) => {
    // example association when a brew has multiple ingredients
    // the 'Ingredient' model has a foreign key names 'brew_id'
    models.Brew.hasMany(models.Ingredients, { foreignKey: "brew_id" });
  };

  return Brew;
};
Controllers
The controllers hold all the functions that the app needs to manipulate the data with Sequelize (or any other functionality that uses data from the database). If the functions are not using any data from the database, consider using Middleware or Modules.

Controllers code-style and Brew example below:

javascript
const db = require("../models/models");

class BrewController { // The name of the controllers should always be <Model>Controller
  findById(id) { // standard function name when retrieving one item
    return db.Brew.findByPk(id) // always using promises (no callbacks, async/await acceptable)
      .then((foundBrew) => {
        if (!foundBrew) {
          return new Promise((resolve, reject) => reject(new Error(404)));
        }

        return foundBrew;
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(error.message || error));
      });
  }
}
Routes
Like the models, all the routes need to be registered in api/index.js file in order for the application to see them.

Below is an example of a brew route that uses the controller created above with some explanations about the code style guide.

javascript
const BrewController = require("../controllers/BrewController");

module.exports = (app) => {
  const brewController = new BrewController(); // initialise the controller in a camelCase variable

  /*
  ** This is a mandatory explanation of the route.
  ** This route will return a single brew by ID
  */
  app.get("/brew/:id", (req, res) => {
    return brewController.findById(req.params.id) // promises (desirable) or async/await
      .then((foundBrew) => {
        return res.status(200).send(foundBrew);
      })
      .catch((error) => { // needs a better error management strategy, but this is how it's done atm
        if (error.message === "404") {
          return res.status(404).send({ error: "not found" });
        }

        return res.status(400).send({ error });
      });
  });
  // ------------------------------------------

  // this modules needs to return a middleware
  return (req, res, next) => {
    next();
  };
};
The next step is to register the new route with the index file:

javascript
const brew = require("../BrewRoute");
// ---

module.exports = {
  brew,
  // ---
};
Authentication
Chartbrew uses jwt token authentication.

To make authenticated requests, the Authorization header must be set to include a valid token


Authorization: Bearer <token>
Making a POST to /user/login with a valid email and password will return the token in the response.

In order to add authorization checks to the routes, the verifyToken middleware can be used in the routes like so:

javascript
const verifyToken = require("../modules/verifyToken");
// -------

app.get("/brew/:id", verifyToken, (req, res) => {
  // ---
});
// ---
Permissions & Roles
Chartbrew implements permissions and roles as well, but in not-so-ideal way. A future update will try a remedy this in a way to make it easier to make changes to these.

All the permissions and roles are registered in modules/accessControl.js. It is important to note that most of these roles are from the team perspective. So for example if a chart "read:any" permission is given to a user, this user can read any charts from the team that user is in only.

Below you can see an example on how to protect resources based on permissions and roles.

javascript
// create a chart example
app.post("/project/:project_id/chart", verifyToken, (req, res) => {
  return projectController.findById(req.params.project_id)
    .then((project) => {
      // get the team role for the user that is making the request
      // "req.user" is populated by the "verifyToken" middleware
      return teamController.getTeamRole(project.team_id, req.user.id);
    })
    .then((teamRole) => {
      // if the user can update any charts in the team, proceed with the request
      const permission = accessControl.can(teamRole.role).updateAny("chart");
      if (!permission.granted) {
        throw new Error(401);
      }
    }
    // ---
  });
  // ---
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

Structure
|--- Client:-
|-- .eslintrc.json
|-- package.json
|-- config                          # Webpack, jest, etc config files
|-- public                          # Contains the entry index.html file
|-- scripts                         # React scripts (build, run, etc)
|-- src
    |-- actions                     # Redux actions
    |-- assets                      # Any assets (images and stuff)
    |-- components                  # React (dumb) components that should be re-usable
    |-- config                      # various config files with globals, colors, misc functions
    |-- containers                  # React smart components (usually pages that contain multiple components)
    |-- reducers                    # Redux reducers
How this works
If you never used React Redux before, it's strongly recommended to run a quick-start before attempting to modify anything in the front-end.

The main point on future developments will be to always develop with the props down, events up mentality. In Chartbrew this means that a container should send the props to a component and the component can call any events that were passed down by the container. The events will run in the parent component.

The new components should be functional and use React Hooks.

WARNING

Currently, the containers are quite huge and some components are not as dumb as they should be. This will be improved with future updates.

Example
The following example will create a dummy container with a component, reducer and action.

Actions
The actions are placed in the actions/ folder.

javascript
// actions/brew.js

import { API_HOST } from "../config/settings";

export const FETCHING_BREW = "FETCHING_BREW"; // this is the type of action, used for identification
export const FETCHED_BREW = "FETCHED_BREW";

export function getBrew(id) {
  return (dispatch) => { // dispatch is used to send the action to the reducer
    const url = `${API_HOST}/brew/${id}`;
    const method = "GET";
    const headers = new Headers({
      "Accept": "application/json",
    });

    dispatch({ type: FETCHING_BREW });
    return fetch(url, { method, headers }) // like in the backend code, Promises are preferred
      .then((response) => {
        if (!response.ok) {
          return new Promise((resolve, reject) => reject(response.statusText));
        }

        return response.json();
      })
      .then((brew) => {
        dispatch({ type: FETCHED_BREW, brew }); // dispatching the action together with the payload
        return new Promise((resolve) => resolve(brew));
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(error));
      });
  };
}
Reducer
The reducers are placed in the reducers/ folder and registered in the index file there.

javascript
// reducers/brew.js

import {
  FETCHING_BREW,
  FETCHED_BREW,
} from "../actions/brew";

export default function brew((state) = {
  loading: false,
  data: {},
}, action) {
  switch (action.type) {
    case FETCHING_BREW:
      return { ...state, loading: true };
    case FETCHED_BREW:
      // remember the "brew" payload dispatched from the action
      return { ...state, loading: false, data: action.brew };
    default:
      return state;
  }
}
Don't forget to register this reducer in the index.js file in the same folder.

Component
This will be an example component to show the name and flavour of the brew and a simple button with an event attached.

javascript
// components/BrewCard.js

import React from "react";
import PropTypes from "prop-types";
import { Button } from "@nextui-org/react";

function BrewCard(props) {
  const { brew, mixBrew } = props;

  return (
    <div style={styles.container}>
      <h2>{{brew.name}}</h2>
      <p>{{brew.flavour}}</p>
      <Button onClick={mixBrew} auto>
        Mix the Brew
      </Button>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};

BrewCard.defaultProps = {
  mixBrew: () => {},
};

BrewCard.propTypes = {
  brew: PropTypes.object.isRequired,
  mixBrew: PropTypes.func,
};

export default BrewCard;
Container
This will be a page showing the BrewCard component after getting calling the getBrew action.

javascript
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container, Loading, Row, Dimmer, Spacer, Text, Card,
} from "@nextui-org/react";

import { getBrew as getBrewAction } from "../actions/brew";

function BrewPage(props) {
  const { getBrew, brew, loading } = props;
  const [mixed, setMixed] = useState(false);

  useEffect(() => {
    getBrew(1);
  }, []);

  // container functionality should be prepended with a '_'
  const _onMixBrew = () => {
    setMixed(true);
  };

  if (loading) {
    return (
      <Container sm justify="center">
        <Row justify="center">
          <Loading size="lg" />
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row justify="center">
        <Text h2>The Brew</Text>
      </Row>
      <Spacer y={1} />
      <Row justify="center">
      <Card>
        <Card.Body>
          <BrewCard brew={brew} mixBrew={_onMixBrew} />
        </Card.Body>
        <Card.Footer>
          {mixed && (
            <Text color="success">
              The brew is mixed
            </Text>
          )}
        </Card.Footer>
      </Row>
    </Container>
  );
}

BrewPage.propTypes = {
  getBrew: PropTypes.func.isRequired,
  brew: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    brew: state.brew.data,
    loading: state.brew.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBrew: (id) => dispatch(getBrewAction(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrewPage);

//---------------------------------------------------------------------------------------------------------------------------------------------------

Integration

1. Google Analytics
The Google Analytics integration can be used once a new project is created and configured in Google Console.

Setup
Create a new project here
Click on APIs and Services in the side menu
Click on Library in the side menu and type analytics in the search bar
Click and enable both Google Analytics Reporting API, Google Analytics API, and Google Analytics Admin API
Head back to the APIs and Services page and click on OAuth Consent Screen option in the side menu
Select on either Internal or External depending on how you plan to use the integration
You will have to fill in all the required details in the form (no need for domain yet) then continue without filling anything on the rest of the tabs
Click on Credentials in the side menu, click on Create credentials, and select OAuth Client ID
Select Web application from the dropdown list, enter any name, and in Authorized redirect URIs enter:
http://localhost:4018/google-auth (for local use)
https://example.com/google-auth (for production use with your domain)
You will get a Client ID and Client Secret which you will have to use for the CB_GOOGLE_CLIENT_ID and CB_GOOGLE_CLIENT_SECRET environmental variables
Head back to the OAuth Consent Screen, scroll down the page, and add test users to enable certain google accounts to use the integration
(Optional) If you want to publish the Google app, you will have to click on the "Publish app" at the top of the page.

2. Webhooks
Currently webhooks are used by Chartbrew to send chart alerts.

Webhook chart alerts
Chartbrew sends POST requests to the webhook URL with the following payload:

chart - the chart name as a string
alert - the alert configuration
type - the alert type is one of milestone, threshold_above, threshold_below, threshold_between, threshold_outside, anomaly
rules - this is an object that shows the trigger rules for the alert
alertsFound - an array of objects containing a label and a value for each item on the chart that triggered the alert
dashboardUrl - the URL to the dashboard where the chart is located
Example payload:
{
  "chart": "Site stats",
  "alert": { "type": "milestone", "rules": { "value": "40" } },
  "alertsFound": [
    { "label": "2023 Jan 13", "value": 47 }
  ],
  "dashboardUrl": "https://app.chartbrew.com/project/1"
}

 

//**************************************************************






