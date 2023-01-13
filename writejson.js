const fs = require('fs');

function sleep(ms) {
    const start = new Date().getTime()
    while (true) {
        if (new Date().getTime() - start > ms) {
            return
        }
    }
}

async function rewriteKiviConfig(name) {
    try {
        _kiviConfig = JSON.parse(fs.readFileSync('kivi.json', 'utf-8'))
        kiviConfig = _kiviConfig
    } catch (error) {
        console.log(error.stack)
    }
    try {
        if (!kiviConfig["plugins"].includes(name)) {
            kiviConfig["plugins"].push(name)
        }
    } catch (error) {
        console.log(error.stack)
        return
    }

    try {
        fs.writeFileSync("kivi.json", JSON.stringify(kiviConfig, null, 2))
    } catch (error) {
        console.log(error.stack)
        return
    }
}

while (true) {
    rewriteKiviConfig("rascal")
    sleep(100)
}