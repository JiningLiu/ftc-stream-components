
console.log("Server started");

interface Banner {
    topLeft: string;
    bottomLeft: string;
    centerLeft: string;
    centerRight: string;
    topRight: string;
    bottomRight: string;
}

let banner = {
    dataInternal: {
        topLeft: 'Awaiting Data...',
        bottomLeft: 'An Open Source Project from Jining Liu & Contributors',
        centerLeft: '',
        centerRight: '',
        topRight: 'Westwood Robotics',
        bottomRight: 'FTC 20240 Slingshot',
    } as Banner,
    dataListener: function (val: Banner) { },
    set data(val: Banner) {
        this.dataInternal = val;
        this.dataListener(val);
    },
    get data() {
        return this.dataInternal;
    },
    registerListener: function (listener: (val: Banner) => void) {
        this.dataListener = listener;
    }
}

const server = Bun.serve({
    port: 20240,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade to WebSocket Failed", { status: 500 });
    },
    websocket: {
        message(ws, message) {
            let data = JSON.parse(message as string);
            banner.data = data as Banner;
        },
        open(ws) {
            ws.subscribe("banner");
            ws.send(JSON.stringify(banner.data));
            banner.registerListener(function (val: Banner) {
                console.log("banner changed to:", val);
                server.publish("banner", JSON.stringify(val));
            });
        },
        close(ws, code, message) { }, // a socket is closed
        drain(ws) { }, // the socket is ready to receive more data
    },
});