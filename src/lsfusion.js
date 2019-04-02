const location = window.location;
const url = location.protocol + "//" + location.host + "/" + location.pathname.split('/')[1];

// const url = "https://demo.lsfusion.org/erp";
const urlExec = url + "/exec";
const urlEval = url + "/eval";
const urlAction = urlEval + "/action";

function handleErrors(response) {
    if (!response.ok) {
        response.text().then(text => console.log(text));
        throw Error(response);
    }
    return response;
}

function isObject(obj) {
    return obj === Object(obj);
}

function getParams(script, data) {
    var formData = new FormData();

    if (script != null)
        formData.append("script", script);

    for (var name in data) {
        if (data[name] instanceof Blob) {
            formData.append(
                name,
                data[name]
            );
        } else
        if (isObject(data[name]) || Array.isArray(data[name])) {
            formData.append(
                name,
                new Blob([JSON.stringify(data[name])],
                    {type: "application/json;charset=UTF-8"})
            );
        } else
            formData.append(
                name,
                new Blob([data[name]],
                    { type: "plain/text;charset=UTF-8"})
            );
    }
    const params = {
        method: "post",
        headers: {
            "Content-type": "multipart/form-data"
        },
        body: formData
    };

    return params;
}

function select(script, data) {
    return fetch(urlAction, getParams("EXPORT FROM " + script, data)).then(handleErrors).then(response => response.json());
}

function selectAction(action, data) {
    return fetch(urlExec + "?action=" + action, getParams(null, data)).then(handleErrors).then(response => response.json());
}

function evaluate(script, data) {
    return fetch(urlAction, getParams(script, data)).then(handleErrors);
}

function exec(action, data) {
    return fetch(urlExec + "?action=" + action, getParams(null, data)).then(handleErrors);
}

function run(script, data) {
    return fetch(urlEval, getParams(script, data)).then(handleErrors);
}

function getUrlExec() {
    return urlExec;
}

export { select, selectAction, exec, evaluate, run, getUrlExec };
