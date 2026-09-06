# DFO 110 本机测试服

面向 Windows 10/11 64 位玩家的地下城与勇士 110 级版本测试登录器。
每台电脑运行自己的本地服务，角色和存档独立保存。

[下载 Windows 测试登录器 0.2.3](https://github.com/Yeseverk/server_110us-releases/releases/download/tester-v0.2.3/AnotherSys.DFO110.Tester-win-Setup.exe)

![登录器首页](screenshots/launcher-home.png)

## 开始游戏

1. 下载并安装上面的 `Setup.exe`，无需 GitHub 账号、token、Git 或 .NET SDK。
2. 准备完整的 US 110 游戏客户端：`DFO.exe` 版本 **2.31.1.117**，同目录含配套的 `Script.pvf` 和 `sk.dat`。安装包不含完整游戏客户端。
3. 打开登录器，点击“选择游戏客户端”，找到 `DFO.exe`。
4. 点击“启动游戏”。首次会准备游戏数据并启动本地服务，然后请求 Windows 管理员授权以启动游戏。

游戏中关闭登录器窗口会收进系统托盘；退出游戏后本地服务自动关闭。

## 存档与反馈

存档位于 `%LOCALAPPDATA%\USLocalServer\Tester\Server`，独立于程序安装目录。
“存档管理”可备份、恢复或打开存档目录；遇到问题可在“运行记录”中导出诊断包。

## 测试范围

这是测试候选版，尚未完成真实客户端、UAC、进入城镇和副本的全部验收，不是稳定版。
Windows Server 2025 上的安装、重复安装、界面截图和核心测试结果见发布说明。
安装包目前未做 Windows 代码签名。此仓库只分发编译程序，不包含服务端源码。

玩家只需下载 `Setup.exe`。`Windows-CoreTests.zip` 用于自动化验证，`nupkg` 和 JSON 文件用于更新系统。
当前候选版不进入稳定更新源，后续稳定版本发布后登录器才会自动提示更新。

游戏美术版权归 NEOPLE 所有。本项目为社区本机测试工具。
