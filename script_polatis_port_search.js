//* Polatis Port I/O GET Data Code Block Starts Here
const headers = {
    "Authorization": "Basic " +btoa("admin:root"),
    "Content-Type": "application/yang-data+json",
    "cache-control": "no-cache",
    "credential": "include",
    "mode": "cors",
}

const portData = {
    a_port: 24,
    a_name: "GHTC_CCU_24A",
    a_connected_to_port: 212,
    a_connected_to_name: "SOM_PSU_01B",
    b_port: 512,
    b_name: "GHTC_CCU_24B",
    b_connected_to_port: 102,
    b_connected_to_name: "SOM_PSU_01A"
}
console.log("test")
const userSubmitBtn = document.getElementById("user_port_button")
console.log(userSubmitBtn)
const inputBox = document.getElementById("user_port_input")

const portA = document.getElementById("port_a")
const nameA = document.getElementById("name_a")
const portConnectedA = document.getElementById("port_connected_a")
const nameConnectedA = document.getElementById("name_connected_a")
const portB = document.getElementById("port_b")
const nameB = document.getElementById("name_b")
const portConnectedB = document.getElementById("port_connected_b")
const nameConnectedB = document.getElementById("name_connected_b")

//^ Will need to test for delay, setTimeout, or waiting for the 
//^ Promises to all be returned, it should already work
//^ but good to note it might need some fixing
async function fetcher(portNumber = null) {
    //* Offline Data for visualizing
    //* ------------------------------------------------
    portA.innerText = 1
    nameA.innerText = "GHTC_CCU_5A"
    portConnectedA.innerText = 440
    nameConnectedA.innerText = "ARENA_PSU_01B"
    portB.innerText = 220
    nameB.innerText = "GHTC_CCU_5B"
    portConnectedB.innerText = 101
    nameConnectedB.innerText = "ARENA_PSU_01A"
    //* ------------------------------------------------
    
    //^ Fetcher Top Scope Variables
    let port = portNumber
    let connected;
    let label1 = ""
    let label2 = ""
    let message = ""
    const url = "http://10.239.0.32:8008/api/data/optical-switch:cross-connects"
    
    const res = await fetch(url, { headers: headers, "credential": "include", "mode": "cors" })
    const jsonRes = await res.json()
    const linkArray = jsonRes["optical-switch:cross-connects"]["pair"]
    
    linkArray.forEach(each => {
        if (Number(each["ingress"]) == portNumber) {
            port = each["ingress"]
            connected = each["egress"]
        }})
        
    //^ function for API calling the port endpoint to get ingress and egress data
    async function portAPILabelFunc(arg) {
        const endpoint = "http://10.239.0.32:8008/api/data/optical-switch:ports/port=" + arg + "/port-label"
        const p = await fetch(endpoint, { headers: headers, "credential": "include", "mode": "cors" })
        const label = await p.json()
        return label["optical-switch:port-label"]
    }
    
    if (connected) {
        label1 = await portAPILabelFunc(port)
        label2 = await portAPILabelFunc(connected)
        console.log(label1, label2)
        //^ Need to now get the B side of the portA to get the
        //^ name of port B and connected B port and name
        //^ Will need to get the B side of port A by fetch that with
        //^ a new API call to get the data for that specific port and
        //^ its connected port and label
    } else {
        message = (`PORT: #${port} ${label1} is not connected to another port`)
        console.log(message)
        portA.innerText = message
    }   
}

//* Fetch Single Port Data
// userPortSearch = prompt("What port would you like to search for?")
// fetcher(userPortSearch)

userSubmitBtn.addEventListener("click", (e) => {
    inputBox.value = null
    fetcher(inputBox.value)
})

document.body.addEventListener("keypress", (e) => {
    if(e.key !== "Enter") return
    inputBox.value = null
    fetcher(inputBox.value)
})