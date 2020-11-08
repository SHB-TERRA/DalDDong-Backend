module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            name:{
                type: DataTypes.STRING(20),
                alllowNull: false,
                unique: false
            },
            email:{
                type:DataTypes.STRING(40),
                allowNull:false,
                unique: true
            },
            user_id:{
                type:DataTypes.STRING(20),
                allowNull:false,
                unique:true
            },
            password:{
                type:DataTypes.STRING(60),
                allowNull:false
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        }
    )
}