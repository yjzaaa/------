/**运行一个任务
 * 如果异步执行任务请返回Promise
 * 要尽快完成任务，同时不要界面卡顿
 * 尽量兼容更多浏览器
 * @param {Function} task
 */
const runTask = (task) => {
  return new Promise((resolve, reject) => {
    _runTask(task, resolve);
  });
};
/**
 * 内部函数_runTask用于执行给定的任务，并在任务完成后调用回调函数
 * 它的主要作用是控制任务的执行时间，确保帧间隔内只执行一次任务
 * 
 * @param {Function} task - 需要执行的任务函数，该函数返回任务的索引值
 * @param {Function} callback - 任务执行完毕后的回调函数，接收任务索引和当前时间作为参数
 */
const _runTask = (task, callback) => {
  // 记录任务开始时间
  let starttime = Date.now();
  
  // 请求浏览器重绘，浏览器会在下次重绘前调用该函数
  requestAnimationFrame(() => {
    // 获取当前时间
    const now = Date.now();
    
    // 如果当前时间与开始时间差小于16毫秒，则执行任务
    if (now - starttime < 16) {
      // 执行任务并获取任务索引
      const index = task();
      // 调用回调函数，传递任务索引和当前时间
      callback({ index, now });
    } else {
      // 否则重新执行任务，确保帧间隔内只执行一次任务
      _runTask(task, callback);
    }
  });
};
const taskProp = {
  length: 1000,
  timespan: 16,
};

/**
 * 定义一个私有函数 _timeout，用于控制任务的执行频率
 * @param {Function} chuckTask - 一个回调函数，代表需要被定时执行的任务
 */
const _timeout = (chuckTask) => {
  // 每隔16毫秒执行一次任务，以模拟一个固定的帧率（例如60帧/秒）
  setTimeout(() => {
    let starttime = Date.now();
    // 调用任务回调函数，传递一个条件函数，确保任务不会超过16.6毫秒
    chuckTask((start) => starttime - start <= 16.6);
  }, 16);
};
