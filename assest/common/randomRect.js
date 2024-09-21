function generateRectangle(minHeight, maxHeight, width) {
    // 验证输入参数
    if (minHeight > maxHeight) {
        throw new Error('Minimum height cannot be greater than maximum height.');
    }

    // 生成随机高度
    const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    // 返回包含随机高度和指定宽度的对象
    return {
        height: randomHeight,
        width: width
    };
}
