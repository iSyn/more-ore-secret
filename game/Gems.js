/*
    --[ REGULAR GEMS ]--------------------------
    Diamonds        = flat sharpness + hardness
    Ruby            = flat damage
    Opal            = flat hardness
    Topaz           = flat sharpness

    Lonsdaleite     = %sharpness + %hardness
    Titanium        = %damage
    Vibranium       = %hardness
    Iridium         = %sharpness

    --[ SPECIAL GEMS ]--------------------------
    Executive Alloy     = %bonus to total OpS
    Barbaric Coating    = %bonus to total OpC
    Four Ore Clover     = increase item find on questing
    Combo Stone         = +combo per click or +combo multiplier
*/

let generateGem = (iLvl) => {

    let randomNum;

    // ----------------------------------------------------------- SELECT RARITY
    let allRarities = ['Common', 'Uncommon', 'Rare']
    let selectedRarity

    randomNum = Math.random()
    if (randomNum >= 0) selectedRarity = allRarities[0]
    if (randomNum >= .7) selectedRarity = allRarities[1] // 30%
    if (randomNum >= .95) selectedRarity = allRarities[2] // 5%

    // ----------------------------------------------------------- SELECT GEM
    let allGems = [
        ['Ruby', 'Sapphire', 'Topaz', 'Opal', 'Diamond'],
        ['Lonsdaleite', 'Iridium', 'Vibranium', 'Titanium']
    ]
    let selectedGem

    randomNum = Math.random()
    if (randomNum <= .2) { // 20% for special
        selectedGem = allGems[1][Math.floor(Math.random() * allGems[1].length)]
    } else {
        selectedGem = allGems[0][Math.floor(Math.random() * allGems[0].length)]
    }

    let selected = {
        rarity: selectedRarity,
        gem: selectedGem
    }

    console.log(selected)




}