var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const NodeMediaServer = require("node-media-server");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
  },
  // trans: {
  //   ffmpeg: "ffmpeg",
  //   tasks: [
  //     {
  //       app: "live",
  //       ac: "aac",
  //       hls: true,
  //       hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
  //       dash: true,
  //       dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
  //       mp4: true,
  //       mp4Flags: "[movflags=frag_keyframe+empty_moov]",
  //     },
  //   ],
  // },
};

var nms = new NodeMediaServer(config);
nms.run();
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
