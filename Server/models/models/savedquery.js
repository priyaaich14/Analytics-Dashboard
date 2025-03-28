module.exports = (sequelize, DataTypes) => {
  const SavedQuery = sequelize.define("SavedQuery", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "Team",
        key: "id",
        onDelete: "cascade",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "User",
        key: "id",
        onDelete: "cascade",
      },
    },
    summary: {
      type: DataTypes.STRING,
    },
    query: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.STRING,
    },
  }, {
    freezeTableName: true,
  });

  SavedQuery.associate = (models) => {
    models.SavedQuery.belongsTo(models.User, { foreignKey: "user_id" });
    models.SavedQuery.belongsTo(models.Team, { foreignKey: "team_id" });
  };

  return SavedQuery;
};
