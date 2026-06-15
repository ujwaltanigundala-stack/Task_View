export const apibaseurl = "http://localhost:8000";
export const imgurl = import.meta.env.BASE_URL;
export function callApi(reqMethod, apiUrl, jsonData, formData, responseHandler, jwtToken = "")
{
    const headers = {};
    if (jsonData) headers["Content-Type"] = "application/json";
    if (jwtToken) headers["Token"] = jwtToken;

    const options = {
        method: reqMethod,
        headers: headers,
        body: jsonData ? JSON.stringify(jsonData) : formData ? formData : undefined
    };

    fetch(apiUrl, options)
    .then(async (res) => {
        console.log("STATUS:", res.status);
        const text = await res.text();
        console.log("RAW RESPONSE:", text);
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        }
        catch (e) {
            data = { code: res.status, message: text };
        }
        responseHandler(data);
    })
        .catch((err) => alert("API request failed: " + (err?.message || err)));

}