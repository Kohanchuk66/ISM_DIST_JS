var generateButtonElem = document.createElement('input');
var generatedBlockElem = document.createElement('div');
var rowsElem = document.createElement('input');
var colsElem = document.createElement('input');
var bombsElem = document.createElement('input');
var formElem = document.createElement('form');
let firstTarget = true;
var countOpened = 0;


rowsElem.type='number';
bombsElem.type='number';
colsElem.type='number';
rowsElem.min = 0;
bombsElem.min = 0;
colsElem.min = 0;
generateButtonElem.type='button';
generateButtonElem.value='game';
document.body.appendChild(formElem);
document.body.appendChild(generatedBlockElem);
formElem.appendChild(rowsElem);
formElem.appendChild(bombsElem);
formElem.appendChild(colsElem);
formElem.appendChild(generateButtonElem);
generatedBlockElem.id='generatedBlock';

loaddata();

function win(){
  let tableElem = document.querySelector('#generatedBlock table');
  tableElem.innerHTML = 'You win';
   countOpened = 0;
  localStorage.setItem( 'rowscount', 0 );
  localStorage.setItem( 'columnsCount', 0 );
  localStorage.setItem( 'bombsCount', 0 );
}

function openEmpties( x, y ) {
  let tableElem = document.querySelector('#generatedBlock table');
  var rowsCount = +rowsElem.value;
  var columnsCount = +colsElem.value;
  //countOpened++;
  openCell(x+1, y);
  openCell(x, y+1);
  openCell(x, y-1);
  openCell(x-1, y);
  openCell(x-1, y-1);
  openCell(x-1, y+1);
  openCell(x+1, y-1);
  openCell(x+1, y+1);
  for ( let i=x,j=y; i < rowsCount ; i++){
    countOpened++;
    openCell(i+1, j);
    if( tableElem.rows[i+1].cells[j].dataset.state == 'empty') openEmpties(i+1,j);
    if( tableElem.rows[i+1].cells[j].dataset.state == 'open') break;
  }
  for ( let i=x,j=y; j < columnsCount ; j++){
    countOpened++;
    openCell(i, j+1);
    if( tableElem.rows[i].cells[j+1].dataset.state == 'empty') openEmpties(i,j+1);
    if( tableElem.rows[i].cells[j+1].dataset.state == 'open') break;
  }
  for ( let i=x,j=y; j >= 0; j--){
    countOpened++;
    openCell(i, j-1);
    if( tableElem.rows[i].cells[j-1].dataset.state == 'empty') openEmpties(i,j-1);
    if( tableElem.rows[i].cells[j-1].dataset.state == 'open') break;
  }
  for ( let i=x,j=y; i >= 0; i--){
    countOpened++;
    openCell(i-1, j);
    if( tableElem.rows[i-1].cells[j].dataset.state == 'empty') openEmpties(i-1,j);
    if( tableElem.rows[i-1].cells[j].dataset.state == 'open') break;
  }
}

function openCell( x, y ) {
  let tableElem = document.querySelector('#generatedBlock table');
  let countBombs = 0;
  var rowsCount = +rowsElem.value;
  var columnsCount = +colsElem.value;
  if ((x+1 < rowsCount) ) if(tableElem.rows[x+1].cells[y].dataset.move == 'false') countBombs++;
  if ((y+1 < columnsCount) && (x+1 < rowsCount) && tableElem.rows[x+1].cells[y+1].dataset.move == 'false' ) countBombs++;
  if ((y+1 < columnsCount) && tableElem.rows[x].cells[y+1].dataset.move == 'false' ) countBombs++;
  if ((x+1 < rowsCount) && (y-1 >= 0) && tableElem.rows[x+1].cells[y-1].dataset.move == 'false' ) countBombs++;
  if ((y+1 < columnsCount) && (x-1 >= 0) && tableElem.rows[x-1].cells[y+1].dataset.move == 'false' ) countBombs++;
  if ((x-1 >= 0) && (y-1 >= 0) && tableElem.rows[x-1].cells[y-1].dataset.move == 'false' ) countBombs++;
  if ( (y-1 >= 0) && tableElem.rows[x].cells[y-1].dataset.move == 'false' ) countBombs++;
  if ((x-1 >= 0) && tableElem.rows[x-1].cells[y].dataset.move == 'false' ) countBombs++;
  if(countBombs == 0){
    tableElem.rows[x].cells[y].dataset.state = 'empty';
    openEmpties(x, y);
  }
  else {
    tableElem.rows[x].cells[y].dataset.state = 'open';
    tableElem.rows[x].cells[y].innerHTML = countBombs;

  }
}

