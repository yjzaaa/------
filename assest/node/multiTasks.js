const { superTask } = require("./superTask"); // 1. 定义一个异步请求函数
// 导入os模块
const os = require("os");

// 获取CPU核心数量
const cpus = os.cpus();
const x = 1; //0.5:7s,1:2.8s, 1.5:4.4s,2:7.5s,
console.log("CPU核心数量:", cpus.length);

const parallelCount = () => {
  return cpus.length * x;
};

const st = superTask(parallelCount());
// console.log("parallelCount:", parallelCount());
const fetchUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`请求成功，URL: ${url}, 数据:`, data);
    return data;
  } catch (error) {
    console.error(`请求失败，URL: ${url}, 错误:`, error);
    throw error;
  }
};
const results = [];
const allTasksFinsh = () => {
  console.log("所有请求完成  :" + "\n" + "所有请求结果:", results);
};
// 2. 定义一个函数来发起多个异步请求
const fetchUrls = async (urls) => {
  try {
    const start = Date.now();
    const total = urls.length;
    let finishcount = 0;
    urls.map((url) => {
      st.add(() => {
        return new Promise((resolve) => {
          fetchUrl(url).then((data) => {
            resolve();
            results.push(data);
            finishcount++;
            if (finishcount === total) {
              allTasksFinsh();
            }
          });
        });
      }).then((time) => {
        console.log(`耗时(${time - start})`);
      });
      //   fetchUrl(url);
    });
  } catch (error) {
    console.error("请求过程中出现错误:", error);
    throw error;
  }
};

// 3. 主逻辑
(async () => {
  const urls = Array.from(
    { length: 200 },
    (_, index) => {
      // 生成1到100之间的随机整数
      const randomIndex = Math.floor(Math.random() * 100) + 1;
      return `https://jsonplaceholder.typicode.com/todos/${randomIndex}`;
    }
  );
  try {
    fetchUrls(urls);
  } catch (error) {
    console.error("请求失败:", error);
  }
})();
