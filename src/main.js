import './style.css'

import * as THREE from 'three'

import {
  CSS3DRenderer,
  CSS3DObject
} from 'three/addons/renderers/CSS3DRenderer.js'

import {
  TrackballControls
} from 'three/addons/controls/TrackballControls.js'

import TWEEN from 'three/addons/libs/tween.module.js'

let camera
let scene
let renderer
let controls

const objects = []

const tableTargets = []
const sphereTargets = []
const helixTargets = []
const gridTargets = []


const CLIENT_ID = '515866714168-p57gf1oqq8d5t5pkcil4pj6k15hkver6.apps.googleusercontent.com'
const API_KEY = 'AIzaSyCmSDKNwezGZ-0KqendGKfgIsMqRGvuARo'
const SPREADSHEET_ID = '1i3Ur9kz93N9D2Jti3VwptiD40Cvh1fZ6RhuPH3BDCjM'

const DISCOVERY_DOC =
  'https://sheets.googleapis.com/$discovery/rest?version=v4'

const SCOPES =
  'https://www.googleapis.com/auth/spreadsheets.readonly'

let tokenClient
let gapiReady = false
let gisReady = false
let people = []


function startVisualization() {

  document
    .getElementById('login-screen')
    .style.display = 'none'

  init()
  animate()

  transform(
    tableTargets,
    2000
  )
}

function init() {

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )

  camera.position.z = 1800

  createCards()

  createTableTargets()
  createSphereTargets()
  createHelixTargets()
  createGridTargets()

  createMenu()

  renderer = new CSS3DRenderer()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )

  document.body.appendChild(
    renderer.domElement
  )

  controls = new TrackballControls(
    camera,
    renderer.domElement
  )

  controls.rotateSpeed = 0.5
  controls.minDistance = 500
  controls.maxDistance = 6000

  window.addEventListener(
    'resize',
    onWindowResize
  )
}

function createCards() {

  people.forEach((person) => {

    const element =
      document.createElement('div')

    element.className =
      `person-card ${getNetWorthClass(person.netWorth)}`

    element.innerHTML = `
      <img
        class="person-photo"
        src="${person.photo}"
        alt="${person.name}"
      />

      <div class="name">
        ${person.name}
      </div>

      <div>
        Age: ${person.age}
      </div>

      <div>
        Country: ${person.country}
      </div>

      <div>
        Interest: ${person.interest}
      </div>

      <div>
        Net Worth:
        $${person.netWorth.toLocaleString()}
      </div>
    `

    const object =
      new CSS3DObject(element)

    object.position.x =
      Math.random() * 2000 - 1000

    object.position.y =
      Math.random() * 1200 - 600

    object.position.z =
      Math.random() * 1500 - 750

    scene.add(object)

    objects.push(object)
  })
}




function createTableTargets() {

  objects.forEach((object, index) => {

    const target =
      new THREE.Object3D()

    const column =
      index % 20

    const row =
      Math.floor(index / 20)

    target.position.x =
      (column - 9.5) * 260

    target.position.y =
      -(row - 4.5) * 330

    target.position.z = 0

    tableTargets.push(target)
  })
}

function createSphereTargets() {

  const vector =
    new THREE.Vector3()

  objects.forEach((object, index) => {

    const target =
      new THREE.Object3D()

    const phi =
      Math.acos(
        -1 +
        (2 * index) /
        objects.length
      )

    const theta =
      Math.sqrt(
        objects.length * Math.PI
      ) * phi

    target.position.setFromSphericalCoords(
      800,
      phi,
      theta
    )

    vector
      .copy(target.position)
      .multiplyScalar(2)

    target.lookAt(vector)

    sphereTargets.push(target)
  })
}

function createHelixTargets() {

  const vector =
    new THREE.Vector3()

  objects.forEach((object, index) => {

    const target =
      new THREE.Object3D()

    // Alternate cards between 2 strands
    const strand =
      index % 2

    // Position along the strand
    const point =
      Math.floor(index / 2)

    // Second strand is rotated 180 degrees
    const angle =
      point * 0.45 +
      strand * Math.PI

    const radius = 800

    target.position.x =
      Math.sin(angle) * radius

    target.position.z =
      Math.cos(angle) * radius

    target.position.y =
      600 - point * 180

    // Make the cards face outward
    vector.set(
      target.position.x * 2,
      target.position.y,
      target.position.z * 2
    )

    target.lookAt(vector)

    helixTargets.push(target)
  })
}

