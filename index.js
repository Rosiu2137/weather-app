const checkWeather = document.querySelector("#checkWeather")
const checkWeather2 = document.querySelector("#checkWeather2")
const cityError = document.querySelector(".error")
const cityError2 = document.querySelector("#error2")
const container1 = document.querySelector(".container")
const container2 = document.querySelector(".container2")
const apiKey = `7d658a61f5cf4e228d6191708240909`
let searched = false


const errors = [
    "Wprowadź nazwę miejscowości",
    "Nie znaleziono podanej miejscowości"
]

const animations = ()=>
{
    let time = 0
    const el = [...document.querySelectorAll(".el")]
    el.forEach(x=>{
        setTimeout(() => {
            x.style.opacity = 1
        }, time+=300);
    })
}

const replacePolishCharacters = (city)=>
{
    const newCity = city.toLowerCase().replace("ą","a").replace("ć","c").replace("ę","e").replace("ł","l").replace("ó","o").replace("ż","z").replace("ź","z").replace("ń","n").replace("ś","s")
    return newCity
}

const getLocalTimeAndLocate = (value,action) =>
{
    switch(action)
    {
        case "time":
            const newValue = value.split("")
            newValue.splice(0,11)
            return newValue.join("")
        case "date":
            const newDate = value.split("")
            const newNewValue = newDate.slice(0,10)
            const date = [newNewValue[8],newNewValue[9],".",newNewValue[5],newNewValue[6],".",newNewValue[0],newNewValue[1],newNewValue[2],newNewValue[3]]
            return date.join("")
    }
}

const setPolishNamesOfWindDirection = (value)=>
{
    if(value.length > 2)
    {
        value = [...value]
        value.splice(0,1)
        value = value.join("")
    }
    if(value == "N")
    {
        return "Północny"
    }
    else if(value == "S")
    {
        return "Południowy"
    }
    else if(value == "W")
    {
        return "Zachodni"
    }
    else if(value == "E")
    {
        return "Wschodni"
    }
    else if(value == "NW")
    {
        return "Północno-zachodni"
    }
    else if(value == "NE")
    {
        return "Północno-wschodni"
    }
    else if(value == "SE")
    {
        return "Południowo-wschodni"
    }
    else if(value == "SW")
    {
        return "Południowo-zachodni"
    }
}

const setPolishFormatDate = (date)=>
{
    const arr = [...date]
    return [arr[11],arr[12],":",arr[14],arr[15]," ",arr[8],arr[9],".",arr[5],arr[6],".",arr[0],arr[1],arr[2],arr[3]].join("")
}

const displayWeatherInfo = async(obj)=>
{
    window.scrollTo(0,0)
    document.querySelector("#city2").value = ""
    const city = document.querySelector(".city")
    const mainLocation = document.querySelector("#mainLocation")
    if(searched)
    {
        mainLocation.innerHTML = `<img src="" id="imgConditions">`
    }
    const conditions = document.querySelector("#conditions")
    const imgConditions = document.querySelector("#imgConditions")
    const country = document.querySelector("#country")
    const time = document.querySelector("#time")
    const date = document.querySelector("#date")
    const timeZone = document.querySelector("#timeZone")
    const temperature = document.querySelector("#temperature")
    const temperatureFeel = document.querySelector("#temperatureFeel")
    const humidity = document.querySelector("#humidity")
    const pressure = document.querySelector("#pressure")
    const rain = document.querySelector("#rain")
    const windSpeed = document.querySelector("#windSpeed")
    const windDirection = document.querySelector("#windDirection")
    const responsiveBackground = document.querySelector(".responsiveBackground")
   
    const cloud = document.querySelector("#cloud")
    const lastAct = document.querySelector("#lastAct")
    container1.style.display = `none`
    container2.style.display = `grid`

    if(window.innerWidth <= 768)
    {
        responsiveBackground.style.display = "block"
    }

    conditions.innerHTML = obj.current.condition.text
   
    imgConditions.src = obj.current.condition.icon

    mainLocation.innerHTML += obj.location.name
    setTimeout(() => {
        city.style.opacity = `1`
        
    }, 10);


    const timeZoneFormation = obj.location.tz_id.split('/').join(" / ")
    timeZone.innerHTML = timeZoneFormation
    time.innerHTML = getLocalTimeAndLocate(obj.location.localtime,"time")
    date.innerHTML = getLocalTimeAndLocate(obj.location.localtime,"date")
    country.innerHTML =obj.location.country
    temperature.innerHTML = `${obj.current.temp_c}&degC`
    temperatureFeel.innerHTML = `${obj.current.feelslike_c}&degC`
    humidity.innerHTML = `${obj.current.humidity}%`
    pressure.innerHTML = `${obj.current.pressure_mb} hPa`
    rain.innerHTML = `${obj.current.precip_mm} mm`
    windSpeed.innerHTML = `${obj.current.wind_kph} km/h`
    windDirection.innerHTML = setPolishNamesOfWindDirection(obj.current.wind_dir)
    cloud.innerHTML = `${obj.current.cloud}%`
    lastAct.innerHTML = `${setPolishFormatDate(obj.current.last_updated)}`
    animations()
    searched = true
}


const getWeather = (city)=>
{
    return new Promise(async(resolve,reject)=>{
        try
        {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=pl`)
            resolve(response.json())
        }
        catch(ex)
        {
            reject()
        }
    })
}

const checkCity =async()=>
{
    let cityLocal
    if(searched)
    {
        cityLocal = (document.querySelector("#city2").value).trim()
    }
    else
    {
         cityLocal = (document.querySelector("#city").value).trim()

    }
    if(city == "")
    {
       cityError.innerHTML = errors[0]
       cityError.classList.add("displayError")
    }
    else
    {
        const cityEN = replacePolishCharacters(cityLocal)
        cityError.innerHTML = ""
        cityError2.innerHTML = ""
        try
        {
            const response = await getWeather(cityEN)
            if(!response)
            {
                throw new Error()
            }
            displayWeatherInfo(response)
        }
        catch(ex)
        {
            if(searched)
            {
                cityError2.innerHTML = errors[1]
            }
            else
            {

            }
            cityError.innerHTML = errors[1]
            cityError.classList.add("displayError")
        }
    }
}

checkWeather.addEventListener("click",checkCity)
checkWeather2.addEventListener("click",checkCity)



const checkPressedKey = (e)=>
{
    if(e.key=="Enter")
    {
        checkCity()
    }
}

window.addEventListener("keydown",checkPressedKey)