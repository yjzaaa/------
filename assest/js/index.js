let doms={
    ball: document.querySelector(".red-ball"),
    app: document.getElementById("app"),
    h1: document.getElementById("h1")
}


doms.app.addEventListener("mouseover", function () {
    animation(5000, 0, 100, function (value) {
        let str = Math.round(value);
        doms.h1.innerHTML = str;
        doms.ball.style.left = value + "px";
    })

    console.log(getImgPaths()) ;
});
