import { openWeatherKey } from './config.js'

class App {
    //outputs
    static outputDay = document.getElementById('day')
    static outputDate = document.getElementById('date')
    static outputClock = document.getElementById('clock')
    static outputCity = document.getElementById('city')
    static outputDegrees = document.getElementById('degrees')

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
        this.lang = lang
        this.city = city

        // main methods
        this.updateClock = function() {
            if(dev){
                console.table({
                    'hours': this.hours,
                    'minutes': this.minutes,
                    'seconds': this.seconds
                })
            }

            App.outputClock.innerHTML = App.outputClock.innerHTML = this.hours + ':' + this.minutes
        }

        this.updateDate = function() {
            if(dev){
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

        this.updateCity = function() {
            this.city = 
            App.outputCity.innerHTML = this.city
        }

        this.updateClock()
        this.updateDate()
        this.updateCity()
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

    async getWeatherData() {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${openWeatherKey}&units=metric`)
        const output = await res.json()
        console.log(output)
    }
    
    start() {  
        setTimeout(() => {   
            this.seconds = 0
            this.updateMinutes()
            setInterval(() => {
                this.updateMinutes()
            }, 60000)
        },((60 - this.seconds) * 1000))
    }
}

const app = new App(1, 'en')

app.start()