const DatasetController = require("../controllers/DatasetController");
const TeamController = require("../controllers/TeamController");
const verifyToken = require("../modules/verifyToken");
const accessControl = require("../modules/accessControl");

module.exports = (app) => {
  const datasetController = new DatasetController();
  const teamController = new TeamController();
  const root = "/team/:team_id/datasets";

  const checkPermissions = (actionType = "readOwn") => {
    return async (req, res, next) => {
      const { team_id } = req.params;

      // Fetch the TeamRole for the user
      const teamRole = await teamController.getTeamRole(team_id, req.user.id);

      if (!teamRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      const permission = accessControl.can(teamRole.role)[actionType]("dataset");
      if (!permission.granted) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { role, projects } = teamRole;

      // Handle permissions for teamOwner and teamAdmin
      if (["teamOwner", "teamAdmin"].includes(role)) {
        return next();
      }

      if (role === "projectAdmin" || role === "projectViewer") {
        const connections = await datasetController.findByProjects(projects);
        if (!connections || connections.length === 0) {
          return res.status(404).json({ message: "No connections found" });
        }

        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    };
  };

  /*
  ** Route to get all datasets
  */
  app.get(root, verifyToken, checkPermissions("readAny"), (req, res) => {
    return datasetController.findByTeam(req.params.team_id)
      .then((datasets) => {
        return res.status(200).send(datasets);
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  });

  /*
  ** Route to get a dataset by ID
  */
  app.get(`${root}/:id`, verifyToken, checkPermissions("readAny"), (req, res) => {
    return datasetController.findById(req.params.id)
      .then((dataset) => {
        return res.status(200).send(dataset);
      })
      .catch((err) => {
        if (err && err.message && err.message === "401") {
          return res.status(401).send(err);
        }

        return res.status(400).send(err);
      });
  });
  // ----------------------------------------------------

  /*
  ** Route to create a new dataset
  */
  app.post(root, verifyToken, checkPermissions("createAny"), (req, res) => {
    return datasetController.create(req.body)
      .then((dataset) => {
        return res.status(200).send(dataset);
      })
      .catch((err) => {
        if (err && err.message && err.message === "401") {
          return res.status(401).send(err);
        }

        return res.status(400).send(err);
      });
  });
  // ----------------------------------------------------

  /*
  ** Route to get the datasets by Chart ID
  */
  app.get(`${root}`, verifyToken, checkPermissions("readyAny"), (req, res) => {
    return datasetController.findByChart(req.params.chart_id)
      .then((dataset) => {
        return res.status(200).send(dataset);
      })
      .catch((err) => {
        if (err && err.message && err.message === "401") {
          return res.status(401).send(err);
        }

        return res.status(400).send(err);
      });
  });
  // ----------------------------------------------------

  /*
  ** Route to update a dataset
  */
  app.put(`${root}/:id`, verifyToken, checkPermissions("updateAny"), (req, res) => {
    return datasetController.update(req.params.id, req.body)
      .then((dataset) => {
        return res.status(200).send(dataset);
      })
      .catch((err) => {
        if (err && err.message && err.message === "401") {
          return res.status(401).send(err);
        }

        return res.status(400).send(err);
      });
  });
  // ----------------------------------------------------

  /*
  ** Route to delete a dataset
  */
  app.delete(`${root}/:id`, verifyToken, checkPermissions("deleteAny"), (req, res) => {
    return datasetController.remove(req.params.id)
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  });
  // ----------------------------------------------------

  /*
  ** Route to run the request attached to the dataset
  */
  app.get(`${root}/:id/request`, verifyToken, checkPermissions("readAny"), (req, res) => {
    return datasetController.runRequest(
      req.params.id, req.params.chart_id, req.query.noSource, req.query.getCache
    )
      .then((dataset) => {
        const newDataset = dataset;
        if (newDataset?.data) {
          const { data } = newDataset;
          if (typeof data === "object" && data instanceof Array) {
            newDataset.data = data.slice(0, 20);
          } else if (typeof data === "object") {
            const resultsKey = [];
            Object.keys(data).forEach((key) => {
              if (data[key] instanceof Array) {
                resultsKey.push(key);
              }
            });

            if (resultsKey.length > 0) {
              resultsKey.forEach((resultKey) => {
                const slicedArray = data[resultKey].slice(0, 20);
                newDataset.data[resultKey] = slicedArray;
              });
            }
          }
        }

        return res.status(200).send(newDataset);
      })
      .catch((err) => {
        if (err && err.message === "404") {
          return res.status(404).send((err && err.message) || err);
        }
        return res.status(400).send((err && err.message) || err);
      });
  });
  // ----------------------------------------------------

  return (req, res, next) => {
    next();
  };
};