function fillBombs( x, y ) {
  let bombArr = [];
  let tableElem = document.querySelector('#generatedBlock table');
  let rowsCount = +rowsElem.value;
  let bombsCount = +bombsElem.value;
  let columnsCount = +colsElem.value;
  while (bombArr.length != bombsCount){
    let isCopy = false;
    let bombX = Math.round(Math.random()*(columnsCount-1))  ;
    let bombY = Math.round(Math.random()*(rowsCount-1));
    if( bombX == x && bombY == y ){
      continue;
    }
    if(bombArr.length == 0){
      bombArr[0] = [+bombX,+bombY];
      continue;
    }
    for (var i = 0; i < bombArr.length; i++){
      if( bombArr[i][0] == bombX && bombArr[i][1] == bombY ){//убрать нажатую кнопку
        isCopy = true;
        break;
      }
    }
    if(!isCopy)
    bombArr[i] = [+bombX,+bombY];

  }console.log(bombArr);
  for (let i = 0; i < bombArr.length; i++) {
    tableElem.rows[bombArr[i][1] ].cells[bombArr[i][0] ].dataset.move = 'false';
  }

}

function generateTable( rowsCount, columnsCount ){
  if(+bombsElem.value >= rowsCount*columnsCount){
    generatedBlockElem.innerHTML = 'Too much bombs';
    localStorage.setItem( 'rowscount', rowsCount );
    localStorage.setItem( 'columnsCount', columnsCount );
    localStorage.setItem( 'bombsCount', +bombsElem.value );
    rowsCount = 0;
    columnsCount = 0;
  }
  var tableElem = document.createElement('table');
  for(var i = 0; i < rowsCount; i++)
  {
    var trElem = document.createElement('tr');
    for(var j = 0; j < columnsCount; j++)
    {
      var tdElem = document.createElement('td');

      tdElem.dataset.state = 'close';
      tdElem.dataset.move=' ';
      trElem.appendChild(tdElem);
    }
    tableElem.appendChild(trElem);
  }
  return tableElem;
}

function savedata(){
  let rowsCount = +rowsElem.value;
  let bombsCount = +bombsElem.value;
  let columnsCount = +colsElem.value;
  let tableElem = document.querySelector('#generatedBlock table');
  var str = '';
  let arr = [];
  for (let i = 0; i < rowsCount; i++){

    for (let j = 0; j < columnsCount; j++){
      if(tableElem && tableElem.rows[i].cells[j].classList.contains('highlight')){
        arr.push(1);
      }
      else {
        arr.push(0);
      }
    }
  }
  localStorage.setItem( 'rowscount', rowsCount );
  localStorage.setItem( 'columnsCount', columnsCount );
  localStorage.setItem( 'bombsCount', bombsCount );
  localStorage.setItem('matrix', arr);
}

function loaddata(){
  rowsElem.value = localStorage.getItem( 'rowscount' );
  bombsElem.value = localStorage.getItem( 'bombsCount' );
  colsElem.value = localStorage.getItem( 'columnsCount' );
  let rowsCount = +rowsElem.value;
  let columnsCount = +colsElem.value;
  generatedBlockElem.appendChild( generateTable( rowsCount, columnsCount) );
  let tableElem = document.querySelector('#generatedBlock table');
  let str = localStorage.getItem('matrix');
  if(str){
    str = str.split(',');
  }
  let k = 0;
  for (let i = 0; i < rowsCount; i++){

    for (let j = 0; j < columnsCount; j++){
      if(str[k] == '1' ){
        tableElem.rows[i].cells[j].classList.add('highlight');
      }

      k++;
    }

  }
}

generatedBlockElem.addEventListener('click', function (event) {
  if( event.target.tagName == "TD" ){
    if(firstTarget){
      fillBombs(event.target.parentNode.rowIndex, event.target.cellIndex);
      firstTarget = false;
    }
    if( event.target.dataset.move == 'false' && event.target.dataset.state == 'close' ){
      event.target.dataset.state = 'bomb';
      generatedBlockElem.innerHTML = 'Looser';
    }
    if( event.target.dataset.state == 'close' ){
      countOpened++;
       openCell(event.target.parentNode.rowIndex, event.target.cellIndex);
      // if(value == 0){
      //   openEmpties(event.target.parentNode.rowIndex, event.target.cellIndex);
      // }
      //else {
      //  event.target.innerHTML = value;
     // }

    }
    console.log(countOpened);
    if(countOpened == rowsElem.value*colsElem.value - bombsElem.value+1){
      win();
    }
    savedata();
  }
});

generatedBlockElem.addEventListener('contextmenu', function (event) {
  if( event.target.tagName == "TD" ){
    event.preventDefault();
    switch (event.target.dataset.state) {
      case "close":
        event.target.dataset.state = 'flag';
        break;
      case "flag":
        event.target.dataset.state = 'close';
        break;
      default:
        break;
    }
  }
});

generateButtonElem.addEventListener('click', function (event) {
  generatedBlockElem.innerHTML = "";
  var rowsCount = +rowsElem.value;
  var columnsCount = +colsElem.value;
  firstTarget = true;
  generatedBlockElem.appendChild( generateTable( rowsCount, columnsCount) );

  let tdEmements = document.getElementsByTagName('td');
  tdEmements.style.width = '20px;';
  tdEmements.style.height = '20px;';
  tdEmements.style.border = '1px solid blue;';
  tdEmements.style.text_align = 'center;';
  savedata();
  event.preventDefault();
});

