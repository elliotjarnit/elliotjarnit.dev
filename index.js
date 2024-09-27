const icons = ["bun", "cloudflare", "cplusplus", "css3", "electron", "express", "figma", "firebase", "framermotion", "git", "github", "go", "googlecloud", "gradle", "graphql", "html5", "java", "javascript", "kotlin", "lua", "mongodb", "mysql", "nextjs", "nodejs", "nuxtjs", "objectivec", "openapi", "opengl", "opencl", "php", "postgresql", "prisma", "python", "react", "redis", "rust", "sass", "socketio", "sqlite", "supabase", "svelte", "swift", "tailwindcss", "tauri", "tensorflow", "threejs", "typescript", "vuejs"]

const innerCircleItemCount = 10
const outerCircleItemCount = 16

function pickIcons(count) {
  const pickedIcons = []
  const availableIcons = [...icons]

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * availableIcons.length)
    pickedIcons.push(availableIcons[index])
    availableIcons.splice(index, 1)
  }

  return pickedIcons
}

function populateIcons() {
  const circle1 = document.getElementById("circle-1")
  const circle2 = document.getElementById("circle-2")

  const icons = pickIcons(innerCircleItemCount + outerCircleItemCount)

  circle1.innerHTML = ""
  circle2.innerHTML = ""

  icons.forEach((icon, index) => {
    const circle = index < innerCircleItemCount ? circle1 : circle2
    const itemCount = index < innerCircleItemCount ? innerCircleItemCount : outerCircleItemCount
    circle.innerHTML += `<div class="dev-icon" style="--rot: ${index * (360 / itemCount)}"><img src="icons/${icon}.svg" alt="${icon}" /></div>`
  })
}

function startAnimation() {
  const circle1 = document.getElementById("circle-1")
  const circle2 = document.getElementById("circle-2")

  let offset = 0;

  setInterval(() => {
    offset++;
    circle1.style.setProperty("--offset", -offset)
    circle2.style.setProperty("--offset", offset)

  }, 100)
}

populateIcons()
startAnimation();