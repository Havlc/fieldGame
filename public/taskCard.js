//Counters
let counter = 0
let mainCounter = parseInt(document.querySelector('#mainCounterPoints').innerText);

function changeTeamColor(){
    let newTeamColor = document.querySelector('#spanTeamColor').innerText
    document.querySelector('#spanTeamColor').style.backgroundColor=newTeamColor;
}

function rankChange(){

    let currentRankName = document.querySelector('#rankName');
    let currentRankImg = document.querySelector('#rankImg')

    //players rank update
    if (mainCounter<=29){
        currentRankName.textContent = `szeregowy`;
    } else if (mainCounter>29 && mainCounter<=49) {
        currentRankName.textContent = `starszy szeregowy`;
        currentRankImg.src = "ranks/StSzeregowy.png";
    } else if (mainCounter>49 && mainCounter<=70) {
        currentRankName.textContent = `kapralu`;
        currentRankImg.src = "ranks/Kapral.png";
    } else if (mainCounter>70 && mainCounter<=92) {
        currentRankName.textContent = `starszy kapralu`;
        currentRankImg.src = "ranks/StKapral.png";
    } else if (mainCounter>92 && mainCounter<=125) {
        currentRankName.textContent = `plutonowy`;
        currentRankImg.src = "ranks/Plutonowy.png";
    } else if (mainCounter>125 && mainCounter<=155) {
        currentRankName.textContent = `sierżancie`;
        currentRankImg.src = "ranks/Sierzant.png";
    } else if (mainCounter>155 && mainCounter<=190) {
        currentRankName.textContent = `starszy sierżancie`;
        currentRankImg.src = "ranks/StSierzant.png";
    } else if (mainCounter>190 && mainCounter<=230) {
        currentRankName.textContent = `młodszy chorąży`;
        currentRankImg.src = "ranks/MlChorazy.png";
    } else {
        currentRankName.textContent = `chorąży`;
        currentRankImg.src = "ranks/Chorazy.png";
    }  
}

//change colour of my team
changeTeamColor()

