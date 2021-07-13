module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Token',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  Token.associate = function (models) {
    // associations can be defined here
    Token.User = Token.belongsTo(models.User, { foreignKey: "user" });
  };
  return Token;
};
