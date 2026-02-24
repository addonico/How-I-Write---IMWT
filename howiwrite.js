const mainTitle = document.getElementsByClassName("mainTitle")[0];
const fonts = ["Julius Sans One", "Protest Revolution", "Courier New", "Roboto Mono"];
const colors = ["#020826", "#3f3a37", "#1d1a16", "#00ff66"];
const stopButton = document.getElementsByClassName("stop")[0];

let index = 0;
let titleAnim = null;
let changingTitle = false;

function changeTitle() {
  if (mainTitle) {
    mainTitle.style.fontFamily = fonts[index % fonts.length];
    mainTitle.style.color = colors[index % colors.length];
    index++;
    changingTitle = true;
  } else {
    console.log("Title element not found");
  }
}

function startTitleAnim() {
  if (mainTitle) {
    if (!changingTitle) {
      titleAnim = setInterval(changeTitle, 500);
      changingTitle = true;
    }
  }
}

function stopTitleAnim() {
  if (mainTitle) {
    if (changingTitle) {
      clearInterval(titleAnim);
      titleAnim = null;
      changingTitle = false;
    }
  }
}

stopButton?.addEventListener("click", () => {
  if (mainTitle) {
    if (changingTitle) {
      stopTitleAnim();
    } else {
      startTitleAnim();
    }
  }
});

var navLinks = document.getElementById("navLinks");

function showMenu() {
  if (navLinks) {
    navLinks.style.right = "0px";
    navLinks.style.display = "block";
  }
}

function hideMenu() {
  if (navLinks) {
    navLinks.style.right = "-200px";
    navLinks.style.display = "none";
  }
}

const intro = document.getElementById("introBtn");
const inter = document.getElementById("interBtn");
const adv = document.getElementById("advBtn");
const moreBtn = document.querySelectorAll(".readMore");
const lessBtn = document.querySelectorAll(".readLess");
const nextBtn = document.querySelectorAll(".next");
const backBtn = document.querySelectorAll(".back");
const n1Btn = document.getElementById("N1btn");
const n2Btn = document.getElementById("N2btn");

let introLvl = true;
let interLvl = false;
let advLvl = false;

function moreText(e) {
  let btn = e.currentTarget;
  let row = btn.closest(".row");

  let currentLvl;
  if (introLvl) currentLvl = row.querySelector(".intro");
  else if (interLvl) currentLvl = row.querySelector(".intermediate");
  else if (advLvl) currentLvl = row.querySelector(".advanced");

  if (currentLvl) {
    let paragraphs = currentLvl.querySelectorAll("p");

    let p0 = paragraphs[0];
    let p1 = paragraphs[1];
    let p2 = paragraphs[2];

    if (window.getComputedStyle(p0).display === "block") {
      p1.style.display = "block";
      p0.style.display = "none";
      p2.style.display = "none";
    } else if (
      window.getComputedStyle(p0).display === "none" &&
      window.getComputedStyle(p1).display === "block"
    ) {
      p1.style.display = "none";
      p2.style.display = "block";
      p0.style.display = "none";
    } else if (
      window.getComputedStyle(p1).display === "none" &&
      window.getComputedStyle(p2).display === "block"
    ) {
      p1.style.display = "none";
      p2.style.display = "block";
      p0.style.display = "none";
    }
  }
}

function lessText(e) {
  let btn = e.currentTarget;
  let row = btn.closest(".row");

  let currentLvl;
  if (introLvl) currentLvl = row.querySelector(".intro");
  else if (interLvl) currentLvl = row.querySelector(".intermediate");
  else if (advLvl) currentLvl = row.querySelector(".advanced");

  if (!currentLvl) return;
  const paragraphs = [...currentLvl.querySelectorAll("p")];
  let idx = paragraphs.findIndex((p) => window.getComputedStyle(p).display === "block");

  if (idx === -1) return;
  if (idx === 0) return;

  paragraphs[idx].style.display = "none";
  paragraphs[idx - 1].style.display = "block";
}

function getVisibleRow() {
  return [...document.querySelectorAll(".row")].find(
    (r) => getComputedStyle(r).display !== "none"
  );
}

function firstBlock(container = document) {
  container
    .querySelectorAll(".intro, .intermediate, .advanced")
    .forEach((div) => (div.style.display = "none"));

  let currentLvl;

  if (introLvl) currentLvl = container.querySelector(".intro");
  else if (interLvl) currentLvl = container.querySelector(".intermediate");
  else if (advLvl) currentLvl = container.querySelector(".advanced");

  if (currentLvl) {
    let paragraphs = currentLvl.querySelectorAll("p");
    paragraphs.forEach((p, i) => (p.style.display = i === 0 ? "block" : "none"));
    currentLvl.style.display = "block";
  }
}

function showRowById(id) {
  const rows = document.querySelectorAll(":is(.N1bd, .N2bd, .N3bd) .row");
  if (!rows.length) return;

  const target = document.getElementById(id);
  if (!target) return;

  rows.forEach((r) => (r.style.display = "none"));
  target.style.display = "block";

  firstBlock(target);

  history.replaceState(null, "", "#" + id);

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

intro?.addEventListener("click", () => {
  introLvl = true;
  interLvl = false;
  advLvl = false;
  const current = getVisibleRow();
  firstBlock(current);
});

adv?.addEventListener("click", () => {
  introLvl = false;
  interLvl = false;
  advLvl = true;
  const current = getVisibleRow();
  firstBlock(current);
});

inter?.addEventListener("click", () => {
  introLvl = false;
  interLvl = true;
  advLvl = false;
  const current = getVisibleRow();
  firstBlock(current);
});

moreBtn.forEach((btn) => {
  btn.addEventListener("click", moreText);
});

lessBtn.forEach((btn) => {
  btn.addEventListener("click", lessText);
});

nextBtn.forEach((el) => {
  const parent = el.closest(".row");
  const mess = document.getElementById("message");

  el.addEventListener("click", () => {
    if (!parent) return;

    if (parent.classList.contains("last")) {
      parent.style.display = "none";
      if (mess) mess.style.display = "block";
      history.replaceState(null, "", "#finish");
      return;
    }

    let next = parent.nextElementSibling;
    while (next && !(next.classList && next.classList.contains("row"))) {
      next = next.nextElementSibling;
    }
    if (!next) return;

    if (next.id) {
      showRowById(next.id);
    } else {
      parent.style.display = "none";
      next.style.display = "block";
      firstBlock(next);
    }
  });
});

backBtn.forEach((el) => {
  el.addEventListener("click", () => {
    const parent = el.closest(".row");
    if (!parent) return;
    if (parent.classList.contains("first")) return;

    let prev = parent.previousElementSibling;
    while (prev && !(prev.classList && prev.classList.contains("row"))) {
      prev = prev.previousElementSibling;
    }
    if (!prev) return;

    if (prev.id) {
      showRowById(prev.id);
    } else {
      parent.style.display = "none";
      prev.style.display = "block";
      firstBlock(prev);
    }
  });
});

function change(t) {
  const themes = ["t1", "t2", "t3", "t4"];

  themes.forEach((id) => {
    document.getElementById(id).disabled = id !== t;
  });

  localStorage.setItem("actCss", t);
}

window.addEventListener("DOMContentLoaded", () => {
  const workingCss = localStorage.getItem("actCss");
  if (workingCss) change(workingCss);

  const hash = window.location.hash;
  if (hash) {
    showRowById(hash.slice(1));
  } else {
    const current = getVisibleRow();
    if (current) firstBlock(current);
  }
});

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (hash) showRowById(hash.slice(1));
});

startTitleAnim();