function createGridTargets() {

  objects.forEach((object, index) => {

    const target =
      new THREE.Object3D()

    const x =
      index % 5

    const y =
      Math.floor(index / 5) % 4

    const z =
      Math.floor(index / 20)

    target.position.x =
      (x - 2) * 400

    target.position.y =
      (1.5 - y) * 400

    target.position.z =
      (z - 4.5) * 700

    gridTargets.push(target)
  })
}



function createMenu() {

  const menu =
    document.createElement('div')

  menu.id = 'menu'

  // TABLE BUTTON
  const tableButton =
    document.createElement('button')

  tableButton.textContent = 'TABLE'

  tableButton.addEventListener(
    'click',
    () => {
      transform(
        tableTargets,
        2000
      )
    }
  )

  // SPHERE BUTTON
  const sphereButton =
    document.createElement('button')

  sphereButton.textContent = 'SPHERE'

  sphereButton.addEventListener(
    'click',
    () => {
      transform(
        sphereTargets,
        2000
      )
    }
  )

  // HELIX BUTTON
  const helixButton =
    document.createElement('button')

  helixButton.textContent = 'HELIX'

  helixButton.addEventListener(
    'click',
    () => {
      transform(
        helixTargets,
        2000
      )
    }
  )

  // GRID BUTTON
  const gridButton =
    document.createElement('button')

  gridButton.textContent = 'GRID'

  gridButton.addEventListener(
    'click',
    () => {
      transform(
        gridTargets,
        2000
      )
    }
  )

  menu.appendChild(
    tableButton
  )

  menu.appendChild(
    sphereButton
  )

  menu.appendChild(
    helixButton
  )

  menu.appendChild(
    gridButton
  )

  document.body.appendChild(
    menu
  )
}





function transform(targets, duration) {

  TWEEN.removeAll()

  objects.forEach(
    (object, index) => {

      const target =
        targets[index]

      new TWEEN.Tween(
        object.position
      )
        .to(
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z
          },
          Math.random() * duration + duration
        )
        .easing(
          TWEEN.Easing.Exponential.InOut
        )
        .start()

      new TWEEN.Tween(
        object.rotation
      )
        .to(
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
          },
          Math.random() * duration + duration
        )
        .easing(
          TWEEN.Easing.Exponential.InOut
        )
        .start()
    }
  )
}

function getNetWorthClass(netWorth) {

  if (netWorth > 200000) {
    return 'wealth-green'
  }

  if (netWorth >= 100000) {
    return 'wealth-orange'
  }

  return 'wealth-red'
}

function onWindowResize() {

  camera.aspect =
    window.innerWidth /
    window.innerHeight

  camera.updateProjectionMatrix()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )
}

function animate() {

  requestAnimationFrame(animate)

  TWEEN.update()

  controls.update()

  renderer.render(
    scene,
    camera
  )
}


function gapiLoaded() {

  gapi.load('client', initializeGapiClient)
}

async function initializeGapiClient() {

  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC]
  })

  gapiReady = true
}

function gisLoaded() {

  tokenClient =
    google.accounts.oauth2.initTokenClient({

      client_id: CLIENT_ID,

      scope: SCOPES,

      callback: async () => {
        await loadSheetData()
      }

    })

  gisReady = true
}

async function loadSheetData() {

  try {

    const response =
      await gapi.client.sheets.spreadsheets.values.get({

        spreadsheetId:
          SPREADSHEET_ID,

        range: "'Data Template'!A2:F201"

      })

    const rows =
      response.result.values || []

    people =
      rows.map(row => ({

        name:
          row[0] || '',

        photo:
          row[1] || '',

        age:
          Number(row[2]) || 0,

        country:
          row[3] || '',

        interest:
          row[4] || '',

        netWorth:
          parseNetWorth(row[5])

      }))

    console.log(
      'People loaded:',
      people.length
    )

    startVisualization()

  } catch (error) {

    console.error(error)

    alert(
      'Unable to load Google Sheet data.'
    )
  }
}


function parseNetWorth(value) {

  if (!value) {
    return 0
  }

  return Number(
    String(value)
      .replace(/[$,]/g, '')
      .trim()
  )
}



window.addEventListener(
  'load',
  () => {

    gapiLoaded()
    gisLoaded()

    document
      .getElementById('login-button')
      .addEventListener(
        'click',
        () => {

          if (!gapiReady || !gisReady) {
            alert(
              'Google services are still loading. Try again in a moment.'
            )

            return
          }

          tokenClient.requestAccessToken({
            prompt: 'consent'
          })
        }
      )
  }
)