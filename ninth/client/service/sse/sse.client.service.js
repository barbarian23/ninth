function sseClient(url) {
    const source = new EventSource(url);
    let sse = {
        connect: function (callback) {
            source.onopen = e => {
                console.log("sseClient onopen",e);
            }
            source.onmessage = function logEvents(event) {
                callback(event);
            }
            source.addEventListener('ping', e => {
                console.log("sseClient error",e);
            });
        }
    }
    return sse;
}
export default sseClient;