var $ = function(b) {
    return document.getElementById(b)
};
var log = function(a) {
    if (window.console) {
        console.log(a)
    }
};
const ec = {
    _cache: {},
    wap: false,
    web: true,
    code: "",
    loginFlag: false
};
String.prototype.endWith = function(a) {
    if (a == null || a == "" || this.length == 0 || a.length > this.length) {
        return false
    }
    if (this.substring(this.length - a.length) == a) {
        return true
    } else {
        return false
    }
    return true
};
String.prototype.startWith = function(a) {
    if (a == null || a == "" || this.length == 0 || a.length > this.length) {
        return false
    }
    if (this.substr(0, a.length) == a) {
        return true
    } else {
        return false
    }
    return true
};
ec.util = {
    toHtml: function(b) {
        return b.replace(/[<>&"']/g,
        function(a) {
            return "&#x" + a.charCodeAt(0).toString(16) + ";"
        })
    },
    isFunction: function(a) {
        return Object.prototype.toString.call(a) === "[object Function]"
    },
    getParamObj: function(c, e) {
        var d = {},
        c = (typeof c === "string") ? c: "",
        e = (typeof e === "string") ? e: "";
        c.replace(/([^?=&#]+)=([^&]*)/g,
        function(a, f, b) {
            d[f] = b
        });
        e.replace(/([^?=&#]+)=([^&]*)/g,
        function(a, f, b) {
            d[f] = b
        });
        return d
    },
    getRandom: function(c, a) {
        var b = a - c;
        var d = Math.random();
        return (c + Math.round(d * b))
    },
    addScriptTag: function(src, fn) {
        if (!src) {
            return
        }
        with(document) {
            0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = src]
        }
        if (fn && ec.util.isFunction(fn)) {
            setTimeout(fn, 100)
        }
    },
    ajax: {
        xhr: function() {
            if (window.location.protocol !== "file:") {
                try {
                    return new XMLHttpRequest()
                } catch(a) {}
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                } catch(a) {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
            }
        },
        open: function(e) {
            if (!e.url || typeof e.url !== "string" || e.url.length < 5) {
                return
            }
            var c = this.xhr(),
            a = ec.util.isFunction;
            if (c) {
                var b = null;
                e.type = e.type || "GET";
                e.dataType = e.dataType || "json";
                e.async = e.async || true;
                e.headers = e.headers || false;
                if (e.data && typeof e.data !== "string") {
                    var d = [];
                    for (key in e.data) {
                        d.push(key + "=" + e.data[key])
                    }
                    b = d.join("&")
                } else {
                    b = e.data
                }
                if (e.type === "GET" && b) {
                    e.url = e.url + ((e.url.indexOf("?") < 0) ? "?": "&") + b;
                    b = null
                }
                c.open(e.type, e.url, e.async);
                if (e.headers) {
                    c.setRequestHeader("CsrfToken", ec.util.cookie.get("CSRF-TOKEN"))
                }
                c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                c.withCredentials = true;
                c.onreadystatechange = function() {
                    if (c.readyState == 4) {
                        if (c.status == 200) {
                            if (e.success) {
                                var f;
                                if (e.dataType === "json") {
                                    try {
                                        f = JSON.parse(c.responseText)
                                    } catch(g) {
                                        f = (new Function("return " + c.responseText))()
                                    }
                                } else {
                                    f = c.responseText
                                }
                                e.success(f)
                            }
                            return
                        }
                    }
                };
                c.send(b)
            }
        },
        getJson: function(a) {
            if (a.funName) {
                window[a.funName] = a.success
            }
            ec.util.addScriptTag(a.url)
        }
    },
    cookie: {
        get: function(m) {
            var g = null;
            if (document.cookie && document.cookie != "") {
                var j = document.cookie.split(";");
                for (var k = 0; k < j.length; k++) {
                    var l = (j[k] || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
                    if (l.substring(0, m.length + 1) == (m + "=")) {
                        var h = function(c) {
                            c = c.replace(/\+/g, " ");
                            var a = '()<>@,;:\\"/[]?={}';
                            for (var b = 0; b < a.length; b++) {
                                if (c.indexOf(a.charAt(b)) != -1) {
                                    if (c.startWith('"')) {
                                        c = c.substring(1)
                                    }
                                    if (c.endWith('"')) {
                                        c = c.substring(0, c.length - 1)
                                    }
                                    break
                                }
                            }
                            return decodeURIComponent(c)
                        };
                        g = h(l.substring(m.length + 1));
                        break
                    }
                }
            }
            return g
        },
        set: function(k, r, m) {
            m = m || {};
            if (r === null) {
                r = "";
                m.expires = -1
            }
            var o = "";
            if (m.expires && (typeof m.expires == "number" || m.expires.toUTCString)) {
                var n;
                if (typeof m.expires == "number") {
                    n = new Date();
                    n.setTime(n.getTime() + (m.expires * 24 * 60 * 60 * 1000))
                } else {
                    n = m.expires
                }
                o = "; expires=" + n.toUTCString()
            }
            var p = "; path=" + (m.path || "/");
            var l = "vmall.com";
            var j = "; domain=" + l;
            var q = m.secure ? "; secure": "";
            document.cookie = [k, "=", encodeURIComponent(r), o, p, j, q].join("")
        },
        remove: function(b) {
            this.set(b, null)
        }
    },
    countdown: function(p, n) {
        var k = $(p),
        o = ec._cache[p + n.startTime],
        r,
        l = n.now - new Date().getTime(),
        m = 0,
        j = function() {
            m = Math.round((n.startTime - new Date().getTime() - l) / 1000);
            m = m <= 0 ? 0 : m
        },
        q = function() {
            j();
            if (m <= 0) {
                m = 0
            }
            r = {
                day: Math.floor(m / (24 * 60 * 60)),
                hour: (n.html.indexOf("{#day}") >= 0) ? Math.floor(m / 60 / 60) % 24 : Math.floor(m / 60 / 60),
                minute: Math.floor(m / 60) % 60,
                second: m % 60
            };
            var a = n.html.replace(/{#day}/g, r.day).replace(/{#hours}/g, r.hour > 9 ? r.hour: "0" + r.hour).replace(/{#minutes}/g, r.minute > 9 ? r.minute: "0" + r.minute).replace(/{#seconds}/g, r.second > 9 ? r.second: "0" + r.second);
            k.innerHTML = a;
            return (m <= 0) ? false: true
        };
        j();
        clearInterval(o);
        if (!q()) {
            if (n.callback) {
                n.callback(n)
            }
            return
        }
        o = setInterval(function() {
            if (!q()) {
                if (n.callback) {
                    n.callback(n)
                }
                clearInterval(o)
            }
        },
        1000);
        ec._cache[p + n.startTime] = o
    }
};
ec.fixed = function(f, j) {
    var f = $(f),
    h = document.compatMode == "CSS1Compat" ? document.documentElement: document.body,
    a = f.offsetTop + h.offsetTop,
    k = 0;
    var b = !!window.ActiveXObject;
    var e = b && !window.XMLHttpRequest;
    var c = b && !!document.documentMode;
    var d = b && !e && !c;
    if (e) {
        var g;
        window.onscroll = function() {
            window.clearTimeout(g);
            g = window.setTimeout(function() {
                k = h.scrollTop;
                if (k >= a) {
                    f.setAttribute("style", "bottom:10px");
                    return
                }
                f.setAttribute("style", " ")
            },
            60)
        }
    }
    $("tools-nav-service-robotim").setAttribute("href", "https://robotim.vmall.com/live800/chatClient/chatbox.jsp?companyID=8922&configID=10&skillId=17&enterurl=" + encodeURIComponent(window.location.href) + "&k=1&remark=")
};
var _paq = _paq || [];
ec.analytics = function(b) {
    if (b.bi || b.dap) {
        var a = "https://res.vmallres.com/bi/hianalytics_v15.js";
        ec.util.addScriptTag(a)
    }
    if (b.bi) {
        _paq.push(["setTrackerUrl", "https://metrics-drcn.dt.hicloud.com:6447/webv1"]);
        ec.pushData()
    }
    if (b.dap) {
        getPtid();
        _paq.push(["setTrackerUrl", "https://dap.vmall.com/dap/report"]);
        ec.pushData()
    }
};
ec.pushData = function() {
    _paq.push(["setSiteId", "sale.vmall.com"]);
    _paq.push(["setCustomVariable", 1, "cid", (ec.util.cookie.get("cps_id") || ""), "page"]);
    _paq.push(["setCustomVariable", 2, "direct", (ec.util.cookie.get("cps_direct") || ""), "page"]);
    _paq.push(["setCustomVariable", 4, "wi", (ec.util.cookie.get("cps_wi") || ""), "page"]);
    _paq.push(["setCustomVariable", 9, "deviceID", (ec.util.cookie.get("deviceID_BI") || ""), "visit"]);
    _paq.push(["setCustomVariable", 10, "uid", (ec.util.cookie.get("uid") || ""), "visit"]);
    _paq.push(["trackPageView"])
};
function getPtid() {
    var e = ec.util.cookie.get("deviceid");
    if (e == null || e == "" || e == undefined) {
        var d = [];
        var c = "0123456789abcdef";
        for (var b = 0; b < 32; b++) {
            d[b] = c.substr(Math.floor(Math.random() * 16), 1)
        }
        d[14] = "4";
        d[19] = c.substr((d[19] & 3) | 8, 1);
        d[8] = d[13] = d[18] = d[23];
        e = d.join("");
        ec.util.cookie.set("deviceid", e, {
            expires: 3650,
            domain: "vmall.com"
        })
    }
    ec.util.cookie.set("TID", e, {
        expires: 3650,
        domain: "vmall.com"
    });
    return e
}
ec.ajax = function(a) {
    ec.util.ajax.open(a)
};
ec.getJson = function(a) {
    ec.util.ajax.getJson(a)
};
ec.isRequestFromVmall = false;
ec.paramForVmall = {};
var fromVmallSkuList = {};
ec.isFireRequest = true;
ec.initForVmall = function() {
    if (ec.isPreview) {
        return
    }
    if (location.protocol == "http:") {
        location.href = ec.url.activity.replace("http://", "https://")
    }
    if (location.search == "") {
        return
    }
    var f = ec.util.getParamObj(location.search, "");
    if (f.mainSku && f.mainSku != "" && f.backUrl && f.backUrl != "") {
        for (var e = 0; e < 1; e++) {
            if (isNaN(f.mainSku)) {
                break
            }
            var a = true;
            var d = new Array();
            if (f.giftSkus && f.giftSkus != "") {
                d = f.giftSkus.split(",");
                for (var b = 0; b < d.length; b++) {
                    if (isNaN(d[b])) {
                        a = false;
                        break
                    }
                }
            }
            if (!a) {
                break
            }
            if (f.accessoriesSkus && f.accessoriesSkus != "") {
                d = f.accessoriesSkus.split(",");
                for (var b = 0; b < d.length; b++) {
                    if (isNaN(d[b])) {
                        a = false;
                        break
                    }
                }
            }
            if (!a) {
                break
            }
            if (f.diyPackSkus && f.diyPackSkus != "") {
                d = f.diyPackSkus.split(",");
                for (var b = 0; b < d.length; b++) {
                    if (isNaN(d[b])) {
                        a = false;
                        break
                    }
                }
            }
            if (!a) {
                break
            }
            ec.paramForVmall.backUrl = decodeURIComponent(f.backUrl);
            if (ec.paramForVmall.backUrl.indexOf("vmall.com") == -1) {
                break
            }
            if (ec.endPage == true) {
                if (ec.paramForVmall.backUrl) {
                    location.href = ec.paramForVmall.backUrl
                } else {
                    location.href = ec.url.vmall
                }
                return
            }
            ec.paramForVmall.activityUrl = ec.url.activity;
            ec.paramForVmall.mainSkuId = f.mainSku;
            if (f.giftSkus) {
                ec.paramForVmall.giftSkus = f.giftSkus
            }
            if (f.accessoriesSkus) {
                ec.paramForVmall.accessoriesSkus = f.accessoriesSkus
            }
            if (f.diyPackSkus) {
                ec.paramForVmall.diyPackSkus = f.diyPackSkus
            }
            var c = false;
            for (skuGroupIndex in ec.skuList) {
                for (skuIndex in ec.skuList[skuGroupIndex].skuInfo) {
                    var g = ec.skuList[skuGroupIndex].skuInfo[skuIndex];
                    if (g.type == 1 && g.id == f.mainSku) {
                        ec.paramForVmall.skuIdInActivity = g.id;
                        c = true;
                        break
                    } else {
                        if (g.type == 3 && g.mainSkuId == f.mainSku) {
                            ec.paramForVmall.skuIdInActivity = g.id;
                            c = true;
                            break
                        }
                    }
                }
                if (c) {
                    break
                }
            }
            if (ec.paramForVmall.skuIdInActivity) {
                ec.selectedProduct.skuId = ec.paramForVmall.skuIdInActivity;
                ec.isRequestFromVmall = true;
                ec.url.activity = ec.paramForVmall.backUrl
            } else {
                location.href = ec.paramForVmall.backUrl;
                return
            }
        }
    }
    if (ec.isRequestFromVmall) {
        $("activity_main").style.display = "none";
        $("footerMessage").style.display = "none";
        fromVmallSkuList = ec.skuList;
        ec.skuList = [];
        ec.showMsgWait()
    } else {
        if (location.hash == "") {
            location.href = ec.url.activity
        }
    }
};
ec.setLoginUrlForVmall = function() {
    var b = ec.paramForVmall.activityUrl;
    var a = "";
    if (ec.paramForVmall.mainSkuId) {
        a += "mainSku=" + ec.paramForVmall.mainSkuId
    }
    if (ec.paramForVmall.giftSkus) {
        a += "&giftSkus=" + ec.paramForVmall.giftSkus
    }
    if (ec.paramForVmall.accessoriesSkus) {
        a += "&accessoriesSkus=" + ec.paramForVmall.accessoriesSkus
    }
    if (ec.paramForVmall.diyPackSkus) {
        a += "&diyPackSkus=" + ec.paramForVmall.diyPackSkus
    }
    if (ec.paramForVmall.backUrl) {
        a += "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl)
    }
    ec.loginUrl = ec.casLoginUrlDomain + "/CAS/portal/login.html?validated=true&themeName=red&service=https%3A%2F%2F" + ec.portalLoginUrlDomain + "%2Faccount%2Flogin%3Furl%3D" + encodeURIComponent(encodeURIComponent(b + "?" + a)) + "&loginChannel=26000000&reqClientType=26&lang=zh-cn"
};
ec.getBackUrl = function() {
    var b = ec.paramForVmall.activityUrl;
    var a = "";
    if (ec.paramForVmall.mainSkuId) {
        a += "mainSku=" + ec.paramForVmall.mainSkuId
    }
    if (ec.paramForVmall.giftSkus) {
        a += "&giftSkus=" + ec.paramForVmall.giftSkus
    }
    if (ec.paramForVmall.accessoriesSkus) {
        a += "&accessoriesSkus=" + ec.paramForVmall.accessoriesSkus
    }
    if (ec.paramForVmall.diyPackSkus) {
        a += "&diyPackSkus=" + ec.paramForVmall.diyPackSkus
    }
    if (ec.paramForVmall.backUrl) {
        a += "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl)
    }
    return b + "?" + a
};
ec.fireRequestForVmall = function() {
    if (ec.isRequestFromVmall) {
        if (!ec.account.isLogin()) {
            ec.setLoginUrlForVmall();
            location.href = ec.loginUrl;
            return
        }
        ec.showMsgWait();
        if (ec.isRequestFromVmall && !ec.isFireRequest) {
            return
        }
        if (ec.joinRequestCount >= ec.quitRequestCount) {
            if (ec.retryFun) {
                clearTimeout(ec.retryFun)
            }
            if (ec.oneMin) {
                clearTimeout(ec.oneMin)
            }
            ec.showMessageBox(1);
            $("boxButton").innerHTML = '<a href="' + ec.url.activity + '" title="看看其它商品" class="honor-box-btn" >看看其它商品</a><a href="javascript:;" onclick="ec.closeBox();ec.fireAgainRequestForVmall();return false;" title="再试一次" class="honor-box-btn-go" >再试一次</a>';
            return
        }
        ec.joinRequestCount = ec.joinRequestCount + 1;
        setTimeout(function() {
            if (ec.buyError) {
                clearTimeout(ec.buyError)
            }
            ec.submit(0)
        },
        500)
    }
};
ec.fireAgainRequestForVmall = function() {
    ec.joinRequestCount = 0;
    ec.fireRequestForVmall()
}; (function() {
    var a = ["uid", "user", "name", "ts", "valid", "sign", "cid", "wi", "ticket", "hasphone", "hasmail", "logintype", "rush_info"],
    b = ec.util.cookie;
    ec.account = {
        isLogin: function() {
            var c = b.get("rush_info");
            var d = b.get("uid");
            return (c && d)
        },
        setLoginInfo: function() {
            var c;
            var j = location.hash;
            var h = location.search;
            c = ec.util.getParamObj(h, j);
            for (i = 0; i < a.length; i += 1) {
                if (a[i] == "cid" || a[i] == "wi") {
                    continue
                }
                if (c[a[i]]) {
                    if (a[i] == "user" || a[i] == "name") {
                        c[a[i]] = c[a[i]].replace(/\+/g, "%20")
                    }
                    b.set(a[i], decodeURIComponent(c[a[i]]))
                }
            }
            var f = {};
            f.expires = 1;
            if (c.cid) {
                b.set("cps_id", decodeURIComponent(c.cid), f)
            }
            if (c.wi) {
                b.set("cps_wi", decodeURIComponent(c.wi), f)
            }
            var g = {
                expires: new Date() + 86400
            };
            b.set("_areacode", "CN", g);
            if (c.tag && c.tag == 1) {
                if (ec.isRequestFromVmall) {
                    ec.setLoginUrlForVmall()
                }
                location.href = ec.loginUrl;
                return
            }
            if (j && j.length > 0) {
                if (ec.isRequestFromVmall) {
                    var d = "";
                    if (ec.paramForVmall.mainSkuId) {
                        d += "mainSku=" + ec.paramForVmall.mainSkuId
                    }
                    if (ec.paramForVmall.giftSkus) {
                        d += "&giftSkus=" + ec.paramForVmall.giftSkus
                    }
                    if (ec.paramForVmall.accessoriesSkus) {
                        d += "&accessoriesSkus=" + ec.paramForVmall.accessoriesSkus
                    }
                    if (ec.paramForVmall.diyPackSkus) {
                        d += "&diyPackSkus=" + ec.paramForVmall.diyPackSkus
                    }
                    if (ec.paramForVmall.backUrl) {
                        d += "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl)
                    }
                    location.href = ec.paramForVmall.activityUrl + "?" + (d);
                    return
                }
                location.href = ec.url.activity
            }
        },
        getLoginInfo: function() {
            var d = b.get("displayName"),
            c = "";
            d = (d ? d: b.get("name"));
            $("login-btn-1").style.display = "none";
            $("user_login_name").innerHTML = "<i class='icon-name'></i>" + d;
            $("user_login_name").style.display = "inline";
            $("logout").style.display = "inline";
            ec.loginFlag = true
        },
        getLoginPars: function() {
            var c = {};
            for (i = 0; i < a.length; i += 1) {
                var d = b.get(a[i]);
                d = d == null ? "": encodeURIComponent(d);
                if (d) {
                    c[a[i]] = d
                }
            }
            return c
        },
        logout: function() {
            var c = b.get("uid");
            for (i = 0; i < a.length; i += 1) {
                ec.util.cookie.remove(a[i])
            }
            ec.util.cookie.remove("hasImg");
            ec.util.cookie.remove("isqueue-" + ec.activityId + "-" + c);
            ec.util.cookie.remove("queueSign-" + ec.activityId + "-" + c);
            ec.util.cookie.remove("orderSign-" + ec.activityId + "-" + c);
            location.href = ec.logoutUrl + encodeURIComponent(ec.url.activity)
        },
        init: function() {
            this.setLoginInfo();
            var c = b.get("orderSign-" + ec.activityId + "-" + b.get("uid"));
            if (c) {
                b.remove("orderSign-" + ec.activityId + "-" + b.get("uid"))
            }
            if (this.isLogin()) {
                this.getLoginInfo();
                return
            }
            if (!ec.endPage) {
                $("honor-btn").innerHTML = '<a id="login-btn-2" class="honor-btn-advance" title="提前登录" href="#">提前登录</a>'
            }
            ec.util.cookie.remove("hasImg")
        },
        isBindPhone: function() {
            var e = b.get("hasphone"),
            c = b.get("hasmail"),
            d = b.get("logintype");
            return e && (1 == e) && c && d
        },
        change: function() {
            var c = b.get("uid");
            for (i = 0; i < a.length; i += 1) {
                ec.util.cookie.remove(a[i])
            }
            ec.util.cookie.remove("hasImg");
            ec.util.cookie.remove("isqueue-" + ec.activityId + "-" + c);
            ec.util.cookie.remove("queueSign-" + ec.activityId + "-" + c);
            ec.util.cookie.remove("orderSign-" + ec.activityId + "-" + c);
            if (ec.isRequestFromVmall) {
                ec.setLoginUrlForVmall()
            }
            location.href = ec.logoutUrl + encodeURIComponent(encodeURIComponent(ec.loginUrl))
        },
        toBindPhone: function() {
            if (ec.isRequestFromVmall) {
                location.href = ec.bindPhoneUrlDomain + "/oauth2/userCenter/bindAccount/bindMobileAccount_1.jsp?lang=zh-cn&themeName=cloudTheme&reqClientType=26&redirect_uri=" + encodeURIComponent(ec.getBackUrl() + "#tag=1")
            } else {
                location.href = ec.bindPhoneUrl
            }
        }
    }
})();
ec.getOffset = function(a) {
    var b = {
        top: 0,
        left: 0
    };
    while (a) {
        b.top += a.offsetTop;
        b.left += a.offsetLeft;
        a = a.offsetParent
    }
    return b
};
ec.getTagById = function(b, a) {
    for (tag in ec.groupTag[b].tags) {
        if (ec.groupTag[b].tags[tag].id == a) {
            return ec.groupTag[b].tags[tag]
        }
    }
};
ec.isTagsEqualToSelected = function(a, b) {
    for (i = 0; i < b.length; i++) {
        if (b[i] != a[i]) {
            return false
        }
    }
    return true
};
function uniqueTag(e) {
    var a = [],
    d = {};
    for (var b = 0,
    c; b < e.length; b++) {
        c = e[b].id;
        if (!d[c]) {
            a.push(e[b]);
            d[c] = true
        }
    }
    return a
}
ec.getNextLevelTagList = function(b) {
    if (b.length == ec.groupTag.length) {
        return null
    }
    var a = new Array();
    for (skuGroup in ec.skuList) {
        if (ec.isTagsEqualToSelected(ec.skuList[skuGroup].groupTag, b)) {
            a.push(ec.getTagById(b.length, ec.skuList[skuGroup].groupTag[b.length]))
        }
    }
    a = uniqueTag(a);
    return a
};
ec.getSkuListBySelectedTags = function(a) {
    if (a.length == ec.groupTag.length) {
        for (skuGroup in ec.skuList) {
            if (ec.isTagsEqualToSelected(ec.skuList[skuGroup].groupTag, a)) {
                return ec.skuList[skuGroup].skuInfo
            }
        }
    }
};
ec.getFirstTagHasSku = function(a) {
    return a[ec.tagNum]
};
ec.getInitSkuList = function() {
    var b = new Array();
    if (ec.groupTag.length > 0) {
        b.push(ec.getFirstTagHasSku(ec.groupTag[0].tags).id);
        for (var a = 1; a < ec.groupTag.length; a++) {
            b.push(ec.getNextLevelTagList(b)[0].id)
        }
    }
    return ec.getSkuListBySelectedTags(b)
};
ec.getSkuById = function(a) {
    for (skuGroup in ec.skuList) {
        for (sku in ec.skuList[skuGroup].skuInfo) {
            if (ec.skuList[skuGroup].skuInfo[sku].id == a) {
                return ec.skuList[skuGroup].skuInfo[sku]
            }
        }
    }
    return null
};
ec.setPackTagName = function() {
    if (ec.selectedProduct.groupTagIds.length > 1) {
        var a = ec.groupTag[ec.selectedProduct.groupTagIds.length - 2].tags;
        var g = ec.selectedProduct.groupTagIds.length;
        for (var c in a) {
            var h = a[c].id;
            for (skuTagNum in ec.skuList) {
                var e = ec.skuList[skuTagNum].groupTag.length;
                if (e <= 3 && ec.skuList[skuTagNum].groupTag[e - 2] == h) {
                    for (var b in ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags) {
                        var f = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].id;
                        if (ec.skuList[skuTagNum].groupTag[e - 1] == f && ec.selectedProduct.groupTagIds[e - 2] == h) {
                            var d = "skuGroupTagText-" + ec.skuList[skuTagNum].groupTag[e - 1];
                            if (document.getElementById(d)) {
                                document.getElementById(d).innerHTML = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].name + " &yen; " + ec.skuList[skuTagNum].skuInfo[0].price
                            }
                        }
                    }
                } else {
                    if (e == 4 && ec.skuList[skuTagNum].groupTag[e - 3] == ec.selectedProduct.groupTagIds[e - 3]) {
                        for (var b in ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags) {
                            var f = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].id;
                            if (ec.skuList[skuTagNum].groupTag[e - 1] == f && ec.skuList[skuTagNum].groupTag[e - 3] == ec.selectedProduct.groupTagIds[e - 3] && ec.skuList[skuTagNum].groupTag[e - 2] == ec.selectedProduct.groupTagIds[e - 2]) {
                                var d = "skuGroupTagText-" + ec.skuList[skuTagNum].groupTag[e - 1];
                                if (document.getElementById(d)) {
                                    document.getElementById(d).innerHTML = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].name + " &yen; " + ec.skuList[skuTagNum].skuInfo[0].price
                                }
                            }
                        }
                    } else {
                        if (e == 5 && ec.skuList[skuTagNum].groupTag[e - 4] == ec.selectedProduct.groupTagIds[e - 4]) {
                            for (var b in ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags) {
                                var f = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].id;
                                if (ec.skuList[skuTagNum].groupTag[e - 1] == f && ec.skuList[skuTagNum].groupTag[e - 4] == ec.selectedProduct.groupTagIds[e - 4] && ec.skuList[skuTagNum].groupTag[e - 3] == ec.selectedProduct.groupTagIds[e - 3] && ec.skuList[skuTagNum].groupTag[e - 2] == ec.selectedProduct.groupTagIds[e - 2]) {
                                    var d = "skuGroupTagText-" + ec.skuList[skuTagNum].groupTag[e - 1];
                                    if (document.getElementById(d)) {
                                        document.getElementById(d).innerHTML = ec.groupTag[ec.selectedProduct.groupTagIds.length - 1].tags[b].name + " &yen; " + ec.skuList[skuTagNum].skuInfo[0].price
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
ec.getSelectedSkuDesc = function(b) {
    var a = "<span>";
    if (ec.selectedProduct.skuId != null && typeof(ec.selectedProduct.skuId) != "undefined" && ec.selectedProduct.skuId != 0) {
        ec.setPackTagName();
        a += "已选择：" + ec.selectedProduct.prodName;
        for (tagName in ec.selectedProduct.groupTags) {
            if (ec.groupTags.length == 1 && tagName == 0) {
                continue
            } else {
                a += " " + ec.selectedProduct.groupTags[tagName]
            }
        }
        a += " &yen; " + ec.selectedProduct.price;
        if (b) {
            a += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="ec.reSelectTagAndSku();">重新选择 ></a>'
        }
        a += '</span><br><span style="color:#888888">' + ec.selectedProduct.deliveryDescription
    } else {
        a += "请先选择要购买的商品";
        if (b) {
            a += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" onclick="ec.gotoSelectTagAndSku();">去选择 ></a>'
        }
    }
    a += "</span>";
    return a
};
ec.createGroupNode = function(e, d, b, c) {
    var a = "";
    for (tag in d) {
        if (c >= 0) {
            a += ec.createGroupTagNode(e, d[tag], b, tag)
        } else {
            a += ec.createGroupTagNode(e, d[tag], b, -1)
        }
    }
    return a
};
ec.createGroupTagNode = function(e, a, b, c) {
    var d = "";
    if (a.hasSku) {
        d = "<li " + ((!b || a.isSoldOut == 0) ? 'class="honor-version-past"': (' onclick="ec.selectGroupTagWithSku(' + e + "," + a.id + "," + a.isSoldOut + "," + c + ')"')) + ' id="skuGroupTag-' + a.id + '"> <div class="honor-version-cont"> <p class="honor-version-tit" id="skuGroupTagText-' + a.id + '">' + a.name + '</p> <span class="honor-version-radio"></span> </div></li>'
    }
    return d
};
ec.createSkuGroupNode = function(c, b) {
    var a = "";
    var d = new Array();
    for (sku in c) {
        a += ec.createSkuNode(c[sku], b);
        if (c[sku].type == 3) {
            d.push(c[sku])
        }
    }
    if (d.length > 0) {
        a += ec.createContrastPackage(d)
    }
    return a
};
ec.createSkuNode = function(c, b) {
    var a = "<li " + ((!b || c.isSoldOut == 0) ? 'class="honor-version-past"': (' onclick="ec.selectSku(' + c.id + "," + c.isSoldOut + ')"')) + ' id="prod-' + c.id + '" > <div class="honor-version-cont">';
    a += '<p class="honor-version-tit">' + c.name + "&nbsp;&yen;&nbsp;" + c.price + "</p>";
    a += '<span class="honor-version-radio"></span> </div></li>';
    return a
};
ec.createContrastPackage = function(b) {
    var a = " <li >";
    a += ' 		<div class="honor-version-all clearfix" id="contrastAllPackage">';
    a += ' 		<a href="javascript:;" class="honor-version-all-tit" onclick="ec.showPackage()">对比全部套餐 &gt;</a>';
    a += ' 			<div class="honor-version-layout" style="display:none" id="packageinfo" >';
    a += ' 				<div class="honor-version-layout-hd">';
    a += " 					<table>";
    a += " 						<tr>";
    a += ' 							<th class="tr-package-name">&nbsp;&nbsp;</th>';
    a += ' 							<th class="tr-package-prod">套餐内容</th>';
    a += ' 							<th class="tr-package-save">节省</th>';
    a += ' 							<th class="tr-package-price">套餐价</th>';
    a += " 						</tr>";
    a += " 					</table>";
    a += " 				</div>";
    a += ' 				<div class="honor-version-layout-bd">';
    a += " 					<table>";
    for (packageData in b) {
        if (b[packageData].saveMoney == null || typeof(b[packageData].saveMoney) == "undefined") {
            b[packageData].saveMoney = 0
        }
        a += " 					<tr>";
        a += ' 						<td class="tr-package-name">' + b[packageData].name + "</td>";
        a += ' 						<td class="tr-package-prod">' + b[packageData].pDescription + "</td>";
        a += ' 						<td class="tr-package-save">&yen;&nbsp;' + b[packageData].saveMoney + "</td>";
        a += ' 						<td class="tr-package-price">&yen;&nbsp;' + b[packageData].price + "</td>";
        a += " 					</tr>"
    }
    a += " 					</table>";
    a += " 				</div>";
    a += " 			</div>";
    a += " 		</div>";
    a += " 	</li>";
    return a
};
ec.init = function(b, a) {
    if (ec.isRequestFromVmall) {
        return
    }
    ec.initHasSkuData();
    ec.initSkuGroupTag(b);
    if (a) {
        ec.autoSelectTagAndSku();
        ec.loadSkuStatus()
    }
    ec.setScrollAction();
    ec.loadStatus = 1;
    if (ec.selectedProduct.groupTagIds.length == 0 || ec.selectedProduct == undefined) {
        ec.setOverPackTagName()
    }
};
ec.setOverPackTagName = function() {
    var e = "";
    ec.groupTag = ec.groupTags[ec.tagNum];
    var d = ec.groupTag.length;
    for (var b in ec.groupTag[d - 1].tags) {
        var f = ec.groupTag[d - 1].tags[b].id;
        for (var a in ec.skuList) {
            if (ec.skuList[a].groupTag[d - 1] == f && e.indexOf(f + "")) {
                e = e + "," + f;
                var c = "skuGroupTagText-" + ec.skuList[a].groupTag[d - 1];
                if (document.getElementById(c)) {
                    document.getElementById(c).innerHTML = ec.groupTag[d - 1].tags[b].name + " &yen; " + ec.skuList[a].skuInfo[0].price
                }
            }
        }
    }
};
ec.isOutSku = function() {
    var c = [];
    var e = false,
    d = 0,
    a = 0,
    b = 0;
    for (skuIndex in ec.skuList) {
        if (ec.skuList[skuIndex].isSoldOut != 0) {
            c.push(ec.skuList[skuIndex].groupTag[0]);
            e = true
        }
        if (ec.skuList[skuIndex].isSoldOut == 1) {
            d++
        }
    }
    if (c.length > 0 && e && ec.skuList.length != d) {
        for (TagIndex in ec.groupTag[0].tags) {
            if (ec.groupTag[0].tags[TagIndex].isSoldOut != 0) {
                if (TagIndex == ec.tagNum) {
                    return
                } else {
                    a = TagIndex;
                    b = ec.groupTag[0].tags[TagIndex].id;
                    ec.selectGroupTagWithSku(0, b, 1, a);
                    return
                }
            }
        }
    }
};
ec.initHasSkuData = function() {
    if (ec.groupTags.length == 0) {
        var b = [];
        var d = [];
        for (var a in ec.groupTag) {
            if (ec.groupTag[a].tags[0].parentId == 0) {
                var f = false;
                for (skuListIndexTemp in ec.skuList) {
                    if (ec.groupTag[a].tags[0].id == ec.skuList[skuListIndexTemp].groupTag[0]) {
                        f = true
                    }
                }
                if (f) {
                    b.push(ec.groupTag[a])
                } else {
                    d.push(ec.groupTag[a])
                }
            }
        }
        b.sort(function(k, j) {
            return k.tags[0].tagSortNum - j.tags[0].tagSortNum
        });
        var h = [];
        for (noHasSkuIndex in d) {
            for (var g in ec.groupTag) {
                if (ec.groupTag[g].tags[0].parentId == 0 && ec.groupTag[g].tags[0].id == d[noHasSkuIndex].tags[0].id) {
                    h.push(g)
                }
            }
        }
        for (delTagIndexTemp in h) {
            ec.groupTag.splice(Number(h[delTagIndexTemp]), 1)
        }
        for (var a in b) {
            var c = [];
            c.push(b[a]);
            for (var g in ec.groupTag) {
                if (b[a].tags[0].id == ec.groupTag[g].tags[0].parentId) {
                    c.push(ec.groupTag[g])
                }
            }
            ec.groupTags.push(c)
        }
        for (groupIndexT in ec.groupTags) {
            if (ec.groupTags[0][0].tags[0].id != ec.groupTags[groupIndexT][0].tags[0].id) {
                ec.groupTags[0][0].tags.push(ec.groupTags[groupIndexT][0].tags[0])
            }
        }
        for (indexG in ec.groupTags) {
            ec.groupTags[indexG][0].tags = ec.groupTags[0][0].tags;
            for (indexGroupT in ec.groupTags[indexG]) {
                for (indexTag in ec.groupTags[indexG][indexGroupT].tags) {
                    for (indexSku in ec.skuList) {
                        if (ec.groupTags[indexG].length == ec.skuList[indexSku].groupTag.length && ec.groupTags[indexG][indexGroupT].tags[indexTag].id == ec.skuList[indexSku].groupTag[indexGroupT]) {
                            ec.groupTags[indexG][indexGroupT].tags[indexTag].hasSku = true;
                            break
                        }
                    }
                }
            }
        }
        for (var e in ec.groupTags[0][0].tags) {
            if (ec.groupTags[0][0].tags[e].isRecommend == 1) {
                ec.tagNum = e
            }
        }
    }
    ec.groupTag = ec.groupTags[ec.tagNum]
};
ec.initSkuGroupTag = function(a) {
    delete ec.selectedProduct.skuId;
    delete ec.selectedProduct.price;
    delete ec.selectedProduct.skuName;
    delete ec.selectedProduct.deliveryDescription;
    ec.selectedProduct.groupTagIds = new Array();
    ec.selectedProduct.groupTags = new Array();
    $("showSelected").innerHTML = ec.getSelectedSkuDesc(false);
    var b = "";
    ec.setSoldOutOfTag(0);
    for (index in ec.groupTag) {
        if (index == 0) {
            if (ec.groupTags.length == 1) {
                b += '<div class="honor-version" style = "display:none;"><i>' + ec.groupTag[index].groupName + '：</i><ul id="skuGroup-' + index + '" class="honor-version-list clearfix">' + ec.createGroupNode(index, ec.groupTag[index].tags, a && (index == 0), index) + "</ul></div>"
            } else {
                b += '<div class="honor-version"><i>' + ec.groupTag[index].groupName + '：</i><ul id="skuGroup-' + index + '" class="honor-version-list clearfix">' + ec.createGroupNode(index, ec.groupTag[index].tags, a && (index == 0), index) + "</ul></div>"
            }
        } else {
            b += '<div class="honor-version"><i>' + ec.groupTag[index].groupName + '：</i><ul id="skuGroup-' + index + '" class="honor-version-list clearfix">' + ec.createGroupNode(index, ec.groupTag[index].tags, a && (index == 0), -1) + "</ul></div>"
        }
    }
    b += '<div class="honor-version" id="choose_products"  style = "display:none;"><i>套餐：</i><ul id="packageGroup" class="honor-version-list pro clearfix">' + ec.createSkuGroupNode(ec.getInitSkuList(), a && (ec.groupTag.length == 0)) + "</ul></div>";
    $("choose_area").innerHTML = b
};
ec.getRecommendTagId = function(a) {
    var c = 0;
    var b = 0;
    for (var d = 0; d < a.length; d++) {
        if (a[d].hasSku && (a[d].isSoldOut == 1 || a[d].isSoldOut == 2)) {
            if (b == 0) {
                b = a[d].id
            }
            if (a[d].isRecommend == 1) {
                if (a[0].parentId == 0) {
                    c = a[ec.tagNum].id
                } else {
                    c = a[d].id
                }
                break
            }
        }
    }
    if (c == 0) {
        if (a[0].parentId == 0) {
            c = a[ec.tagNum].id
        } else {
            if (b == 0) {
                c = a[0].id
            } else {
                c = b
            }
        }
    }
    return c
};
ec.getRecommendSkuId = function(b) {
    var c = 0;
    var a = 0;
    for (var d = 0; d < b.length; d++) {
        if (b[d].isSoldOut == 1 || b[d].isSoldOut == 2) {
            if (a == 0) {
                a = b[d].id
            }
            if (b[d].isRecommend == 1) {
                c = b[d].id;
                break
            }
        }
    }
    if (c == 0) {
        c = a
    }
    return c
};
ec.autoSelectTagAndSku = function() {
    if (ec.groupTag.length > 0) {
        ec.selectGroupTagWithSku(0, ec.getRecommendTagId(ec.groupTag[0].tags), ec.groupTag[0].tags[0].isSoldOut, -1)
    } else {
        ec.selectSku(ec.getRecommendSkuId(ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds)), ec.getSkuById(ec.getRecommendSkuId(ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds))).isSoldOut)
    }
};
ec.selectGroupTagWithSku = function(f, d, a, e) {
    if (e >= 0) {
        ec.tagNum = e;
        ec.lodDefault();
        return
    }
    if (ec.groupTag.length < f + 1) {
        return
    }
    ec.selectSkuGroupTag(f, d, a);
    for (var b = f + 1; b < ec.groupTag.length; b++) {
        ec.selectSkuGroupTag(b, ec.getRecommendTagId(ec.getNextLevelTagList(ec.selectedProduct.groupTagIds)))
    }
    var c = ec.getRecommendSkuId(ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds));
    if (c != 0) {
        ec.selectSku(ec.getRecommendSkuId(ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds)), ec.getSkuById(ec.getRecommendSkuId(ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds))).isSoldOut)
    }
};
ec.selectSkuGroupTag = function(f, d, a) {
    if (ec.groupTag.length < f + 1 || ec.selectedProduct.groupTagIds.length != ec.selectedProduct.groupTags.length || ec.selectedProduct.groupTagIds.length < f) {
        return
    }
    ec.selectedProduct.groupTagIds[f] = d;
    ec.selectedProduct.groupTags[f] = ec.getTagById(f, d).name;
    delete ec.selectedProduct.skuId;
    delete ec.selectedProduct.price;
    delete ec.selectedProduct.skuName;
    delete ec.selectedProduct.deliveryDescription;
    $("skuGroupTag-" + d).className = "honor-version-active";
    $("showSelected").innerHTML = ec.getSelectedSkuDesc(false);
    for (tagIndex in ec.groupTag[f].tags) {
        if (ec.groupTag[f].tags[tagIndex].id != d && $("skuGroupTag-" + ec.groupTag[f].tags[tagIndex].id) != null && $("skuGroupTag-" + ec.groupTag[f].tags[tagIndex].id).className == "honor-version-active") {
            $("skuGroupTag-" + ec.groupTag[f].tags[tagIndex].id).className = ""
        }
    }
    if (f + 1 == ec.groupTag.length) {
        var e = ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds);
        $("packageGroup").innerHTML = ec.createSkuGroupNode(e, true)
    } else {
        ec.setSoldOutOfTag(f + 1);
        if (ec.selectedProduct.groupTagIds.length != f + 1) {
            ec.selectedProduct.groupTagIds.splice(f + 1, (ec.groupTag.length - f - 1));
            ec.selectedProduct.groupTags.splice(f + 1, (ec.groupTag.length - f - 1));
            for (var c = f + 2; c < ec.groupTag.length; c++) {
                $("skuGroup-" + (c)).innerHTML = ec.createGroupNode(c, ec.groupTag[c].tags, false, -1)
            }
            $("packageGroup").innerHTML = ec.createSkuGroupNode(ec.getInitSkuList(), false, -1)
        }
        var b = ec.getNextLevelTagList(ec.selectedProduct.groupTagIds);
        $("skuGroup-" + (f + 1)).innerHTML = ec.createGroupNode(f + 1, b, true, -1)
    }
};
ec.selectSku = function(b, a) {
    if (b == 0) {
        return false
    }
    if (ec.selectedProduct.skuId == b) {
        return false
    }
    var d = ec.getSkuById(b);
    ec.selectedProduct.skuId = b;
    ec.selectedProduct.price = d.price;
    ec.selectedProduct.skuName = d.name;
    ec.selectedProduct.deliveryDescription = d.deliveryDescription;
    $("prod-" + b).className = "honor-version-active";
    var c = ec.getSkuListBySelectedTags(ec.selectedProduct.groupTagIds);
    for (skuIndex in c) {
        if (c[skuIndex].id != b && $("prod-" + c[skuIndex].id) && $("prod-" + c[skuIndex].id).className == "honor-version-active") {
            $("prod-" + c[skuIndex].id).className = ""
        }
    }
    if (a == "2") {
        if ($("dateup").className == "honor-all-time hide" || $("dateup").className == "honor-all-time honor-btn-time-prompt hide") {
            $("dateup").className = "honor-all-time honor-btn-time-prompt";
            $("honor-btn").innerHTML = '<a class="honor-btn-end" title="已售罄" href="javascript:;">已售罄</a>';
            ec.endPage = true
        }
    } else {
        if ($("dateup").className == "honor-all-time honor-btn-time-prompt" || $("dateup").className == "honor-all-time hide") {
            ec.hide(["dateup"]);
            if (ec.account.isLogin()) {
                $("honor-btn").innerHTML = '<a onclick="ec.buy(this); return false;" href="javascript:;" title="立即申购" class="honor-btn-go">立即申购</a>'
            } else {
                $("honor-btn").innerHTML = '<a onclick="ec.buy(this); return false;" href="javascript:;" title="立即登录" class="honor-btn-go">立即登录</a>'
            }
        }
    }
    $("showSelected").innerHTML = ec.getSelectedSkuDesc(false);
    if (ec.loadStatus == 1) {
        ec.loadStatus = 3
    }
    return false
};
ec.returnTop = function() {
    var a = document.body.scrollTop || document.documentElement.scrollTop;
    ec.returnTopWithFixedTime(a)
};
ec.returnTopWithFixedTime = function(a) {
    var b = document.body.scrollTop || document.documentElement.scrollTop;
    window.scrollBy(0, -a / 5);
    if (b > 0) {
        setTimeout("ec.returnTopWithFixedTime(" + a + ")", 20)
    }
};
ec.reSelectTagAndSku = function() {
    ec.returnTop();
    $("showSelected").innerHTML = ec.getSelectedSkuDesc(false)
};
ec.gotoSelectTagAndSku = function() {
    ec.returnTop();
    $("showSelected").innerHTML = ec.getSelectedSkuDesc(false)
};
ec.setScrollAction = function() {
    ec.floatAreaTop = ec.getOffset($("button_area")).top;
    ec.goBackTop = ec.getOffset($("hungBarTop")).top;
    window.onscroll = function() {
        var a = document.body.scrollTop || document.documentElement.scrollTop;
        if (a > ec.floatAreaTop) {
            if ($("packageinfo") != null && $("packageinfo").style.display == "block") {
                ec.showPackage()
            }
            $("button_area").style.position = "fixed";
            $("showSelected").innerHTML = ec.getSelectedSkuDesc(true)
        } else {
            $("button_area").style.position = "absolute";
            $("showSelected").innerHTML = ec.getSelectedSkuDesc(false)
        }
        if (a > ec.goBackTop) {
            $("hungBarTop").style.display = "block"
        } else {
            $("hungBarTop").style.display = "none"
        }
    }
};
ec.checkSelected = function() {
    if (ec.selectedProduct.skuId != null && ec.selectedProduct.groupTagIds.length == ec.groupTag.length && ec.getSkuById(ec.selectedProduct.skuId) != null) {
        return true
    }
    return false
};
ec.isSelectedSkuSoldOut = function(b) {
    for (var a = 0; a < b.groupTagIds.length; a++) {
        if (ec.getTagById(a, b.groupTagIds[a]).isSoldOut == 0) {
            return true
        }
    }
    if (ec.getSkuById(b.skuId).isSoldOut == 0) {
        return true
    }
    return false
};
ec.reselectTagAndSkuBySelected = function(b) {
    for (var a = 0; a < b.groupTagIds.length; a++) {
        ec.selectGroupTagWithSku(a, b.groupTagIds[a])
    }
    ec.selectSku(b.skuId)
};
ec.setSkuStatus = function(b) {
    var a = 0;
    for (skuGroup in ec.skuList) {
        a = 0;
        for (sku in ec.skuList[skuGroup].skuInfo) {
            ec.skuList[skuGroup].skuInfo[sku].isSoldOut = b[ec.skuList[skuGroup].skuInfo[sku].id];
            if (ec.skuList[skuGroup].skuInfo[sku].isSoldOut == 1 || ec.skuList[skuGroup].skuInfo[sku].isSoldOut == 2) {
                a = ec.skuList[skuGroup].skuInfo[sku].isSoldOut
            }
        }
        ec.skuList[skuGroup].isSoldOut = a
    }
};
ec.isSkuAllSoldOut = function() {
    var a = true;
    for (skuGroup in ec.skuList) {
        if (ec.skuList[skuGroup].isSoldOut == 1 || ec.skuList[skuGroup].isSoldOut == 2) {
            a = false;
            break
        }
    }
    return a
};
ec.setSoldOutOfTag = function(b) {
    if (ec.groupTag.length == 0) {
        return
    }
    var a = ec.selectedProduct.groupTagIds.slice(0, b);
    for (indexTag in ec.groupTag[b].tags) {
        a[b] = ec.groupTag[b].tags[indexTag].id;
        if (ec.groupTag[b].tags[indexTag].hasSku) {
            ec.groupTag[b].tags[indexTag].isSoldOut = 0;
            for (indexGroupSku in ec.skuList) {
                if (ec.isTagsEqualToSelected(ec.skuList[indexGroupSku].groupTag, a) && (ec.skuList[indexGroupSku].isSoldOut == 1 || ec.skuList[indexGroupSku].isSoldOut == 2)) {
                    ec.groupTag[b].tags[indexTag].isSoldOut = ec.skuList[indexGroupSku].isSoldOut;
                    break
                }
            }
        }
    }
};
ec.loadSkuStatus = function() {
    if (!ec.loadFist) {
        return
    }
    ec.loadFist = false;
    var b = {};
    if (ec.isRequestFromVmall) {
        b = fromVmallSkuList
    } else {
        b = ec.skuList
    }
    var a = "";
    for (skuGroup in b) {
        for (sku in b[skuGroup].skuInfo) {
            if (b[skuGroup].skuInfo[sku].type == "1") {
                a += b[skuGroup].skuInfo[sku].id + ","
            } else {
                a += b[skuGroup].skuInfo[sku].mainSkuId + ","
            }
        }
    }
    ec.ajax({
        url: ec.url.skuStatus + "?skuIds=" + a + "&t=" + new Date().getTime(),
        type: "GET",
        dataType: "json",
        success: function(d) {
            if (d && d.success) {
                if (ec.loadStatus != 4) {
                    var c = {};
                    for (skuGroup in b) {
                        for (sku in b[skuGroup].skuInfo) {
                            if (b[skuGroup].skuInfo[sku].type == "3") {
                                c[b[skuGroup].skuInfo[sku].mainSkuId] = b[skuGroup].skuInfo[sku].id
                            } else {
                                c[b[skuGroup].skuInfo[sku].id] = b[skuGroup].skuInfo[sku].id
                            }
                        }
                    }
                    var e = {};
                    for (rushbuy in d.skuRushBuyInfoList) {
                        if (d.skuRushBuyInfoList[rushbuy].isRushBuySku) {
                            e[c[d.skuRushBuyInfoList[rushbuy].skuId]] = d.skuRushBuyInfoList[rushbuy].skuStatus
                        } else {
                            e[c[d.skuRushBuyInfoList[rushbuy].skuId]] = 1
                        }
                    }
                    ec.setSkuStatus(e);
                    if (ec.isSkuAllSoldOut()) {
                        ec.getStatus(2);
                        ec.setOverPackTagName();
                        return
                    }
                    var f = new Object();
                    f.skuId = ec.selectedProduct.skuId;
                    f.groupTagIds = ec.selectedProduct.groupTagIds.slice(0);
                    ec.initSkuGroupTag(true);
                    if (ec.loadStatus == 3 && !ec.isSelectedSkuSoldOut(f)) {
                        ec.reselectTagAndSkuBySelected(f)
                    } else {
                        ec.autoSelectTagAndSku()
                    }
                    ec.loadStatus = 2;
                    ec.isOutSku()
                }
            }
        }
    })
};
ec.loadStatus = 0;
ec.lazy = true;
ec.isBuy = true;
ec.buy = function(a) {
    if (!ec.lazy) {
        return
    }
    if (!ec.loginFlag) {
        if (ec.isRequestFromVmall) {
            ec.setLoginUrlForVmall()
        }
        location.href = ec.loginUrl;
        return
    }
    if (!ec.checkSelected()) {
        ec.showMessageBox(7);
        return
    }
    ec.lazy = false;
    ec.getStatus(5);
    ec.buyError = setTimeout(function() {
        ec.showMessageBox(6)
    },
    1000 * 8);
    setTimeout(function() {
        if (ec.buyError) {
            clearTimeout(ec.buyError)
        }
        ec.submit(0)
    },
    500);
    setTimeout(function() {
        ec.lazy = true;
        if (ec.loadStatus == 4) {
            return
        }
        ec.getStatus(1)
    },
    1000 * 8)
};
ec.calculating = false;
ec.calculateResult = "";
ec.retryTime = 5000;
ec.calcCostTime = null;
ec.retryFun = null;
ec.oneMin = null;
ec.quitRequestCount = 6;
ec.joinRequestCount = 0;
ec.rush = function(c, a, d, b) {
    if (ec.isRequestFromVmall && !ec.isFireRequest) {
        return
    }
    if (ec.joinRequestCount >= ec.quitRequestCount) {
        if (ec.retryFun) {
            clearTimeout(ec.retryFun)
        }
        if (ec.oneMin) {
            clearTimeout(ec.oneMin)
        }
        ec.showMessageBox(1);
        return
    }
    ec.joinRequestCount = ec.joinRequestCount + 1;
    ec.retryFun = setTimeout(function() {
        ec.rush(c, a, d, b)
    },
    ec.requestOrdInterval);
    a.t = new Date().getTime();
    if (typeof(Worker) != "function") {
        a.calculateResult = 0
    } else {
        if (ec.calculateResult) {
            a.calculateResult = ec.calculateResult;
            a.calcCostTime = ec.calcCostTime
        }
    }
    ec.ajax({
        url: c,
        type: "POST",
        data: a,
        dataType: "json",
        success: function(k) {
            if (k && k.success) {
                var j = {
                    expires: 1
                };
                ec.util.cookie.set("orderSign-" + ec.activityId + "-" + k.uid, k.orderSign, j);
                if (ec.flowType == 2) {
                    ec.reserveTimes(k, b)
                } else {
                    var f = ec.url.chooseComponent + "?nowTime=" + d + skus;
                    if (ec.isRequestFromVmall) {
                        f = f + "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl) + (ec.paramForVmall.giftSkus ? "&optionalGiftIds=" + ec.paramForVmall.giftSkus: "") + (ec.paramForVmall.accessoriesSkus ? "&componentIds=" + ec.paramForVmall.accessoriesSkus: "") + (ec.paramForVmall.diyPackSkus ? "&diyPackSkus=" + ec.paramForVmall.diyPackSkus: "")
                    }
                    var h = ec.url.activity;
                    window.location.href = f + "&rushbuy_js_version=" + ec.rushbuy_js_version + "&backto=" + encodeURIComponent(h)
                }
            } else {
                if (k && k.code) {
                    if (k.code == 4 || k.code == 5 || k.code == 6 || k.code == 8 || k.code == 9) {
                        if ((ec.retryFun || ec.oneMin) && k.code != 9) {
                            clearTimeout(ec.retryFun);
                            clearTimeout(ec.oneMin)
                        }
                        if (k.code == 4) {
                            ec.showMsgSoldOut()
                        } else {
                            if (k.code == 5) {
                                ec.showMessageBox(4)
                            } else {
                                if (k.code == 6) {
                                    ec.showBox()
                                } else {
                                    if (k.code == 8) {
                                        ec.account.change()
                                    } else {
                                        if (k.code == 9) {
                                            var g = ec.util.cookie.get("uid");
                                            if (g) {
                                                ec.getQualification(g)
                                            } else {
                                                if (ec.isRequestFromVmall) {
                                                    ec.setLoginUrlForVmall()
                                                }
                                                location.href = ec.loginUrl
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return
            }
        }
    })
};
ec.reserveTimes = function(e, d) {
    var b = "";
    var a = {};
    a.mainSku = ec.selectedProduct.skuId;
    a.activityId = ec.activityId;
    a.duid = e.uid;
    a.orderSign = e.orderSign;
    a.t = new Date().getTime();
    a.coverFlag = d;
    ec.ajax({
        url: ec.url.reserveInv,
        type: "POST",
        data: a,
        dataType: "json",
        success: function(h) {
            if (h.success) {
                var g = ec.util.cookie.get("uid");
                ec.util.cookie.remove("reserveTimeout_" + ec.activityId + "_" + ec.selectedProduct.skuId + "_" + g);
                b = h.reserveTimes;
                b = b * 1000;
                var k = new Date();
                k = k.getFullYear() + "-" + (k.getMonth() + 1) + "-" + k.getDate() + " " + k.getHours() + ":" + k.getMinutes() + ":" + k.getSeconds();
                var f = "&skuId=" + ec.selectedProduct.skuId + "&skuIds=" + ec.selectedProduct.skuId + "&activityId=" + ec.activityId;
                var c = ec.url.chooseComponent + "?nowTime=" + k + f;
                if (ec.isRequestFromVmall) {
                    c = c + "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl) + (ec.paramForVmall.giftSkus ? "&optionalGiftIds=" + ec.paramForVmall.giftSkus: "") + (ec.paramForVmall.accessoriesSkus ? "&componentIds=" + ec.paramForVmall.accessoriesSkus: "") + (ec.paramForVmall.diyPackSkus ? "&diyPackSkus=" + ec.paramForVmall.diyPackSkus: "")
                }
                var j = ec.url.activity;
                window.location.href = c + (b ? "&reserveTimes=" + b: "") + "&rushbuy_js_version=" + ec.rushbuy_js_version + "&backto=" + encodeURIComponent(j)
            } else {
                if (h.code != 1) {
                    clearTimeout(ec.retryFun);
                    clearTimeout(ec.oneMin)
                }
                if (h.code == 1) {} else {
                    if (h.code == 2) {
                        ec.showMessageBox(13)
                    } else {
                        if (h.code == 3) {
                            ec.showMessageBox(11)
                        } else {
                            if (h.code == 4) {
                                ec.showMessageBox(10, h.orderCode)
                            } else {
                                if (h.code == 5) {
                                    ec.showMessageBox(12, null, h, e.uid)
                                } else {
                                    if (h.code == 6) {
                                        ec.showMsgSoldOut()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
};
var coverFlag = "";
ec.submit = function(c) {
    if (c && c == "1") {
        coverFlag = 1
    } else {
        coverFlag = 0
    }
    if (ec.retryFun) {
        clearTimeout(ec.retryFun)
    }
    if (ec.oneMin) {
        clearTimeout(ec.oneMin)
    }
    ec.showMsgWait();
    var e = new Date();
    e = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
    skus = "&skuId=" + ec.selectedProduct.skuId + "&skuIds=" + ec.selectedProduct.skuId + "&activityId=" + ec.activityId;
    var a = ec.account.getLoginPars(),
    d = ec.url.creatOrderUrl;
    a.skuId = ec.selectedProduct.skuId;
    a.skuIds = ec.selectedProduct.skuId;
    a.activityId = ec.activityId;
    a.nowTime = e;
    ec.joinRequestCount = 0;
    var b = ec.requestOrdTimes * ec.requestOrdInterval;
    ec.oneMin = setTimeout(function() {
        if (ec.retryFun) {
            clearTimeout(ec.retryFun)
        }
        ec.hide(["msg_wait", "activity_layout"]);
        ec.showMessageBox(1)
    },
    b);
    ec.rush(d, a, e, coverFlag)
};
ec.getStatus = function(a) {
    var b = "";
    switch (a) {
    case 1:
        b = '<a onclick="ec.buy(this); return false;" href="javascript:;" title="立即申购" class="honor-btn-go">立即申购</a>';
        ec.hide(["dateup"]);
        break;
    case 2:
        if (ec.hasNextQueue == 1) {
            b = '<a href="' + ec.nextQueueUrl + '" title="预约下轮抢购" class="honor-btn-go">预约下轮抢购</a>'
        } else {
            b = '<a class="honor-btn-end" title="已售罄" href="javascript:;">已售罄</a>';
            ec.hide(["dateup"]);
            ec.hide(["countdown"])
        }
        ec.show(["soldOutSection"]);
        ec.loadStatus = 4;
        ec.getSelectedSkuDesc = function() {
            return ""
        };
        ec.initSkuGroupTag(false);
        break;
    case 3:
        $("boxHeader").innerHTML = '<img src="' + ec.url.imgUrl + 'ic_cry.jpg">';
        b = ' <a class="honor-btn-go" title="' + ec.noQueueText + '" href="' + ec.url.gotoQueue + '">' + ec.noQueueText + "</a>";
        break;
    case 4:
        b = '<a id="login-btn-2"  class="honor-btn-go" title="立即登录" href="javascript:;">立即登录</a>';
        ec.hide(["dateup"]);
        break;
    case 5:
        b = '<a class="honor-btn-end" title="正在提交请求" href="javascript:;">正在提交请求</a>';
        break;
    default:
        b = '<a style="display:none;" class="honor-btn-ready" title="即将发售" href="javascript:;">即将发售</a>';
        break
    }
    $("honor-btn").innerHTML = b
};
ec.time = function(b, a) {
    ec.util.countdown("countdown", {
        html: "<b>{#day}</b>天<b>{#hours}</b>:<b>{#minutes}</b>:<b>{#seconds}</b>",
        now: b.getTime(),
        startTime: a.getTime(),
        callback: function(c) {
            if (!ec.loginFlag) {
                ec.getStatus(4);
                ec.setLoginUrl(ec.loginUrl);
                ec.hide(["countdown"])
            } else {
                ec.getStatus(1);
                ec.hide(["countdown"])
            }
            delete ec._cache["countdown" + a.getTime()]
        }
    })
};
ec.show = function(b) {
    for (var c = 0; c < b.length; c++) {
        $(b[c]).className = $(b[c]).className.replace(" hide", "")
    }
};
ec.hide = function(b) {
    for (var c = 0; c < b.length; c++) {
        $(b[c]).className = $(b[c]).className.replace(" hide", "");
        $(b[c]).className = $(b[c]).className + " hide"
    }
};
ec.gotoQuestion = function() {
    if (!ec.isBuy) {
        return
    }
    ec.show(["activity_layout"]);
    ec.hide(["activity_main", "hot_prod", "msg_wait", "msg_soldout", "footerMessage"]);
    $("answer").value = ""
};
ec.showMsgSoldOut = function() {
    if (!ec.isInvQueryStrategyTime) {
        document.getElementById("msg_soldout").getElementsByClassName("honor-end-pd")[0].innerHTML = ec.webQuaShowByTotalInventory ? ec.webQuaShowByTotalInventory: "抱歉，您当前选择的商品已售罄"
    } else {
        document.getElementById("msg_soldout").getElementsByClassName("honor-end-pd")[0].innerHTML = ec.webQuaShowByUsertypeInventory ? ec.webQuaShowByUsertypeInventory: "抱歉，您当前选择的商品已售罄"
    }
    ec.show(["msg_soldout", "hot_prod", "activity_layout", "footerMessage"]);
    ec.hide(["activity_main", "msg_wait"])
};
ec.showMsgWait = function() {
    ec.show(["msg_wait", "activity_layout"]);
    ec.hide(["activity_main", "hot_prod", "msg_soldout", "footerMessage"])
};
ec.setLoginUrl = function(a) {
    if (!a) {
        return
    }
    if ($("login-btn-2")) {
        $("login-btn-2").href = a
    }
    $("login-btn-1").href = a
};
ec.closeBox = function() {
    $("box-mask").style.display = "none";
    $("honor-box").style.display = "none";
    window.onresize = null
};
ec.goOrderUrl = function(a) {
    var b = (new Date()).valueOf();
    window.location.href = ec.url.vmall + "/member/order-" + a
};
ec.goBuyServiceUrl = function(h) {
    var d = ec.util.cookie.get("uid");
    ec.util.cookie.remove("reserveTimeout_" + ec.activityId + "_" + _paramForJson.currentMainSku + "_" + d);
    var g = new Date();
    g = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate() + " " + g.getHours() + ":" + g.getMinutes() + ":" + g.getSeconds();
    var b = "&skuId=" + _paramForJson.currentMainSku + "&skuIds=" + _paramForJson.currentMainSku + "&activityId=" + ec.activityId;
    var a = ec.url.chooseComponent + "?nowTime=" + g + b;
    if (ec.isRequestFromVmall) {
        a = a + "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl) + (ec.paramForVmall.giftSkus ? "&optionalGiftIds=" + ec.paramForVmall.giftSkus: "") + (ec.paramForVmall.accessoriesSkus ? "&componentIds=" + ec.paramForVmall.accessoriesSkus: "") + (ec.paramForVmall.diyPackSkus ? "&diyPackSkus=" + ec.paramForVmall.diyPackSkus: "")
    }
    var f = _paramForJson.reserveTimes * 1000;
    var e = ec.url.activity;
    window.location.href = a + (f ? "&reserveTimes=" + f: "") + "&rushbuy_js_version=" + ec.rushbuy_js_version + "&backto=" + encodeURIComponent(e)
};
ec.getScroll = function() {
    var a;
    if (document.documentElement && document.documentElement.scrollTop) {
        a = document.documentElement.scrollTop
    } else {
        if (document.body) {
            a = document.body.scrollTop
        }
    }
    return a
};
ec.calcBox = function() {
    var a = document.body.clientWidth,
    d = document.body.clientHeight,
    c = $("honor-box").offsetHeight,
    b = $("honor-box").offsetWidth;
    $("honor-box").style.left = a / 2 - b / 2 + "px";
    $("honor-box").style.top = d / 2 - c / 2 + "px";
    $("honor-box").style.position = "fixed"
};
ec.calculateMaskSize = function() {
    var c = document.documentElement.clientHeight ? document.documentElement: document.body,
    a = c.scrollHeight > c.clientHeight ? c.scrollHeight: c.clientHeight,
    d = c.scrollWidth > c.clientWidth ? c.scrollWidth: c.clientWidth;
    $("box-mask").style.width = d + "px";
    $("box-mask").style.height = a + "px"
};
ec.showBox = function() {
    $("box-mask").style.display = "block";
    $("honor-box").style.display = "block";
    ec.calculateMaskSize();
    ec.calcBox();
    window.onresize = ec.calculateMaskSize;
    var a = window.onscroll;
    window.onscroll = function() {
        ec.calcBox();
        if (a) {
            a()
        }
    }
};
ec.getQualification = function(a) {
    var b = "callbackqueue";
    ec.ajax({
        url: ec.url.qualification,
        type: "POST",
        data: {
            uid: a,
            qid: ec.qid
        },
        dataType: "json",
        success: function(d) {
            try {
                delete window[b]
            } catch(c) {
                window[b] = null
            }
            if (d) {
                if (d.isqueue && d.queueSign) {
                    var f = {
                        expires: 1
                    };
                    ec.util.cookie.set("isqueue-" + ec.activityId + "-" + a, d.isqueue, f);
                    ec.util.cookie.set("queueSign-" + ec.activityId + "-" + a, d.queueSign, f);
                    if (ec.needQueue && d.isqueue == 2) {
                        if (ec.oneMin) {
                            clearTimeout(ec.oneMin)
                        }
                        ec.getStatus(3);
                        $("queue_next_1").href = ec.url.gotoQueue;
                        if (ec.isRequestFromVmall) {
                            ec.showMsgWait()
                        }
                        ec.showBox();
                        ec.isFireRequest = false;
                        return
                    }
                } else {
                    ec.getCookieQualification(a);
                    return
                }
            } else {
                ec.getCookieQualification(a);
                return
            }
        }
    })
};
ec.getCookieQualification = function(a) {
    if (ec.util.cookie.get("isqueue-" + ec.activityId + "-" + a) && ec.util.cookie.get("queueSign-" + ec.activityId + "-" + a)) {
        if (ec.needQueue && ec.util.cookie.get("isqueue-" + ec.activityId + "-" + a) == 2) {
            ec.getStatus(3);
            $("queue_next_1").href = ec.url.gotoQueue;
            if (ec.isRequestFromVmall) {
                ec.showMsgWait()
            }
            ec.showBox();
            ec.isFireRequest = false
        }
    }
};
ec.load = function() {
    if (ec.isActivityEnded()) {
        ec.changeHtmlWhenActivityIsEnded();
        if (ec.loadStatus == 4) {
            ec.setOverPackTagName()
        }
        return
    }
    var a = !-[1];
    var b = new Date().getTime(),
    c = ec.startTime;
    c.setMinutes(ec.startTime.getMinutes() + 2);
    document.onkeydown = function(d) {
        var e = (a) ? event.keyCode: d.which;
        if (e == 116 && b <= c.getTime()) {
            document.body.style.display = "none";
            setTimeout(function() {
                document.body.style.display = "block"
            },
            Math.floor(Math.random() * 1000 + 50));
            if (a) {
                event.keyCode = 0;
                event.cancelBubble = true
            } else {
                d.preventDefault()
            }
            return false
        }
    };
    setTimeout(function() {
        if (ec.account.isLogin()) {
            var d = ec.util.cookie.get("uid");
            if (d) {
                ec.getQualification(d)
            }
        }
    },
    300);
    setTimeout(function() {
        if (ec.account.isLogin()) {
            ec.checkLoginTime()
        }
    },
    1000)
};
ec.showPackage = function() {
    var c = $("packageinfo");
    if (c.style.display == "block") {
        $("contrastAllPackage").className = "honor-version-all clearfix";
        c.style.display = "none"
    } else {
        if (c.style.display == "none") {
            $("contrastAllPackage").className = "honor-version-all honor-version-all-hover clearfix";
            c.style.display = "block";
            var b = ec.getOffset(c).left;
            var a = b + 700;
            if (b < 0) {
                c.style.left = c.offsetLeft - b + "px"
            } else {
                if (a > document.body.clientWidth) {
                    c.style.left = c.offsetLeft - (a - document.body.clientWidth) + "px"
                }
            }
        }
    }
};
ec.getconfskutag = function() {
    var a = ec.util.getRandom(1, 10);
    return "https://cfm" + ((a < 10) ? "0" + a: a) + ".vmall.com/" + ec.activityId + "-inventory.json"
};
ec.checkLoginTime = function() {
    var a = ec.util.cookie.get("ts") && ((new Date().getTime() - ec.util.cookie.get("ts")) > (800 * 24 * 60 * 60 * 1000));
    if (a) {
        ec.account.change()
    }
};
ec.isActivityEnded = function() {
    if (new Date().getTime() >= ec.endTime.getTime()) {
        return true
    }
    return false
};
ec.changeHtmlWhenActivityIsEnded = function() {
    ec.getStatus(2)
};
ec.lab_load = function(a, b) {
    $(a).style.display = "none";
    $(b).focus()
};
ec.lab_hide_show = function(c, d) {
    var b = $(d).value;
    if (b == "" || b == null || b == undefined) {
        $(c).style.display = "block"
    } else {
        $(c).style.display = "none"
    }
};
ec.lodDefault = function() {
    ec.initForVmall();
    ec.init(true, true);
    ec.load()
};
var _paramForJson;
var soldOutText;
var soldOutText2;
ec.showMessageBox = function(c, a, b, f) {
    if (!ec.isInvQueryStrategyTime) {
        soldOutText = ec.webNoqShowByTotalInventory ? ec.webNoqShowByTotalInventory: "抱歉，没有抢到";
        soldOutText2 = ec.webNoqShowByTotalInventory ? ec.webNoqShowByTotalInventory: "抱歉，没有抢到"
    } else {
        soldOutText = ec.webNoqShowByUsertypeInventory ? ec.webNoqShowByUsertypeInventory: "抱歉，您当前选择的商品已售罄";
        soldOutText2 = ec.webNoqShowByUsertypeInventory ? ec.webNoqShowByUsertypeInventory: "抱歉，没有抢到"
    }
    if (ec.isNextShotTimeMs) {
        honorEndTxt = '<p class="honor-end-txt" style="margin-bottom: 0; font-size: 12px;">下次开售时间<span style="font-size: 12px; color: #000000;">' + ec.activityNextShotTimeStr + "</span>，敬请期待~</p>"
    } else {
        honorEndTxt = ""
    }
    if (ec.isRequestFromVmall && c != 1 && c != 2 && c != 3 && c != 4 && c != 9 && c != 10 && c != 11 && c != 12 && c != 13) {
        return
    }
    if (c == 1 || c == 10 || c == 11 || c == 12 || c == 13) {
        $("boxCloseBtn").style.display = "none"
    } else {
        $("boxCloseBtn").style.display = "block"
    }
    if (c == 1 || c == 10 || c == 13) {
        if (c == 1 || c == 13) {
            $("boxHeader").innerHTML = '<img src="' + ec.url.imgUrl + 'ic_expect.jpg">'
        } else {
            $("boxHeader").innerHTML = '<img src="' + ec.url.imgUrl + 'ic_smile.jpg">'
        }
        $("boxHeader").className = "box-header"
    } else {
        $("boxHeader").innerHTML = "";
        $("boxHeader").className = "hr-30"
    }
    if (c == 1) {
        $("boxText").innerHTML = '<p class="honor-end-pd" style="font-size: 14px; color: #000000;">' + soldOutText2 + "</p>" + honorEndTxt;
        $("boxButton").innerHTML = '<a href="' + ec.url.activity + '" title="返回活动" class="honor-box-btn" >返回活动</a>' + ec.isYxgUrl
    } else {
        if (c == 4) {
            $("boxText").innerHTML = "活动未开始";
            $("boxButton").innerHTML = '<a href="' + ec.url.activity + '" class="honor-box-btn-go">确定</a>'
        } else {
            if (c == 5) {
                $("boxText").innerHTML = "活动已结束";
                $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.closeBox();" class="honor-box-btn-go">确定</a>'
            } else {
                if (c == 6) {
                    $("boxText").innerHTML = "抢购人数太多，请稍后重试";
                    $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.closeBox();" class="honor-box-btn-go">确定</a>'
                } else {
                    if (c == 7) {
                        $("boxText").innerHTML = "请选择您要的商品或套餐";
                        $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.closeBox();" class="honor-box-btn-go">确定</a>'
                    } else {
                        if (c == 9) {
                            $("boxText").innerHTML = "感谢参与，我们将在下次到货前，优先通知您，提醒购买";
                            $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.closeBox();" class="honor-box-btn-go">确定</a>'
                        } else {
                            if (c == 10) {
                                $("boxText").innerHTML = "本次发售商品数量有限，您已超过购买上限，请将机会留给他人吧！";
                                $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.goOrderUrl(' + a + ');" title="查看订单" class="honor-box-btn" >查看订单</a>'
                            } else {
                                if (c == 11) {
                                    $("boxText").innerHTML = "对不起，您有逾期未提交订单情况，不能再参加本场活动";
                                    $("boxButton").innerHTML = '<a href="' + ec.url.activity + '"  title="确定" class="honor-box-btn-go" >确定</a>'
                                } else {
                                    if (c == 13) {
                                        $("boxText").innerHTML = '<p class="honor-end-pd" style="font-size: 14px; color: #000000;">' + soldOutText + "</p>" + honorEndTxt;
                                        $("boxButton").innerHTML = '<a href="' + ec.url.activity + '"  title="返回活动" class="honor-box-btn" >返回活动</a>' + ec.isYxgUrl
                                    } else {
                                        if (c == 12) {
                                            _paramForJson = b;
                                            var e;
                                            var d = {};
                                            if (ec.isRequestFromVmall) {
                                                d = fromVmallSkuList
                                            } else {
                                                d = ec.skuList
                                            }
                                            for (skuGroup in d) {
                                                for (sku in d[skuGroup].skuInfo) {
                                                    if (d[skuGroup].skuInfo[sku].id == b.currentMainSku) {
                                                        e = d[skuGroup].skuInfo[sku].skuName
                                                    }
                                                }
                                            }
                                            $("boxText").innerHTML = "您已经获得" + e + "的购买资格，继续提交会重新排队，如果排队成功将会替换掉已获得的购买资格。是否继续？";
                                            $("boxButton").innerHTML = '<a href="javascript:;" onclick="ec.goBuyServiceUrl(\'' + f + '\');"  title="查看订单详情" class="honor-box-btn" >查看订单详情</a><a href="javascript:;" onclick="ec.closeBox();ec.submit(1);return false;"  title="继续提交" class="honor-box-btn" id="1">继续提交</a>'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ec.showBox()
};
ec.openSurveryBox = function() {
    $("survery-box").style.display = "block";
    $("box-mask").style.display = "block";
    ec.reloadCode()
};
ec.closeSurveryBox = function() {
    $("survery-box").style.display = "none";
    $("box-mask").style.display = "none"
};
ec.reloadCode = function() {
    $("surveryVerifyImg").src = "https://" + ec.url.vmall + "/feedback/randomCode?_t=" + new Date().getTime()
};
ec.surverySubmit = function() {
    var b = $("surverytype").value;
    var c = $("surveryContent").value;
    var a = $("surveryContact").value;
    var d = $("surveryVerify").value;
    if (c == "") {
        $("errMsg").innerHTML = "<span class='vam icon-warn'>您还没有输入反馈信息哦</span>";
        return
    }
    if (b == "请选择疑问类型") {
        $("errMsg").innerHTML = "<span class='vam icon-warn'>提交失败，您还没有选择疑问类型哦</span>";
        return
    }
    if (d == "") {
        $("errMsg").innerHTML = "<span class='vam icon-warn'>请输入验证码</span>";
        return
    }
    ec.getJson({
        url: "https://" + ec.url.vmall + "/feedback.json?type=" + b + "&content=" + c + "&contact=" + a + "&code=" + d + "&callback=surveryfeed",
        funName: "surveryfeed",
        type: "jsonp",
        success: function(e) {
            if (!e.success) {
                ec.reloadCode();
                $("surveryVerify").value = "";
                $("errMsg").innerHTML = "<span class='vam icon-warn'>提交失败" + e.msg + "</span>";
                return
            }
            alert("提交成功，华为商城感谢您的宝贵建议！");
            ec.closeSurveryBox();
            $("surveryContent").value = "";
            $("surveryVerify").value = "";
            return
        }
    })
};
ec.robotAnswer = function() {
    var a = {
        portal: "2",
        lang: "zh_CN",
        country: "CN",
        systemConfigKeys: "ipcc_url_4wap"
    };
    ec.ajax({
        url: ec.url.ucDomain + "/mcp/querySystemConfig",
        type: "GET",
        data: a,
        dataType: "json",
        headers: true,
        beforeSend: function(b) {
            b.withCredentials = true;
            b.setRequestHeader("CsrfToken", ec.util.cookie.get("CSRF-TOKEN"))
        },
        timeout: 10000,
        success: function(b) {
            if (b.success) {
                window.open(b.systemConfigInfos.ipcc_url_4wap.systemConfigValue)
            }
        }
    })
};