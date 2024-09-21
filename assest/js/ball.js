let doms = {
  ball: document.querySelector(".red-ball"),
  carousel: document.getElementById("carousel"),
  h1: document.querySelector("h1"),
  next: document.querySelector(".next"),
};

let stop = null;

const rect = {
  left: 0,
  top: 0,
  width: 800,
  height: 500,
};

const tasks = [];

const randerTask = (duration, i) => {
  return () => {
    const index = i;
    const start = Date.now();
    while (Date.now() - start < duration) {
      // 空操作，模拟耗时
      // console.log(".");
    }

    return index + 1;
  };
};
const addtasks = () => {
  // 添加一个模拟的同步任务
  for (let i = 0; i < taskProp.length; i++) {
    tasks.push(randerTask(taskProp.timespan, i));
  }
};
addtasks();
const finishTasks = [];
let finishcount = 0;
let lastfinishedtime = 0;

const executeTasks = () => {
  if (tasks.length === 0) {
    addtasks();
    return;
  }
  runTask(tasks.shift()).then((index) => {
    finishcount++;
    let duration = index.now - lastfinishedtime;
    lastfinishedtime = index.now;
    finishTasks.push({ index: `第${index.index}个任务`, duration: duration });
    if (finishcount === taskProp.length) {
      console.log(finishTasks);
    }
  });
  executeTasks();
};
const timespan = 100;
function runAnimation() {
  if (stop) {
    stop();
  }
  stop = animation(5000, 0, timespan, (value) => {
    let str = Math.round(value);
    doms.h1.innerHTML = str;
    let left = 0;
    let top = 0;
    // 根据动画进度计算位置
    if (value < timespan / 4) {
      left = rect.left + value * (rect.width / (timespan / 4));
    } else if (value < timespan / 2) {
      top = rect.top + (value - timespan / 4) * (rect.height / (timespan / 4));
      left = rect.left + rect.width;
    } else if (value < (3 * timespan) / 4) {
      left =
        rect.left +
        rect.width -
        (value - timespan / 2) * (rect.width / (timespan / 4));
      top = rect.top + rect.height;
    } else {
      top =
        rect.top +
        rect.height -
        (value - (3 * timespan) / 4) * (rect.height / (timespan / 4));
      left = rect.left;
    }
    doms.ball.style.left = left + "px";
    doms.ball.style.top = top + "px";
  });
}
runAnimation();

doms.next.addEventListener("click", () => {
  executeTasks();
});
