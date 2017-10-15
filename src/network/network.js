import * as THREE from "three"
import Socket from "socket.io-client"
import Config from "./../config.js"

export default class {
    constructor(callback) {
        if (!Config.DEBUG) {
            this.socket = Socket(this.IP + "/visual");
            console.log(this.IP);

            this.socket.emit("get-history");
            this.socket.on("current-history", callback);
        } else {
            console.warn("[SERVER CONNECTION FAILED] this project might be for debug or has ERROR. it will be worked by DEBUG MODE.");

            this.res = [];


            //added Debug Event
            document.addEventListener("keydown", ({ key }) => {
                if (key != " ") return;
                const idx =  Math.round(Math.random() * 6.0);
                this.res.push({
                    originSrc: "./res/images/dummy0" + idx + ".jpg",
                    styleSrc: "./res/images/dummy0" + idx + ".jpg",
                    resultSrc: "./res/images/dummy0" + idx+ ".jpg",
                    styleName: "DUMMY NAME",
                    styleId: "STYLE ID",
                    createdDate: "2017.10.21",

                });
                callback(JSON.stringify(this.res));
            });
        }


        // //send emit
        // switch (this.socket.disconnected) {
        //     case true: {
        //         console.warn("[SERVER CONNECTION FAILED] this project might be for debug or has ERROR. it will be worked by DEBUG MODE.");

        //         this.res = [];


        //         //added Debug Event
        //         document.addEventListener("keydown", ({key})=>{
        //             if(key != " ") return;
        //             this.res.push({
        //                 originSrc : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
        //                 styleSrc : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
        //                 resultSrc : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
        //                 styleName : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
        //                 styleId :"./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",
        //                 createdDate : "./res/images/dummy0" + Math.round(Math.random() * 6.0) + ".jpg",

        //             });
        //             console.log("KEYDOWN");
        //             callback(JSON.stringify(this.res));
        //         });

        //     } break;
        //     case false: {
        //         console.log("[SERVER CONNECTED SUCCESSFULLY]");
        //     } break;
        // }
    }

    req(str) { this.socket.emit("select-result-request", str); }

    get IP() { return Config.SOCKET_HOST + ":" + Config.SOCKET_PORT; }
}