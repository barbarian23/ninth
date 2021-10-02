import receive from "../controller/reactjs/render.controller"; // render client

//render ra file html    
const router = async function (req, res) {
    console.log("url", req.url);
    receive(req, res);
};

export default router;