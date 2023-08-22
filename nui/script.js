const container = document.querySelector(".candidates-container");
let startPosition = 0;
let currentTranslate = 0;
let winner
let createDiv

const carousel = document.querySelector(".candidates-container"),
arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const dragStart = (e) => {
    // updatating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
    document.body.style.cursor = "grab";
}

const dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if(!isDragging) return;
    isDragging = false;
    document.body.style.cursor = "default";
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);
// container.addEventListener("mousedown", (event) => {
//   isDragging = true;
//   startPosition = event.clientX;
//   container.classList.add("dragging");
// });

// container.addEventListener("mousemove", (event) => {
//   if (!isDragging) return;
//   const currentPosition = event.clientX;
//   const diff = currentPosition - startPosition;
//   container.scrollLeft = currentTranslate - diff;
// });

// container.addEventListener("mouseup", () => {
//   isDragging = false;
//   container.classList.remove("dragging");
//   currentTranslate = container.scrollLeft;
// });

// container.addEventListener("mouseleave", () => {
//   isDragging = false;
//   container.classList.remove("dragging");
// });

window.addEventListener('message', (event) => {
  const type = event.data.type
  
  if (type == 'press-e') {
    document.getElementById("press-e").style.display = "flex";
    document.getElementById("press-e").textContent = "Press [E] to vote!"
  }

  if(type == 'close-e') {
    document.getElementById("press-e").style.display = "none"
  }

  if (type == "comelater-e") {
    document.getElementById("press-e").textContent = "Come back later!"
    document.getElementById("press-e").style.display = "flex";
  }

  if (type === 'winner') {
    winner = event.data.winner
  }

  if (type == 'resetVote') {
    clearParent(document.getElementById('candidates-container'))
  }

  if (type == 'admin') {
    console.log("31")
    document.getElementById("admin-btn").style.display = "block"
    document.getElementById("candidates-container").style.display = "none"
    document.getElementById("main").style.display = "flex";
    document.querySelector('body').style.display = "flex";
    document.getElementById("admin-menu").style.display = "flex"
    document.getElementById("main-header-text").textContent = "Admin Action Menu"  
    document.getElementById("press-e").style.display = "none"
  }
  if (type == 'user') {
    document.getElementById("admin-btn").style.display = "none"
    document.getElementById("candidates-container").style.display = "flex"
    document.getElementById("main").style.display = "flex";
    document.querySelector('body').style.display = "flex";
    document.getElementById("press-e").style.display = "none"
  }

  if (type === "display") {
    document.getElementById("background").style.display = "flex"
  }
  
  if (type == 'createDiv') {
    createCandidateDiv(event.data.headingJS, event.data.detailsJS, event.data.imgURLJS);
    const voteButtons = document.getElementsByClassName("vote-btn")
    for (const vote of voteButtons) {
        vote.addEventListener('click', () => {
          axios.post(`https://${GetParentResourceName()}/candidateNames`, {
              name: vote.title
          })
          axios.post(`https://${GetParentResourceName()}/releaseFocus`, {})
          document.querySelector('.notitext').textContent = "You have successfully voted!"  
          document.querySelector('.noti').style.top = "10px"  
          document.getElementById('main').style.opacity = "0"
          setTimeout(() => {
            document.getElementById('main').style.display = "none"
            document.getElementById('main').style.opacity = "1.0"
            axios.post(`https://${GetParentResourceName()}/releaseFocus`, {})
          }, 1000);
          setTimeout(() => {
            document.querySelector('.noti').style.top = "-100px"  
          }, 4000);
        })
    }
  }

})

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("main-btn").addEventListener('click', () => {
        document.getElementById("admin-menu").style.display = "none"
        document.getElementById("candidates-container").style.display = "flex"
        document.getElementById("main-header-text").textContent = "Don't forget to vote!"  
    });

    document.getElementById("admin-btn").addEventListener('click', () => {
        document.getElementById("admin-menu").style.display = "flex"
        document.getElementById("candidates-container").style.display = "none"
        document.getElementById("main-header-text").textContent = "Admin Action Menu"  
    });

    document.getElementById("add-btn").addEventListener('click', () => {
        document.getElementById("admin-menu").style.display = "none"
        document.getElementById("main-header").style.display = "none"
        document.querySelector("form").style.display = "flex"
    });

    document.getElementById("start-btn").addEventListener('click', () => {
      axios.post(`https://${GetParentResourceName()}/startVote`, {
        isVoteStarted: true
      })
      document.querySelector('.noti').style.top = "10px"
      document.querySelector('.notitext').textContent = "Vote is succesfully started!"  
      setTimeout(() => {
        document.querySelector('.noti').style.top = "-100px"  
      }, 2000);
    })

    document.getElementById('close-btn').addEventListener('click', () => {
      axios.post(`https://${GetParentResourceName()}/releaseFocus`, {})
      document.getElementById('main').style.opacity = "0"
      setTimeout(() => {
        document.getElementById('main').style.display = "none"
        document.getElementById('main').style.opacity = "1.0"
        axios.post(`https://${GetParentResourceName()}/releaseFocus`, {})
      }, 1000);
    })

    document.getElementById('finish-btn').addEventListener('click', () => {
      axios.post(`https://${GetParentResourceName()}/getWinner`, {})
      document.querySelector('.noti').style.top = "10px"
      setTimeout(() => {
        if (winner != undefined) {
          document.querySelector('.notitext').textContent = `${winner} is the Winner!` 
        }
        else {
          document.querySelector('.notitext').textContent = "No one voted at the moment!" 
          document.getElementById('noti2').style.backgroundColor = "red"
          document.getElementById('noti1').style.backgroundColor = "red"
          document.querySelector('.noti2').textContent = "X"
        }
      }, 100);
      setTimeout(() => {document.querySelector('.noti').style.top = "-100px"}, 3000);
      setTimeout(() => {
        document.getElementById('noti1').style = ""
        document.getElementById('noti2').style.backgroundColor = ""
        document.querySelector('.noti2').textContent = "✔"
      }, 4000);
        
    })

    document.getElementById("reset-btn").addEventListener('click', () =>{
      axios.post(`https://${GetParentResourceName()}/resetVote`, {})
      document.querySelector('.notitext').textContent = "Votes succesfully reseted!"  
      document.querySelector('.noti').style.top = "10px"
      setTimeout(() => {
        document.querySelector('.noti').style.top = "-100px"  
      }, 2000);
    })

    document.getElementById("submit-cancel").addEventListener('click', () =>{
      document.getElementById("admin-menu").style.display = "flex"
      document.getElementById("main-header").style.display = "flex"
      document.querySelector("form").style.display = "none"
      document.getElementById("main-header-text").textContent = "Admin Action Menu"  
    })
}, false);

