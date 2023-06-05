// const headers = {
//     "Accept": "application/yang-data+json",
//     "Content-Type": "application/yang-data+json",
//     "Authorization": "Basic " +btoa("admin:root"),

// }

// async function fetcher() {
//     const url = "http://10.239.0.32:8008/api"
//     const res = await fetch(url, { 
//         headers: headers,
//         method: "OPTIONS"
//     })
//     // const jsonRes = await res.json()
//     // console.log(jsonRes)
//     // const linkArray = jsonRes["optical-switch:cross-connects"]["pair"]
//     // console.log(linkArray)
// }

// // //* Fetch Single Port Data
// fetcher()

// // fetch(`https://api.allorigins.win/get?url=${encodeURIComponent("http://10.239.0.32:8008/api/data/optical-switch:cross-connects")}`, {headers: headers})
// //                     .then(response => {
// //                       if (response.ok) return response.json()
// //                       console.log(response)
// //                       throw new Error('Network response was not ok.')
// //                     })
// //                     .then(data => console.log(data.contents));

var myHeaders = new Headers();
myHeaders.append("Content-Type", "\"application/yang-data+json\"");
myHeaders.append("Authorization", "Basic YWRtaW46cm9vdA==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://10.239.0.32:8008/api", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));