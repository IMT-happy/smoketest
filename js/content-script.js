console.log("环境检测完成，可执行smoketest");
// listeneerror();

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener("DOMContentLoaded", function () {});

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("xixi,我进来啦～", request);
  // $(".follow-btn.follow").click()
  // sendMessageToBackground(request);
  sendResponse("resultResponse：" + JSON.stringify({ response: "response" }));
});
// get error message
// let errordatas = [];
function listeneerror(url) {
  // add listener
  window.addEventListener(
    "error",
    function (e) {
      console.log("==============", e.message);
      var obj = {
        type: "error",
        msg: e.message,
        url: url,
      };
      // errordatas.push(obj);
      // outputobj.errdata = errordatas;
      var data = JSON.stringify(obj);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // alert("数据已发送");
          console.log(this.responseText);
        }
      });
      xhr.open(
        "POST",
        "https://172.16.39.188:8988/frontEnd/webcoverage/smoketest"
      ); // http://10.23.184.5:6869/api/insertchromepagedata
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
    },
    true
  );
}
let loginfo = [];
// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(msg) {
  chrome.runtime.sendMessage({ info: msg }, function (response) {
    alert(response);
  });
}
let outputobj = {};

// outputobj.errarr = [];
// 监听长连接
chrome.runtime.onConnect.addListener(function (port) {
  console.log(port);
  if (port.name == "dosearch") {
    window.scrollTo({ left: 0, top: 3000, behavior: "smooth" });
    $("a").attr("target", "_blank");
    const currentinfo = getcurrentinfo();
    outputobj["currentinfo"] = currentinfo;
    var result = getAllNodes("*"); // get all class element
    var player = getAllplayerNodes("*");
    var outputresult;
    var imgresult = getImageSize(); // get imgs asserts
    outputobj["outputimgresult"] = imgresult;
    if (result.length > 0) {
      //
      var startindex, stopindex;
      if (result.indexOf("mini-upload.van-popover__reference")) {
        console.log("mini-upload.van-popover__reference");
        startindex = result.indexOf("mini-upload.van-popover__reference");
      } else {
        startindex = 0;
      }
      if (result.indexOf("international-footer")) {
        console.log("international-footer");
        stopindex = result.indexOf("international-footer");
      } else {
        stopindex = result.length;
      }
      result = result.slice(startindex, stopindex);
      // judge is exsit common
      if (result.indexOf("common")) {
        console.log("exsit common");
        var commonindex = result.indexOf("common");
        result = result.slice(0, commonindex);
      }

      if (player.length > 0) {
        console.log("存在player");
        outputresult = result.concat(player);
      } else {
        outputresult = result;
      }
      var tmp = new Array();
      // tmp = result; // test all click
      for (var i in outputresult) {
        //该元素在tmp内部不存在才允许追加
        if (tmp.indexOf(outputresult[i]) == -1) {
          tmp.push(outputresult[i]);
        }
      }

      let repeatclickevents = [];
      tmp.forEach((ele, index) => {
        (function (ele, index) {
          // 注意这里是形参
          setTimeout(function () {
            let currentname = $("." + ele)[0].innerText
              ? $("." + ele)[0].innerText
              : "normal";

            let eachlen = $("." + ele).length;
            if (eachlen > 1) {
              // $("." + ele)[1].click();
              let obj = {
                ele: ele,
                len: eachlen,
              };
              repeatclickevents.push(obj);
              let existeobj = {
                event:
                  currentname && currentname.length < 10 ? currentname : ele,
                fatherevent: true,
                childlen: eachlen,
              };
              loginfo.push(existeobj);
            } else {
              $("." + ele).click();
              let obj = {
                event:
                  currentname && currentname.length < 10 ? currentname : ele,
                fatherevent: false,
                childlen: 1,
              };
              loginfo.push(obj);
            }

            // print log message
            console.log(
              `执行 ${
                currentname && currentname.length < 10 ? currentname : ele
              } 点击事件`
            );
          }, 1000 * (index + 1)); // 还是每秒执行一次，不是累加的
        })(ele, index); // 注意这里是实参，这里把要用的参数传进去
      });
      // do more actions

      var startlen = tmp.length;
      var totalmeassagelen;
      (function (len) {
        setTimeout(function () {
          console.log("repeatclickevents: ", repeatclickevents);
          var lastlen = 0;
          repeatclickevents.forEach((elelenadd) => {
            lastlen += elelenadd.len;
          });
          totalmeassagelen = lastlen + len;
          // console.log("lastlen: ", lastlen);
          // console.log("len: ", len);
          // console.log("totalmeassagelen: ", totalmeassagelen);
          outputobj.totallength = totalmeassagelen;
          repeatclickevents.forEach((eles, indexs) => {
            // console.log(`${indexs}is indexs: `, indexs);
            (function (eles, indexs) {
              setTimeout(function () {
                indexs = indexs + 1;
                var totallen = 0;
                for (var j = 0; j < indexs; j++) {
                  totallen += repeatclickevents[j].len;
                }
                // console.log("totallen: ", totallen);
                // let eachloginfo = [];
                for (let i = 0; i < eles.len; i++) {
                  (function (i) {
                    // 注意这里是形参
                    setTimeout(function () {
                      // let currentnames = $("." + eles.ele)[i].innerText;
                      $("." + eles.ele)[i].click();
                      // print log message

                      console.log(`执行${eles.ele}第${i}个元素,点击事件`);
                    }, 1000 * (i + totallen + 1)); // 还是每秒执行一次，不是累加的
                  })(i); // 注意这里是实参，这里把要用的参数传进去
                }
              }, 1000 * (indexs + 1));
            })(eles, indexs); // 注意这里是实参，这里把要用的参数传进去
          });
          (function (len) {
            setTimeout(function () {
              // console.log("loginfo: ", loginfo);
              outputobj.loginfo = loginfo;
              // sendMessageToBackground(outputobj);
              // listeneerror();
              // sent data to api ==========
              var data = JSON.stringify(outputobj);
              var xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                  alert(
                    "数据已发送，查看日志报告： http://qa-mng.bilibili.co/#/Smoke"
                  );
                  console.log(this.responseText);
                }
              });
              xhr.open(
                "POST",
                "https://172.16.39.188:8988/frontEnd/webcoverage/smoketest"
              ); // http://10.23.184.5:6869/api/insertchromepagedata
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.send(data);
            }, 1000 * (len + 5)); // len s 后执行
          })(totalmeassagelen); // 注意这里是实参，这里把要用的参数传进去
        }, 1000 * (len + 5)); // len s 后执行
      })(startlen); // 注意这里是实参，这里把要用的参数传进去
    } else {
      sendMessageToBackground("抱歉，没有article 关键字～，请联系 IMT ");
    }
    // console.log("收集错误");
    listeneerror(currentinfo.url);
    //
  }
  // alert(JSON.stringify(result));
});

