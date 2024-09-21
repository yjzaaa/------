module.exports = {
  superTask:  (parallelCount = 2) =>{
    const tasks = [];
    let runningCount = 0;
    const add = (task) => {
      return new Promise((resolve, reject) => {
        tasks.push({
          task,
          resolve,
          reject,
        });
        _run();
      });
    };

    const _run = () => {
      while (runningCount < parallelCount && tasks.length > 0) {
        const { task, resolve, reject } = tasks.shift();
        runningCount++;
        task()
          .then(() => {
            const endTime = Date.now(); // 记录当前任务结束时间
            resolve(endTime);
          }, reject)
          .finally(() => {
            runningCount--;
            _run();
          });
      }
    };

    return { add };//控制外界能访问的函数
  },
};

