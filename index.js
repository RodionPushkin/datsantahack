console.clear()
const axios = require('axios')
const data = {
  token: "30d09cb3-a614-4bd9-99aa-0071fad81680",
  map_url: "https://datsanta.dats.team/json/map/faf7ef78-41b3-4a36-8423-688a61929c08.json",
  mapID: "faf7ef78-41b3-4a36-8423-688a61929c08",
  route_url: "https://datsanta.dats.team/api/round",
  santa_base: {
    x: 0,
    y: 0
  }
}
const info = require("./faf7ef78-41b3-4a36-8423-688a61929c08.json")

console.log("gifts:", info.gifts[0])
console.log("children:", info.children[0])
console.log("snowAreas:", info.snowAreas[0])
console.log("--------------------------------------------------")

const getDistance = (xStart = 0, yStart = 0, xEnd = 0, yEnd = 0) => {
  return Math.round(Math.sqrt(Math.pow(xEnd - xStart, 2) + Math.pow(yEnd - yStart, 2)))
}
const isTouchingSnowArea = (xStart = 0, yStart = 0, xEnd = 0, yEnd = 0) => {
  // console.time('isTouchingSnowArea')
  let isTouched = false
  let snowArea
  for (let i = 0; i < info.snowAreas.length; i++) {
    const area = info.snowAreas[i]
    const vectorA = {
      x: xEnd - xStart,
      y: yEnd - yStart,
      length: getDistance(xStart, yStart, xEnd, yEnd)
    }
    const vectorB = {
      x: area.x - xStart,
      y: area.y - yStart,
      length: getDistance(xStart, yStart, area.x, area.y)
    }
    const AB = (vectorA.x * vectorB.x + vectorA.y * vectorB.y)
    const AModule = Math.sqrt(Math.pow(vectorA.x, 2) + Math.pow(vectorA.y, 2))
    const BModule = Math.sqrt(Math.pow(vectorB.x, 2) + Math.pow(vectorB.y, 2))
    const cosAngle = AB / (AModule * BModule)
    const angle = Math.acos(cosAngle) * 180 / Math.PI
    const edge = vectorA.length > vectorB.length ? vectorB.length : vectorA.length
    const height = Math.abs(edge * Math.sin(angle * Math.PI / 180))
    if ((height < area.r && height >= 1 || height < area.r && height == 0) && getDistance(xStart, yStart, area.x, area.y) <= getDistance(xStart, yStart, xEnd, yEnd) + area.r) {
      isTouched = true
      area.height = height
      snowArea = area
    }
  }
  // console.timeEnd('isTouchingSnowArea')
  return [isTouched, isTouched ? snowArea : null]
}
// console.log(isTouchingSnowArea(0, 0, 4722, 1950))
const isCoordinateInSnowArea = (x = 0, y = 0) => {
  // console.time('isTouchingSnowArea')
  const snowAreas = info.snowAreas
  let isIn = false
  let snowArea
  snowAreas.forEach((area, index) => {
    const length = getDistance(area.x, area.y, x, y)
    if (length < area.r) {
      isIn = true
      snowArea = area
    }
  })
  // console.timeEnd('isTouchingSnowArea')
  return [isIn, isIn ? snowArea : null]
}
// console.log(isCoordinateInSnowArea(4722,1950))
const updateSnowAreas = (snowareas = [{r: null, x: null, y: null}]) => {
  console.time('updateSnowAreas')
  for (let i = 0; i < snowareas.length; i++) {
    const length = Math.round(snowareas[i].r + snowareas[i].r * 0.13)
    const x = snowareas[i].x
    const y = snowareas[i].y
    snowareas[i].length = length
    snowareas[i].aura = [
      {id: 1, x: x, y: y - length},
      {id: 2, x: x + length, y: Math.round(y - (length / 2))},
      {id: 3, x: x + length, y: Math.round(y + (length / 2))},
      {id: 4, x: x, y: y + length},
      {id: 5, x: x - length, y: Math.round(y + (length / 2))},
      {id: 6, x: x - length, y: Math.round(y - (length / 2))},
    ]
  }
  console.timeEnd('updateSnowAreas')
  return snowareas
}
const updateChildren = (children = [{x: null, y: null}], gifts = [{id: null, x: null, y: null}]) => {
  console.time('updateChildren')
  if (gifts.length != children.length) return null
  gifts.forEach((item, index) => {
    children[index].id = item.id
    children[index].isInSnowArea = isCoordinateInSnowArea(children[index].x, children[index].y)
    children[index].distance = getDistance(data.santa_base.x, data.santa_base.y, children[index].x, children[index].y)
  })
  console.timeEnd('updateChildren')
  return children
}
// console.log(updateChildren(info.children, info.gifts)[0])
const bubbleSortByWeight = (children = [{x: null, y: null}], gifts = [{id: null, x: null, y: null}]) => {
  console.time('bubbleSortWeight')
  for (let i = 0, endI = gifts.length - 1; i < endI; i++) {
    for (let j = 0, endJ = endI - i; j < endJ; j++) {
      if (gifts[j].weight > gifts[j + 1].weight) {
        let swapGift = gifts[j]
        let swapChild = children[j]
        gifts[j] = gifts[j + 1]
        children[j] = children[j + 1]
        gifts[j + 1] = swapGift
        children[j + 1] = swapChild
      }
    }
  }
  for (let i = 0; i < children.length; i++) {
    children[i].graph = []
    const otherChildrens = children.filter(child => child.id != children[i].id)
    for (let j = 0; j < otherChildrens.length; j++) {
      children[i].graph.push({
        child: otherChildrens[j],
        distance: getDistance(children[i].x, children[i].y, otherChildrens[j].x, otherChildrens[j].y)
      })
    }
  }
  console.timeEnd('bubbleSortWeight')
  return {children, gifts};
}
// console.log(bubbleSortByWeight(info.children, info.gifts).children[0])
const bubbleSortByDistance = (children = [{x: null, y: null}], gifts = [{id: null, x: null, y: null}]) => {
  console.time('bubbleSortDistance')
  for (let i = 0, endI = gifts.length - 1; i < endI; i++) {
    for (let j = 0, endJ = endI - i; j < endJ; j++) {
      if (children[j].distance > children[j + 1].distance) {
        let swapGift = gifts[j]
        let swapChild = children[j]
        gifts[j] = gifts[j + 1]
        children[j] = children[j + 1]
        gifts[j + 1] = swapGift
        children[j + 1] = swapChild
      }
    }
  }
  console.timeEnd('bubbleSortDistance')
  return {children, gifts};
}
// console.log(bubbleSortByDistance(info.children, info.gifts).children[0])

