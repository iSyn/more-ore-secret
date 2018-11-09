let s = ( el ) => {
  return document.querySelector( el )
}

let remove_el = ( el ) => {
  el.parentNode.removeChild( el )
}

let remove_wrapper = () => {
  let wrappers = document.querySelectorAll( '.wrapper' )
  if ( wrappers.length > 0 ){
    remove_el( wrappers[ wrappers.length - 1 ] )
  }
}

let get_random_num = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

let beautify_number = (number) => {

  var SI_PREFIXES = [
    "", // number is less than 1,000
    "Thousand", // number is in the thousands
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Dodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
    "Unvigintillion",
    "Dovigintillion",
    "Trevigintillion",
    "Quattuorvigintillion",
    "Quinvigintillion",
    "Sexvigintillion",
    "Septenvigintillion",
    "Octovigintillion",
    "Novemvigintillion",
    "Trigintillion",
    "Untrigintillion",
    "Dotrigintillion",
    "Tretrigintillion",
    "Quattuortrigintillion",
    "Quintrigintillion",
    "Sextrigintillion",
    "Septentrigintillion",
    "Octotrigintillion",
    "Novemtrigintillion",
    "F*ckloadillion",
    "F*cktonillion"
  ];

  if (!number) return 0;
  if (number < 10){
      if (Math.round(number) === number) return number;
      return number.toFixed(1);
  }
  // what tier? (determines SI prefix)
  var tier = Math.log10(number) / 3 | 0;

  // if zero, we don't need a prefix
  if (tier === 0) return Math.round(number)
  // if (tier === 1) return Math.round(number)

  // get prefix and determine scale
  var prefix = SI_PREFIXES[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add prefix as suffix
  return parseFloat(scaled.toFixed(2)) + " " + prefix;
}

let select_from_arr = ( arr, code_name ) => {
  for ( let i in arr ) {
    if ( arr[ i ].code_name === code_name ) {
      arr[ i ].index = parseInt( i )
      return arr[ i ]
    }
  }
}

let select_random_from_arr = ( arr ) => {
  return arr[ Math.floor( Math.random() * arr.length ) ]
}

let get_random_color = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}