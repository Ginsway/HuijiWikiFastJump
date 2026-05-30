// ==UserScript==
// @name         HuijiWiki 模板快速跳转
// @namespace    https://*.huijiwiki.com/
// @version      1.4.5
// @description  Ctrl+左键新标签打开模板链接，Ctrl悬停显示手型光标
// @author       Ginsway with GPT4.1
// @match        https://*.huijiwiki.com/*
// @grant        none
// @source       https://github.com/Ginsway/HuijiWikiFastJump/
// @updateURL    https://github.com/Ginsway/HuijiWikiFastJump/raw/refs/heads/main/HuijiWikiFastJump.user.js
// @downloadURL  https://github.com/Ginsway/HuijiWikiFastJump/raw/refs/heads/main/HuijiWikiFastJump.user.js
// ==/UserScript==

(function() {
    "use strict";

    // class 检查函数
    function hasAllClasses(el, classList) {
        return classList.every(c => el.classList.contains(c));
    }
    function hasAnyClasses(el, classList) {
        return classList.some(c => el.classList.contains(c));
    }

    const needed = [
        "cm-mw-template-name",
        "cm-mw-pagename"
    ];
    const needed2 = [
        "cm-mw-template-ground",
        "cm-mw-template2-ground",
        "cm-mw-template3-ground",
        "cm-mw-template-ext-ground"
    ];

    function isTargetElement(el) {
        return hasAllClasses(el, needed) && hasAnyClasses(el, needed2);
    }
    // 当前进入的目标元素，方便失焦恢复
    let currentTarget = null;

    // 绑定Ctrl+左键点击
    document.addEventListener('click', function (e) {
    if (e.button !== 0 || !e.ctrlKey) return;
    let el = e.target;
    while (el && el !== document.body) {
        if (el.classList && isTargetElement(el)) {
            const id = (el.textContent || '').trim();
            if (id) {
                window.open(
                    `https://${window.location.hostname}/wiki/%E6%A8%A1%E6%9D%BF:${encodeURIComponent(id)}`,
                    "_blank"
                );
                e.preventDefault();
                return; // 这里要加return，防止多次处理
            }
        }
        el = el.parentElement;
    }
}, false); // <<< 用冒泡阶段

    // 悬浮逻辑
    document.addEventListener("mouseover", function (e) {
        let el = e.target;
        while (el && el !== document.body) {
            if (el.classList && isTargetElement(el)) {
                currentTarget = el;
                if (window.ctrlKeyDown) {
                    el.style.cursor = "pointer";
                }
                break;
            }
            el = el.parentElement;
        }
    });

    document.addEventListener("mouseout", function (e) {
        let el = e.target;
        // 找到目标，恢复光标
        if (el && el === currentTarget) {
            el.style.cursor = "";
            currentTarget = null;
        }
    });

    // 记录Ctrl键状态
    window.ctrlKeyDown = false;
    document.addEventListener("keydown", function (e) {
        if (e.key === "Control") {
            window.ctrlKeyDown = true;
            if (currentTarget) {
                currentTarget.style.cursor = "pointer";
            }
        }
    });
    document.addEventListener("keyup", function (e) {
        if (e.key === "Control") {
            window.ctrlKeyDown = false;
            if (currentTarget) {
                currentTarget.style.cursor = "";
            }
        }
    });
})();
