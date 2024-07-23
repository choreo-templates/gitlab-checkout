const { exec } = require('child_process');
const util = require('util');
const core = require('@actions/core');

const execProm = util.promisify(exec);

async function run() {
try  {
    const token = core.getInput('token');
    const username = core.getInput('username');
    const userOrgName = core.getInput('userOrgName');
    const userRepoName = core.getInput('userRepoName');
    const commitUser = core.getInput('commitUser');
    const commitEmail = core.getInput('commitEmail');
    const configRepoName = core.getInput('configRepoName');
    const serverUrl = core.getInput('serverUrl');
    const urlWithoutProtocol = serverUrl.replace(/^https:\/\//, '');
    const ref = core.getInput('ref');

    console.log("Started removing files in current directory");

    exec(`rm -rf /home/runner/workspace/${configRepoName}/${configRepoName}/*`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            core.setOutput("choreo-status", "failed");
            core.setFailed(err.message);
            return;
        }
        console.log(stdout);
        console.log(stderr);
        console.log("Completed removing files in current directory");
        console.log("Started checkout to GitLab repo");
        exec(`git config --global --add safe.directory /home/runner/workspace/${configRepoName}/${configRepoName}`, (err, stdout, stderr) => {  
            if (err) {
                console.log(err);
                core.setOutput("choreo-status", "failed");
                core.setFailed(err.message);
                return;
            }
            console.log(stdout);
            console.log(stderr);
            console.log("Completed adding safe directory");
            exec(`git init`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    core.setOutput("choreo-status", "failed");
                    core.setFailed(err.message);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
                console.log("Completed git init");
                exec(`git config user.name "${commitUser}" && git config user.email "${commitEmail}"`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                        core.setOutput("choreo-status", "failed");
                        core.setFailed(err.message);
                        return;
                    }
                    console.log(stdout);
                    console.log(stderr);
                    console.log("Completed git config user.name and user.email");
                    console.log(`url: ${serverUrl}/${userOrgName}/${userRepoName}.git`);
                  
                    exec(`git remote add origin https://oauth2:${token}@${urlWithoutProtocol}/${userOrgName}/${userRepoName}.git`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            core.setOutput("choreo-status", "failed");
                            core.setFailed(err.message);
                            return;
                        }
                        console.log(stdout);
                        console.log(stderr);
                        console.log("Completed git remote add origin");
                        exec(`git remote -v`, (err, stdout, stderr) => {
                            if (err) {
                                console.log(err);
                                core.setOutput("choreo-status", "failed");
                                core.setFailed(err.message);
                                return;
                            }
                            console.log(stdout);
                            console.log(stderr);
                        });
                        exec(`git -c protocol.version=2 fetch --no-tags --prune --progress --no-recurse-submodules origin`, (err, stdout, stderr) => {
                            if (err) {
                                console.log(err);
                                core.setOutput("choreo-status", "failed");
                                core.setFailed(err.message);
                                return;
                            }
                            console.log(stdout);
                            console.log(stderr);
                            console.log("Completed git fetch");
                            console.log("ref" + ref);
                            exec(`git checkout -b ${ref} ${ref}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.log(err);
                                    core.setOutput("choreo-status", "failed");
                                    core.setFailed(err.message);
                                    return;
                                }
                                console.log("ref");
                                console.log("ref" + stdout);
                                console.log(stderr);
                                console.log("Completed checkout to GitLab repo");
                            });
                        });
                    });
                });
            });
        });
    });

} catch (e) {
    core.setOutput("choreo-status", "failed");
    core.setFailed(e.message);
    console.log("choreo-status", "failed");
    console.log(e.message);
}
}

run();
