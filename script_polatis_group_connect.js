//* Polatis Port I/O GET Data Code Block Starts Here
const infoText = document.getElementById("info")

const headers = {
    "Authorization": "Basic " +btoa("admin:root"),
    "Content-Type": "application/yang-data+json",
    "cache-control": "no-cache",
    "credential": "include",
    "mode": "cors",
}

//~=================================================================================

//* Polatis Group Connect Code Block Starts Here
const srcListContainer = document.getElementById("src_list_container")
const dstListContainer = document.getElementById("dst_list_container")
let src = ""
let dst = ""
let srcElement = null
let dstElement = null
let waitingDelay = false

//^ TEST Data for coding at home, will be appended with API data when online
// const polatisArraySrc = []
// const polatisArrayDst = []
const polatisArraySrc = [{
    name: "PSU_01_SRC",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "CCU_01_DST",
    "connected-port-slot": 0
}, {
    name: "PSU_02_SRC",
     // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "CCU_02_DST",
    "connected-port-slot": 1
}, {
    name: "PSU_03_SRC",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "CCU_03_DST",
    "connected-port-slot": 2
}, {
    name: "PSU_04_SRC",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "CCU_04_DST",
    "connected-port-slot": 3
},]
const polatisArrayDst = [{
    name: "CCU_01_DST",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "PSU_01_SRC"
}, {
    name: "CCU_02_DST",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "PSU_02_SRC"
}, {
    name: "CCU_03_DST",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "PSU_03_SRC"
}, {
    name: "CCU_04_DST",
    // portSideA: each["ingress"][0],
    // portSideB: each["egress"][0],
    "connected-group-name": "PSU_04_SRc"
},]

// while(waitingDelay) {
//     dstListContainer.backgroundColor = "black"
// }

const cancelFuncAppear = (e = null) => {
    e.style.backgroundColor = "firebrick"
    e.style.outline = "none"
    e.style.color = "black"
}

const cancelFuncLeave = (e = null) => {
    disableDstSelection()
    //^ If there is no target passed into the parameters, this will instead put all cancel box's to home position
    if(e !== null) {
        e.style.left = "50px"
    } else {
        document.querySelectorAll(".src_list_cancel_box").forEach(each => {
            each.style.left = "50px"
        })
    }
    document.querySelectorAll(".current_dst_connected").forEach(each => {
        each.classList.remove("current_dst_connected")
    })
    clearMobileSrcSelection()
    clearMobileDstSelection()
    src = ""
    dst = ""
}

const linkingFunc = (source, dest) => {
    
    if(source && dest) {
        disableDstSelection()
        document.querySelectorAll(".src_ul_container").forEach(each => {
            each.style.pointerEvents = "none"
        })
        document.querySelectorAll(".src_text_ul").forEach(each => {
            each.style.backgroundColor = "rgb(25, 47, 79)"
        })
        src = ""
        dst = ""
        document.querySelectorAll(".list_text").forEach(each => {
            // console.log(each)
            if(each.value == dstElement.value) {
                // console.log(each)
                each.value = 999
                each.parentElement.children[2].innerText = ""
            }
        })
        srcElement.value = dstElement.value
        const selection = srcElement.parentElement
        selection.children[2].innerText = dstElement.innerText
        linkPolatisPorts(source, dest)
       
        setTimeout(() => {
            cancelFuncLeave()
            clearMobileSrcSelection()
            clearMobileDstSelection()
        }, 500)
    } else { return }}

const show_cancel_box = (e) => {
    enableDstSelection()
    const index = e.children[0].value
    const currentConnect = dstListContainer.children[index]
    document.querySelectorAll(".src_list_cancel_box").forEach(each => {
        each.style.left = "50px"
    })
    document.querySelectorAll(".list_text").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_src")
    })
    document.querySelectorAll(".current_dst_connected").forEach(each => {
        each.classList.remove("current_dst_connected")
    })
    srcElement = e.children[0]
    // console.log(srcElement)
    srcElement.classList.add("mobile_on_click_list_item_src")
    target = e.previousElementSibling
    target.style.left = "-16px"
    if (!currentConnect) return
    currentConnect.classList.add("current_dst_connected")
}

const enableDstSelection = () => {
    document.querySelectorAll(".dstLi").forEach(each => {
        each.style.backgroundColor = "rgb(40, 75, 124)"
        each.style.color = "white"
    })
}

const disableDstSelection = () => {
    document.querySelectorAll(".dstLi").forEach(each => {
        each.style.backgroundColor = "rgb(25, 47, 79)"
        each.style.color = "rgb(180, 180, 180)"
    })
}

const clearMobileDstSelection = () => {
    document.querySelectorAll(".mobile_on_click_list_item_dst").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_dst")
        each.classList.remove("current_dst_connected")
    })
}

