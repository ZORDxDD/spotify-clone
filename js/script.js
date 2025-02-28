let currentSong = new Audio();
let songs;
let currFolder;

const secondsToMinutes = (Seconds) => {
    totalSeconds = Math.floor(Seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}:${paddedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`https://realnilesh.github.io/spotify-clone/songs${currFolder}`);

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    songs = [];

    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currFolder}`)[1]);
        }
    }

    let songUl = document.querySelector(".songList ul");
    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `<li> 
            <div class="info">
                <img class="invert" src="img/musicLogo.svg" alt="">
                <div class="SongInfo">${song.replaceAll("%20", " ")} </div>
            </div>
            <div class="playNow">play Now <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".SongInfo").innerHTML.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `https://realnilesh.github.io/spotify-clone/songs${currFolder}${track}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songName").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00";

    document.querySelector(".range input").value = 100;
    currentSong.volume = 1;
}

async function displayAlbums() {
    let a = await fetch(`https://realnilesh.github.io/spotify-clone/songs/`);

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardHolder");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`https://realnilesh.github.io/spotify-clone/songs/${folder}/info.json`);

            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                <img class="rounded" src="https://realnilesh.github.io/spotify-clone/songs/${folder}/cover.jpeg" alt="">
                <h4>${response.title}</h4>
                <p>${response.description}</p>
                <div class="play">
                    <svg width="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="none" fill="#1ed760" />
                        <polygon points="40,30 70,50 40,70" fill="black" />
                    </svg>
                </div>
            </div>`;
        }
    }

    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`/${item.currentTarget.dataset.folder}/`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    await getSongs("/copy/");
    console.log(songs);

    playMusic(songs[Math.floor(1 + Math.random() * (songs.length - 1))], true);

    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = secondsToMinutes(currentSong.currentTime) + "/" + secondsToMinutes(currentSong.duration);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let seekbar_pos = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = seekbar_pos + "%";
        currentSong.currentTime = (currentSong.duration * seekbar_pos) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = (e.target.value) / 100;
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            document.querySelector(".range input").value = 0;
            currentSong.volume = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            document.querySelector(".range input").value = 20;
            currentSong.volume = 0.2;
        }
    });
}

main();
