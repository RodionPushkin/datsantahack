const json = []
const storms = [{
  "r": 369,
  "x": 4722,
  "y": 1950
},
{
  "r": 504,
  "x": 4304,
  "y": 6072
},
{
  "r": 350,
  "x": 1106,
  "y": 4150
},
{
  "r": 303,
  "x": 432,
  "y": 939
},
{
  "r": 666,
  "x": 2023,
  "y": 6893
},
{
  "r": 578,
  "x": 8572,
  "y": 4642
},
{
  "r": 484,
  "x": 6361,
  "y": 9636
},
{
  "r": 631,
  "x": 9647,
  "y": 136
},
{
  "r": 356,
  "x": 2481,
  "y": 1062
},
{
  "r": 323,
  "x": 112,
  "y": 8982
},
{
  "r": 500,
  "x": 7259,
  "y": 3715
},
{
  "r": 322,
  "x": 5806,
  "y": 3357
},
{
  "r": 360,
  "x": 6198,
  "y": 5325
},
{
  "r": 543,
  "x": 9708,
  "y": 2985
},
{
  "r": 512,
  "x": 8988,
  "y": 6778
},
{
  "r": 561,
  "x": 2428,
  "y": 3526
},
{
  "r": 308,
  "x": 5681,
  "y": 216
},
{
  "r": 438,
  "x": 3684,
  "y": 9424
},
{
  "r": 524,
  "x": 4495,
  "y": 4129
},
{
  "r": 526,
  "x": 7584,
  "y": 6545
},
{
  "r": 351,
  "x": 5539,
  "y": 8066
},
{
  "r": 628,
  "x": 6699,
  "y": 2087
},
{
  "r": 605,
  "x": 8853,
  "y": 8332
},
{
  "r": 533,
  "x": 3683,
  "y": 7346
},
{
  "r": 698,
  "x": 961,
  "y": 2715
},
{
  "r": 478,
  "x": 1203,
  "y": 9945
},
{
  "r": 351,
  "x": 9745,
  "y": 9915
},
{
  "r": 379,
  "x": 7364,
  "y": 8302
},
{
  "r": 350,
  "x": 3154,
  "y": 4766
},
{
  "r": 367,
  "x": 8573,
  "y": 2050
}]

function setup() {
  createCanvas(1000, 1000);
  let showPoints = true
  let showStorms = true
  let dpi = 10
  clear()
  let index = 0
  let interval = setInterval(() =>{
    if(index < json.length){
      if(json[index+1]) line(json[index].x/dpi, json[index].y/dpi, json[index+1].x/dpi, json[index+1].y/dpi)
      stroke(2)
      fill("#ffffff")
      index++
    }else{
      clearInterval(interval)
    }
  },10)
  for (let i = 0; i < json.length; i++) {
    if(showPoints) circle(json[i].x/dpi, json[i].y/dpi, dpi/2)
  }
  for (let i = 0; i < storms.length; i++) {
    noStroke()
    fill("rgba(135, 217, 255,0.8)")
    if(showStorms) circle(storms[i].x/dpi, storms[i].y/dpi, storms[i].r/dpi*2)
  }
}
function draw() {
  
}