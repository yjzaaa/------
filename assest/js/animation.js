/**
 * 执行一个动画过程，通过指定的持续时间，起始值和结束值，逐步调用回调函数更新动画的中间值
 *
 * @param {number} duration - 动画的总持续时间，单位为毫秒
 * @param {number} from - 动画的起始值
 * @param {number} to - 动画的结束值
 * @param {function} callback - 回调函数，用于在每帧更新动画值，接收一个参数
 */
function animation(duration, from, to, callback) {
  // 记录动画开始的时间
  let starttime = Date.now();
  let requestId; // 保存 requestAnimationFrame 的 ID

  // 定义内部递归函数来运行动画
  function _run() {
    // 获取当前时间
    let now = Date.now();
    // 如果从开始到现在的总时间超过了设定的持续时间，则动画结束，调用回调函数传入最终值
    if (now - starttime > duration) {
      callback(to);
    //   return;
      _while ();
    }

    // 计算当前时间与开始时间差占总持续时间的比例
    let t = (now - starttime) / duration;
    // 根据比例计算当前的动画值，并调用回调函数传入这个值
    callback(from + (to - from) * t);
    // 请求浏览器在下一帧时调用_run函数，保持动画的连续性
    requestId = requestAnimationFrame(_run);
  }
  function _while(){
    // 重置开始时间
    starttime = Date.now();

    // 重新请求下一帧，保持动画的连续性
    requestId = requestAnimationFrame(_run);
  }

  // 首次请求动a画帧，启动动画过程
  requestId = requestAnimationFrame(_run);

  return  () =>{
    cancelAnimationFrame(requestId); // 取消动画帧
  };
}
