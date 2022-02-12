const draggable_list = document.getElementById('draggable-list');
const checkBtn = document.getElementById('check');

const rankHierarchy = [
  'Korpus szeregowych',
  'Korpus podoficerów młodszych',
  'Korpus podoficerów',
  'Korpus podoficerów starszych',
  'Korpus oficerów młodszych',
  'Korpus oficerów starszych',
  'Korpus generałów',
  'Marszałek Polski'
];

// Store listitems
const listItems = [];

let dragStartIndex;

createList();

// Insert list items into DOM
function createList() {
  [...rankHierarchy]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((rankName, index) => {
      const listItem = document.createElement('li');

      listItem.setAttribute('data-index', index);

      listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <img src="./ranks/puzzle/V2/${index + 1}.jpg" />
        <div class="draggable" draggable="true">
          <p class="rank-name">${rankName}</p> 
          <i class="fa fa-arrow-down"></i>
          <i class="fa fa-arrow-up"></i>         
        </div>        
      `;

      listItems.push(listItem);

      draggable_list.appendChild(listItem);
    });

  addEventListeners();
}

function dragStart() {
  // console.log('Event: ', 'dragstart');
  dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragEnter() {
  // console.log('Event: ', 'dragenter');
  this.classList.add('over');
}

function dragLeave() {
  // console.log('Event: ', 'dragleave');
  this.classList.remove('over');
}

function dragOver(e) {
  // console.log('Event: ', 'dragover');
  e.preventDefault();
}

function dragDrop() {
  // console.log('Event: ', 'drop');
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove('over');
}

// Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');

  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

// Check the order of list items
function checkOrder() {
  listItems.forEach((listItem, index) => {
    const rankCorp = listItem.querySelector('.draggable').innerText.trim();
    console.log(rankCorp)

    if (rankCorp !== rankHierarchy[index]) {
      listItem.classList.add('wrong');
    } else {
      listItem.classList.remove('wrong');
      listItem.classList.add('right');
    }
  });
  let wrongAnswers = document.querySelectorAll('.wrong')
  if(Object.entries(wrongAnswers)==0){
      document.querySelector('#rankSolution').innerText='podporucznik'
      document.querySelectorAll('.fa').forEach(i => {
        i.style.display="none";
      })
  }
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');
  const arrowUp = document.querySelectorAll('.fa-arrow-up');
  const arrowDown = document.querySelectorAll('.fa-arrow-down');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });

  arrowUp.forEach(item =>{ 
    item.addEventListener('click', () => {
       // console.log(item)
    //const currentNumber = item.parentNode.parentNode.children[0]
    const currentRankText = item.parentNode.innerHTML
    const beforeRankText = item.parentNode.parentNode.previousSibling.children[2].innerHTML
    /*console.log(currentRankText)
    console.log(beforeRankText)
    console.log(item.parentNode.innerText)
    console.log(item.parentNode.parentNode)*/
    console.log(item.parentNode.parentNode.previousSibling.children[2].children[1])
    item.parentNode.parentNode.previousSibling.children[2].innerHTML = currentRankText
    item.parentNode.innerHTML = beforeRankText
    /*console.log(`zmieniono${currentRankText} na ${beforeRankText}`)*/
    console.log(item.parentNode.parentNode)
    console.log(item.children)
    
    /*console.log(draggable_list)
    console.log(draggables)
    console.log(dragListItems)
    console.log(arrowUp)*/
    });
})
arrowDown.forEach(item =>{ 
  item.addEventListener('click', () => {

  const currentRankText = item.parentNode.innerHTML
  const beforeRankText = item.parentNode.parentNode.nextSibling.children[2].innerHTML

  console.log(item.parentNode.parentNode.nextSibling.children[2].children[1])
  item.parentNode.parentNode.nextSibling.children[2].innerHTML = currentRankText
  item.parentNode.innerHTML = beforeRankText

  console.log(item.parentNode.parentNode)
  console.log(item.children)
  });
})
/*console.log(draggable_list)
console.log(draggables)
console.log(dragListItems)
console.log(arrowUp)*/
}

checkBtn.addEventListener('click', checkOrder);
checkBtn.addEventListener('click', addEventListeners)
/*
document.querySelectorAll('.fa-arrow-up').forEach(item =>{ 
    item.addEventListener('click', () => {
        console.log(item)
    //const currentNumber = item.parentNode.parentNode.children[0]
    const currentRankText = item.parentNode.innerHTML
    const beforeRankText = item.parentNode.parentNode.previousSibling.children[2].innerHTML
    console.log(currentRankText)
    console.log(beforeRankText)
    console.log(item.parentNode.innerText)
    
    item.parentNode.parentNode.previousSibling.children[2].innerHTML = currentRankText
    item.parentNode.innerHTML = beforeRankText
    });
})*/