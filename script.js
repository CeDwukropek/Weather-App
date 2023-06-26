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
                console.table({
                    'hours': this.hours,
                    'minutes': this.minutes,
                    'seconds': this.seconds
                })
            }

            App.outputClock.innerHTML = App.outputClock.innerHTML = this.hours + ':' + this.minutes
        }

        this.updateDate = function() {
            if(this.dev){
                console.table({
                    'day number': this.dayNumber,
                    'day of the month': this.dayOfTheMonth,
                    'month number': this.monthNumber,
                    'year': this.year
                });
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

    updateCity(city, lang) {
        this.city = city
        App.outputCity.innerHTML = this.city
        this.updateLang(lang)
    }

    updateLang(lang) {
        this.lang = lang
        this.updateDate()
    }

    updateDegress(deg) {
        App.outputDegrees.innerHTML = `${deg}&deg;`
    }

    updateClouds(val) {
        App.outputClouds.innerHTML = `${val}`
    }

    updateHumidity(val) {
        App.outputHumidity.innerHTML = `${val}%`
    }

    updateWind(val) {
        App.outputWind.innerHTML = `${val}km/h`
    }

    async getWeatherData(city = this.city) {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=metric`)
        const output = await res.json()
        if(this.dev){
            console.log(output)
            console.log('temp:', Math.ceil(output.main.temp))
            console.log('humidity:', output.main.humidity)
        }
        this.updateDegress(Math.ceil(output.main.temp))
        this.updateClouds(output.clouds.all)
        this.updateHumidity(output.main.humidity)
        this.updateWind(output.wind.speed)
    }

    async getUsersData() {
        const data = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${geoApiKey}`)
        .then(response => response.json())
        .then(data => {
            if(this.dev)
            {
                console.table(data);
                console.log('lang :>> ', data.country.languages[0]['iso_code']);
            }
            this.updateCity(data.city.name, data.country.languages[0]['iso_code'])
            this.getWeatherData()
        })
        .catch(error => {
            console.log('error :>> ', error);
        })
    }
    
    start() {
        this.getUsersData()

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
