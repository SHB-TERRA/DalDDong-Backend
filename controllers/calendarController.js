import promise from '../models/promise';
import moment from 'moment';

const { User, Promise, Participant, Sequelize: { Op }, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

export const getMyCalendar = async (req, res, next) => {
    let promiseArrs = '';
    let result = {};
    try {
	console.log(req.session);
        let MONTH = req.query.month;
        let START_DAY = moment(MONTH, 'YYYY-MM').startOf('month').format("YYYY-MM-D").toString();
        let END_DAY = moment(MONTH, 'YYYY-MM').endOf('month').format("YYYY-MM-D").toString()
        
        if ( req.params.id != req.user.id ) {
            return res.status(403).json({message: "잘못된 접근입니다"});
        }

        const QUERY = "SELECT A.user_id, C.name, D.name AS title, D.id AS promise_id, D.promise_day AS promise_day, D.promise_time AS time,  D.place, D.meeting_place, D.max_people "
        + "FROM participants A "
        + "JOIN (SELECT participants.promise_id FROM participants JOIN users ON participants.user_id=users.user_id where users.id = " + req.params.id + ") "
        + "B ON A.promise_id = B.promise_id "
        + "JOIN users C ON C.user_id = A.user_id " 
        + "JOIN promises D ON D.id = A.promise_id "
        + "WHERE DATE_FORMAT(D.promise_day, '%Y-%m-%d') BETWEEN DATE_FORMAT('" + START_DAY + "' , '%Y-%m-%d') AND DATE_FORMAT('" + END_DAY + "' , '%Y-%m-%d')";
        
        promiseArrs = await sequelize.query(QUERY, { type: QueryTypes.SELECT });
        
        for (var promise of promiseArrs) {
            var DAY = moment(promise.promise_day).format('DD');
            if ( result[DAY] ) {
                result[DAY].push(promise);
            } else {
                result[DAY] = new Array();
                result[DAY].push(promise);
            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(result);
}

export const deleteMyPromise = async (req, res )=> {
    try{

        if ( req.params.id != req.user.id ) {
            return res.status(403).json({message: "잘못된 접근입니다"});
        }

        //TODO 참가자가 다 사라진 Promise 삭제해야하나
        var result = await Participant.destroy({
            where:{
                user_id: req.user.user_id,
                promise_id: req.query.promise_id
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json({
        message: "success"
    });
}

//TODO 구현단계 
export const editMyPromise = async ( req, res, next ) => {    

    try{
        if ( req.params.id != req.user.id ) {
            return res.status(403).json({message: "잘못된 접근입니다"});
        }

        var QUERY = "SELECT * FROM promises A JOIN participants B ON A.id = B.promise_id WHERE promise_id = " + req.body.promise_id;

        var promise = await sequelize.query(
            QUERY,
            {
              type: QueryTypes.SELECT
            }
          );
        
    } catch ( error ){
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json({
        message: "success"
    });
}

export const addPromise = async (req, res) => {
    let newPromise = '';
    let falseResults = new Array();

    try{
        
        if ( req.params.id != req.user.id ) {
            return res.status(403).json({message: "잘못된 접근입니다"});
        }

        // participants는 행번 array { participants: []} 이름(행번)
        let participants = req.body.participants; 
        participants.push(req.body.user_id);
        
        let max_people = participants.length;
        var time = req.body.promise_day + ' ' + req.body.promise_time + ":00"
        
        newPromise = await Promise.create({
            meeting_place: req.body.meeting_place,
            place: req.body.place,
            max_people: req.body.max_people || max_people,
            promise_day: req.body.promise_day,
            promise_time: req.body.promise_time,
            name: req.body.title || (req.body.promise_day+ ' ' + req.body.username),
            user_id: req.body.user_id,
            is_board: false
        });

        if (!newPromise) {
            return res.status(403).send({message: '파라미터 값이 잘못되었습니다'});
        }
        
        // 행번으로부터 userlists 조회
        let userLists = await User.findAll({
            where: {
                user_id:{
                    [Op.in]: participants
                },
                email_verified: true
            }
          });
         
        if ( userLists.length != max_people ) 
            return res.status(403).send({message: '참가자 행번이 잘못되었습니다'});        
        
        for (var user of userLists) {
            //당일 약속이 있는 참가자들 확인 
            let QUERY = 'SELECT A.user_id FROM users A JOIN ( ' +
                'SELECT B.promise_day, C.user_id FROM participants C INNER JOIN promises B ON B.id = C.promise_id ) D ' +
                'ON A.user_id = D.user_id WHERE A.user_id = $user_val AND D.promise_day = "' + req.body.promise_day + '"';
            
            var result = await sequelize.query(
                QUERY,
                {
                  bind: {user_val: user.user_id},
                  type: QueryTypes.SELECT
                }
              );
            
            if ( result.length > 0 ) {
                falseResults.push(result);
                break;
            }
            
            var newParticipant = await Participant.create({
                user_id : user.user_id,
                promise_id: newPromise.id
            });
        }
        
        if (falseResults.length > 0) {
            await Promise.destroy({
                where:{
                    id: newPromise.id
                }
            });
            return res.status(403).json({message: "약속이 중복됩니다"});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json(falseResults);
    }

    return res.status(200).json({message: "등록완료"});
}
