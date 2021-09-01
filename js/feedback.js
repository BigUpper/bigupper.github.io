const showToast = (eleName, str) => {
    const ele = document.getElementById(eleName);
    if (ele) {
        ele.innerHTML = str;
    }
}

const submitSuccess = () => {
    const ele = document.getElementById('feedbackSuccess');
    if (ele) {
        ele.classList.add('show');
        setTimeout(function () {
            ele.classList.remove('show');
        }, 1000);
    }
}

const getAppInfo = () => {
    const query = getAppInfoFromUrl();
    if (!query) return;
    const btnPrimaryClassName = query.btnPrimaryClassName;
    const textPrimaryClassName = query.textPrimaryClassName;
    const themeStyle = query.themeStyle || 1;
    const productId = query.productId;
    const feedbackBox = document.querySelector(".privacy-content");
    if (btnPrimaryClassName === 'btn-timer' && textPrimaryClassName === 'text-timer') {
        const titleList = document.getElementsByClassName("item-title");
        const feedbackTitle = document.querySelector('.feedback-title');
        const feedbackItem = document.querySelector('.feedback-items');
        const inputList = document.getElementsByTagName("input");
        const textareaList = document.getElementsByTagName("textarea");
        const fileSelect = document.querySelector(".select-file-span");
        let i;
        for (i = 0; i < titleList.length; i++) {
            titleList[i].classList.add("item-title-timer");
        }
        feedbackBox && feedbackBox.classList.add('privacy-content-timer');
        feedbackTitle && feedbackTitle.classList.add('feedback-title-mj8');
        feedbackItem && feedbackItem.classList.add('feedback-items-timer');
        let j;
        for (j = 0; j < inputList.length; j++) {
            inputList[j].classList.add("input-timer");
        }
        let k;
        for (k = 0; k < textareaList.length; k++) {
            textareaList[k].classList.add("input-timer");
        }
        fileSelect && fileSelect.classList.add('file-info-timer');
    }
    console.log(themeStyle);

    if (productId && productId !== '') {
        document.body.classList.add(`app-theme-${productId}`)
    }
    if (themeStyle === '1' || themeStyle === '2') {
        document.body.classList.add(`theme-style-${themeStyle}`)
    }


}
const submitFail = (str) => {
    const ele = document.getElementById('feedbackFail');
    if (ele) {
        if (str) {
            const textEle = ele.querySelector('.tips-result-text');
            if (textEle) {
                textEle.innerHTML = str;
            }
        }
        ele.classList.add('show');
        setTimeout(function () {
            ele.classList.remove('show');
        }, 1000);
    }
}


function feedbackSubmit(data) {
    return apiPromise({
        url: apiDomain() + '/api/v1/feed_back',
        data: data
    });
}

function getCaptcha() {
    return apiPromise({
        url: apiDomain() + '/api/v1/get_captcha',
        data: {
            type: 'feed_back'
        }
    });
}

function getImgCode() {
    getCaptcha().then(res => {

        let code = res.code;

        let data = res.data;

        if (code === 200) {

            let key = data.key;

            let img = data.img;
            let imgCodePic = document.getElementById('imgCodePic');
            if (imgCodePic) {
                imgCodePic.setAttribute('src', img);
                imgCodePic.setAttribute('data-key', key);
            }
        }
    }).catch(e => {
        console.log(e);
    });
}


function watchFilePicker() {
    const filePicker = document.getElementById('file');
    const fileInfoEle = document.getElementById('fileInfo');
    if (filePicker) {
        filePicker.addEventListener('change', function (e) {

            const files = e.target.files;
            if (!files) return false;
            const file = files[0];
            if (fileInfoEle) {
                fileInfoEle.innerHTML = file.name;
            }
        })
    }
}

function watchErrorTips(eleName, errorTipsName) {
    const ele = document.getElementById(eleName);
    const tips = document.getElementById(errorTipsName);
    if (ele) {
        ele.addEventListener('keyup', function () {
            if (tips) {
                tips.innerHTML = '';
            }
        });
    }
}

function isiOS() {
    var u = navigator.userAgent;
    var iOs = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端\
    return iOs;
};

/**
 * 暴露全局对外的暗黑模式设置方法，供iOS端调用
 * type 1 为默认  2为暗黑模式
 */

