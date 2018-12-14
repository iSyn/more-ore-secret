let Gem = function( obj ) {

  this.level = _get_level()
  this.type = _get_type()

}

let _get_type = () => {

  let possible_types = [

    /*
        Possible Gems:
        - Increase pickaxe damage by flat amount
        - Increase pickaxe damage by percentage
        - Increase pickaxe sharpness by flat amount
        - Increase pickaxe sharpness by percentage
        - Increase pickaxe hardness by flat amount
        - Increase pickaxe hardness by percentage
        - Increase pickaxe sharpness and hardness by flat amount
        - Increase pickaxe sharpness and hardness by percentage
        - Increase specific building production by flat amount
        - Increase specific building production by percentage
        - Increase all building production by flat amount
        - Increase all building production by percentage
    */

    'Ruby', // Increase damage by flat amount
    'Topaz', // Increase production of a specific building
    ''
  ]

}