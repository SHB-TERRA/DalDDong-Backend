module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'promise',
        {
            name:{
                type: DataTypes.STRING(20),
                alllowNull: false,
                unique: false
            },
            user_id:{
                type:DataTypes.STRING(20),
                allowNull: false,
                unique: false
            },
            promise_time:{
                type:DataTypes.DATE,
                allowNull:false
            },
            place:{
                type:DataTypes.STRING(60),
                allowNull:false
            },
            meeting_place:{
                type:DataTypes.STRING(60),
                allowNull:false
            },
            max_people:{
                type:DataTypes.INTEGER,
                allowNull:false
            },
            is_board:{
                type:DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        }
    )
}