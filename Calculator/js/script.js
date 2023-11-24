window.addEventListener('load', ()=>{
    addValue.focus()
});



let calculator = document.querySelector('.calculator');
let addValue = document.querySelector('#addValue');
let showValueBox = document.querySelector('.show-value-box')
let showValue = document.querySelector('#showValue');
let deleteShowValue = document.querySelector('#deleteShowValue')
let deleteStorage = document.querySelector('#deleteStorage')
let historyBtn = document.querySelector('#historyBtn');
let deleteBtn = document.querySelector('#deleteBtn');
let math = document.querySelector('.math');



if(!localStorage.getItem('history')) historyBtn.disabled = true

let array = [];
let historyArray = localStorage.getItem('history');

if(historyArray){
  array = JSON.parse(historyArray);
}


deleteStorage.addEventListener('click', ()=>{
  localStorage.clear()
  showValue.textContent = null;
  deleteShowValue.style.display = 'none';
  historyBtn.disabled = true
  array = [];
})

let isHistoryOpen = false;

historyBtn.addEventListener('click', ()=>{
  if(!isHistoryOpen){
    showValue.textContent = null;
    //let history = JSON.parse(localStorage.getItem('history'));
    array.forEach(elem => {
        let string = document.createElement('p');
        for (let key in elem) {
          string.append(elem[key]);
        }
        showValue.append(string);
    });

    deleteShowValue.style.display = 'flex'
    isHistoryOpen = true;
  }
  else{
    showValue.textContent = null;

    deleteShowValue.style.display = 'none'
    isHistoryOpen = false;
  }
})



function deleteLastLetter() {
  addValue.value = addValue.value.slice(0, -1);
  deleteTimeoutId = setTimeout(deleteLastLetter, 150);
}

deleteBtn.addEventListener('mousedown', function() {
  deleteLastLetter();
});

deleteBtn.addEventListener('mouseup', function() {
  clearTimeout(deleteTimeoutId);
  addValue.focus()
});



math.addEventListener('click', (e)=>{
    if(e.target.nodeName != 'BUTTON') return;

    if(!addValue.value && Number(e.target.textContent) || e.target.textContent == '()' || e.target.textContent == 0 || e.target.textContent == '+/-'){}
    else if(!addValue.value && !Number(e.target.textContent)) return alert(`Can't do it`);


    let lastElement = addValue.value.length-1;

    switch(e.target.textContent){ 
        case 'C':  
            addValue.value = null;
            showValue.textContent = null;
            deleteShowValue.style.display = 'none';
            isHistoryOpen = false;
            break;

        case '()':
            let open = addValue.value.lastIndexOf('(');
            let close = addValue.value.lastIndexOf(')');
            if(open == -1 && close == -1 && !addValue.value) addValue.value += '('
            else if(addValue.value[lastElement] == '/' || addValue.value[lastElement] =='*' || addValue.value[lastElement] =='-' || addValue.value[lastElement] =='+'){
              addValue.value += '(';
            }
            else if(!isNaN(addValue.value[lastElement])) {
              if(open>close) addValue.value += ')';
              else addValue.value += '*('
            }  
            else if(addValue.value[lastElement] == ')' || addValue.value[lastElement] == '!') addValue.value += '*('

            
            else if(open>close) addValue.value += ')';
            else if(close>open) addValue.value += '('; 
            break;

        case '!':
            if(!isNaN(addValue.value[lastElement])) addValue.value += '!'
            else if(!Number(addValue.value[lastElement])) return alert(`Can't do it`);
            break;

        case '=':
            function factorial(x){
              
              
              let fact = 1;
              for (let i = 1; i < x+1; i++) {
                fact = fact * i;
              }

              return fact
            }

            let equation = addValue.value;
            mark: for(i=0;i<addValue.value.length;i++){
              if(addValue.value[i] == '!'){
                if(!isNaN(addValue.value.slice(0, i))) {
                  let numb = Number(addValue.value.slice(0, i));
                  let calc = factorial(numb)
                  let full = `${calc}${addValue.value.slice(i+1)}`;
                  addValue.value = full;
                  continue mark;
                }
                for(j=i-1;j>=0;j--){
                  if(isNaN(addValue.value[j])){
                    let numb = Number(addValue.value.slice(j+1,i))
                    let calc = factorial(numb)
                    
                    let full = `${addValue.value.slice(0, j+1)}${calc}${addValue.value.slice(i+1)}`;
                    addValue.value = full;
                    i = 0;
                    continue mark;
                  }
                }
              }
            }

            let string = addValue.value;
            
            if(string[lastElement] == '/' || string[lastElement] =='*' || string[lastElement] =='-' || string[lastElement] =='+' || string[lastElement] =='.' || string[lastElement] == '(') return alert('Impossible');


            showValue.textContent = eval(string)
            array.push({Expression: `${equation} = ${showValue.textContent}`})      
            localStorage.setItem('history', JSON.stringify(array))       
            addValue.value = showValue.textContent;

            deleteShowValue.style.display = 'none'
            historyBtn.disabled = false;
            isHistoryOpen = false;
            break;

        case '+/-':
            if(isNaN(addValue.value[lastElement])){
              if(addValue.value[lastElement] == '-' && addValue.value[lastElement-1] == '(') addValue.value = `${addValue.value.slice(0, lastElement-1)}`;
              else addValue.value +='(-';
            }
            else if(!isNaN(addValue.value[lastElement])){
              if(!isNaN(addValue.value)) {
                addValue.value = `(-${addValue.value}`;
                break;
              }

              for(i = addValue.value.length-1; i>=0; i--){
                if(isNaN(addValue.value[i])) {
                  if(addValue.value[i] == '-' && addValue.value[i-1] == '(') addValue.value = `${addValue.value.slice(0, i-1)}${addValue.value.slice(i+1)}`;
                  else addValue.value = `${addValue.value.slice(0, i+1)}(-${addValue.value.slice(i+1)}`;
                  break;
                }
              }
            }
            break;

        default:
            if(e.target.textContent == '/' || e.target.textContent == '*' || e.target.textContent == '-' || e.target.textContent == '+' || e.target.textContent == '.'){
              if(addValue.value[lastElement] == '/' || addValue.value[lastElement] =='*' || addValue.value[lastElement] =='-' || addValue.value[lastElement] =='+' || addValue.value[lastElement] =='.'){
                return
              }
            }
            if(addValue.value[lastElement] == ')') {
              if(e.target.textContent == '*') addValue.value += `*`;
              else if(!isNaN(e.target.textContent)) addValue.value += `*${e.target.textContent}`;
              else if(e.target.textContent != '*') addValue.value += `${e.target.textContent}`;
            }
            else addValue.value += e.target.textContent;
            break;
    }

    addValue.focus()
})