let doms = {
  ball: document.querySelector(".red-ball"),
  app: document.getElementById("app"),
  h1: document.getElementById("h1"),
  divContainer: document.getElementById("container"),
  carousel: document.getElementById("carousel"),
};

doms.ball.addEventListener("mouseleave", () => {
  runAnimation();
  //   getRect();
});
window.onresize = () => {
  setPosition(getElems);
};
function runAnimation() {
  let width = doms.divContainer.clientWidth;
  animation(5000, 0, width, (value) => {
    let str = Math.round(value);
    doms.h1.innerHTML = str;
    doms.ball.style.left = value + "px";
  });
}

function getRect(minH = 50, maxH, w) {
  return generateRectangle(minH, maxH, w);
}

const minH = 150; // 最小高度
const maxH = 220; // 最大高度
const imgWidth = 220; // 宽度
const imgArry = [];

const createImgs = (imgs, position) => {
  for (let i = 0; i < imgs.length; i++) {
    const imgRect = getRect(minH, maxH, imgWidth);

    const src = imgs[i];
    const img = document.createElement("img");
    img.src = src;
    img.style.width = imgRect.width + "px";
    img.style.height = imgRect.height + "px";
    doms.divContainer.appendChild(img);
    img.classList.add("img-element");
    addhover(img);
  }
  position(getElems);
};
const initArr = (length) => {
  let arr = new Array(length).fill(0);
  return arr;
};
const getElems = () => {
  let imgElements = doms.divContainer.querySelectorAll("img");
  return imgElements;
};

const getDurRect = (description, img) => {
  const rectDuringEnd = img.getBoundingClientRect();
  console.log(`${description}`, rectDuringEnd);
};
const pointInPolygon = (point, polygon) => {
  return (
    point[0] >= polygon.left &&
    point[0] <= polygon.right &&
    point[1] >= polygon.top &&
    point[1] <= polygon.bottom
  );
};

const getOtherImgs = (imgRect, img) => {
  const otherImgs = [];
  //根据img获取被img覆盖住的所有元素
  imgArry.forEach((img2) => {
    const imgRect2 = img2.getBoundingClientRect();

    if (img2 !== img) {
      if (
        Math.abs(
          imgRect2.left + imgRect2.width - (imgRect.width + imgRect.left)
        ) +
          Math.abs(imgRect2.left - imgRect.left) <
          imgRect.width + imgRect2.width &&
        Math.abs(
          imgRect2.top + imgRect2.height - (imgRect.height + imgRect.top)
        ) +
          Math.abs(imgRect2.top - imgRect.top) <
          imgRect.height + imgRect2.height
      ) {
        otherImgs.push(img2);
        return;
      }
    }
  });
  return otherImgs;
};

const scaleOptions = {
  scale: 1,
  isScalingUp: true,
  isStopping: false,
};

// 停止所有动画
const stopAnimations = (img) => {
  const otherElements = getOtherImgs(img);
  otherElements.forEach((other) => {
    other.style.transform = "scale(1)";
  });
};

//将重叠的其他元素缩小
const scaleOtherImgs = (img, getOtherImgs, animateScaling) => {
  animateScaling(scaleOptions, getOtherImgs, img);
};
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
const addhover = (img) => {
  let otherImgs = [];

  const scale = 1.5;
  const scalefunc = (ishovered = false) => {
    if (!ishovered) {
      // animation(400, 1, scale, (value) => {
      //   img.style.transform = `scale(${value})`;
      //   otherImgs.forEach((other) => {
      //     other.style.transform = `scale(${2 - value})`;
      //   });
      // });
      img.style.transform = `scale(${scale})`;
      otherImgs.forEach((other) => {
        other.style.transform = `scale(${1.8 - scale})`;
      });
    } else if (ishovered) {
      img.style.transform = "scale(1)";
      otherImgs.forEach((other) => {
        other.style.transform = "scale(1)";
      });
    }
  };
  // 添加鼠标移入事件
  img.addEventListener("mouseover", () => {
    const rect = img.getBoundingClientRect();
    // 计算缩放中心点的实际坐标
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    // 计算缩放后的尺寸
    const newW = rect.width * scale;
    const newH = rect.height * scale;
    const scaleRect = {
      left: cx - newW / 2,
      top: cy - newH / 2,
      width: rect.width * scale,
      height: rect.height * scale,
    };
    otherImgs = getOtherImgs(scaleRect, img);

    img.classList.add("hover");
    scalefunc();
  });

  img.addEventListener("mouseout", () => {
    img.classList.remove("hover");
    scalefunc(true);
  });
};
// createImgs(imgs, () => {
//   setPosition(getElems);
//   doms.divContainer.classList.add("container");
// });

