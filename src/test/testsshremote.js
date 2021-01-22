const { SSHMachineService } = require("../services/remotes/ssh-machine-service.js")
const constants = require('../constants.js')

const path = require('path')
const { FileSystem } = require('nativescript/lib/common/file-system.js')

if (typeof process.argv[2] !== 'string') {
    console.warn(`Usage: node ${path.basename(__filename)} projectPath\n\tprojectPath:\tPath to a nativescript project to run test with`)
    process.exit(1)
}
const projectDir = path.resolve(process.argv[2])

async function runTest() {
    const nsremoteConfigPath = path.relative(__dirname, path.resolve(projectDir, constants.configFileName))
    const projconfig = require(nsremoteConfigPath)
    if (!projconfig) {
        console.warn(`Missing config file ${nsremoteConfigPath}. Refer to Readme.md for instructions on populating this file with your config.`)
        process.exit(1)
    } else if (!projconfig.ssh) {
        console.warn(`Config json from ${nsremoteConfigPath} missing key "ssh". Refer to Readme.md for instructions on populating this file with your config.`)
        process.exit(1)
    }
    
    const service = new SSHMachineService(new FileSystem(), {}, {}, "ios", {}, require(`${projectDir}/.nsremote.config.json`).ssh, {
        projectDir,
        nativeProjectRoot: path.relative(projectDir, 'platforms', 'ios'),
        platformsDir: path.relative(projectDir, 'platforms'),
        projectName: 'Yellowbox'
    })
    
    console.log(`Running test...`);
    await service.build({ cliArgs: { clean: false } })
}

runTest()
