module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'participant',
        {
            promise_id:{
                type: DataTypes.INTEGER,
                alllowNull: false,
                unique: false
            },
            user_id:{
                type:DataTypes.STRING(20),
                allowNull:false,
                unique: false
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        }
    )
}