const walkAvoidStorm = (storm, previousRoute) => {
  let routes = []
  storm.aura = storm.aura.filter(aura => aura.x <= 10000 && aura.y <= 10000 && aura.x >= 0 && aura.y >= 0)
  storm.aura.forEach((aura, index) => {
    storm.aura[index].distance = getDistance(previousRoute.x, previousRoute.y, aura.x, aura.y)
  })
  for (let i = 0, endI = storm.aura.length - 1; i < endI; i++) {
    for (let j = 0, endJ = endI - i; j < endJ; j++) {
      if (storm.aura[j].distance > storm.aura[j + 1].distance) {
        let swapAura = storm.aura[j]
        storm.aura[j] = storm.aura[j + 1]
        storm.aura[j + 1] = swapAura
      }
    }
  }
  let aura1, aura2, aura3
  if (storm.aura.length > 1) {
    aura1 = storm.aura[0]
    routes.push({"x": aura1.x, "y": aura1.y})
  }
  if (storm.aura.length > 2) {
    aura2 = storm.aura[1]
    routes.push({"x": aura2.x, "y": aura2.y})
  }
  // if(storm.aura.length > 3){
  //   aura3 = storm.aura.filter(aura => aura.id == (aura2.id+1 > 6 ? 1 : aura2.id+1))[0]
  //   routes.push({"x": aura3.x, "y": aura3.y})
  // }
  return routes
}
const buildBag = () => {
  // return a bag
}