function getAllNodes(d) {
  //判断下参数
  d === "*" && (d = document.getElementsByTagName("body"));
  //用arguments[1] 初始化一个空数组
  !arguments[1] && (arguments[1] = []);
  for (var i = 0, l = d.length; i < l; i++) {
    //nodeType === 1 时 push
    if (d[i].nodeType === 1) {
      if (d[i].className.length > 0) {
        var classname = d[i].className.replaceAll(" ", ".");
        arguments[1].push(classname);
      }
      //   d[i].nameaa = d[i].className;
    }
    //有子节点 arguments[1]作为参数继续调用 arguments.callee 可以调用自身 匿名函数常用
    if (d[i].hasChildNodes()) {
      arguments.callee(d[i].childNodes, arguments[1]);
    }
  }
  //把arguments[1] return出来
  return arguments[1];
}

function getAllplayerNodes(d) {
  //判断下参数
  d === "*" &&
    (d = document.getElementsByClassName("bilibili-player-video-wrap"));
  //用arguments[1] 初始化一个空数组
  !arguments[1] && (arguments[1] = []);
  for (var i = 0, l = d.length; i < l; i++) {
    //nodeType === 1 时 push
    if (d[i].nodeType === 1) {
      if (d[i].className.length > 0) {
        var classname = d[i].className.replaceAll(" ", ".");
        arguments[1].push(classname);
      }
      //   d[i].nameaa = d[i].className;
    }
    //有子节点 arguments[1]作为参数继续调用 arguments.callee 可以调用自身 匿名函数常用
    if (d[i].hasChildNodes()) {
      arguments.callee(d[i].childNodes, arguments[1]);
    }
  }
  //把arguments[1] return出来
  return arguments[1];
}
// get img size
// transferSize 表示资源传输总大小，包含header
// encodedBodySize 表示压缩之后的body大小
// decodedBodySize 表示解压之后的body大小
function getImageSize() {
  const getEntries = window.performance.getEntries();
  const imgR = getEntries.filter((ele) => ele.initiatorType === "img");
  let newarr = [];
  imgR.forEach((ele) => {
    $("<img />")
      .attr("src", ele.name)
      .on("load", function () {
        //这里使用的jquery新建一个img对象进行添加attr属性,把src添加上去,然后进行载入事件
        var imgw = this.width; //这里的width和height就是图片实际的宽高了
        var imgh = this.height;
        let splitnames = ele.name.split(".");
        let type = splitnames[splitnames.length - 1];
        const newobj = {
          name: ele.name,
          type: type,
          transferSize: ele.transferSize,
          encodedBodySize: ele.encodedBodySize,
          decodedBodySize: ele.decodedBodySize,
          width: imgw,
          height: imgh,
        };
        newarr.push(newobj);
      });
  });
  return newarr;
}

// server do

function getcurrentinfo() {
  var name = document.title;
  var url = document.location.hostname + document.location.pathname;
  const obj = {
    url: url,
    name: name,
  };
  return obj;
}