/**
 * Default IMG BURDAN DEGISILIYO
 */
const defaultImgURL =
  "https://cdn.openart.ai/stable_diffusion/85a03fa10f01a88a870833d33a67cde302a92711_2000x2000.webp";

document.addEventListener("DOMContentLoaded", () => {
  // FORMA EVENT LISTENER EKLIYORUM
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    // BUNLAR FORMU GIZLEYIP ADAYLAR KISMINI TEKRAR GETIRMEK ICIN
    document.getElementById("main-header").style.display = "flex";
    document.getElementById("main-header-text").textContent = "Admin Action Menu"  
    document.getElementById("admin-menu").style.display = "flex"
    document.querySelector("form").style.display = "none";

    // OYUNCUNUN YAZDIGI SEYLERI ALIYORUM
    const heading = document.getElementById("heading").value;
    const details = document.getElementById("details").value;
    const imgURL = document.getElementById("image-url").value;
    // YAZDIKLARIYLA YENI CANDIDATE DIV OLUSTURUYORUM
    axios.post(`https://${GetParentResourceName()}/createCandidate`, {
      heading, details, imgURL
    })
  });
});

// Her admin submiti icin bu functionu kullanicaksin
function createCandidateDiv(heading, details, imageURL) {
  const candidateDiv = document.createElement("div");
  candidateDiv.className = "candidate-div";

  const candidateBg = document.createElement("div");
  candidateBg.className = "candidate-background";

  const candidateIMG = document.createElement("img");
  candidateIMG.classList.add("candidate-image");

  if (!imageURL) {
    candidateIMG.setAttribute("src", defaultImgURL);
  } else {
    candidateIMG.setAttribute("src", imageURL);
  }

  candidateBg.appendChild(candidateIMG);

  const candidateName = document.createElement("p");
  candidateName.textContent = heading;
  candidateName.classList.add("white-text", "candidate-name-text");

  const candidateDetails = document.createElement("p");
  candidateDetails.innerHTML = details;
  candidateDetails.className = "candidate-details-text";

  const voteBtn = document.createElement("button");
  voteBtn.textContent = "VOTE";
  voteBtn.title = heading;
  voteBtn.classList.add("white-text", "vote-btn");

  candidateDiv.appendChild(candidateBg);
  candidateDiv.appendChild(candidateName);
  candidateDiv.appendChild(candidateDetails);
  candidateDiv.appendChild(voteBtn);

  document.getElementById("candidates-container").appendChild(candidateDiv);
}

function clearParent(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}