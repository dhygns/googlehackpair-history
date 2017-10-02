import * as THREE from "three"
import Socket from "socket.io-client"

const SERVER_IP = "http://172.20.10.9:5000/visual";

export default class {
    constructor(callback) {
        this.socket = Socket(SERVER_IP);
        //send emit
        switch (this.socket.disconnected) {
            case true: {
                console.warn("[SERVER CONNECTION FAILED] this project might be for debug or has ERROR. it will be worked by DEBUG MODE.");

                this.res = [];

                document.addEventListener("keydown", ({key})=>{
                    if(key != " ") return;
                    this.res.push({
                        originName : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
                    });
                    console.log("KEYDOWN");
                    callback(JSON.stringify(this.res));
                });

            } break;
            case false: {
                console.log("[SERVER CONNECTED SUCCESSFULLY]");

                this.socket.emit("get-history");
                this.socket.on("current-history", callback);
            } break;
        }
    }
}