
    const fs = require('fs');
    const path = require('path');
    let paths = [];

    /**
     * 递归地读取目录中的所有文件和子目录，并复制符合条件的文件到目标目录。
     * @param {string} sourceDir - 源目录路径
     * @param {string} targetDir - 目标目录路径
     */
    function copyImages(sourceDir, targetDir) {
        fs.readdir(sourceDir, (err, files) => {
            if (err) throw err;

            files.forEach(file => {
                const filePath = path.join(sourceDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) throw err;

                    if (stats.isDirectory()) {
                        // 如果是目录，则递归处理
                        const newTargetDir = path.join(targetDir, file);
                        fs.mkdir(newTargetDir, { recursive: true }, err => {
                            if (err) throw err;
                            copyImages(filePath, newTargetDir);
                        });
                    } else if (stats.isFile() && (file.endsWith('preview.png') || file.endsWith('preview.jpg'))) {
                        // 如果是文件且为 .png 或 .jpg，则复制
                        const targetFilePath = path.join(targetDir, file);
                        paths.push(targetFilePath);
                        fs.copyFile(filePath, targetFilePath, err => {
                            if (err) throw err;
                            // console.log(`Copied: ${filePath} to ${targetFilePath}`);
                            console.log(targetFilePath);
                        });
                    }
                });
            });
        });
    }

    // 脚本入口
    const sourceDirectory = 'O:\\Steams\\Steamas\\steamapps\\workshop\\content\\431960'; // 使用反斜杠进行转义
    const targetDirectory = 'D:\\前端\\高阶函数示例\\assest\\imgs'; // 替换为实际的目标目录
    fs.mkdir(targetDirectory, { recursive: true }, err => {
        if (err) throw err;
        copyImages(sourceDirectory, targetDirectory);
    });
    return paths;

