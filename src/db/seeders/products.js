
  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Products', 
      [
  {
    "shopify_title": "Agria Potato",
    "shopify_id": "4502212345914",
    "shopify_handle": "agria-potato",
    "shopify_variant_id": "31792460398650",
    "shopify_price": 450,
    "available": false,
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "shopify_title": "Apples NZ Rose",
    "shopify_id": "4502212476986",
    "shopify_handle": "apples-nz-rose",
    "shopify_variant_id": "31792460529722",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:01.233Z",
    "updatedAt": "2020-07-13T00:53:04.282Z"
  },
  {
    "shopify_title": "Baby Kale",
    "shopify_id": "4502213296186",
    "shopify_handle": "baby-kale",
    "shopify_variant_id": "31792461840442",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:09.181Z",
    "updatedAt": "2020-07-17T04:15:12.983Z"
  },
  {
    "shopify_title": "Beans Green",
    "shopify_id": "4502212771898",
    "shopify_handle": "beans-green",
    "shopify_variant_id": "31792461316154",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:04.332Z",
    "updatedAt": "2020-07-17T04:15:12.725Z"
  },
  {
    "shopify_title": "Beans Yellow",
    "shopify_id": "4502212804666",
    "shopify_handle": "beans-yellow",
    "shopify_variant_id": "31792461348922",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:04.315Z",
    "updatedAt": "2020-07-13T00:53:24.413Z"
  },
  {
    "shopify_title": "Beetroot",
    "shopify_id": "4502212051002",
    "shopify_handle": "beetroot",
    "shopify_variant_id": "31792459677754",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:56.653Z",
    "updatedAt": "2020-07-13T00:52:28.401Z"
  },
  {
    "shopify_title": "Brocolli",
    "shopify_id": "4502212902970",
    "shopify_handle": "brocolli",
    "shopify_variant_id": "31792461447226",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:05.418Z",
    "updatedAt": "2020-07-13T00:53:29.832Z"
  },
  {
    "shopify_title": "Brussels Sprouts",
    "shopify_id": "4502212870202",
    "shopify_handle": "brussels-sprouts",
    "shopify_variant_id": "31792461414458",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:05.030Z",
    "updatedAt": "2020-07-13T00:53:29.402Z"
  },
  {
    "shopify_title": "Cabbage",
    "shopify_id": "4502212837434",
    "shopify_handle": "cabbage",
    "shopify_variant_id": "31792461381690",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:04.843Z",
    "updatedAt": "2020-07-13T00:53:29.842Z"
  },
  {
    "shopify_title": "Capsicum",
    "shopify_id": "4502213754938",
    "shopify_handle": "capsicum",
    "shopify_variant_id": "31792462954554",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:12.573Z",
    "updatedAt": "2020-07-13T00:54:25.912Z"
  },
  {
    "shopify_title": "Carrots",
    "shopify_id": "4502212575290",
    "shopify_handle": "carrots",
    "shopify_variant_id": "31792460660794",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:02.370Z",
    "updatedAt": "2020-07-13T00:53:14.406Z"
  },
  {
    "shopify_title": "Cauliflower",
    "shopify_id": "4502213066810",
    "shopify_handle": "cauliflower",
    "shopify_variant_id": "31792461611066",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:06.440Z",
    "updatedAt": "2020-07-13T00:53:45.259Z"
  },
  {
    "shopify_title": "Cavolonero Kale",
    "shopify_id": "4502212214842",
    "shopify_handle": "cavolonero-kale",
    "shopify_variant_id": "31792460267578",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:58.224Z",
    "updatedAt": "2020-07-13T00:52:38.665Z"
  },
  {
    "shopify_title": "Celeriac",
    "shopify_id": "4502213034042",
    "shopify_handle": "celeriac",
    "shopify_variant_id": "31792461578298",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:06.574Z",
    "updatedAt": "2020-07-13T00:53:39.930Z"
  },
  {
    "shopify_title": "Celery",
    "shopify_id": "4502213001274",
    "shopify_handle": "celery",
    "shopify_variant_id": "31792461545530",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:05.911Z",
    "updatedAt": "2020-07-13T00:53:39.666Z"
  },
  {
    "shopify_title": "Cucumber",
    "shopify_id": "4502212968506",
    "shopify_handle": "cucumber",
    "shopify_variant_id": "31792461512762",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:05.765Z",
    "updatedAt": "2020-07-13T00:53:34.778Z"
  },
  {
    "shopify_title": "Curly Kale",
    "shopify_id": "4502213165114",
    "shopify_handle": "curly-kale",
    "shopify_variant_id": "31792461709370",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:07.835Z",
    "updatedAt": "2020-07-13T00:53:50.273Z"
  },
  {
    "shopify_title": "Dill",
    "shopify_id": "4502212116538",
    "shopify_handle": "dill",
    "shopify_variant_id": "31792459776058",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:57.162Z",
    "updatedAt": "2020-07-13T00:52:33.593Z"
  },
  {
    "shopify_title": "Eggplant",
    "shopify_id": "4502212935738",
    "shopify_handle": "eggplant",
    "shopify_variant_id": "31792461479994",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:05.678Z",
    "updatedAt": "2020-07-13T00:53:34.470Z"
  },
  {
    "shopify_title": "Fennel",
    "shopify_id": "4502212247610",
    "shopify_handle": "fennel",
    "shopify_variant_id": "31792460300346",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:58.511Z",
    "updatedAt": "2020-07-13T00:52:43.601Z"
  },
  {
    "shopify_title": "Garlic",
    "shopify_id": "4502213132346",
    "shopify_handle": "garlic",
    "shopify_variant_id": "31792461676602",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:07.628Z",
    "updatedAt": "2020-07-13T00:53:50.054Z"
  },
  {
    "shopify_title": "Kohlrabi",
    "shopify_id": "4502213722170",
    "shopify_handle": "kohlrabi",
    "shopify_variant_id": "31792462921786",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:12.071Z",
    "updatedAt": "2020-07-13T00:54:25.492Z"
  },
  {
    "shopify_title": "Leek",
    "shopify_id": "4502213197882",
    "shopify_handle": "leek",
    "shopify_variant_id": "31792461742138",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:08.136Z",
    "updatedAt": "2020-07-13T00:53:54.992Z"
  },
  {
    "shopify_title": "Lettuce",
    "shopify_id": "4502212280378",
    "shopify_handle": "lettuce",
    "shopify_variant_id": "31792460333114",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:58.710Z",
    "updatedAt": "2020-07-13T00:52:48.672Z"
  },
  {
    "shopify_title": "Microgreens",
    "shopify_id": "4502213263418",
    "shopify_handle": "microgreens",
    "shopify_variant_id": "31792461807674",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:08.996Z",
    "updatedAt": "2020-07-13T00:53:55.414Z"
  },
  {
    "shopify_title": "Onions Brown",
    "shopify_id": "4502212182074",
    "shopify_handle": "onions-brown",
    "shopify_variant_id": "31792460234810",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:57.578Z",
    "updatedAt": "2020-07-13T00:52:38.871Z"
  },
  {
    "shopify_title": "Onions Red",
    "shopify_id": "4502212706362",
    "shopify_handle": "onions-red",
    "shopify_variant_id": "31792461250618",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:03.258Z",
    "updatedAt": "2020-07-13T00:53:19.149Z"
  },
  {
    "shopify_title": "Pak Choi",
    "shopify_id": "4502212313146",
    "shopify_handle": "pak-choi",
    "shopify_variant_id": "31792460365882",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:59.523Z",
    "updatedAt": "2020-07-13T00:52:48.875Z"
  },
  {
    "shopify_title": "Parsley",
    "shopify_id": "4502212149306",
    "shopify_handle": "parsley",
    "shopify_variant_id": "31792460202042",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:57.413Z",
    "updatedAt": "2020-07-13T00:52:33.310Z"
  },
  {
    "shopify_title": "Parsnips",
    "shopify_id": "4502212378682",
    "shopify_handle": "parsnips",
    "shopify_variant_id": "31792460431418",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:52:59.961Z",
    "updatedAt": "2020-07-13T00:52:59.518Z"
  },
  {
    "shopify_title": "Pears Burre Bosc",
    "shopify_id": "4502212509754",
    "shopify_handle": "pears-burre-bosc",
    "shopify_variant_id": "31792460562490",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:02.235Z",
    "updatedAt": "2020-07-13T00:53:09.378Z"
  },
  {
    "shopify_title": "Peas",
    "shopify_id": "4502213394490",
    "shopify_handle": "peas",
    "shopify_variant_id": "31792461873210",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:09.464Z",
    "updatedAt": "2020-07-13T00:54:00.129Z"
  },
  {
    "shopify_title": "Pumpkin Butternut",
    "shopify_id": "4502212411450",
    "shopify_handle": "pumpkin-butternut",
    "shopify_variant_id": "31792460464186",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:00.637Z",
    "updatedAt": "2020-07-13T00:52:59.316Z"
  },
  {
    "shopify_title": "Pumpkin Crown",
    "shopify_id": "4502212444218",
    "shopify_handle": "pumpkin-crown",
    "shopify_variant_id": "31792460496954",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:00.772Z",
    "updatedAt": "2020-07-13T00:53:04.479Z"
  },
  {
    "shopify_title": "Purple Heart Potatoes",
    "shopify_id": "4502213460026",
    "shopify_handle": "purple-heart-potatoes",
    "shopify_variant_id": "31792462594106",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:09.996Z",
    "updatedAt": "2020-07-13T00:54:05.434Z"
  },
  {
    "shopify_title": "Radishes",
    "shopify_id": "4502213689402",
    "shopify_handle": "radishes",
    "shopify_variant_id": "31792462889018",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:11.680Z",
    "updatedAt": "2020-07-13T00:54:25.738Z"
  },
  {
    "shopify_title": "Red Chard",
    "shopify_id": "4502212640826",
    "shopify_handle": "red-chard",
    "shopify_variant_id": "31792460693562",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:03.054Z",
    "updatedAt": "2020-07-13T00:53:14.007Z"
  },
  {
    "shopify_title": "Seeded Sourdough Bread",
    "shopify_id": "4502212542522",
    "shopify_handle": "seeded-sourdough-bread",
    "shopify_variant_id": "31792460595258",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:02.520Z",
    "updatedAt": "2020-07-13T00:53:09.579Z"
  },
  {
    "shopify_title": "Shallots",
    "shopify_id": "4502213787706",
    "shopify_handle": "shallots",
    "shopify_variant_id": "31792462987322",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:12.746Z",
    "updatedAt": "2020-07-13T00:54:25.921Z"
  },
  {
    "shopify_title": "Silverbeet",
    "shopify_id": "4502212739130",
    "shopify_handle": "silverbeet",
    "shopify_variant_id": "31792461283386",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:04.123Z",
    "updatedAt": "2020-07-13T00:53:24.743Z"
  },
  {
    "shopify_title": "Snow Peas",
    "shopify_id": "4502213427258",
    "shopify_handle": "snow-peas",
    "shopify_variant_id": "31792462135354",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:09.794Z",
    "updatedAt": "2020-07-13T00:54:00.421Z"
  },
  {
    "shopify_title": "Spinach",
    "shopify_id": "4502213492794",
    "shopify_handle": "spinach",
    "shopify_variant_id": "31792462692410",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:10.340Z",
    "updatedAt": "2020-07-13T00:54:10.153Z"
  },
  {
    "shopify_title": "Spring Onions",
    "shopify_id": "4502212673594",
    "shopify_handle": "spring-onions",
    "shopify_variant_id": "31792460988474",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:03.327Z",
    "updatedAt": "2020-07-13T00:53:19.398Z"
  },
  {
    "shopify_title": "Swedes",
    "shopify_id": "4502213656634",
    "shopify_handle": "swedes",
    "shopify_variant_id": "31792462856250",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:11.811Z",
    "updatedAt": "2020-07-13T00:54:20.822Z"
  },
  {
    "shopify_title": "Sweet Corn",
    "shopify_id": "4502213591098",
    "shopify_handle": "sweet-corn",
    "shopify_variant_id": "31792462790714",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:11.108Z",
    "updatedAt": "2020-07-13T00:54:20.489Z"
  },
  {
    "shopify_title": "Tomatoes",
    "shopify_id": "4502213525562",
    "shopify_handle": "tomatoes",
    "shopify_variant_id": "31792462725178",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:10.297Z",
    "updatedAt": "2020-07-13T00:54:10.446Z"
  },
  {
    "shopify_title": "Turnips",
    "shopify_id": "4502213558330",
    "shopify_handle": "turnips",
    "shopify_variant_id": "31792462757946",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:10.600Z",
    "updatedAt": "2020-07-13T00:54:10.569Z"
  },
  {
    "shopify_title": "Watermelon",
    "shopify_id": "4502213230650",
    "shopify_handle": "watermelon",
    "shopify_variant_id": "31792461774906",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:08.477Z",
    "updatedAt": "2020-07-13T00:53:55.330Z"
  },
  {
    "shopify_title": "Yams",
    "shopify_id": "4502213623866",
    "shopify_handle": "yams",
    "shopify_variant_id": "31792462823482",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:11.330Z",
    "updatedAt": "2020-07-13T00:54:20.686Z"
  },
  {
    "shopify_title": "Zucchini",
    "shopify_id": "4502213099578",
    "shopify_handle": "zucchini",
    "shopify_variant_id": "31792461643834",
    "shopify_price": 450,
    "available": true,
    "createdAt": "2020-07-04T11:53:07.220Z",
    "updatedAt": "2020-07-13T00:53:45.004Z"
  }
]
      , {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Products', null, {});
    }
  };
  
