
function sseServer(res) {
    // const userServerSentEventMiddleware = (res) => {

    //     // res.flushHeaders();
    //     res.writeHead(200, {
    //         "Connection": "keep-alive",
    //         "Content-Type": "text/event-stream",
    //         "Cache-Control": "no-cache",
    //     });
    //     const sendEventStreamData = (data) => {
    //         res.write('event: message\n');
    //         res.write(`data: ${JSON.stringify(data)}`);
    //         res.write("\n\n");
    //         res.flush();
    //     }

    //     // thêm hàm sendEventStreamData vào res, sau này chỉ cần gọi hàm này để gửi event
    //     Object.assign(res, {
    //         sendEventStreamData
    //     });

    //     return res;
    // }

    res.writeHead(200, {
        // 'Access-Control-Allow-Headers': 'Content-Type',
        // 'Access-Control-Allow-Origin': '*',
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });

    let sseInner = {
        sendData: function (data) {
            res.write('event: message\n');
            res.write(`data: ${JSON.stringify(data)}`);
            res.write("\n\n");
            res.flush();
        },
        close: function (fn,param) {
            res.on('close', ()=>{
                fn(param);
                res.end();
            });
        }
    }

    return sseInner;

}
export default sseServer;