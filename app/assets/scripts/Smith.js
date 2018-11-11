let Smith = function( obj = {} ) {

    this.click_duration = 1000

    this.upgrade_in_progress = {}
    this.duration = obj.duration * 1000 || 0
    this.current_progress = obj.current_progress || 0

    this.start_upgrade = ( upgrade ) => {

        this.upgrade_in_progress = upgrade
        this.duration = upgrade.duration * 1000

        this._update_progress()

    }

    this.progress_click = () => {
        console.log('fire')
        if ( !is_empty( this.upgrade_in_progress ) ) {
            this.current_progress += this.click_duration
        }
    }

    this._update_progress = () => {

        build_pickaxe_update( true )
        
        let update_progress = setInterval(() => {

            let bar = s( '.progress-bar' )

            this.current_progress += ( 1000 / S.prefs.game_speed )

            if ( bar ) {
                let percentage = ( this.current_progress / this.duration ) * 100
                bar.style.width = percentage + '%'
            }

            if ( this.current_progress >= this.duration ) {
                this._update_complete()
                clearInterval( update_progress )
            }


        }, 1000 / S.prefs.game_speed )
    }

    this._update_complete = () => {

        console.log( this.upgrade_in_progress )

        this.upgrade_in_progress.owned = 1
        if ( this.upgrade_in_progress.repeat ) {
            this.upgrade_in_progress.level++
        }

        this.upgrade_in_progress = {}
        this.current_progress = 0

        build_pickaxe_update( true )
        build_smith_upgrades( true )
    }

}