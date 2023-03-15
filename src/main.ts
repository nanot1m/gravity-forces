import "./style.css"
import { setupCanvas } from "./app"

const canvas = document.createElement("canvas")

document.querySelector<HTMLDivElement>("#app")!.appendChild(canvas)

setupCanvas(canvas)
