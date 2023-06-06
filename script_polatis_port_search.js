//* Polatis Port I/O GET Data Code Block Starts Here
const headers = {
    "Authorization": "Basic " +btoa("admin:root"),
    "Content-Type": "application/yang-data+json",
    "cache-control": "no-cache",
    // "credential": "include",
    // "mode": "cors",
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
const userSubmitBtn = document.getElementById("user_port_button")
const inputBox = document.getElementById("user_port_input")
const errorModal = document.getElementById("error_modal")

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

let counter = 0;

async function fetcher(portNumber = null, portEl, nameEl, portConnectedEl, nameConnectedEl, flipFor2nd = false) {
    if (counter === 0) {
        errorModal.style.display = "none"
        portA.innerText = ""
        nameA.innerText = ""
        portConnectedA.innerText = ""
        nameConnectedA.innerText = ""
        portB.innerText = ""
        nameB.innerText = ""
        portConnectedB.innerText = ""
        nameConnectedB.innerText = ""
    }

    // console.log(portEl)
    // console.log(nameEl)
    // console.log(portConnectedEl)
    // console.log(nameConnectedEl)
    //* Offline Data for visualizing
    //* ------------------------------------------------
    // portA.innerText = 1
    // nameA.innerText = "GHTC_CCU_5A"
    // portConnectedA.innerText = 440
    // nameConnectedA.innerText = "ARENA_PSU_01B"
    // portB.innerText = 220
    // nameB.innerText = "GHTC_CCU_5B"
    // portConnectedB.innerText = 101
    // nameConnectedB.innerText = "ARENA_PSU_01A"
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
    // console.log(linkArray)
    
    linkArray.forEach(each => {
        if (Number(each["ingress"]) == portNumber) {
            port = each["ingress"]
            connected = each["egress"]
            // console.log(port, connected)
        }})
        
    //^ function for API calling the port endpoint to get ingress and egress data
    async function portAPILabelFunc(arg) {
        const endpoint = "http://10.239.0.32:8008/api/data/optical-switch:ports/port=" + arg + "/port-label"
        const p = await fetch(endpoint, { headers: headers, "credential": "include", "mode": "cors" })
        const label = await p.json()
        // console.log(label)
        return label["optical-switch:port-label"]
    }
    
    
    label1 = await portAPILabelFunc(port)
    if (connected && counter < 2) {
        counter++
        label2 = await portAPILabelFunc(connected)
        // console.log(label1, label2)
        if (flipFor2nd) {
            portEl.innerText = connected
            nameEl.innerText = label2
            portConnectedEl.innerText = portNumber
            nameConnectedEl.innerText = label1
        } else {
            portEl.innerText = portNumber
            nameEl.innerText = label1
            portConnectedEl.innerText = connected
            nameConnectedEl.innerText = label2
        }
        const secondValue = Number(connected) - 384
        fetcher(String(secondValue), portB, nameB, portConnectedB, nameConnectedB, true)
    } 
    else if(!connected) {
        errorModal.style.display = "flex"
        message = (`PORT: #${port} ${label1} is not connected to another port`)
        // console.log(message)
        errorModal.innerHTML = `
            <p>Port: ${port}</p>
            <p>${label1}</p>
            <p>is not connected to another port</p>
        `
    }   
}

//* Fetch Single Port Data
// userPortSearch = prompt("What port would you like to search for?")
// fetcher(userPortSearch)

userSubmitBtn.addEventListener("click", (e) => {
    counter = 0
    if (inputBox.value.length < 1) return
    fetcher(inputBox.value, portA, nameA, portConnectedA, nameConnectedA)
    inputBox.value = null
})

document.body.addEventListener("keypress", (e) => {
    if(e.key !== "Enter") return
    counter = 0
    if (inputBox.value.length < 1) return
    fetcher(inputBox.value, portA, nameA, portConnectedA, nameConnectedA)
    inputBox.value = null
})