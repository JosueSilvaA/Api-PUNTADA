const webpush = require('../configs/webPush');
const Usuario = require("../models/usuario");
const endPointUsuario = require("../models/endPointUsuario");




const getAdmins = async () => {
    const data = await Usuario.find({rol: '5f3f14f1963f5800176ca4d4'}, {rol: true})
    return data;
}


    const sendNotification = async (userId, title, message) => {
        // let userEnp = JSON.parse(user)
        const userEP = await endPointUsuario.findOne({ usuario: userId }, { userEndPoint : true});
        // console.log(userEP)
        const payload = JSON.stringify({
            title: title,
            message: message,
        });
        try {
            await webpush.sendNotification(userEP.userEndPoint, payload);
        } catch (error) {
            console.log(error);
        }
    }

    const sendAdminNotification = async (title, message) => {
        const admins = await getAdmins();
        let adminEnpId = [];
        admins.forEach(element => {
            adminEnpId.push(element._id);
        });
        const admEndP = await endPointUsuario.find({usuario :{$in: adminEnpId}}, {userEndPoint: true})
        admEndP.forEach( async (admin) => {
            
            const payload = JSON.stringify({
            title: title,
            message: message,
            });
            // console.log(typeof(admin.userEndPoint));
            // let userEnp = JSON.parse(admin.userEndPoint);
            
            try {
               await webpush.sendNotification(admin.userEndPoint, payload);

            } catch (error) {
                console.log(error);
            }
        });

    }
module.exports = {sendNotification, sendAdminNotification};