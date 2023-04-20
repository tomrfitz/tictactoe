// This code is not meant to be run, it's just a sample of how to use fetch.

const getData = async () => {
    payload = {
        method: "GET",
        body: JSON.stringify({
            "nums": [0, 1, 2, 3]
        })
    }
    const response = await fetch("localhost:8080", payload);

    // this line is dangerous, you should always check status code before unpacking the json.
    const data = await response.json();

}

getData();