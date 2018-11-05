let s = ( el ) => {
  return document.querySelector( el )
}

let remove_el = ( el ) => {
  el.parentNode.removeChild( el )
}

let get_random_num = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

let format_number = ( num ) => {
  
}