//轮播图
const createImgItems = (imgs) => {
  let count = 0;
  document.querySelectorAll(".carousel-item").forEach((item) => {
    const imgRect = { width: 500, height: 300 };
    item.innerHTML += `<img src="${imgs[count]}" style="width:${imgRect.width}px;height:${imgRect.height}px;">`;
    count++;
  });
};
createImgItems(imgs);

const xoffsetStep = 100;
const scalestep = 0.8;
const opacitystep = 0.8;
const rotateYstep = 45;

const carouselContainer = document.getElementById("carousel-container");
const items = Array.from(carouselContainer.children);
let index = 2;

const layout = () => {
  const count = items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sign = Math.sign(i - index);

    // Transform properties
    let xoffset = (i - index) * xoffsetStep;
    if (i !== index) {
      xoffset = xoffset + 100 * sign;
    }
    const rotateY = i === index ? 0 : rotateYstep * -sign;

    const scale = scalestep ** Math.abs(i - index);
    const zIndex = count - Math.abs(index - i);

    // Apply transform
    item.style.transform = `translate3d(${xoffset}px, 0, ${
      -zIndex * 100
    }px) scale(${scale}) rotateY(${rotateY}deg)`;

    // Opacity
    const opacity = opacitystep ** Math.abs(i - index);
    item.style.opacity = opacity;

    // Z-index
    item.style.zIndex = zIndex;
  }
};
// 初始化轮播图
const initializeCarousel = () => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.style.transform = "translate3d(0, 0, 0)";
    item.style.opacity = 1;
    item.style.zIndex = items.length - i;
  }
};

initializeCarousel(); // 初始化轮播图

document.querySelector(".prev").addEventListener("click", function () {
  index = (index - 1 + items.length) % items.length;
  layout();
});

document.querySelector(".next").addEventListener("click", function () {
  index = (index + 1) % items.length;
  layout();
});

layout(); // 初始化轮播图

//根据imgWidth计算有几列和图片的间隙
function cal() {
  const containerWidth = doms.divContainer.clientWidth;

  let cols = Math.floor(containerWidth / imgWidth);
  // 确保至少有一列
  cols = Math.max(1, cols);

  // 计算间隙
  let gap = Math.floor((containerWidth - cols * imgWidth) / (cols - 1));
  // 确保间隙不为负数
  gap = Math.max(0, gap);
  return { cols: cols, gap: gap };
}
function setPosition(getimgElements) {
  let colsgap = cal();
  let arr = initArr(colsgap.cols);
  let imgElements = getimgElements();

  imgElements.forEach((img, index) => {
    //获取当前元素设置的列和top
    let min = Math.min(...arr);
    let minIndex = arr.indexOf(min);
    let x = minIndex;
    let y = Math.floor((index + 1) / colsgap.cols);
    //将图片坐标设置到对应的位置
    let left = (colsgap.gap + imgWidth) * minIndex;
    let top = min + colsgap.gap;
    img.style.position = "absolute";
    img.style.left = `${left}px`;
    img.style.top = `${top}px`;
    imgArry.push(img);
    arr[minIndex] = top + parseInt(img.style.height.split("px"));
  });
}
