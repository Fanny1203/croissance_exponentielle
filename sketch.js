let persons = [];
let isRunning = false;
let infectedCount = 1;
let canvasWidth = 800;
let canvasHeight = 600;
let growthRate = 2;
let lastUpdateTime = 0;

class Person {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.infected = false;
        this.size = 8;
        this.index = index;  
    }

    display() {
        fill(this.infected ? '#ff0000' : '#00ff00');
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('sketch-container');
    resetSimulation();

    // Event listeners
    document.getElementById('startBtn').addEventListener('click', startSimulation);
    document.getElementById('stopBtn').addEventListener('click', stopSimulation);
    document.getElementById('totalPersons').addEventListener('change', resetSimulation);
}

function draw() {
    background(255);

    // Update infection state
    if (isRunning) {
        const currentTime = millis();
        if (currentTime - lastUpdateTime >= 1000) { // Update every second
            const newInfectedCount = Math.min(
                Math.floor(infectedCount * growthRate),
                persons.length
            );
            
            // Infect new persons based on selected mode
            const mode = document.getElementById('orderedMode').value;
            
            while (infectedCount < newInfectedCount) {
                let indexToInfect;
                
                if (mode === 'random') {
                    do {
                        indexToInfect = Math.floor(random(persons.length));
                    } while (persons[indexToInfect].infected);
                } else {
                    indexToInfect = infectedCount;
                }
                
                persons[indexToInfect].infected = true;
                infectedCount++;
            }
            
            lastUpdateTime = currentTime;
        }
    }

    // Display all persons
    for (let person of persons) {
        person.display();
    }
}

function startSimulation() {
    isRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    lastUpdateTime = millis();
}

function stopSimulation() {
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    resetSimulation();
}

function resetSimulation() {
    persons = [];
    const totalPersons = parseInt(document.getElementById('totalPersons').value);
    growthRate = (parseFloat(document.getElementById('growthRate').value));
    
    // Create persons in a grid layout
    const cols = Math.floor(Math.sqrt(totalPersons));
    const rows = Math.ceil(totalPersons / cols);
    const cellWidth = canvasWidth / cols;
    const cellHeight = canvasHeight / rows;

    for (let i = 0; i < totalPersons; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        persons.push(new Person(x, y, i));
    }

    // Infect first person
    persons[0].infected = true;
    infectedCount = 1;
}
