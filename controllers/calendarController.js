import user from '../models/user';

const { User, Promise, Participant, Sequelize: { Op } } = require('../models');

export const getMyCalendar = async (req, res, next) => {
    let result = '';
    try {
        result = await Participant.findAll({
            include:[{
                model: Promise
            }],
            where:{
                user_id: req.body.user_id,                
            }
        });
        console.log(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(result);
}
export const addPromise = async (req, res) => {
    let newPromise = '';
    let newParticipant = '';
    let falseResults = '';

    try{
        // participants는 행번 array { participants: []}
        let participants = req.body.participants; 
        let max_people = participants.length;
        var time = req.body.promise_day + ' ' + req.body.promise_time
        var parsedTime = moment(time, 'YYYY-MM-D HH:mm:ss');

        newPromise = await Promise.create({
            meeting_place: req.body.meeting_place,
            place: req.body.place,
            max_people: req.body.max_people || max_people,
            promise_time: parsedTime,
            name: req.body.title || (promise_time + ' ' +req.body.username),
            user_id: req.user.user_id,
            is_board: false
        });

        if (!newPromise) {
            return res.status(500).send({message: '파라미터 값이 잘못되었습니다'});
        }

        // 행번으로부터 userlists 조회
        userLists = User.findAll({
            where: {
                user_id:{
                    [Op.in]: participants
                },
                email_verified: true
            }
          });
        
        if ( userLists.length != max_people ) 
            return res.status(500).send({message: '참가자 행번이 잘못되었습니다'});
        
        for (user in userLists) {
            //당일 약속이 있는 참가자들 확인 
            let promiseLists = await Promise.findAll({
                include:[{
                    model: Participant
                }],
                where:{
                    user_id: user.user_id,  
                    [and] :{
                        promise_time: {[gte]: moment(req.body.promise_day, 'YYYY-MM-D HH:mm:ss').startOf('day')},
                        promise_time: {[lt]: moment(req.body.promise_day, 'YYYY-MM-D HH:mm:ss').add(1, 'days').startOf('day') }//다음날 
                    }
                }
            });

            if ( promiseLists ) {
                falseResults.push(promiseLists)
                break;
            }

            newParticipant = await Participant.create({
                user_id : user.user_id,
                promise_id: newPromise.id
            });
        }

        if (falseResults.length > 0) {
            await Promise.destroy({
                id: newPromise.id
            });
            res.status(500).json(falseResults);
        }

    } catch (error) {
        res.status(500).json(falseResults);
    }

    return res.status(200).json({message: 등록완료});
}