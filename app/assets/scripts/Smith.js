let Smith = function( obj = {} ) {

    this.click_duration = 1000

    this.upgrade_in_progress = {}
    this.duration = obj.duration * 1000 || 0
    this.current_progress = obj.current_progress || 0

    this.start_upgrade = ( upgrade ) => {

        if ( S.refined >= upgrade.price ) {
            S.refined -= upgrade.price

            this.upgrade_in_progress = upgrade
            this.duration = upgrade.duration * 1000

            this._update_progress()
        }

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

        let upgrade = this.upgrade_in_progress

        if ( upgrade.unlock_functions ) {
            let fn = upgrade.unlock_functions

            if ( fn.unlock_fragility_spectacles ) {
                S.locked.fragility_spectacles = 0
                generate_weak_spot()
            }

            if ( fn.increase_pickaxe_sharpness ) {
                S.pickaxe.sharpness += fn.increase_pickaxe_sharpness
            }

            if ( fn.increase_pickaxe_hardness ) {
                S.pickaxe.hardness += fn.increase_pickaxe_hardness
            }

            if ( fn.unlock_smith_upgrades ) {
                console.log( 'target:', fn.unlock_smith_upgrades )
                fn.unlock_smith_upgrades.forEach( code_name => {
                    let target_upgrade = select_from_arr( Smith_Upgrades, code_name )
                    select_from_arr( target_upgrade.requires, upgrade.code_name ).owned = 1

                    let locked = 0
                    target_upgrade.requires.forEach( requirement => {
                        if ( !requirement.owned ) {
                            locked = 1
                        }
                    })

                    target_upgrade.locked = locked

                })
            }
        }

        upgrade.owned = 1
        if ( upgrade.repeat ) upgrade.level++ 

        if ( upgrade.code_name == 'a_u_t_o_m_a_t_e_r' ) {
            new Automater()
            S.automater.automater_accordion_hidden = false
            O.reposition_elements = 1
        }

        this.upgrade_in_progress = {}
        this.current_progress = 0

        if ( O.current_tab == 'smith' ) build_smith()
    }

}