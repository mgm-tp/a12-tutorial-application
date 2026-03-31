import KillPort from "kill-port";
import Pkg from "../package.json" with { type: "json" };
const port = Pkg.webpackPort

KillPort(port)
    .then((result) => {
        //Unix and Windows success
        if (result.code === 0) {
            console.log('Process stopped on port '+ port +' with command:\n' + result.cmd);
        } else {
            //Windows error
            console.log('Process is probably already not running on port ' + port + ', task finished with:\n' + result.stderr);
        }
    })
    .catch((error) => {
        //Unix error
        console.log('Process is probably already not running on port ' + port + ', task finished with:\n' + error);
    });
