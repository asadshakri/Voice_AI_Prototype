const { v4 } =require('uuid');

const createUuid= async(req, res) => {
    try {
        const uuid = v4();
        res.json({ uuid });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports={
    createUuid
}
