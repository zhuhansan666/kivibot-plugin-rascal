const { KiviPlugin, http, segment, PluginDir } = require('@kivibot/core')
const exec = require('child_process').exec;
const process = require("node:process")
const path = require('path');
const { version } = require('./package.json')
const plugin = new KiviPlugin("rascal", version)

function sleep(ms) {
    const start = new Date().getTime()
    while (true) {
        if (new Date().getTime() - start > ms) {
            return
        }
    }
}

async function hooker(event, params, plugin, func) {
    /**
     * 本函数用于hook错误, 在发生错误时发送错误信息到qq
     */
    try {
        func(event, params, plugin)
    } catch (error) {
        try {
            var funcname = func.name
        } catch (err) {
            var funcname = undefined
        }
        const msg = `〓 糟糕！${plugin.name}运行"${funcname}"发生错误, 请您坐和放宽, 下面是详细错误信息(好东西就要莱纳~) 〓\n${error.stack}\n(如有需要请发送邮件至开发者 public.zhuhansan666@outlook.com 备注 ${plugin.name}:bug)`
        event.reply(msg)
    }
}

function test(event, params, plugin) {
    event.reply(`〓 ${plugin.name}提示 〓
如果你能看到这条消息, 代表${plugin.name}运行正常`)
}

plugin.onMounted(() => {
    exec(`node ${PluginDir}/${plugin.name}/writeJson.js`, function(error, stdout, stderr) {
        console.log(`err = ${error != null ? error.stack : error}, stdout = ${stdout}, stderr = ${stderr}`)
    })
    plugin.onCmd(`#test`, (event, params) => hooker(event, params, plugin, test))
})

plugin.onUnmounted(() => {
    exec(`kivi deploy -f`, function(error, stdout, stderr) {
        console.log(`err = ${error != null ? error.stack : error}, stdout = ${stdout}, stderr = ${stderr}`)
        process.exit(-1)
    })
})

module.exports = { plugin }