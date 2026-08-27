const mcaOnly = (req,res, next) =>{
    if(!req.user || req.user.department !== "MCA"){
        return res.status(403).json({
            message : "Access Denied. Only Mca department users can perform this action"
        })
    }
    next();
}

export default mcaOnly;