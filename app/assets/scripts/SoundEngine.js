let SoundEngine = function() {

    this.ore_hit_sfx = new Howl({
        src: [ './assets/sounds/ore-hit.wav' ],
        volume: .5 * S.prefs.sfx_volume,
    })

    this.ore_weak_spot_hit_sfx = new Howl({
        src: [ './assets/sounds/ore-weak-spot-hit.wav' ],
        volume: .6 * S.prefs.sfx_volume
    })

    this.ore_percentage_lost_sfx = new Howl({
        src: [ './assets/sounds/ore-percentage-lost.wav' ],
        volume: .5 * S.prefs.sfx_volume
    })

    this.ore_destroyed_sfx = new Howl({
        src: [ './assets/sounds/ore-destroyed.wav' ],
        volume: .5 * S.prefs.sfx_volume
    })

    this.buy_sound = new Howl({
        src: [ './assets/sounds/buy-sound.wav' ],
        volume: .5 * S.prefs.sfx_volume
    })

    this.store_item_hover = new Howl({
        src: [ './assets/sounds/store-item-hover.wav' ],
        volume: .5 * S.prefs.sfx_volume
    })

}