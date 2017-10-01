import * as THREE from "three"
import Socket from "socket.io-client"

const SERVER_IP = "http://172.20.10.9:5000/visual";

export default class {
    constructor(callback, isDebug = false) {

        //send emit
        switch (isDebug) {
            case true: {

            } break;
            case false: {
                this.socket = Socket(SERVER_IP);
                this.socket.emit("get-history");
                this.socket.on("current-history", callback);
            } break;
        }



    }
}