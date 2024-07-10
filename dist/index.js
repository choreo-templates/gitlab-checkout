/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 74:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { exec } = __nccwpck_require__(81);
const util = __nccwpck_require__(837);
const core = __nccwpck_require__(74);

const execProm = util.promisify(exec);

async function run() {
try  {
    const token = core.getInput('token');
    const serverUrl = core.getInput('serverUrl');
    const userOrgName = core.getInput('userOrgName');
    const userRepoName = core.getInput('userRepoName');
    const commitUser = core.getInput('commitUser');
    const commitEmail = core.getInput('commitEmail');
    const configRepoName = core.getInput('configRepoName');
    const branch = core.getInput('branch');
    const disableSSL = core.getInput('disableSSL');

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
        exec(disableSSL === true ? `git config --global http.sslVerify false` : `git config --global http.sslVerify true`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                core.setOutput("choreo-status", "failed");
                core.setFailed(err.message);
                return;
            }
            console.log(stdout);
            console.log(stderr);
            console.log("Completed disabling SSL verification");
        
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
            exec(`git init /home/runner/workspace/${configRepoName}/${configRepoName}`, (err, stdout, stderr) => {
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
                    if(serverUrl!=""){
                        exec(`git config http.extraHeader "Authorization: Bearer ${token}"`,(err,stdout,stderr)=>{
                            if (err) {
                                console.log(err);
                                core.setOutput("choreo-status", "failed");
                                core.setFailed(err.message);
                                return;
                            }
                            console.log(stdout);
                            console.log(stderr);
                            console.log("Completed git config http.extraHeader");
                        });
                    }                  
                    
                    exec(`git remote add origin ${serverUrl}/${userOrgName}/${userRepoName}.git`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            core.setOutput("choreo-status", "failed");
                            core.setFailed(err.message);
                            return;
                        }
                        console.log(stdout);
                        console.log(stderr);
                        console.log("Completed git remote add origin");
                        exec(`git -c protocol.version=2 fetch --no-tags --prune --progress --no-recurse-submodules --depth=1 origin +refs/heads/${branch}*:refs/remotes/origin/${branch}* +refs/tags/${branch}*:refs/tags/${branch}*`, (err, stdout, stderr) => {
                            if (err) {
                                console.log(err);
                                core.setOutput("choreo-status", "failed");
                                core.setFailed(err.message);
                                return;
                            }
                            console.log(stdout);
                            console.log(stderr);
                            console.log("Completed git fetch");
                            exec(`git branch --list --remote origin/${branch}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.log(err);
                                    core.setOutput("choreo-status", "failed");
                                    core.setFailed(err.message);
                                    return;
                                }
                                console.log("branches");
                                console.log("branches" + stdout);
                                console.log(stderr);
                                console.log("Completed git branch --list --remote");
                                exec(`git checkout --progress --force -B ${branch} refs/remotes/origin/${branch}`, (err, stdout, stderr) => {
                                    if (err) {
                                        console.log(err);
                                        core.setOutput("choreo-status", "failed");
                                        core.setFailed(err.message);
                                        return;
                                    }
                                    console.log(stdout);
                                    console.log(stderr);
                                    console.log("Completed checkout to GitLab repo");
                                });
                            });
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
})();

module.exports = __webpack_exports__;
/******/ })()
;