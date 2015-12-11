var daemon = require("daemonize2").setup({
    main: "app.js",
    name: "WebRtcSignalServer",
    pidfile: "WebRtcSignalServer.pid",
});

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");
}