const clearMobileSrcSelection = () => {
    document.querySelectorAll(".mobile_on_click_list_item_src").forEach(each => {
        each.classList.remove("mobile_on_click_list_item_src")
    })
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

    //^ Find current link and break it on the UI so the new link is
    //^ the only visible link
    const removedDstConnectIndex = polatisArrayDst.findIndex(o => o.name === portDst)
    // console.log(removedDstConnectIndex)
    
    polatisArraySrc.forEach(each => {
        // console.log(each)
        if(each["connected-port-slot"] == removedDstConnectIndex)
        each["connected-port-slot"] = undefined
    })
    // console.log(polatisArraySrc)
    // console.log("SRC:", srcGroupsEnd)
    // console.log("DST:", dstGroupsEnd)

    


    //& Posting Data to Polatis
    const url2 = "http://10.239.0.32:8008/api/operations/polatis-switch:add-group-cross-connect"
    const postDictionary = JSON.stringify({
        "input": {
            "group-name-from": portDst,
            "group-name-to": portSrc
        }  
    })
    //& Custom Header
        const res = await fetch(
            url2, {
                method: "POST",
                headers: {
                    "Authorization": "Basic " +btoa("admin:root"),
                    "Content-Type": "application/yang-data+json",
                },
                // "credential": "include",
                "mode": "cors",
                body: postDictionary
            }
            )
            if (!res.ok) {
                console.log("try again")
                return
            }
    // console.log(`${portSrc} --> ${portDst}`)
    // src = ""
    // dst = ""
    document.querySelectorAll(".src_ul_container").forEach(each => {
        each.style.pointerEvents = "auto"
    })
    document.querySelectorAll(".src_text_ul").forEach(each => {
        each.style.backgroundColor = "rgb(40, 75, 124)"
    })
}

async function PullAndPush() {
    
    let array = null
    const url1 = 'http://10.239.0.32:8008/api/data/optical-switch:groups'
        const r = await fetch(url1, {
            headers: headers,
            "credential": "include",
            "mode": "cors"
        })

    if (r.ok) {
            const res = await r.json()
            array = res["optical-switch:groups"]["group"]
            array.forEach(each => {
                if(each["group-name"].toLowerCase().includes(dstSearch.toLowerCase())) {
                    // console.log(each)
                    dstGroupsHold.push({
                        name: each["group-name"],
                        portSideA: each["ingress"][0],
                        portSideB: each["egress"][0],
                        "connected-group-name": each["connected-group"]
                    })
                }
                
                if(each["group-name"].toLowerCase().includes(srcSearch.toLowerCase())) {
                    // console.log(each["connected-group"])
                    srcGroupsHold.push({
                        name: each["group-name"],
                        portSideA: each["ingress"][0],
                        portSideB: each["egress"][0],
                        "connected-group-name": each["connected-group"],
                        "connected-port-slot": null
                    })
                }
            })
            srcGroupsHold.forEach(each => {
                // console.log("HERE IS EACH", each)
                each["connected-port-slot"] = dstGroupsHold.findIndex(o => o["connected-group-name"] == each["name"])
                polatisArraySrc.push(each)
            })
            dstGroupsHold.forEach(each => {
                polatisArrayDst.push(each)
            })
            // console.log(dstGroupsHold)
            // console.log(srcGroupsHold)
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
        // console.log("DST List:", dstGroupsEnd)
        // console.log("SRC List:", srcGroupsEnd)
        
        //*-------------------------------
        // fetcher()

    }
    const appendArrayList = () => {
        polatisArraySrc.forEach(each => {
            const connected = each["connected-group-name"] ? each["connected-group-name"] : ""
            const newNode = document.createElement("div")
            newNode.innerHTML = `
            <ul class="src_ul_container">
            <li class="src_list_cancel_box" onmousedown="cancelFuncLeave(this)" onmouseup="cancelFuncAppear(this)">X</li>
            <ul class="${each["name"]} src_text_ul" onclick="show_cancel_box(this)">
            <li class="list_text"} value="${each["connected-port-slot"]}">${each["name"]}</li>
            <div class="line"></div>
            <li class="list_text_under">${connected}</li>
            </ul>
            </ul>
            `
            
            srcListContainer.appendChild(newNode)
        })
        
        polatisArrayDst.forEach((each, index) => {
            const newNode = document.createElement("li")
            newNode.classList.add("dstLi")
            newNode.innerHTML = `
                    <span class="dstSpan" value=${index}>${each["name"]}</span>
            `
            newNode.addEventListener('click', (e) => {
                if(e.target.closest("li").style.color !== "white") return
                dst = e.target.innerText
                dstElement = e.target
                clearMobileDstSelection()
                e.target.value = index
                e.target.closest("li").classList.add("mobile_on_click_list_item_dst")
                linkingFunc(src, dst)
            })
            dstListContainer.appendChild(newNode)
        })

        const mobileCancelButton = document.getElementById("mobile_cancel_button")
        mobileCancelButton.addEventListener(("click"), () => {
            cancelFuncLeave()
        })
    }
    //* Trigger Get and Post
    // const data = PullAndPush()

    
    setTimeout(() => {
        appendArrayList()
        document.querySelectorAll(".src_text_ul").forEach(each => {
            each.addEventListener('click', (e) => {
                const element = e.target.closest(".src_text_ul")
                src = element.classList[0]
                // }
                // console.log("AFTER CLICK", src)
                clearMobileSrcSelection()
                e.target.closest(".src_text_ul").classList.add("mobile_on_click_list_item_src")
                linkingFunc(src, dst)
            })
        })
    }, 2000)
    
    // console.log(polatisArraySrc)
    // console.log(polatisArrayDst)

    //~=================================================================================
    //&=================================================================================
    //?=================================================================================
    //* Assigning each SRC node the connected Egress DST node



