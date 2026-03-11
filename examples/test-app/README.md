# Panther Expo Test App

用于测试和验证 Panther Expo 框架各包功能的示例应用。

## 功能测试

该应用包含以下测试模块：

| 模块 | 测试内容 |
|------|----------|
| **UI** | 按钮、输入框、复选框、开关、徽章、警告、加载 spinner |
| **Core** | 安全存储、API 客户端、日志管理 |
| **Theme** | 主题切换、调色板生成、间距系统 |
| **Utils** | 表单验证（Zod）、颜色转换工具 |

## 快速开始

```bash
# 进入测试应用目录
cd examples/test-app

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 本地包链接

该应用通过 `file:` 协议链接到本地框架包：

```json
{
  "@panther-expo/core": "file:../../packages/core",
  "@panther-expo/theme": "file:../../packages/theme",
  "@panther-expo/ui": "file:../../packages/ui",
  "@panther-expo/utils": "file:../../packages/utils"
}
```

## 测试说明

### UI 组件测试
- 测试各种按钮样式和变体
- 输入框数据绑定
- 复选框和开关状态
- 徽章和警告提示
- 加载状态 spinner

### Core 功能测试
- **存储**: 测试 secure storage 的存取删功能
- **API**: 模拟 API 请求测试
- **日志**: 输出各级别日志到控制台

### Theme 主题测试
- 切换亮/暗主题
- 查看当前颜色变量
- 生成颜色调色板
- 查看间距系统

### Utils 工具测试
- 表单验证（邮箱、密码规则）
- 十六进制颜色转 RGB
- RGBA 转 RGB

## 开发调试

修改本地包后，需要重新构建：

```bash
# 在包目录中
cd packages/ui
npm run build

# 然后重启测试应用
```

## License

MIT
