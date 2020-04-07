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
rowsElem.min = 1;
bombsElem.min = 1;
colsElem.min = 1;
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
  alert('You win');
   countOpened = 0;

}

function isCellExist(row, col) {
  return row >= 0 && col >=0 && row < rowsElem.value && col < colsElem.value;
}

function openCell( x, y ) {
  let tableElem = document.querySelector('#generatedBlock table');
  if(tableElem.rows[x].cells[y].dataset.state == 'bomb'){
    tableElem.rows[x].cells[y].dataset.state = 'openBomb';
    alert('lose');
    return;
  }
  let countBombs = 0;
  for (let i = -1; i <= 1; i++){
    for (let j = -1; j <= 1; j++){
      if ( isCellExist(x+i, y+j) && (tableElem.rows[ x+i ].cells[ y+j ].dataset.state == 'bomb' || tableElem.rows[ x+i ].cells[ y+j ].dataset.step == 'bombFlag')){
        countBombs++;
      }
    }
  }

  tableElem.rows[x].cells[y].dataset.state = 'open';
  tableElem.rows[x].cells[y].innerHTML = countBombs;
  return countBombs;
}

function fillBombs( clickRow, clickCol) {
  let tableElem = document.querySelector('#generatedBlock table');
  let rowsCount = +rowsElem.value;
  let bombsCount = +bombsElem.value;
  let columnsCount = +colsElem.value;
  let cellsArr = [];
  for (let i = 0; i < rowsCount; i++){
    for (let j = 0; j < columnsCount; j++){
      cellsArr.push({'row' : i, 'col' : j});
    }
  }
  for (let i = 0; i < bombsCount; i++){
    let randomIndex = Math.floor(Math.random() * cellsArr.length );
    let bombRow = cellsArr[randomIndex].row;
    let bombCol = cellsArr[randomIndex].col;
    if(clickRow == bombRow && bombCol == clickCol ){
      i--;
      continue;
    }
    tableElem.rows[ bombRow ].cells[ bombCol ] = -1;
    tableElem.rows[ bombRow ].cells[ bombCol ].dataset.state = 'bomb';
    cellsArr.splice( randomIndex, 1);
  }




}

function generateTable( rowsCount, columnsCount ){
  if(+bombsElem.value >= rowsCount*columnsCount){
    generatedBlockElem.innerHTML = 'Too much bombs';
    localStorage.setItem( 'rowscount', rowsCount );
    localStorage.setItem( 'columnsCount', columnsCount );
    localStorage.setItem( 'bombsCount', bombsElem.value );
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
  let arr = [];
  let opened = 0;
  for (let i = 0; i < rowsCount; i++){

    for (let j = 0; j < columnsCount; j++){
      if(tableElem ){
        switch (tableElem.rows[i].cells[j].dataset.state) {
          case 'close':
            arr.push(0);
            opened++;
            break;
          case 'bomb':
            arr.push(1);
            opened++;
            break;
          case 'empty':
            arr.push(2);
            opened++;
            break;
          case 'open':
            opened++;
            arr.push(5);
            break;
          default:
            switch (tableElem.rows[i].cells[j].dataset.step) {
              case 'closeFlag':
                arr.push(3);
                break;
              case 'bombFlag':
                arr.push(4);
            }
            break;
        }
      }
    }
  }
  localStorage.setItem( 'rowscount', rowsCount );
  localStorage.setItem( 'columnsCount', columnsCount );
  localStorage.setItem( 'bombsCount', bombsCount );
  localStorage.setItem('matrix', arr);
  localStorage.setItem('opened', opened);

}

function loaddata(){
  opened = localStorage.getItem('opened');
  if (opened != 0){
    firstTarget = false;
  }
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
      switch (str[k]) {
        case '1':
        case '3':
          tableElem.rows[i].cells[j].dataset.state = 'bomb';
          break;
      }
      k++;
    }
  }
  k = 0;
    for (let i = 0; i < rowsCount; i++){
      for (let j = 0; j < columnsCount; j++){
        switch (str[k]) {
          case '2':
            tableElem.rows[i].cells[j].dataset.state = 'empty';
            break;
          case '3':
            tableElem.rows[i].cells[j].dataset.step = 'closeFlag';
            break;
          case '4':
            tableElem.rows[i].cells[j].dataset.step = 'bombFlag';
            break;
          case '5':
            openCell(i,j);
            break;
        }

        k++;
      }
    }
}

generatedBlockElem.addEventListener('click', function (event) {
  let tableElem = document.querySelector('#generatedBlock table');
  if( event.target.tagName == "TD" ){
    let clickCol = event.target.cellIndex;
    let clickRow = event.target.parentNode.rowIndex;
    if( tableElem.rows[clickRow].cells[clickCol].dataset.state == 'close' )
      countOpened++;
    if (firstTarget){
      fillBombs(clickRow, clickCol);
    }
    let countBombs = openCell(clickRow, clickCol);
    if (countBombs == 0){
      let stack = [{'row' : clickRow, 'col' : clickCol}];
      while (stack.length > 0){
        let cell = stack.pop();
        let countBombs = openCell(cell.row, cell.col);
        if( countBombs == 0)
        {
          for (let i = -1; i <= 1; i++){
          for (let j = -1; j <= 1; j++){
            if(cell.row + i == clickRow && cell.col + j == clickCol ) continue;
            if ( isCellExist(cell.row+i, cell.col+j) && tableElem.rows[cell.row+i].cells[cell.col+j].dataset.state == 'close'){
              let countBombs = openCell(cell.row+i, cell.col+j);
              countOpened++;
              stack.push({ 'row' : cell.row + i, 'col': cell.col + j });
              tableElem.rows[cell.row+i].cells[cell.col+j].dataset.state = 'open';
            }
          }
        }
        }
      }
    }
    firstTarget = false;
  }
  let rowsCount = +rowsElem.value;
  let columnsCount = +colsElem.value;
  let bombsCount = +bombsElem.value;
  if( countOpened == rowsCount * columnsCount - bombsCount){
    win();
  }
    savedata();

});

generatedBlockElem.addEventListener('contextmenu', function (event) {
  if( event.target.tagName == "TD" ){
    event.preventDefault();
    switch (event.target.dataset.state) {
      case "close":
        event.target.dataset.step = 'closeFlag';
        event.target.dataset.state = '';
        break;
      case "bomb":
        event.target.dataset.step = 'bombFlag';
        event.target.dataset.state = '';
        break;
      default:
        switch (event.target.dataset.step) {
          case "closeFlag":
            event.target.dataset.state = 'close';
            event.target.dataset.step = '';
            break;
          case "bombFlag":
            event.target.dataset.state = 'bomb';
            event.target.dataset.step = '';
            break;
          default:
            break;
        }
        break;
    }

  }
  savedata();
});

generateButtonElem.addEventListener('click', function (event) {
  generatedBlockElem.innerHTML = "";
  var rowsCount = +rowsElem.value;
  var columnsCount = +colsElem.value;
  localStorage.setItem('opened', 0);
  firstTarget = true;
  generatedBlockElem.appendChild( generateTable( rowsCount, columnsCount) );
  savedata();
  event.preventDefault();
});