const createRoute = (bag) => {

}
const sendData = async (bags, routes) => {
  console.log(bags.length, routes.length)
  const config = {
    method: "post",
    url: data.route_url,
    headers: {
      Accept: "application/json",
      "X-API-Key": data.token,
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      "mapID": data.mapID,
      "moves": routes,
      "stackOfBags": bags.reverse()
    })
  }
  return axios(config).then(res => {
    return res.data
  }).catch((error) => {
    console.error(error)
    return false
  });
}
const main = async () => {
  console.time('deadsanta')
  info.snowAreas = updateSnowAreas(info.snowAreas)
  info.children = updateChildren(info.children, info.gifts)
  const sorted = bubbleSortByWeight(info.children, info.gifts)
  info.gifts = sorted.gifts
  info.children = sorted.children
  const listOfBags = []
  const listOfRoutes = []
  let currentWeight = 0
  let currentVolume = 0
  let temporaryBag = []

  for (let i = 0; i < info.gifts.length; i++) {
    let previousRoute = listOfRoutes.length > 0 ? listOfRoutes[listOfRoutes.length - 1] : [{x: 0, y: 0}]
    let touchFromPreviousRoute = isTouchingSnowArea(previousRoute.x, previousRoute.y, 0, 0)
    if (currentWeight + info.gifts[i].weight > 200 || currentWeight + info.gifts[i].volume > 100) {
      listOfBags.push(temporaryBag.reverse())
      temporaryBag = []
      currentWeight = 0
      currentVolume = 0
      // listOfRoutes.push({"x": 0, "y": 0})
      if (touchFromPreviousRoute[0]) {
        let routes = walkAvoidStorm(touchFromPreviousRoute[1], previousRoute)
        // console.log(routes)
        listOfRoutes.push(...routes)
        previousRoute = listOfRoutes[listOfRoutes.length - 1]
        // console.log(previousRoute)
        touchFromPreviousRoute = isTouchingSnowArea(previousRoute.x, previousRoute.y, 0, 0)
      }
    }
    currentWeight += info.gifts[i].weight
    currentVolume += info.gifts[i].volume

    if (touchFromPreviousRoute[0]) {
      let routes = walkAvoidStorm(touchFromPreviousRoute[1], previousRoute)
      // console.log(routes)
      listOfRoutes.push(...routes)
      previousRoute = listOfRoutes[listOfRoutes.length - 1]
      // console.log(previousRoute)
      touchFromPreviousRoute = isTouchingSnowArea(previousRoute.x, previousRoute.y, info.children[i].x, info.children[i].y)[0]
    }
    listOfRoutes.push({"x": info.children[i].x, "y": info.children[i].y})
    temporaryBag.push(info.gifts[i].id)
  }
  if (temporaryBag.length > 0) {
    listOfBags.push(temporaryBag)
  }


  const fs = require("fs")
  const path = require("path")
  fs.readFile('data.js', (err, data) => {
    if (err) {
      console.log(err)
      fs.appendFile('data.js', `let json = ${JSON.stringify(listOfRoutes)}`, (err2) => {
        if (err2) console.log(err2)
        console.log("saved")
      })
    } else {
      data = data.toString('utf8');
      if (data != `let json = ${JSON.stringify(listOfRoutes)}`) {
        fs.unlink('data.js', function (err1) {
          if (err1) console.log(err1);
          console.log("sdfs")
          fs.appendFile('data.js', `let json = ${JSON.stringify(listOfRoutes)}`, (err2) => {
            if (err2) console.log(err2)
            console.log("saved")
          })
        });
      }
    }
  })
  console.log(listOfBags.length, listOfRoutes.length)
  // let query = await sendData(listOfBags, listOfRoutes)
  // console.log(query)
  // if(query.roundId && query.roundId.length > 1){
  //   let interval = setInterval(()=>{
  //     axios.get(`${data.route_url}/${query.roundId}`).then(res=>{
  //       console.log(res.data)
  //       if(res.data.data.total_time > 0){
  //         clearInterval(interval)
  //       }
  //     })
  //   },30000)
  // }
  console.timeEnd('deadsanta')
}
main()