window.appSetDarkMode = function (type) {
    const selectFile = document.getElementById('selectFile');
    const refreshImgCode = document.getElementById('refreshImgCode');
    const btnSubmitFeedback = document.getElementById('btnSubmitFeedback');
    const refreshImg = document.querySelector(".icon-refresh");
    const feedbackBox = document.querySelector(".privacy-content");
    const titleList = document.getElementsByClassName("item-title");
    const feedbackTitle = document.querySelector('.feedback-title');
    const feedbackItem = document.querySelector('.feedback-items');
    const inputList = document.getElementsByTagName("input");
    const textareaList = document.getElementsByTagName("textarea");
    const fileSelect = document.querySelector(".select-file-span");
    if (Number(type) === 1) {
        selectFile && selectFile.classList.remove('ah-bg');
        refreshImgCode && refreshImgCode.classList.remove('ah-text');
        refreshImg && refreshImg.classList.remove('icon-refresh');
        btnSubmitFeedback && btnSubmitFeedback.classList.remove('btn-ah');
        let i;
        for (i = 0; i < titleList.length; i++) {
            titleList[i].classList.remove("item-title-ah");
        }
        feedbackBox && feedbackBox.classList.remove('privacy-content-ah');
        feedbackTitle && feedbackTitle.classList.remove('feedback-title-mj8');
        feedbackItem && feedbackItem.classList.remove('feedback-items-ah');
        let j;
        for (j = 0; j < inputList.length; j++) {
            inputList[j].classList.remove("input-ah");
        }
        let k;
        for (k = 0; k < textareaList.length; k++) {
            textareaList[k].classList.remove("input-ah");
        }
        fileSelect && fileSelect.classList.remove('file-info-ah');
    }
    if (Number(type) === 2) {
        selectFile && selectFile.classList.add('ah-bg');
        refreshImgCode && refreshImgCode.classList.add('ah-text');
        refreshImg && refreshImg.classList.add('icon-refresh');
        btnSubmitFeedback && btnSubmitFeedback.classList.add('btn-ah');
        let i;
        for (i = 0; i < titleList.length; i++) {
            titleList[i].classList.add("item-title-ah");
        }
        feedbackBox && feedbackBox.classList.add('privacy-content-ah');
        feedbackTitle && feedbackTitle.classList.add('feedback-title-mj8');
        feedbackItem && feedbackItem.classList.add('feedback-items-ah');
        let j;
        for (j = 0; j < inputList.length; j++) {
            inputList[j].classList.add("input-ah");
        }
        let k;
        for (k = 0; k < textareaList.length; k++) {
            textareaList[k].classList.add("input-ah");
        }
        fileSelect && fileSelect.classList.add('file-info-ah');
    }
};

(function () {
    const btnSubmitFeedback = document.getElementById('btnSubmitFeedback');
    if (!btnSubmitFeedback) return;
    btnSubmitFeedback.addEventListener('click', function () {
        const phoneEle = document.getElementById('phone');
        const emailEle = document.getElementById('email');
        const imgCodeEle = document.getElementById('imgCode');
        const feedbackEle = document.getElementById('feedback');
        const fileEle = document.getElementById('file');

        const phone = phoneEle.value;

        const email = emailEle.value;

        const imgCode = imgCodeEle.value;

        const feedback = feedbackEle.value;
        console.log(feedback)
        if (!phone) {
            showToast('phoneTips', '请输入手机号');

            phoneEle.focus();
            return false;
        }
        if (!isValid('phone', phone)) {
            showToast('phoneTips', '请输入有效的手机号');

            phoneEle.focus();
            return false;
        }
        if (email.length > 0 && !isValid('email', email)) {
            showToast('emailTips', '请输入有效的邮箱地址');

            emailEle.focus();
            return false;
        }


        if (!feedback) {
            showToast('feedbackTips', '请输入要反馈的内容');

            feedbackEle.focus();
            return false;
        }

        if (feedback.length < 20) {
            showToast('feedbackTips', '亲，要反馈的内容至少20个字～');

            feedbackEle.focus();
            return false;
        }

        if (feedback.length > 500) {
            showToast('feedbackTips', '亲，要反馈的内容最多500个字～');

            feedbackEle.focus();
            return false;
        }

        if (!imgCode) {
            showToast('imgCodeTips', '请输入图形验证码');
            window.scroll({top: document.body.clientHeight, left: 0, behavior: 'smooth'});

            imgCodeEle.focus();
            return false;
        }

        // if (!isValid('imgCode', imgCode)) {
        //     showToast('请输入有效的图形验证码', 'tips');

        //     imgCodeEle.focus();
        //     return false;
        // }


        const imgCodeKey = document.getElementById('imgCodePic').getAttribute('data-key');

        const filePicker = document.getElementById('file');
        let file = null;
        if (filePicker) {

            if (filePicker.files) {

                file = filePicker.files[0];
            }

        }

        const feedbackData = {
            phone_num: phone, // 1-包月会员 2-终身会员
            email: email,
            content: feedback,
            captcha: imgCode,
            key: imgCodeKey
        }
        if (file) {

            feedbackData.file = file;
        }
        let query = getQueryString();
        let deviceType = 0;

        let productId = query['app_id']; // app_id

        let plateFrom = query['platform']; // platform
        if (plateFrom) {
            deviceType = plateFrom.toLowerCase() === 'android' ? 1 : 2;
        } else {
            let state = isiOS()
            deviceType = state ? 2 : 1;
        }

        feedbackData.device_type = deviceType // 1-android  2-ios

        feedbackData.product_id = productId ? productId : '0001';
        feedbackSubmit(feedbackData).then(res => {

            if (res.code === 200) {
                submitSuccess();
                getImgCode();

            } else if (res.code === 20002) {
                showToast('imgCodeTips', '验证码不正确');
                getImgCode();
                window.scroll({top: document.body.clientHeight, left: 0, behavior: 'smooth'});

                imgCodeEle.focus();
            } else {
                submitFail('提交失败');
                getImgCode();
            }
        });
    });
    getImgCode();
    const imgCodePic = document.getElementById('imgCodePic');
    if (imgCodePic) {
        imgCodePic.addEventListener('click', function () {
            getImgCode();
        });
    }

    const refreshImgCode = document.getElementById('refreshImgCode');
    if (refreshImgCode) {
        refreshImgCode.addEventListener('click', function () {
            getImgCode();
        });
    }
    getAppInfo();
    watchFilePicker();
    watchErrorTips('phone', 'phoneTips');
    watchErrorTips('email', 'emailTips');
    watchErrorTips('feedback', 'feedbackTips');
    watchErrorTips('imgCode', 'imgCodeTips');
})();
