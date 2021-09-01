function param(requestData) {

    let class2type = {};
    let toString = class2type.toString;
    let hasOwn = class2type.hasOwnProperty;
    let fnToString = hasOwn.toString;
    let getProto = Object.getPrototypeOf;
    let ObjectFunctionString = fnToString.call(Object);

    function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    }

    function isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    function toType(obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    }

    function isArrayLike(obj) {
        let length = !!obj && "length" in obj && obj.length;
        let type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
            return false;
        }
        return type === "array" ||
            length === 0 ||
            typeof length === "number" &&
            length > 0 &&
            (length - 1) in obj;
    }

    function each(obj, callback) {
        let length;
        let i = 0;
        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }
        }
        return obj;
    }

    function isPlainObject(obj) {
        let proto;
        let Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }
        proto = getProto(obj);
        if (!proto) {
            return true;
        }
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    }

    function buildParams(prefix, obj, traditional, add) {
        let name;
        if (Array.isArray(obj)) {
            each(obj, function (i, v) {
                if (traditional || /\[\]$/.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                }
            }
        } else {
            add(prefix, obj);
        }
    }

    function paramData(a, traditional) {
        let prefix;
        let s = [];
        let add = function (key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value === null ? "" : value);
        };
        if (Array.isArray(a) || (!isPlainObject(a))) {
            each(a, function () {

                add(this.name, this.value);
            });
        } else {
            for (prefix in a) {
                if (a.hasOwnProperty(prefix)) {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }
        }
        return s.join("&");
    }


    return paramData(requestData);
}

const ajax = function (opt, success, fail) {
    function xhrRequest(opt) {
        opt = opt || {};
        opt.type = opt.type.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () {
        };
        opt.contentType = opt.contentType || 'application/x-www-form-urlencoded;charset=utf-8';
        if (!opt.url) {
            return false;
        }
        let xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {

            xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }

        let postData = param(opt.data);
        if (opt.type.toUpperCase() === 'POST') {

            xmlHttp.open('POST', opt.url, opt.async);

            xmlHttp.setRequestHeader('Content-Type', opt.contentType);
        } else if (opt.type.toUpperCase() === 'GET') {

            xmlHttp.open('GET', opt.url + '?' + postData, opt.async);
            postData = null;
        }

        xmlHttp.onreadystatechange = function () {

            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                success && success(xmlHttp.responseText);
            }

            if (xmlHttp.readyState === 4 && xmlHttp.status === 500) {

                fail && fail(xmlHttp.responseText)
            }

            xmlHttp.onerror = function (e) {
                fail && fail(e);
            }
        };
        try {

            xmlHttp.send(postData);
        } catch (e) {
            fail && fail(e);
        }
    }

    return xhrRequest(opt);
}

function apiPromise(options) {
    return new Promise(function (resolve, reject) {
        let optType = 'POST';

        if (options.type) {

            optType = options.type.toUpperCase();
        }

        let contentType = options.contentType || 'application/x-www-form-urlencoded;charset=utf-8';
        let xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {

            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        let data = "";

        let dataRequest = options.data;

        let url = options.url;

        data = param(options.data);

        if (options.proxy) {

            url = options.proxy;
            data = param({

                url: options.url,

                params: options.data
            })
        }
        console.log(url, 'url')

        if (optType === 'POST') {

            xhr.open('POST', url);


        } else {
            // 默认为get

            xhr.open('GET', url + '?' + data);

            data = null;
        }


        xhr.setRequestHeader("content-type", contentType);

        if (options.isAuthToken) {

            xhr.setRequestHeader('Authorization', options.isAuthToken);
        }


        xhr.send(data);

        xhr.onreadystatechange = function () {

            let timer = null;

            let timeout = options.timeout ? options.timeout : 5000;

            if (xhr.readyState === 4 && xhr.status === 200) {

                let res = JSON.parse(xhr.responseText);

                clearTimeout(timer);
                resolve(res);
            }
            timer = setTimeout(() => {

                clearTimeout(timer);

                reject(xhr.status);
            }, timeout)

        }
    });
}

function getQueryString() {
    let url = decodeURI(window.location.search);
    let data = {};
    if (url.indexOf("?") !== -1) {
        let str = url.substr(1);
        let res = str.split("&");
        for (let i = 0; i < res.length; i++) {

            data[res[i].split("=")[0]] = unescape(res[i].split("=")[1]);
        }
    }
    return data;
}

function isValid(key, value) {
    const regList = {
        phone(str) {
            return RegExp(/^1[3-9][0-9]{9}$/).test(str)
        },
        email(str) {
            return RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(str);
        },
        imgCode(str) {
            return str.length === 4;
        },
        username(str) {
            return RegExp(/^[a-zA-z]\w{3,15}$/).test(str);
        }
    };

    return !Object.hasOwnProperty.call(regList, key) ? false : regList[key](value);
}

function getAppInfoFromUrl() {
    let query = getQueryString();
    let productId = query['app_id']; // app_id  产品id
    let productVersion = query['app_version']; // 应用版本号
    let appStore = query['app_store']; // 应用商店名称，如华为，小米应用市场等
    let platform = query['platform']; // 应用平台也就是操作系统类型 android/ios
    let platformVersion = query['platform_version']; // 应用平台版本号
    let cid = query['cid']; // 渠道ID
    let platformName = query['version_name']; // 版本号名称
    let themeStyle = query['theme_style'] // 主题样式 默认 为1 浅色 2 深色
    return {
        btnPrimaryClassName: '',
        textPrimaryClassName: '',
        chooseFile: true,
        productId: productId,
        productVersion: productVersion,
        appStore: appStore,
        platform: platform,
        platformVersion: platformVersion,
        cid: cid,
        platformName: platformName,
        themeStyle: themeStyle,
    };
}

function watchModalLoginOutConfirm(modalName, btnModalConfirm, callback) {
    const confirm = document.getElementById(btnModalConfirm);
    if (!confirm) return false;
    confirm.addEventListener('click', function () {
        modalHide(modalName);
    });
}

function modalHide(modalName) {
    const modalConfirmToLoginOut = document.getElementById(modalName);
    if (!modalConfirmToLoginOut) return false;
    modalConfirmToLoginOut.classList.remove('show');
}


function modalShow(modalName) {
    const modalConfirmToLoginOut = document.getElementById(modalName);
    if (!modalConfirmToLoginOut) return false;
    modalConfirmToLoginOut.classList.add('show');
}

function watchModalLoginOutSubmit() {
    const btnToLoginOut = document.getElementById('btnToLoginOut');
    if (!btnToLoginOut) return false;
    btnToLoginOut.addEventListener('click', function () {
        const modalConfirmToLoginOut = document.getElementById('modalConfirmToLoginOut');
        if (!modalConfirmToLoginOut) return false;
        const privacyAgree = document.getElementById('checkboxPrivacyAgree');
        if (!privacyAgree) return false;
        if (!privacyAgree.checked) {
            privacyAgree.focus();
            return false;
        }
        modalConfirmToLoginOut.classList.add('show')
    });
}

function watchModalLoginAgree() {
    const privacyAgree = document.getElementById('checkboxPrivacyAgree');
    if (!privacyAgree) return false;
    privacyAgree.addEventListener('change', function () {
        const btnToLoginOut = document.getElementById('btnToLoginOut');
        if (!btnToLoginOut) return false
        this.checked ? btnToLoginOut.classList.add('active') : btnToLoginOut.classList.remove('active');
    })
}

function getMobileOs() {
    let userAgent = navigator.userAgent || navigator.vendor;
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window['MSStream']) {
        return "iOS";
    }
    return "unknown";
}

