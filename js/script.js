let currentSong=new Audio();
let songs;
let currFolder;

const secondsToMinutes=(Seconds)=>{
    totalSeconds=Math.floor(Seconds)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

   
    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}:${paddedSeconds}`;
}

async function getSongs(folder) {

    currFolder=folder

    let a = await fetch(`../songs${currFolder}`)

    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    songs = []

    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++){
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currFolder}`)[1])
        }
    }

    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=""

    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML + `<li> 
                        <div class="info">
                            <img class="invert" src="img/musicLogo.svg" alt="">
                            <div class="SongInfo">${song.replaceAll("%20"," ")} </div>
                                  
                        </div>
                        <div class="playNow">play Now <img class="invert" src="img/play.svg" alt="">
                        </div>
         </li>`
        
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            // console.log(e.querySelector(".SongInfo").innerHTML.trim())
            playMusic(e.querySelector(".SongInfo").innerHTML.trim())
        })

       
    })
}

const playMusic=(track,pause=false)=>{
   
    currentSong.src=`../songs${currFolder}`+track
    if(!pause){
    currentSong.play()
    play.src="img/pause.svg"
    }
    
    document.querySelector(".songName").innerHTML=decodeURI(track)
    document.querySelector(".songTime").innerHTML="00:00/00:00"
    
    document.querySelector(".range").getElementsByTagName("input")[0].value=100
    currentSong.volume=1;


}

async function displayAlbums(){
    let a = await fetch(`../songs`)

    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer=document.querySelector(".cardHolder")
    //  console.log(anchors)
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("../songs/")){
            // console.log(e.href.split("/").slice(-2)[0]);
            let folder=e.href.split("/").slice(-2)[0];
            let a = await fetch(`../songs/${folder}/info.json`);

            let response = await a.json();
            cardContainer.innerHTML=cardContainer.innerHTML+ `<div data-folder="${folder}" class="card">
               <img class="rounded" src="../songs/${folder}/cover.jpeg" alt="">
                <h4>${response.title}</h4>
                <p>${response.description}</p>
                <div class="play">
                    <svg width="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="none" fill="#1ed760" />
                        <polygon points="40,30 70,50 40,70" fill="black" />
                      </svg>
                    
                </div>
            </div>`

        }
    }

          //load the playlist when card is clicked
          Array.from(document.getElementsByClassName("card")).forEach(e=>{
            // console.log(e)
            e.addEventListener("click",async item=>{
                // console.log(item,item.currentTarget.dataset)
                songs=await getSongs(`../${item.currentTarget.dataset.folder}/`)
            })
        })
   


}




async function main() {
    await getSongs("/copy/")
    console.log(songs)

    playMusic(songs[Math.floor(1+Math.random()*(songs.length-1))],true)

    //Display all the Albumns on the page
    displayAlbums();

   
//    var audio=new Audio(songs[0]);
//    audio.play()

//    audio.addEventListener("loadeddata",()=>{
//     let duration=audio.duration;
//     console.log(duration)
  // })
  play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play();
         play.src="img/pause.svg"
        }
        else{
            currentSong.pause();
            play.src="img/play.svg"
    }
  })


    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML=secondsToMinutes(currentSong.currentTime)+"/"+secondsToMinutes(currentSong.duration)
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let seekbar_pos=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=seekbar_pos+"%"
        currentSong.currentTime=(currentSong.duration*seekbar_pos)/100;
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";

      
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";

    })

    previous.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index-1>=0){
                playMusic(songs[index-1]);
        }
    })
    next.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index+1<songs.length){
                playMusic(songs[index+1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume=(e.target.value)/100;

      
    })

    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("img/volume.svg")){
            e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
            currentSong.volume=0;
        }
        else {
            e.target.src= e.target.src.replace("img/mute.svg","img/volume.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value=20
            currentSong.volume=0.2;
        }
    })
    

}
main()

