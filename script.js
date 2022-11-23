const calculation_prv = document.getElementById('calculation');
const mode_prv = document.getElementById('mode');
const result_prv = document.getElementById('result');
const btn_equals = document.getElementById('method_equals');
const btn_point_val = document.getElementById('method_point_val');
const btn_clear = document.getElementById('clear');
const btn_all_clear = document.getElementById('all_clear');
let value_btns = document.querySelectorAll('.value');
let method_btns = document.querySelectorAll('.btn_method');
let method_subs_btn = document.getElementById("method_substraction");
let temp_value_init = 0;
let temp_method_container = 0;
let stack_array = [];

btn_clear.addEventListener('click', function() {
  if(result_prv.classList.contains("finalized")) {
    calculation_prv.innerText = "";
    result_prv.innerText = "";
    temp_value_container_i = 0;
    temp_value_container_ii = 0;
    temp_value_container_iii = 0;
    temp_value_container_iv = 0;
    temp_value_container_v = 0;
    result_prv.classList.remove('finalized');
    // if(localStorage.getItem('next_subs_method')=="negative") { localStorage.removeItem('next_subs_method'); }
  } else {
    if(calculation_prv.innerText!="") { 
      calculation_prv.innerText = calculation_prv.innerText.substring(0,(calculation_prv.innerText.length-2));
      // if(localStorage.getItem('next_subs_method')=="negative") { localStorage.removeItem('next_subs_method'); }
    } else { calculation_prv.innerText = ""; }
    result_prv.classList.remove('finalized');
  } 
});

btn_all_clear.addEventListener('click', function() {
  calculation_prv.innerText = "";
  result_prv.innerText = "";
  temp_value_container_i = 0;
  temp_value_container_ii = 0;
  temp_value_container_iii = 0;
  temp_value_container_iv = 0;
  temp_value_container_v = 0;
  // localStorage.removeItem('next_subs_method');
  result_prv.classList.remove('finalized');
});

// mode_prv.addEventListener('click', function() { (mode_prv.innerText=="Standard") ? mode_prv.innerText="BODMAS" : mode_prv.innerText="Standard"; });

btn_point_val.addEventListener('click', function() {
  if(calculation_prv.innerText!="") {
    if(calculation_prv.innerText.length==1 && calculation_prv.innerText=="-") {
      calculation_prv.innerText = "-0.";
    } else if(calculation_prv.innerText.length>=2) {
      switch(calculation_prv.innerText.substring((calculation_prv.innerText.length-1),(calculation_prv.innerText.length))) {
        case " ": case ".": return false;
        case "%": case "÷": case "x": case "-": case "+": 
          calculation_prv.innerText = calculation_prv.innerText + " 0.";
        break;
        default: 
          multi_decimal_remover(calculation_prv.innerText.lastIndexOf("."),(calculation_prv.innerText.length));
        break;
      }
    } else {
      calculation_prv.innerText = calculation_prv.innerText + ".";
    }
  } else { calculation_prv.innerText = "0."; }
});

value_btns.forEach(value_btn => { value_btn.addEventListener('click', function() {
  if(calculation_prv.innerText!="") {
    switch(calculation_prv.innerText[calculation_prv.innerText.length-1]) {
      case "%": case "÷": case "x": case "+": calculation_prv.innerText = calculation_prv.innerText + " " + value_btn.innerText; break;
      case "-":
        if(calculation_prv.innerText.length==1) { calculation_prv.innerText = calculation_prv.innerText + value_btn.innerText; }
        else { calculation_prv.innerText = calculation_prv.innerText + " " + value_btn.innerText; }
      break;
      default: calculation_prv.innerText = calculation_prv.innerText + value_btn.innerText; break;
    }
  } else { calculation_prv.innerText = calculation_prv.innerText + value_btn.innerText; }
}) });

method_btns.forEach(method_btn => { method_btn.addEventListener('click', function() {
  if(calculation_prv.innerText!="") {
    switch(calculation_prv.innerText[calculation_prv.innerText.length-1]) {
      case "%": case "÷": case "x": case "+":
        if(calculation_prv.innerText.length==1) { return false; }
        else { calculation_prv.innerText = calculation_prv.innerText.substring(0,(calculation_prv.innerText.length-1)) + " " + method_btn.innerText; } 
      break;
      default: 
        if(calculation_prv.innerText[calculation_prv.innerText.length-1]!="-") { calculation_prv.innerText = calculation_prv.innerText + " " + method_btn.innerText; }
        else { 
          if(method_btn.innerText=="-") { calculation_prv.innerText = calculation_prv.innerText.substring(0,(calculation_prv.innerText.length-1)) + " " + method_btn.innerText; }
          else { return false; }
        }
      break;
    }
  } else {
    switch(method_btn.innerText) {
      case "%": case "÷": case "x": case "+": if(calculation_prv.innerText=="") { return false; } break;
      default: calculation_prv.innerText = calculation_prv.innerText + method_btn.innerText; break;
    }
  }
}) });

btn_equals.addEventListener('click', function() {
  let calculation_array = result_compiler(calculation_prv.innerText.split(" "));

  if(calculation_array.length>2) { 
    let k=calculation_array.length-1;
    temp_value_container = calculation_array[0];

    while(k>=0) {
      if(calculation_array[1]=='-') {
        temp_value_container = temp_value_container-calculation_array[2];
      } else if(calculation_array[1]=='/') {
        temp_value_container = temp_value_container/calculation_array[2];
      } else if(calculation_array[1]=='*') {
        temp_value_container = temp_value_container*calculation_array[2];
      } else if(calculation_array[1]=='+') {
        temp_value_container = temp_value_container+calculation_array[2];
      } else if(calculation_array[1]=='%') {
        temp_value_container = temp_value_container*(calculation_array[2]/100);
      }

      calculation_array.reverse();
      calculation_array.pop();
      calculation_array.pop();
      calculation_array.pop();
      calculation_array.push(temp_value_container);
      calculation_array.reverse();

      k-=2;
    }

    result_prv.innerText = temp_value_container;
    result_prv.classList.add('finalized');
  } else { return false; }
});

function multi_decimal_remover(last_point_val_index,calculation_length) {

  if(last_point_val_index!=-1) {
    let calculation_keys = [];
    let calculation_keys_chars = calculation_prv.innerText.substring(last_point_val_index,(calculation_length));

    for(let i=(calculation_keys_chars.length-1); i>=0; i--) { if(calculation_keys_chars[i]!=" ") { calculation_keys.push(calculation_keys_chars[i]); } }
  
    if(calculation_keys.includes(".")) { return false; }
    else { calculation_prv.innerText = calculation_prv.innerText + "."; }
    
  } else {
    calculation_prv.innerText = calculation_prv.innerText + ".";
  }

  return 0;
}

function result_compiler(given_array) {
  let new_array = [];

  for(let i=(given_array.length-1); i>=0; i--) { 
    switch(given_array[i]) {
      case "%": new_array[i] = '%'; break;
      case "÷": new_array[i] = '/'; break;
      case "x": new_array[i] = '*'; break;
      case "-": new_array[i] = '-'; break;
      case "+": new_array[i] = '+'; break;
      default: new_array[i] = parseFloat(given_array[i]); break;
    }
  }
  
  return new_array;
}