let Gem = function( obj ) {

  this.level = _get_level()
  this.type = _get_type()

}

let _get_type = () => {

  let possible_types = [

    /*
        Possible Gems:
        --------------
        - Ruby:         Increase pickaxe damage by flat amount
        - Citrine:      Increase pickaxe damage by percentage
        - Sapphire:     Increase pickaxe sharpness by flat amount
        - Alexandrite:  Increase pickaxe sharpness by percentage
        - Turquoise:    Increase pickaxe hardness by flat amount
        - Amethyst:     Increase pickaxe hardness by percentage
        - Moonstone:    Increase pickaxe sharpness and hardness by flat amount
        - Diamond:      Increase pickaxe sharpness and hardness by percentage
        - Jade:         Increase specific building production by flat amount
        - Morganite:    Increase specific building production by percentage
        - Emerald:      Increase all building production by flat amount
        - Topaz:        Increase all building production by percentage
        - Onyx:         Increase quest completion percentage by a flat amount
        - Tanzanite:    Increase quest completion percentage by a percentage
    */

  ]

}