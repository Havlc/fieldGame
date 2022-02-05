function changeTeamColor(){
let newTeamColor = document.querySelector('#spanTeamColor').innerText
document.querySelector('#spanTeamColor').style.backgroundColor=newTeamColor;
}
function changeTaskImg(){
let newTaskImg = document.querySelector('avatar').innerText
console.log(newTaskImg)
}
//changeTaskImg()

changeTeamColor()
//make a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    .task-card {
		font-family: 'Arial', sans-serif;
		background: lightgray;
        color:darkslategrey;
		width: auto;
		display: grid;
        grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: firebrick 5px solid;
        border-radius: 40px;
	}
    .info {
        display: none;
    }

    .hint {
        display: none;
    }

    #mapPicture {
        display: none;
    }

    #solving {
        display: none;
    }

	.task-card img {
		max-width: 100%;
        border-radius: 40px 0 0 40px;
	}
    
    button {
        display: inline-block;
		cursor: pointer;
		background: firebrick;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}

    button:hover {
        color: white;
        background: crimson;
        border-radius: 25px 0 25px 0;
        border: 0px solid firebrick;
        box-shadow: 5px 5px darkred;
        opacity: 0.8;
        transition: all 0.05s ease 0.1s;
    
    button:disabled {
        display: none;
        background: darkgrey;
    }

    img {
        height: 20vh;
    }
    </style>
    
    <div class="task-card">
        <img />
        <div> 
            <h3></h3>
            <div class="info">
                <p><slot name="title" />tytuł</p>
                <p><slot name="code" />kod</p>
                <p id="mapLocation">lokalizacja</p>
                    <button id="showMap">pokaż na mapie</button>
                    <img id="mapPicture" src="mapy/plan gry-komplet.png"/>
                <p><slot name="content" />treść</p>
                    <button id="pdp1">Podpowiedź 1</button>
                <p><slot name="podpowiedz1" class="hint" id="hint1" />podpowiedź numer 1</p>
                    <button id="pdp2">Podpowiedź 2</button>
                <p><slot name="podpowiedz2" class="hint" id="hint2" />podpowiedź numer 2</p>
                    <button id="fix">Rozwiązanie</button>
                <p><slot name="rozwiazanie" id="solving" />rozwiązanie</p>
                    <p><input type="text" id="inputCommit" placeholder="Tu wprowadź hasło">
                    <button id="btnCommit" class="commit">zatwierdź</button>
                    <button id="btnSkip">pomiń</button></p>
                    <button id="btnApproved" style="display:none">zaliczone</button></p>
                <p id="showCommit">komunikat</p>
                <h6 id="counter">counter</h6>
            </div>
            <button id="toggle-info">Pokaż zadanie</button>
        </div>
        
    </div>
`;

//Make task-card element
class TaskCard extends HTMLElement {
    constructor() {
        super();
        
        //condition
        this.showInfo = true;
        
        //Enable shadow Root
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        //Import name and avatar attributes to task card
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
    }

    //Show Task info in a card
        toggleInfo() {
            
            //change condition to toggle
            this.showInfo = !this.showInfo;
        
            //toggle card surface
            const info = this.shadowRoot.querySelector('.info');
            const toggleBtn = this.shadowRoot.querySelector('#toggle-info');
        
            if(this.showInfo) {
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż zadanie';
            } else {
              info.style.display = 'block';
              toggleBtn.innerText = 'Ukryj zadanie';
            }
          }
        
        toggleMap() {
            //reduce points for opening a hint map
            counter-=1
            
            //toggle map
            const info = this.shadowRoot.querySelector('#mapPicture');
            const toggleBtn = this.shadowRoot.querySelector('#showMap');

            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtn.style.display = 'none';
                //toggleBtn.innerText = 'Ukryj lokalizację';
              } else {
                /*Alternative case with returning button
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż lokalizację';*/
              }
        }

        toggleHint() {
            //this.showHint = !this.showInfo;

            //reduce points for opening a hint
            counter-=2

            //toggle Hint number 1
            const info = this.shadowRoot.querySelector('#hint1');
            const toggleBtn = this.shadowRoot.querySelector('#pdp1');
                        
            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtn.style.display = 'none';
                /*toggleBtn.innerText = 'Ukryj podpowiedź';*/
              } else {
                /*Alternative case with returning button
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż podpowiedź';*/
              }
        }

        toggleHint2() {
            //this.showHint2 = !this.showInfo;

            //reduce points for opening a hint
            counter-=2

            //toggle Hint number 2
            const info = this.shadowRoot.querySelector('#hint2');
            const toggleBtn = this.shadowRoot.querySelector('#pdp2');

            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtn.style.display = 'none';
                /*toggleBtn.innerText = 'Ukryj podpowiedź';*/
              } else {
                /*Alternative case with returning button
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż podpowiedź';*/
              }
        }
        
        toggleSolving() {
            //this.showSolving = !this.showInfo;
            
            //reduce points for opening a solving
            counter-=5

            //toggle solving
            const info = this.shadowRoot.querySelector('#solving');
            const toggleBtn = this.shadowRoot.querySelector('#fix');
            
            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtn.style.display = 'none';
                /*toggleBtn.innerText = 'Ukryj rozwiązanie';*/
              } else {
                /*Alternative case with returning button
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż rozwiązanie';*/
              }
        }
        
        confirmSolving() {

            //catch buttons
            const podpowiedz1 = this.shadowRoot.querySelector('#pdp1');
            const podpowiedz2 = this.shadowRoot.querySelector('#pdp2');
            const rozwiazanieBtn = this.shadowRoot.querySelector('#fix');
            const rozwiazanie = this.children[6].innerText;
            const commit = this.shadowRoot.querySelector('#btnCommit');
            const skip = this.shadowRoot.querySelector('#btnSkip');
            const inputValue = this.shadowRoot.querySelector('#inputCommit');
            const showCommit = this.shadowRoot.querySelector('#showCommit');

            //catch counters
            const counterField = this.shadowRoot.querySelector('#counter');
            const mainCounterField = document.querySelector('#mainCounter');

            //catch input
            let odpowiedz = inputValue.value;
             let taskNumber2 = parseInt(this.attributes.number.value)

            //validating
                if (odpowiedz == rozwiazanie){
                    //add points for entering a correct solving
                    counter+=10;
                    //disable all task buttons
                    commit.style.display = 'none';
                    //btnShowMap.disabled = true;
                    podpowiedz1.style.display = 'none';
                    podpowiedz2.style.display = 'none';
                    rozwiazanieBtn.style.display = 'none';
                    skip.style.display = 'none';

                        if (counter>0){
                            showCommit.innerHTML = `${odpowiedz} to odpowiedź prawidłowa!`;
                            counterField.innerHTML = `Twój wynik za zadanie = ${counter} punktów`;

                            //counters update and reset
                            mainCounter += counter;
                            counter = 0
                            mainCounterField.innerHTML = `Twój wynik - ${mainCounter} punktów`;
                            /*currentTaskNumber++;
                            document.getElementById("newTask").innerHTML = `Nowe zadanie do rozwiązania: ${pytanie1.content}`;
                            // funkcja odsłaniająca kolejne zadanie*/
                            this.rankChange();
                        } else {

                            showCommit.innerHTML = `${odpowiedz} to odpowiedź prawidłowa! ale wykorzystaliście zbyt wiele prób :(`;

                            counter = 0
                            counterField.innerHTML = `Twój wynik za zadanie = ${counter} punktów`;
                            //mainCounter += counter;
                            mainCounterField.innerHTML = `Twój wynik - ${mainCounter} punktów`;
                        }
                }
                                
                else {
                    showCommit.innerHTML = `${odpowiedz} to odpowiedź nieprawidłowa, spróbuj ponownie`;
                    counter-=1
                };
        }

        skipTask(){
            //catch buttons and counters
            const podpowiedz1 = this.shadowRoot.querySelector('#pdp1');
            const podpowiedz2 = this.shadowRoot.querySelector('#pdp2');
            const rozwiazanieBtn = this.shadowRoot.querySelector('#fix');
            const commit = this.shadowRoot.querySelector('#btnCommit');
            const skip = this.shadowRoot.querySelector('#btnSkip');
            const showCommit = this.shadowRoot.querySelector('#showCommit');
            const counterField = this.shadowRoot.querySelector('#counter');
            const mainCounterField = document.querySelector('#mainCounter');
            counter=0;
            
                showCommit.innerHTML = `Pominęliście to zadanie`;
                counterField.innerHTML = `Twój wynik za zadanie = ${counter} punktów`;
                
                    //disable all task buttons
                    commit.style.display = 'none';
                    //btnShowMap.disabled = true;
                    podpowiedz1.style.display = 'none';
                    podpowiedz2.style.display = 'none';
                    rozwiazanieBtn.style.display = 'none';
                    skip.style.display = 'none';
                
                //counters update
                 mainCounterField.innerHTML = `Twój wynik - ${mainCounter} punktów`;
        }

        rankChange(){
            
            let currentRankName = document.querySelector('#rankName');
            let currentRankImg = document.querySelector('#rankImg')

            //players rank update
            if (mainCounter<=20){
                currentRankName.innerHTML = `szeregowy`;
            } else if (mainCounter>20 && mainCounter<=40) {
                currentRankName.innerHTML = `starszy szeregowy`;
                currentRankImg.src = "ranks/StSzeregowy.png";
            } else if (mainCounter>40 && mainCounter<=65) {
                currentRankName.innerHTML = `kapralu`;
                currentRankImg.src = "ranks/Kapral.png";
            } else if (mainCounter>65 && mainCounter<=95) {
                currentRankName.innerHTML = `starszy kapralu`;
                currentRankImg.src = "ranks/StKapral.png";
            } else if (mainCounter>95 && mainCounter<=130) {
                currentRankName.innerHTML = `plutonowy`;
                currentRankImg.src = "ranks/Plutonowy.png";
            } else if (mainCounter>130 && mainCounter<=170) {
                currentRankName.innerHTML = `sierżancie`;
                currentRankImg.src = "ranks/Sierzant.png";
            } else if (mainCounter>170 && mainCounter<=215) {
                currentRankName.innerHTML = `starszy sierżancie`;
                currentRankImg.src = "ranks/StSierzant.png";
            } else {
                currentRankName.innerHTML = `młodszy chorąży`;
                currentRankImg.src = "ranks/MlChorazy.png";
            }      
        }

    connectedCallback() {
        this.shadowRoot.querySelector('#toggle-info').
        addEventListener('click', () => this.toggleInfo());
        this.shadowRoot.querySelector('#showMap').
        addEventListener('click', () => this.toggleMap());
        this.shadowRoot.querySelector('#pdp1').
        addEventListener('click', () => this.toggleHint());
        this.shadowRoot.querySelector('#pdp2').
        addEventListener('click', () => this.toggleHint2());
        this.shadowRoot.querySelector('#fix').
        addEventListener('click', () => this.toggleSolving());
        this.shadowRoot.querySelector('#btnCommit').
        addEventListener('click', () => this.confirmSolving());
        this.shadowRoot.querySelector('#btnSkip').
        addEventListener('click', () => this.skipTask());
    }

    disconnectedCallback(){
        this.shadowRoot.querySelector('#toggle-info').
        removeEventListener();
        this.shadowRoot.querySelector('#showMap').
        removeEventListener();
        this.shadowRoot.querySelector('#pdp1').
        removeEventListener();
        this.shadowRoot.querySelector('#pdp2').
        removeEventListener();
        this.shadowRoot.querySelector('#fix').
        removeEventListener();
        this.shadowRoot.querySelector('#btnCommit').
        removeEventListener();
        this.shadowRoot.querySelector('#btnSkip').
        removeEventListener();
    }
}

window.customElements.define('task-card', TaskCard)

//Counters
//let currentTaskNumber = 0;
let counter = 0
let mainCounter = 0;
let teamcolor

//Ending game handlers
function endGame(){
    //End game warning
    alert('Jeżeli zakończysz grę, nie będzie możliwe jej kontynuowanie. Chcesz zakończyć?')

    //Two level safety exit
    let endButton = document.querySelector('#btnEndGame');
    let finalEndButton = document.querySelector('#btnSumUpEnd');

    endButton.disabled = true;
    finalEndButton.style.display = 'block';
}

function finalEndGame(){

    let currentRankName = document.querySelector('#rankName').firstChild.data;
    let finalEndButton = document.querySelector('#btnSumUpEnd');
    const mainCounterField = document.querySelector('#mainCounter');
    let newTeamColor = document.querySelector('#spanTeamColor').innerText;
    let finalInfo = document.querySelector('#sumUpInfo');

    finalEndButton.disabled = true;
    finalInfo.innerHTML = `KONIEC GRY! ${currentRankName} zdobyliście ${mainCounter} punktów`;
    finalInfo.style.backgroundColor = `${newTeamColor}`;
    mainCounterField.style.display = 'none';
}

document.querySelector('#btnEndGame').addEventListener('click', () => endGame())
document.querySelector('#btnSumUpEnd').addEventListener('click', () => finalEndGame())