//make a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    .task-card {
		font-family: 'Cambria', serif;
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

    #solving {
        display: none;
    }

	.taskImg {
		max-width: 100%;
        border-radius: 40px 0 0 40px;
	}

    .mapImg {
        display: none;
        max-height: 60vh;
        max-width: 90%;
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
        <img name="avatar" class="taskImg"/>
        <div> 
            <h3><slot name="number"/>numer</h3>
            <div class="info">
                <p><slot name="title"/>tytuł</p>
                <p id="mapLocation">lokalizacja</p>
                    <button id="showMap">pokaż na mapie</button>
                    <img name="maps" class="mapImg" id="mapPicture"/>
                <p><slot name="content" />treść</p>
                <p><slot name="link" />linki</p>
                    <button id="pdp1">Podpowiedź 1</button>
                <p><slot name="podpowiedz1" class="hint" id="hint1" />podpowiedź numer 1</p>
                    <button id="pdp2">Podpowiedź 2</button>
                <p><slot name="podpowiedz2" class="hint" id="hint2" />podpowiedź numer 2</p>
                    <button id="fix">Rozwiązanie</button>
                <p><slot name="rozwiazanie" id="solving" />rozwiązanie</p>
                    <input type="text" id="inputCommit" placeholder="Tu wprowadź hasło">
                    <button id="btnCommit" class="commit">zatwierdź</button>
                    <button id="btnSkip">pomiń</button>
                <p id="showCommit">komunikat</p>
                
                <button id="btnShowMapNext">lokalizacja następnego zadania</button>
                <img name="mapNext" class="mapImg" id="mapPictureNext"/>
                <p><slot id="taskVisibility" name="visibility"/>status zadania</p>
                <p><slot name="counter" id="counterDB"/>licznik</p>
                <p><slot name="counter" id="counter"/>licznik</p>
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
        this.shadowRoot.querySelector('#mapPicture').src = this.getAttribute('maps');
        this.shadowRoot.querySelector('#mapPictureNext').src = this.getAttribute('mapNext');

    }

    //Show Task info in a card
        toggleInfo() {
            
            //change condition to toggle
            this.showInfo = !this.showInfo;
        
            //toggle card surface
            const info = this.shadowRoot.querySelector('.info');
            const toggleBtn = this.shadowRoot.querySelector('#toggle-info');
            const podpowiedz1 = this.shadowRoot.querySelector('#pdp1');
            const podpowiedz2 = this.shadowRoot.querySelector('#pdp2');
            const rozwiazanieBtn = this.shadowRoot.querySelector('#fix');
            const commit = this.shadowRoot.querySelector('#btnCommit');
            const skip = this.shadowRoot.querySelector('#btnSkip');
            const taskVisibility = this.shadowRoot.querySelector('#taskVisibility');
            const inputField = this.shadowRoot.querySelector('#inputCommit');
            const counterField = this.shadowRoot.querySelector('#counter');

            if(this.showInfo) {
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż zadanie';
            } else {
                info.style.display = 'block';
                toggleBtn.innerText = 'Ukryj zadanie';
                taskVisibility.style.display = 'none';
                counterField.style.display = 'none';
            }
            if(this.children[8].innerText=='hidden'){
                
                //disable all task buttons
                commit.style.display = 'none';
                podpowiedz1.style.display = 'none';
                podpowiedz2.style.display = 'none';
                rozwiazanieBtn.style.display = 'none';
                skip.style.display = 'none';
                inputField.style.display = 'none';
                counterField.style.display = 'none';
            }
          }
        
        toggleMap() {
            //reduce points for opening a hint map
            //counter-=1
            
            //toggle map
            const info = this.shadowRoot.querySelector('#mapPicture');
            const toggleBtn = this.shadowRoot.querySelector('#showMap');
            const locationText = this.shadowRoot.querySelector('#mapLocation');

            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtn.style.display = 'none';
                locationText.style.display = 'none';
                //toggleBtn.innerText = 'Ukryj lokalizację';
              } else {
                /*Alternative case with returning button
                info.style.display = 'none';
                toggleBtn.innerText = 'Pokaż lokalizację';*/
              }
        }
        toggleNextMap() {            
            //toggle map
            const info = this.shadowRoot.querySelector('#mapPictureNext');
            const toggleBtnNext = this.shadowRoot.querySelector('#btnShowMapNext');

            if(!this.showInfo) {
                info.style.display = 'block';
                toggleBtnNext.style.display = 'none';
            }   else {console.log('no map found')}
        }

        toggleHint() {

            //reduce points for opening a hint
            counter-=2

            //toggle Hint number 1
            const info = this.shadowRoot.querySelector('#hint1');
            const toggleBtn = this.shadowRoot.querySelector('#pdp1');
            const taskId = this.children[0].innerText;
            const team = document.querySelector('#spanTeamColor').innerText

            //this.updateHintOneUsed(taskId)
                        
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
            //console.log(rozwiazanie)
            const commit = this.shadowRoot.querySelector('#btnCommit');
            const skip = this.shadowRoot.querySelector('#btnSkip');
            const inputValue = this.shadowRoot.querySelector('#inputCommit');
            const showCommit = this.shadowRoot.querySelector('#showCommit');

            //catch data
            const taskId = this.children[0].innerText;
            //console.log(`task id ${taskId}`)
            const team = document.querySelector('#spanTeamColor').innerText
            // console.log(taskId)
            // console.log(team)
            // console.log(this)
            // console.log('input value : ' + inputValue.value)

            //catch counters
            const counterField = this.shadowRoot.querySelector('#counter');
            const mainCounterField = document.querySelector('#mainCounter');
            const counterFieldDB = this.shadowRoot.querySelector('#counterDB')
            const mainCounterFieldPoints = document.querySelector('#mainCounterPoints');

            //catch input
            let odpowiedz = inputValue.value.toLowerCase().replace(/ /g,'');
            let taskNumber2 = parseInt(this.attributes.name.value)
            //console.log(localStorage.getItem(`task${taskNumber2}`))
            if(false && localStorage.getItem(`task${taskNumber2}`)>0){
                counter = parseInt(localStorage.getItem(`task${taskNumber2}`))
                // counterField.textContent = `Twój wynik za zadanie = ${counter} punktów`;
                mainCounter += counter;
                this.updatePointsInDb(taskId, counter, counterField, mainCounterField);
                counter = 0
                // mainCounterField.textContent = `Twój wynik - ${mainCounter} punktów`;
                this.rankChange();
                //disable all task buttons
                commit.style.display = 'none';
                //btnShowMap.disabled = true;
                podpowiedz1.style.display = 'none';
                podpowiedz2.style.display = 'none';
                rozwiazanieBtn.style.display = 'none';
                skip.style.display = 'none';
            } else {
            //validating
                if (odpowiedz == rozwiazanie){
                    //add points for entering a correct solving
                    counter+=10;
                    counterField.style.display = 'block';
                    counterFieldDB.style.display = 'none';
                    //disable all task buttons
                    commit.style.display = 'none';
                    //btnShowMap.disabled = true;
                    podpowiedz1.style.display = 'none';
                    podpowiedz2.style.display = 'none';
                    rozwiazanieBtn.style.display = 'none';
                    skip.style.display = 'none';

                        if (counter>0){
                            showCommit.textContent = `${odpowiedz} to odpowiedź prawidłowa!`;
                            // counterField.textContent = `Twój wynik za zadanie = ${counter} punktów`;
                            localStorage.setItem(`task${taskNumber2}`,`${counter}`)
                            //counters update and reset
                            mainCounter += counter;
                            
                            mainCounterFieldPoints.style.display = 'none';
                            this.updatePointsInDb(team, taskId, counter, counterField, mainCounterField);
                            counter = 0
                            // mainCounterField.textContent = `Twój wynik - ${mainCounter} punktów`;
                            /*currentTaskNumber++;
                            document.getElementById("newTask").textContent = `Nowe zadanie do rozwiązania: ${pytanie1.content}`;
                            // funkcja odsłaniająca kolejne zadanie*/
                            rankChange();
                        } else {

                            showCommit.textContent = `${odpowiedz} to odpowiedź prawidłowa! ale wykorzystaliście zbyt wiele prób :(`;
                            this.updatePointsInDb(team, taskId, 0, counterField,mainCounterField);
                            counter = 0
                            // counterField.textContent = `Twój wynik za zadanie = ${counter} punktów`;
                            //mainCounter += counter;
                            // mainCounterField.textContent = `Twój wynik - ${mainCounter} punktów`;
                        }
                }
                                
                else {
                    showCommit.textContent = `${odpowiedz} to odpowiedź nieprawidłowa, spróbuj ponownie`;
                    counter-=1
                };
            }
        }

        skipTask(){
            //catch buttons and counters
            const podpowiedz1 = this.shadowRoot.querySelector('#pdp1');
            const podpowiedz2 = this.shadowRoot.querySelector('#pdp2');
            const rozwiazanieBtn = this.shadowRoot.querySelector('#fix');
            const commit = this.shadowRoot.querySelector('#btnCommit');
            const skip = this.shadowRoot.querySelector('#btnSkip');
            const showCommit = this.shadowRoot.querySelector('#showCommit');
            const inputField = this.shadowRoot.querySelector('#inputCommit');
            const counterField = this.shadowRoot.querySelector('#counter');
            const mainCounterField = document.querySelector('#mainCounter');
            const counterFieldDB = this.shadowRoot.querySelector('#counterDB')
            const mainCounterFieldPoints = document.querySelector('#mainCounterPoints');
            let taskNumber2 = parseInt(this.attributes.name.value)
            counter=0;

            const taskId = this.children[0].innerText;
            //console.log(`task id ${taskId}`)
            const team = document.querySelector('#spanTeamColor').innerText

                showCommit.textContent = `Pominęliście to zadanie`;
                
                counterField.style.display = 'block';
                counterFieldDB.style.display = 'none';

                    //disable all task buttons
                    commit.style.display = 'none';
                    podpowiedz1.style.display = 'none';
                    podpowiedz2.style.display = 'none';
                    rozwiazanieBtn.style.display = 'none';
                    skip.style.display = 'none';
                    inputField.style.display = 'none';
                
                localStorage.setItem(`task${taskNumber2}`,`${counter}`)
                //counters update
                mainCounterFieldPoints.style.display = 'none';
                this.updatePointsInDb(team, taskId, counter, counterField, mainCounterField);
        }

        /*updateHintOneUsed(taskId)
        {
            let url = "/" + taskId + "/hintOne"

            const data = JSON.stringify({ "hintOne" : true });
            const head = { "Content-Type" : "application/json" }; 

            fetch(url, {
                method : "POST",
                body : data,
                headers: head
            }).then(
                response => 
                {
                    if (response.status === 400) {
                        throw new Error('400 - bad request');
                    }
                    return response.json()
                }
            ).then(
                json => {
                         console.log(json)                  
                }
            )
            .catch(ex => {
                    console.log(ex)
            });
        }*/

        updatePointsInDb(team, taskId, points, taskPointsField, totalPointsField){
            //update database
            let url = "/" + taskId;

            const data = JSON.stringify({ "points" : `${points}` });
            const head = { "Content-Type" : "application/json" }; 

            fetch(url, {
                method : "POST",
                body : data,
                headers: head
            }).then(
                response => 
                {
                    if (response.status === 400) {
                        throw new Error('400 - bad request');
                    }
                    return response.json()
                }
            ).then(
                json => {
                    taskPointsField.textContent = `Twój wynik za zadanie = ${json.pointsForTask} punktów`;
                    totalPointsField.textContent = `Wasz wynik - ${json.totalPoints} punktów`
                    mainCounter = json.totalPoints
                    //console.log(mainCounter)
                    
                    rankChange();
                    
                }
            )
            .catch(ex => {
                    console.log(ex)
                    taskPointsField.textContent = `To zadanie zostało już rozwiązane`;
                   
            });
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
        this.shadowRoot.querySelector('#btnShowMapNext').
        addEventListener('click', () => this.toggleNextMap());
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
        this.shadowRoot.querySelector('#btnShowMapNext').
        removeEventListener();
    }
}

