import Network from "./network/network.js"
import Resource from "./manager/resource.js"
import Visual from "./visual.js"

//Visual Effect
(function () {
    this.network = new Network(this.action.bind(this));
    this.resource = new Resource();
    this.setup();
}).bind({
    setup: function () {

        //ForDebug
        document.addEventListener("keydown", ({ key }) => {
            if (key == " ") {
                const info = this.resource.getInfo((this.resource.Count * Math.random()) << 0);
                console.log(info);
                this.network.req(info);
            }
        });


        console.log("HISTORY PROJECT");
        this.main = new Visual(this.resource);
        this.animate(0, 0);
    },

    action: function (res) {
        this.main.action(JSON.parse(res));
        console.log(res);
    },

    update: function (t, dt) {
        this.main.update(t, dt);
    },

    animate: function (oldt, nowt) {
        this.update(nowt * 0.001, (nowt - oldt) * 0.001);
        requestAnimationFrame(this.animate.bind(this, nowt));
    }
})();