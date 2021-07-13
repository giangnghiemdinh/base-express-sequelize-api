const bcrypt = require('bcryptjs');
const paginate = require('../utils/paginate');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return undefined;
        },
      },
      role: {
        type: DataTypes.STRING,
        default: 'user',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async function (user) {
          const salt = bcrypt.genSaltSync();
          user.password = await bcrypt.hash(user.password, salt);
          user.role = 'user';
          user.isEmailVerified = false;
        },
      },
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    User.Tokens = User.hasMany(models.Token, { foreignKey: 'user' });
  };
  User.prototype.isPasswordMatch = async function (password) {
    const { dataValues } = this;
    return bcrypt.compare(password, dataValues.password);
  };
  User.isEmailTaken = async function (email, excludeUserId = null) {
    const conditions = {};
    conditions.email = email;
    if (excludeUserId) {
      conditions.id = excludeUserId;
    }
    const user = await this.findOne({ where: { ...conditions } });
    return !!user;
  };
  User.paginate = paginate.bind(User);
  return User;
};
