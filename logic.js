'use strict';

let jsonn = '{"consumption" : {"50": 140, "60": 146, "70": 152, "80": 160, "90": 170, "100": 180, "110": 195, "120": 210, "130": 225, "140": 250}, "chargingPercents" : [3, 6, 9, 13, 18, 24, 31, 39, 48, 58, 69, 81, 94, 108, 123, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 145, 140, 135, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 63, 60, 58, 56, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3]}'

// jsonn

function run() {
    document.querySelector(".results").innerHTML = ""
    let battery = document.querySelector('.battery').value // kwh
    let reserve = document.querySelector('.reserve').value // percentages
    let reservedBattery = battery / 100 * reserve //kwh
    let distance = document.querySelector('.distance').value //km
    let maxChargeSpeed = document.querySelector('.maxChargeSpeed').value //kwh highest station can provide
    let startingPercentage = document.querySelector('.startingPercentage').value // percentages
    let maxPercentageWhenCharging = document.querySelector('.maxPercentageWhenCharging').value // percentages
    let startUsableBattery = battery * startingPercentage / 100 - reservedBattery //kwh
    let usableBattery = battery * maxPercentageWhenCharging / 100 - reservedBattery //kwh 
    let optimalSpeed = [0, 999999999] // искомое значение
    let recomendedSpeed = [0, 999999999, 0] // искомое значение
    let stopExtraTime = document.querySelector('.stopExtraTime').value //min
    let obj = JSON.parse(jsonn);
    let consumption = obj.consumption;
    let chargingPercents = obj.chargingPercents;
    // let consumption = {
    //     50: 140,
    //     60: 146,
    //     70: 152,
    //     80: 160,
    //     90: 170,
    //     100: 180,
    //     110: 195,
    //     120: 210,
    //     130: 225,
    //     140: 250
    // }

    let result = {
        "speed": 0,
        "drivingTime": 0,
        "stops": 0,
        "eachStopTime": 0,
        "totalStopTime": 0,
        "totalTime": 0
    }

    // let chargingPercents = [3, 6, 9, 13, 18, 24, 31, 39, 48, 58, 69, 81, 94, 108, 123, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 145, 140, 135, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 63, 60, 58, 56, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3]


    for (let speed in consumption) {
        result.speed = speed
        let hours = time(speed)
        if (optimalSpeed[1] > hours) {
            optimalSpeed = [speed, hours]
        }

        let soStops
        if ((result.stops - parseInt(result.stops)) > 0) {
            soStops = parseInt(result.stops) + 1
        } else {
            soStops = result.stops
        }

        if (result.stops == "No stops") {
            result.totalStopTime = 0
            result.eachStopTime = 0
        }

        console.log(`
        Cкорость: ${result.speed}
        Время в движении: ${result.drivingTime}
        Количество остановок: ${result.stops}
        Средняя длительность полной остановки: ${result.eachStopTime}
        Общее время на остановки: ${result.totalStopTime}
        Общее время в пути: ${result.totalTime}`);

        document.querySelector(".results").insertAdjacentHTML("beforeend", `<div class="main_interface sizeForResults">
        <div class="result_element">
            <span>Швидкість: </span><span class="speed report">${result.speed} км/г</span>
        </div>
        <div class="result_element">
            <span>Прогнозований час на маршрут: </span><span class="report">${convertedTime(result.totalTime)}</span>
        </div>
        <div class="result_element">
            <span>Кількість зупинок: </span><span class="report">${soStops}</span>
        </div>
        <hr>
        <div class="result_element">
            <span class="repot_small">Прогнозована тривалість зупинки: </span><span class="repot_small">${convertedTime(result.eachStopTime)}</span>
        </div>
        <div class="result_element">
            <span class="repot_small">Прогнозований час в русі: </span><span class="repot_small">${convertedTime(result.drivingTime)}</span>
        </div>
        <div class="result_element">
            <span class="repot_small">Прогнозований час на зупинки: </span><span class="repot_small">${convertedTime(result.totalStopTime)}</span>
        </div>
    </div>`)

        if (soStops != parseFloat(soStops)) {
            soStops = 0
        }
        if (recomendedSpeed[1] > hours && recomendedSpeed[2] == soStops) {
            recomendedSpeed = [speed, hours, soStops]
        } else if (recomendedSpeed[1] > hours * 1.2 && recomendedSpeed[2] <= soStops * 0.9 && recomendedSpeed[2] < soStops) {
            recomendedSpeed = [speed, hours, soStops]
        }
    }


    function convertedTime(timeToConvert) {
        let convertedTime = parseInt(timeToConvert) + ":";
        if (Math.round((timeToConvert - parseInt(timeToConvert)) * 60) == 0) {
            convertedTime += "00";
        } else if (Math.round((timeToConvert - parseInt(timeToConvert)) * 60) < 10) {
            convertedTime += "0" + Math.round((timeToConvert - parseInt(timeToConvert)) * 60);
        } else {
            convertedTime += Math.round((timeToConvert - parseInt(timeToConvert)) * 60);
        }
        return convertedTime;
    }

    function time(speed) {
        result.drivingTime = distance / speed
        if ((distance * consumption[speed]) / (startUsableBattery * 1000) < 1) {
            result.totalTime = result.drivingTime
            result.eachStopTime = "No stops"
            result.stops = "No stops"
            result.totalStopTime = "No stops"
            return result.totalTime
        }
        result.stops = ((distance * consumption[speed]) - startUsableBattery * 1000) / (usableBattery * 1000)
        result.totalTime = result.drivingTime + chargingStops()
        return result.totalTime
    }

    function chargingStops() {
        let fullChargeSession = parseInt(result.stops)
        let partialChargeSession = (result.stops - fullChargeSession) * maxPercentageWhenCharging
        let fullSessionLenght = charging(maxPercentageWhenCharging)
        let partialSessionLenght = charging(partialChargeSession)
        if (fullChargeSession > 0) {
            result.eachStopTime = +fullSessionLenght + +stopExtraTime / 60
            result.totalStopTime = +result.eachStopTime * parseInt(result.stops) + partialSessionLenght
            if (partialSessionLenght > 0) {
                result.totalStopTime += stopExtraTime / 60
            }
        } else {
            result.eachStopTime = +partialSessionLenght + +stopExtraTime / 60
            result.totalStopTime = result.eachStopTime
        }
        return result.totalStopTime
    }

    function charging(chargedPerSession) {
        let onePercent = battery / 100
        let total = 0
        for (let i in chargingPercents) {
            if (i > reserve && i <= chargedPerSession) {
                if (chargingPercents[i] < maxChargeSpeed) {
                    total += onePercent / chargingPercents[i]
                } else {
                    total += onePercent / maxChargeSpeed
                }
            }
        }
        return total
    }
    console.log(`Вирахувана оптимальна швидкість ${optimalSpeed[0]} вимагатиме ${optimalSpeed[1]} годин`);
    console.log(`Recomended speed is ${recomendedSpeed[0]} and it would consume ${recomendedSpeed[1]} hours`);
    document.querySelector(".bestOption").innerHTML = `<span>Вирахувана оптимальна швидкість <b> &nbsp;${optimalSpeed[0]} </b> &nbsp; і вимагатиме <b> &nbsp;${parseInt(optimalSpeed[1])} годин ${Math.round((optimalSpeed[1] - parseInt(optimalSpeed[1])) * 60)} хвилин</b></span>`


    if (recomendedSpeed[0] != optimalSpeed[0]) {
        document.querySelector(".bestOption").innerHTML += `<span>Рекомендована швидкість <b> &nbsp;${recomendedSpeed[0]} </b> &nbsp;і вимагатиме <b> &nbsp;${parseInt(recomendedSpeed[1])} годин ${Math.round((recomendedSpeed[1] - parseInt(recomendedSpeed[1])) * 60)} хвилин </b> &nbsp;через меншу кількість зупинок</span>`
    }

}

function read() {
    const [file] = document.querySelector('input[type=file]').files;
    const reader = new FileReader();
  
    reader.addEventListener("load", () => {
      // this will then display a text file
      jsonn = reader.result;
    }, false);
  
    if (file) {
      reader.readAsText(file);
    }
  }


//   var data;
//   // this is wrong because it has to loop trough all files.
//   fs.readFile(__dirname + '/tmpl/filename.html', 'utf8', function(err, html){
//       if(err) throw err;
//       //filename must be without .html at the end
//       data['filename'] = html;
//   });
//   socket.emit('init', {data: data});