import { openWeatherKey, geoApiKey } from './config.js'

class App {
    //outputs
    static outputDay = document.getElementById('day')
    static outputDate = document.getElementById('date')
    static outputClock = document.getElementById('clock')
    static outputCity = document.getElementById('city')
    static outputDegrees = document.getElementById('degrees')
    static outputClouds = document.getElementById('clouds')
    static outputHumidity = document.getElementById('humidity')
    static outputWind = document.getElementById('wind')

    constructor(dev = 0, lang = 'en', city = 'Kraków', date = new Date()) {
        // date varibles
        this.dayNumber = date.getDay() // 0-6, starting from Saturday
        this.dayOfTheMonth = date.getDate() // 1-31
        this.monthNumber = date.getMonth() // 0-11
        this.year = date.getFullYear() // e.g. 2023
        date.getHours() < 10 ? this.hours = '0' + String(date.getHours()) : this.hours = date.getHours() // 00 - 23
        date.getMinutes() < 10 ? this.minutes = '0' + String(date.getMinutes()) : this.minutes = date.getMinutes() // 00 - 59
        this.seconds = date.getSeconds()
        this.date = new Date(this.year, this.monthNumber + 1, 0) // actual date
        this.daysInMonth = this.date.getDate() // days in current month

        // main variables
        this.dev = dev
        this.lang = lang
        this.city = city

        // main methods
        this.updateClock = function() {
            if(this.dev){
                console.groupCollapsed('Time Data:')
                    console.log('hours', this.hours);
                    console.log('minutes', this.minutes);
                    console.log('seconds', this.seconds);
                console.groupEnd('Date Data:')
            }

            App.outputClock.innerHTML = App.outputClock.innerHTML = this.hours + ':' + this.minutes
        }

        this.updateDate = function() {
            if(this.dev){
                console.groupCollapsed('Date Data:')
                    console.log('day number', this.dayNumber);
                    console.log('day of the month', this.dayOfTheMonth);
                    console.log('month number', this.monthNumber);
                    console.log('year', this.year);
                console.groupEnd('Date Data:')
            }
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

            App.outputDay.innerHTML = days[this.lang][this.dayNumber]
            App.outputDate.innerHTML = this.dayOfTheMonth + ' ' + months[this.lang][this.monthNumber] + " '" + String(this.year).substring(2, 4)
        }

        this.updateClock()
    }

    updateMinutes() {
        this.minutes++

        this.minutes == 60 ? this.updateHours() : 0
        this.minutes = this.minutes % 60
        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes

        this.updateClock()
    }

    updateHours() {
        this.hours++

        this.hours == 24 ? this.updateDay() : 0
        this.hours = this.hours % 24
        this.hours = this.hours < 10 ? '0' + this.hours : this.hours
    }

    updateDay() {
        this.dayNumber++

        this.dayNumber == this.daysInMonth ? this.updateMonth() : 0
        this.dayNumber = this.dayNumber % this.daysInMonth
        this.dayNumber = this.dayNumber < 10 ? '0' + this.dayNumber : this.dayNumber
    }

    updateMonth() {
        this.monthNumber++
        this.daysInMonth = this.date.getDate()

        this.monthNumber == 11 ? this.updateYear() : 0
        this.dayNumber = this.dayNumber % 12
    }

    updateCity(city) {
        this.city = city
        App.outputCity.innerHTML = this.city
    }

    updateLang(lang) {
        this.lang = lang
        this.updateDate()
    }

    updateDegress(val) {
        App.outputDegrees.innerHTML = `${val}&deg;`
    }

    updateClouds(val) {
        App.outputClouds.innerHTML = `${val}%`
    }

    updateHumidity(val) {
        App.outputHumidity.innerHTML = `${val}%`
    }

    updateWind(val) {
        App.outputWind.innerHTML = `${val}km/h`
    }

    updateTime(){

    }

    calcTimeChange() {
        
    }

    async getWeatherData(city = this.city) {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=metric`)
        const output = await res.json()
        if(this.dev){
            console.groupCollapsed('Weather Data:')
                console.log('base:', output.base)
                console.group('clouds')
                    console.log('%call:', 'background-color: darkgreen', output.clouds.all)
                console.groupEnd('clouds')
                console.log('cod:', output.cod);
                console.groupCollapsed('coord')
                    console.log('lat:', output.coord.lat)
                    console.log('lon:', output.coord.lon)
                console.groupEnd('coord')
                console.log('dt:', output.dt);
                console.log('id:', output.id);
                console.group('main')
                    console.log('feels_like:', output.main.feels_like)
                    console.log('grnd_level:', output.main.grnd_level)
                    console.log('%chumidity:','background-color: darkgreen', output.main.humidity)
                    console.log('pressure:', output.main.pressure)
                    console.log('sea_level:', output.main.sea_level)
                    console.log('%ctemp:', 'background-color: darkgreen', output.main.temp)
                    console.log('temp_max:', output.main.temp_max)
                    console.log('temp_min:', output.main.temp_min)
                    console.groupEnd('main')
                console.log('%cname:', 'background-color: darkgreen', output.name)
                console.groupCollapsed('sys')
                    console.log('country:', output.sys.country)
                    console.log('id:', output.sys.id)
                    console.log('sunrise:', output.sys.sunrise)
                    console.log('sunset:', output.sys.sunset)
                    console.log('type:', output.sys.type)
                console.groupEnd('sys')
                console.log('timezone', output.timezone)
                console.log('visibility', output.visibility)
                console.groupCollapsed('weather')
                    console.log('description:',output.weather[0].description);
                    console.log('icon:',output.weather[0].icon);
                    console.log('id:',output.weather[0].id);
                    console.log('main:',output.weather[0].main);
                console.groupEnd('weather')
                console.group('wind')
                    console.log('deg:', output.wind.deg)
                    console.log('gust:', output.wind.gust)
                    console.log('%cspeed:', 'background-color: darkgreen', output.wind.speed)
                console.groupEnd('wind')
            console.groupEnd('Weather Data:')
        }
        this.updateDegress(Math.ceil(output.main.temp))
        this.updateClouds(output.clouds.all)
        this.updateHumidity(output.main.humidity)
        this.updateWind(output.wind.speed)
    }

    async getUserData() {
        const data = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${geoApiKey}`)
        .then(response => response.json())
        .then(data => {
            if(this.dev)
            {
                console.groupCollapsed('User Data')
                console.table(data);
                console.groupEnd('User Data')
            }
            this.updateCity(data.city.name)
            this.updateLang(data.country.languages[0]['iso_code'])
            this.getWeatherData()
        })
        .catch(error => {
            console.log('error :>> ', error);
        })
    }
    
    start() {
        this.getUserData()

        setTimeout(() => {   
            this.seconds = 0
            this.updateMinutes()
            setInterval(() => {
                this.updateMinutes()
            }, 60000)
        },((60 - this.seconds) * 1000))
    }
}

const app = new App(1)

app.start()

const cities = document.getElementById('cities')
const citiesNames = cities.querySelectorAll('li')

citiesNames.forEach(element => {
    element.addEventListener('click', e => {
        app.updateCity(e.target.innerHTML)
        app.getWeatherData()
    })
});