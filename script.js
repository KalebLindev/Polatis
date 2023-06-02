//* Polatis Port I/O GET Data Code Block Starts Here
const infoText = document.getElementById("info")

const headers = {
    "Authorization": "Basic " +btoa("admin:root"),
    "Content-Type": "application/yang-data+json",
    "cache-control": "no-cache"
}

async function fetcher() {
    try {
        //^ Fetcher Top Scope Variables
        let port = ""
        let connected = ""
        let label1 = ""
        let label2 = ""
        let message = ""
        const url = "http://10.239.0.32:8008/api/data/optical-switch:cross-connects"

        //^ Input for which Polatis port to API data from
        // userPortSearch = prompt("What port would you like to search for?")
        // userPortSearch = "17"

        const res = await fetch(url, { headers: headers })
        const jsonRes = await res.json()
        // console.log(jsonRes)
        const linkArray = jsonRes["optical-switch:cross-connects"]["pair"]
        // console.log(linkArray)

        linkArray.forEach(each => {
            // console.log(each)
            if (Number(each["ingress"]) == userPortSearch) {
            port = each["ingress"]
            connected = each["egress"]
        }})

        //^ function for API calling the port endpoint to get ingress and egress data
        async function portApiFunc(arg) {

            const endpoint = "http://10.239.0.32:8008/api/data/optical-switch:ports/port=" + arg + "/port-label"
            const p = await fetch(endpoint, { headers: headers})
            const label = await p.json()
            // console.log(label)
            return label["optical-switch:port-label"]
        }

        if (port) {
            label1 = await portApiFunc(port)
            label2 = await portApiFunc(connected)
            message = (`PORT: ${port} ${label1} is connected to PORT: ${connected} ${label2}`)
            console.log(message)
            infoText.innerText = message
        } else {
            message = (`PORT: #${userPortSearch} ${label1} is not connected to another port`)
            console.log(message)
            infoText.innerText = message
        }   
    } catch(err) {
        console.log(err)
    }
    //^ Must be called inside Fetcher Func since it is initiated inside of it
    portApiFunc()
}

// fetcher()

//~=================================================================================

//* Polatis Group Connect Code Block Starts Here
const srcListContainer = document.getElementById("src_list_container")
const dstListContainer = document.getElementById("dst_list_container")
let src = ""
let dst = ""

//^ TEST Data for coding at home, will be appended with API data when online
// const polatisArraySrc = []
// const polatisArrayDst = []
const polatisArraySrc = ["PSU_01_SRC", "PSU_02_SRC", "PSU_03_DST"]
const polatisArrayDst = ["CCU_01_DST", "CCU_02_DST", "CCU_03_DST"]

const cancelFuncAppear = (e = null) => {
    
    e.style.backgroundColor = "firebrick"
    e.style.outline = "none"
    e.style.color = "black"
    
}

const cancelFuncLeave = (e = null) => {
    //^ If there is no target passed into the parameters, this will instead put all cancel box's to home position
    if(e !== null) {
        e.style.left = "50px"
    } else {
        document.querySelectorAll(".src_list_cancel_box").forEach(each => {
            each.style.left = "50px"
        })
    }
}

const linkingFunc = () => {
    if(src && dst) {
        linkPolatisPorts(src, dst)
        src = ""
        dst = ""
        setTimeout(() => {
            cancelFuncLeave()
        }, 500)
    } else { return }}

const show_cancel_box = (e) => {
    document.querySelectorAll(".src_list_cancel_box").forEach(each => {
        each.style.left = "50px"
    })
    target = e.previousElementSibling
    target.style.left = "-16px"
}

//~=================================================================================
//&=================================================================================
//?=================================================================================


const dstSearch = "dst"
const srcSearch = "src"
const groups = []
let dstGroupsHold = []
let srcGroupsHold = []
let dstNumIndex = 1
let srcNumIndex = 1
const dstGroupsEnd = Array(100).fill(null)
const srcGroupsEnd = Array(100).fill(null)

const linkPolatisPorts = async (portSrc, portDst) => {

    //& Posting Data to Polatis
    const url2 = "http://10.239.0.32:8008/api/operations/polatis-switch:add-group-cross-connect"
    const postDictionary = JSON.stringify({
        "input": {
            "group-name-from": portDst,
            "group-name-to": portSrc
        }  
    })
    //& Custom Header
    const res2 = await fetch(
        url2, {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": "Basic " +btoa("admin:root"),
                "Content-Type": "application/yang-data+json",
            },
            body: postDictionary
        }
        )
    console.log(`${portSrc} --> ${portDst}`)
}

async function PullAndPush() {
    
    let array = null
    const url1 = 'http://10.239.0.32:8008/api/data/optical-switch:groups'
        const r = await fetch(url1, {
            headers: headers
        })

    if (r.ok) {
            const res = await r.json()
            array = res["optical-switch:groups"]["group"]
            array.forEach(each => {
                //^ NEED to convert this for in into JavaScript
                if(each["group-name"].toLowerCase().includes(dstSearch.toLowerCase())) {
                    dstGroupsHold.push(each["group-name"])
                }
                
                //^ NEED to convert this for in into JavaScript
                if(each["group-name"].toLowerCase().includes(srcSearch.toLowerCase())) {
                    srcGroupsHold.push(each["group-name"])
                }
            })
            srcGroupsHold.forEach(each => {
                polatisArraySrc.push(each)
            })
            dstGroupsHold.forEach(each => {
                polatisArrayDst.push(each)
            })
            console.log(dstGroupsHold)
            console.log(srcGroupsHold)
        } else {
            console.log("NOPE")
        }

        //^ NEED to convert this for in into JavaScript
        if(dstGroupsHold) {
            dstGroupsHold.forEach(each => {
                dstGroupsEnd[dstNumIndex] = dstGroupsHold[srcNumIndex - 1]
                dstNumIndex += 1
            })

        }

        //^ NEED to convert this for in into JavaScript
        srcGroupsHold.forEach(each => {
            srcGroupsEnd[srcNumIndex] = srcGroupsHold[srcNumIndex - 1]
            srcNumIndex += 1
        })

        console.log("DST List:", dstGroupsEnd)
        console.log("SRC List:", srcGroupsEnd)
    
    }
    const appendArrayList = () => {

        polatisArraySrc.forEach(each => {
            const newNode = document.createElement("div")
            newNode.innerHTML = `
            <ul class="src_ul_container">
            <li class="src_list_cancel_box" onmousedown="cancelFuncLeave(this)" onmouseup="cancelFuncAppear(this)">X</li>
            <li class="list_text" onclick="show_cancel_box(this)">${each}</li>
            </ul>
            `
            newNode.addEventListener('click', (e) => {
                src = e.target.innerText
                linkingFunc()
            })
            
            srcListContainer.appendChild(newNode)
        })
        
        polatisArrayDst.forEach(each => {
            const newNode = document.createElement("li")
            newNode.innerText = each
            newNode.addEventListener('click', (e) => {
                dst = e.target.innerText
                linkingFunc()
            })
            
            dstListContainer.appendChild(newNode)
        })
    }
// const data = PullAndPush()
appendArrayList()