/*
A minimal Web Bluetooth connection example

created 6 Aug 2018
by Tom Igoe
*/
var myDevice;
var myService = 0x181a;        // fill in a service you're looking for here
var myCharacteristic = 0xffb2;   // fill in a characteristic from the service here
let currentDate = new Date(); 
let words=[ "Yes","No","Hello","Please","Thank You","Help","All Done","Wait","Hungry","Thirsty", "Hungry", "I Love You","My Turn","Quiet","More"]

const intervalHandle = setInterval(update, 1000);
// clearInterval(intervalHandle);

//arrays of arrays
let buttonCache=new Set([]);
//will update the history with recieved information
function update(){
  if(buttonCache.size>0){
//remove duplicates
//buttonCache.filter((item,index) => buttonCache.indexOf(item) === index);
console.log(buttonCache)


let wordnum = 0;
buttonCache.forEach (function(value) {
  wordnum+=2**(value-1);
})

//html magic which inputs variable

//eample of something likened to <p1>= words[wordnum]

    console.log(wordnum)
    console.log(words[wordnum])

    const elem = document.getElementById("message")
    let prev = elem.innerHTML;
    let newStuff = " " + words[wordnum] + "\n" + prev;
    elem.innerHTML = newStuff


    buttonCache=new Set([]);
}
}


   

function connect(){
  navigator.bluetooth.requestDevice({
	filters: [
	{ services: [0x181a] },
    { name: "mpy-uart" },
	{ services: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"] },
    { namePrefix: "Prefix" }],
	
	  
    //filters: ["mpy-uart"]       // you can't use filters and acceptAllDevices together
    optionalServices: [myService]
    //acceptAllDevices: true
  })
  .then(function(device) {
    // save the device returned so you can disconnect later:
    myDevice = device;
    console.log(device);
    // connect to the device once you find it:
    return device.gatt.connect();
  })
  .then(function(server) {
    // get the primary service:
    return server.getPrimaryService(myService);
  })
  .then(function(service) {
     //get the  characteristic:
    return service.getCharacteristics();
  })
  .then(function(characteristics) {
     //subscribe to the characteristic:
    for (c in characteristics) {
      characteristics[c].startNotifications()
      .then(subscribeToChanges);
    }
  })
  .catch(function(error) {
    // catch any errors:
    console.error('Connection failed!', error);
	//console.log(error);
  });
}

// subscribe to changes from the meter:
function subscribeToChanges(characteristic) {
  console.log(characteristic)
  characteristic.oncharacteristicvaluechanged = handleData;
}

// handle incoming data:
function handleData(event) {
  // get the data buffer from the meter:
  //var buf = new Uint8Array(event.target.value);

  const elem = document.getElementById("text")
  //elem.innerHTML = event.target.value.getUint8(0)

  const data = []

  let mystr = ""

  for (let i = 0; i < event.target.value.byteLength; i++) {
    data[i] = event.target.value.getUint8(i)
    mystr += String.fromCharCode(event.target.value.getUint8(i));
  } 
    let arr=[];
    arr= mystr.split('');

    buttonCache.add(arr[1])
  

    //wont update html if the mystr data is 0, which should be the majority of the time

    //array[1] is the int of button
  




  //console.log(buf[0]);
  console.log(event.target)
}


// disconnect function:
function disconnect() {
  if (myDevice) {
    // disconnect:
    myDevice.gatt.disconnect();
  }
}