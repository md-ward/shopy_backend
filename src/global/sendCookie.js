module.exports = function sendCookie(res, cookieName, cookieValue,) {
    res.cookie(cookieName, cookieValue, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
}

