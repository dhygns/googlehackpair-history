import Network from "./network/network.js"
import Visual from "./visual.js"

//Visual Effect
(function() {
    this.network = new Network(this.action.bind(this));
    this.setup();
}).bind({
    setup : function(datas) {
        console.log("HISTORY PROJECT");
        this.main = new Visual();
        this.animate(0, 0);        
    },

    action : function(res) {
        this.main.action(JSON.parse(res));
    },

    update : function(t, dt) {
        this.main.update(t, dt);
    },

    animate : function(oldt, nowt) {
        this.update(nowt * 0.001, (nowt - oldt) * 0.001);
        requestAnimationFrame(this.animate.bind(this, nowt));
    }
})();