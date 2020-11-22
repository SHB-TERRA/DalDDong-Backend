module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            name:{
                type: DataTypes.STRING(20),
                alllowNull: true,
                unique: false
            },
            email:{
                type:DataTypes.STRING(40),
                allowNull:false,
                unique: true
            },
            user_id:{
                type:DataTypes.STRING(20),
                allowNull:true,
                unique:true
            },
            password:{
                type:DataTypes.STRING(2048),
                allowNull:false
            },
            email_verified: {
                type:DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            key_for_verify :{
                 type: DataTypes.STRING(150), 
                 required:true 
            }
        },
        {
            timestamps: true,
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        }
    )
}