function setupWebViewJavascriptBridge(callback) {
    if (window['WebViewJavascriptBridge']) {
        return callback(window['WebViewJavascriptBridge']);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0);
}

function appCall(fnName, data, callback, fail) {
    if (!data) {
        data = fnName
    }
    let platform = getMobileOs();
    let resData = '';
    if (platform === 'iOS') {
        console.log(platform, fnName, 'iOS方法调用开始');
        setupWebViewJavascriptBridge(function (bridge) {
            if (callback) {
                if (fnName === 'getToken') {
                    bridge['callHandler']('getToken', {'js_value': 'js传递的值'}, function (response) {
                        console.log(platform, fnName, response);
                        callback && callback(response);
                    });
                } else {
                    bridge['registerHandler'](fnName, function (res, responseCallback) {
                        console.log(platform, fnName, res);
                        responseCallback({
                            'js_value': 'js传递的值'
                        });
                    });
                }
            } else {
                bridge['callHandler'](fnName, data);
                console.log(platform, fnName, '无需返回值');
            }
        });
    }

    if (platform === 'Android') {
        if (callback) {
            if (window['android'] && window['android'][fnName] && window['android'][fnName]) {
                resData = window['android'][fnName](data);
                console.log(platform, fnName, resData);
            } else {
                fail && fail('没有这个方法：' + fnName);
            }
        } else {
            if (window['android'] && window['android'][fnName] && window['android'][fnName]) {
                window['android'][fnName](data);
                window['android'][fnName](data);
            } else {
                fail && fail('没有这个方法：' + fnName);
            }
            console.log(platform, fnName, '无需返回值');
        }
        callback && callback(resData);
    }
}

function privacyAgreement() {
    appCall('privacyAgreement');
}

function userAgreement() {
    appCall('userAgreement');
}

function watchUserAgreement() {
    const btnUserAgreement = document.getElementById('btnUserAgreement');
    if (btnUserAgreement) {
        btnUserAgreement.addEventListener('click', function () {
            userAgreement();
        });
    }
}

function watchUserPrivacyAgreement() {
    const btnPrivacyAgreement = document.getElementById('btnPrivacyAgreement');
    if (btnPrivacyAgreement) {
        btnPrivacyAgreement.addEventListener('click', function () {
            privacyAgreement();
        });
    }
}

window.appSetDarkMode = function (type) {
    const pageLogoff = document.querySelector(".page-logoff");
    const btnToLoginOut = document.getElementById('btnToLoginOut');
    if (type === 1 || type === "1") {
        pageLogoff && pageLogoff.classList.remove("page-logoff-ah");
        btnToLoginOut && btnToLoginOut.classList.remove("confirm-login-out-ah");
    }
    if (type === 2 || type === "2") {
        pageLogoff && pageLogoff.classList.add("page-logoff-ah");
        btnToLoginOut && btnToLoginOut.classList.add("confirm-login-out-ah");
    }
};

function apiDomain() {
    return "https://api.wxrest.com";
}

function feedbackSubmit(data) {
    return apiPromise({
        url: apiDomain() + '/api/v1/feed_back',
        data: data
    });
}