window.customElements.define('task-card', TaskCard)

//Ending game handlers
function endGame(){
    //End game warning
    alert('Jeżeli zakończysz grę, nie będzie możliwe jej kontynuowanie. Chcesz zakończyć?')

    //Two level safety exit
    let endButton = document.querySelector('#btnEndGame');
    let finalEndButton = document.querySelector('#btnSumUpEnd');
    let mainCounterFieldPoints = document.querySelector('#mainCounterPoints')

    //console.log(mainCounter)
    rankChange()

    endButton.disabled = true;
    finalEndButton.style.display = 'block';
    mainCounterFieldPoints.style.display = 'none';
}

function finalEndGame(){

    let currentRankName = document.querySelector('#rankName').firstChild.data;
    let finalEndButton = document.querySelector('#btnSumUpEnd');
    const mainCounterField = document.querySelector('#mainCounter');
    let newTeamColor = document.querySelector('#spanTeamColor').innerText;
    let finalInfo = document.querySelector('#sumUpInfo');

    finalInfo.textContent = `KONIEC GRY! ${currentRankName} zdobyliście ${mainCounter} punktów`;
    finalInfo.style.backgroundColor = `${newTeamColor}`;
    mainCounterField.style.display = 'none';
    finalEndButton.disabled = true;
    finalEndButton.style.display = 'none'
}

document.querySelector('#btnEndGame').addEventListener('click', () => endGame())
document.querySelector('#btnSumUpEnd').addEventListener('click', () => finalEndGame())