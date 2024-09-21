const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

class SuperTask {
  constructor(parallelCount = 1) {
    this.parallelCount = parallelCount;
    this.tasks = [];
    this.runningCount = 0; // 当前运行的任务数量
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        task,
        resolve,
        reject,
      });
      this._run();
    });
  }
  _run() {
    while (this.runningCount < this.parallelCount && this.tasks.length > 0) {
      const { task, resolve, reject } = this.tasks.shift();
      this.runningCount++;
      task()
        .then(() => {
          const endTime = Date.now(); // 记录结束时间
          resolve(endTime);
        }, reject)
        .finally(() => {
          this.runningCount--;
          this._run();
        });
    }
  }
}

let superTask = new SuperTask(5); // 设置并发数为2
const startTime = Date.now(); // 记录开始时间

const addTask = (time, name) => {
  superTask
    .add(() => {
      return timeout(time); // 确保返回一个 Promise
    })
    .then((endTime) => {
      const duration = endTime - startTime; // 计算耗时
      console.log(`任务${name} 耗时 ${duration}ms执行完毕`);
    });
};
// 调用示例
addTask(10000, 1); // 10000ms后输出任务1执行完毕
addTask(5000, 2); // 5000ms后输出任务2执行完毕
addTask(3000, 3); // 8000ms后输出任务3执行完毕
addTask(4000, 4); // 12000ms后输出任务4执行完毕
addTask(5000, 5); // 15000ms后输出任务5执行完毕
