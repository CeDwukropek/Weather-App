const date = new Date()


function getActualDate(language = 'en') {
    const dayName = date.getDay()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    //console.log('day :>> ', day);

    const outputDay = document.getElementById('day')
    const outputDate = document.getElementById('date')

    const days = {
        'en': [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thusday',
            'Friday',
            'Saturday'
        ],
        'pl': [
            'Niedziela',
            'Poniedziałek',
            'Wtorek',
            'Środa',
            'Czwartek',
            'Piątek',
            'Sobota'
        ]
    }

    const months = {
        'en': [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec'
        ],
        'pl': [
            'St',
            'Lut',
            'Mrz',
            'Kw',
            'Maj',
            'Cz',
            'Lip',
            'Sier',
            'Wrz',
            'Paź',
            'Lis',
            'Gr'
        ]
    }

    //console.log('days :>> ', days[language][dayName]);
    outputDay.innerHTML = days[language][dayName]
    //console.log(day + ' ' + month + ' ' + year)
    outputDate.innerHTML = day + ' ' + months[language][month] + ' ' + String(year).substring(2, 4)
}

async function getWeatherData(city = 'Kraków') {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=08c558b464289821c6e52c06901f3a97&units=metric`)
    const output = await res.json()
    console.log(output)
}

async function startClock(devMode = 1) {
    let hours = date.getHours()
    hours < 10 ? hours = '0' + String(hours) : hours
    let minutes = date.getMinutes()
    minutes < 10 ? minutes = '0' + String(minutes) : minutes
    var seconds = date.getSeconds()

    const outputClock = document.getElementById('clock')

    outputClock.innerHTML = hours + ':' + minutes

    setInterval(function(){
        minutes++
        minutes == 60 ? hours++ : hours
        minutes = minutes % 60
        minutes < 10 ? '0' + minutes : minutes
        //console.log('minutes :>> ', minutes);
        outputClock.innerHTML = hours + ':' + minutes
    }, 60000);

    if(devMode)
    {
        let secondsCounter = date.getSeconds()
        setInterval(function(){
            secondsCounter = secondsCounter % 60
            console.log('time :>> ', hours + ':' + minutes + ':' + secondsCounter);
            secondsCounter++
        }, 1000)
    }

}

startClock(0)
getActualDate()
//getWeatherData()

