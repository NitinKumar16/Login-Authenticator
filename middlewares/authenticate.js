
module.exports = (req, res, next) => {
    try {

        let token = "admin";

        if(req.cookies['xfcv'] == token){
            next();
        } else {
            //render a denied screen
            res.redirect("/denied")
        }

    } catch (error) {
        console.log(error);
        //render a access denied screen.
        res.redirect("/denied")
    }
}