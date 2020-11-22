// CREATE TABLE session(
//     sid                     VARCHAR(100) PRIMARY KEY NOT NULL,   
//     session                 VARCHAR(2048) DEFAULT '{}',   
//     lastSeen                DATETIME DEFAULT NOW() 
//   );

const { now } = require("sequelize/lib/data-types")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'session',
        {
            sid:{
                type: DataTypes.STRING(100),
                alllowNull: false,
                unique: true,
                primaryKey: true
            },
            session:{
                type:DataTypes.STRING(2048),
                allowNull:true,
                defaultValue: '{}'
            },
            lastSeen:{
                type:DataTypes.DATE,
                allowNull:false,
                defaultValue:now
            }
        },
        {
            timestamps: false,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        }
    )
}