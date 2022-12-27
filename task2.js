console.clear()
const axios = require('axios')
const data = {
  token: "30d09cb3-a614-4bd9-99aa-0071fad81680",
  map_url: "https://datsanta.dats.team/json/map/a8e01288-28f8-45ee-9db4-f74fc4ff02c8.json",
  mapID: "a8e01288-28f8-45ee-9db4-f74fc4ff02c8",
  route_url: "https://datsanta.dats.team/api/round2"
}
const info = require('./a8e01288-28f8-45ee-9db4-f74fc4ff02c8.json')
const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
const getTotalPrice = (children) => {
  let total = 0
  for (let i = 0; i < children.length; i++) {
    total+=children[i].gift.price
  }
  return total
}
const bubbleSortByPrice = (array ) => {
  for (let i = 0, endI = array.length - 1; i < endI; i++) {
    for (let j = 0, endJ = endI - i; j < endJ; j++) {
      if (array[j].price > array[j + 1].price) {
        let swaparray = array[j]
        array[j] = array[j + 1]
        array[j + 1] = swaparray
      }
    }
  }
  return array;
}

const main = () => {
  console.time('main')
  // gender 0 is female and gender 1 is male but -1 is unimegasex
  const gift_type = [
    {type: "constructors", gender: 1, age_min: 3, age_max: -1},
    {type: "dolls", gender: 0, age_min: 0, age_max: -1},
    {type: "radio_controlled_toys", gender: 1, age_min: 3, age_max: -1},
    {type: "toy_vehicles", gender: 1, age_min: 1, age_max: -1},
    {type: "board_games", gender: -1, age_min: 5, age_max: -1},
    {type: "outdoor_games", gender: -1, age_min: 1, age_max: -1},
    {type: "playground", gender: -1, age_min: 2, age_max: -1},
    {type: "soft_toys", gender: -1, age_min: 0, age_max: -1},
    {type: "computer_games", gender: 1, age_min: 6, age_max: -1},
    {type: "sweets", gender: -1, age_min: 0, age_max: -1},
    {type: "books", gender: -1, age_min: 3, age_max: -1},
    {type: "pet", gender: -1, age_min: 0, age_max: -1},
    {type: "clothes", gender: 0, age_min: 0, age_max: -1},
  ]
  for (let i = 0; i < info.gifts.length; i++) {
    for (let j = 0; j < gift_type.length; j++) {
      if(gift_type[j].type == info.gifts[i].type){
        info.gifts[i].gender = gift_type[j].gender
        info.gifts[i].age_min = gift_type[j].age_min
        info.gifts[i].age_max = gift_type[j].age_max == -1 ? 999999999 : gift_type[j].age_max
      }
    }
  }
  let currentGifts = bubbleSortByPrice(info.gifts).reverse()
  currentGifts = shuffle(info.gifts)
  for (let i = 0; i < info.children.length; i++) {
    info.children[i].gender = info.children[i].gender == "female" ? 0 : 1
    info.children[i].gift = currentGifts.filter(gift => (gift.gender == info.children[i].gender || gift.gender == -1) && (info.children[i].age >= gift.age_min && info.children[i].age <= gift.age_max))[0]
    currentGifts = currentGifts.filter(gift => gift.id != info.children[i].gift.id)
  }
  console.log(getTotalPrice(info.children))
  while(getTotalPrice(info.children) > 100000){
    currentGifts = bubbleSortByPrice(info.gifts).reverse()
    currentGifts = shuffle(info.gifts)
    for (let i = 0; i < info.children.length; i++) {
      info.children[i].gender = info.children[i].gender == "female" ? 0 : 1
      info.children[i].gift = currentGifts.filter(gift => (gift.gender == info.children[i].gender || gift.gender == -1) && (info.children[i].age >= gift.age_min && info.children[i].age <= gift.age_max))[0]
      currentGifts = currentGifts.filter(gift => gift.id != info.children[i].gift.id)
    }
    console.log(getTotalPrice(info.children))
  }
  const presentingGifts = []
  for (let i = 0; i < info.children.length; i++) {
    presentingGifts.push({
      giftID: info.children[i].gift.id,
      childID: info.children[i].id
    })
  }
  console.log(presentingGifts[0])
  console.log(info.children.length,info.gifts.length,presentingGifts.length)
  axios({
    method: "post",
    url: String(data.route_url),
    headers: {
      "Accept": "application/json",
      "X-API-Key": data.token,
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      "mapID": data.mapID,
      "presentingGifts": presentingGifts
    })

  }).then(res=>{
    console.log(res.data)
  }).catch(err=>{
    console.log(err)
  })
  const fs = require("fs")
  const path = require("path")
  fs.appendFile(`${new Date().getTime()}.json`, JSON.stringify(presentingGifts), (err2) => {
    if (err2) console.log(err2)
    console.log("saved")
  })
  console.timeEnd('main')
}
main()