// var bg = chrome.extension.getBackgroundPage();
// var oldedid = bg.getid();
// alert(oldedid);
// popup主动发消息给content-script
$("#doelementsearch").click(() => {
  alert("开发中啦～～～");
  // getCurrentTabId((tabId) => {
  //   if (!oldedid) {
  //     sendMessageToContentScript(tabId, (response) => {
  //       if (response) {
  //         alert("get");
  //       }
  //     });
  //   } else {
  //     if (oldedid !== tabId) {
  //       // chrome.tabs.remove(tabId);
  //       console.log("oldedid: ", oldedid, "tabId: ", tabId);
  //     } else {
  //       sendMessageToContentScript(tabId, (response) => {
  //         if (response) {
  //           alert("get");
  //         }
  //       });
  //     }
  //   }
  //   // chrome.tabs.remove(tabId);
  // });
  // $("#showgif").css("display", "block");
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  sendResponse(JSON.stringify(request.info));
  // sendResponse("我是popup，我已收到你的消息：" + JSON.stringify(request));
});

// popup与content-script建立长连接
$("#dosearchconnect").click(() => {
  $("#showgif").css("display", "block");
  getCurrentTabId((tabId) => {
    var port = chrome.tabs.connect(tabId, { name: "dosearch" });
    getCurrentTabId((tabId) => {
      // chrome.tabs.remove(tabId);
      port.postMessage({ question: "doasearchwiththispage", id: tabId });
    });
    port.onMessage.addListener(function (msg) {
      // alert("收到长连接消息：" + msg.answer);
      if (msg.answer && msg.answer.startsWith("检测")) {
        $("#showgif").css("display", "none");
        $("#getreport").css("display", "block");
        port.postMessage({ question: "好的收到！查看报告" });
      }
    });
  });
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query(
      { active: true, windowId: currentWindow.id },
      function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
      }
    );
  });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
  getCurrentTabId((tabId) => {
    chrome.tabs.sendMessage(tabId, message, function (response) {
      if (callback) callback(response);
    });
  });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
  getCurrentTabId((tabId) => {
    chrome.tabs.executeScript(tabId, { code: code });
  });
}
