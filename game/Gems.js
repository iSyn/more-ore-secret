/*
    --[ REGULAR GEMS ]--------------------------
    Diamonds        = flat sharpness + hardness
    Ruby            = flat damage
    Shapphire       = flat hardness
    Topaz           = flat sharpness

    Vibranium       = %sharpness + %hardness
    Titanium        = %damage
    Mythril         = %hardness
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
    let allRarities = [
        ['Common', [1, 10]],
        ['Uncommon', [10, 30]],
        ['Rare', [40, 100]],
        ['Unique', [100, 140]]
    ]
    let selectedRarity

    randomNum = Math.random()
    if (randomNum >= 0) selectedRarity = allRarities[0]
    if (randomNum >= .7) selectedRarity = allRarities[1]  // 30%
    if (randomNum >= .95) selectedRarity = allRarities[2] // 5%
    if (randomNum >= .99) selectedRarity = allRarities[3] // 1%

    // ----------------------------------------------------------- SELECT RARITY AMOUNT
    // Math.floor(Math.random() * (maxRange - minRange) + minRange)
    selectedRarity.amount = Math.floor(Math.random() * (selectedRarity[1][1] - selectedRarity[1][0]) + selectedRarity[1][0])

    // ----------------------------------------------------------- SELECT GEM
    let allGems = [
        [
            {gem: 'Ruby', bonus: 'damage'},
            {gem: 'Sapphire', bonus: 'hardness'},
            {gem: 'Topaz', bonus: 'sharpness'},
            {gem: 'Diamond', bonus: 'both'}
        ], [
            {gem: 'Titanium', bonus: 'damage'},
            {gem: 'Mythril', bonus: 'hardness'},
            {gem: 'Iridium', bonus: 'sharpness'},
            {gem: 'Vibranium', bonus: 'both'}
        ]
    ]

    let selectedGem

    if (Math.random() <= .2) { // 20% for special
        selectedGem = allGems[1][Math.floor(Math.random() * allGems[1].length)]
    } else {
        selectedGem = allGems[0][Math.floor(Math.random() * allGems[0].length)]
    }

    // ----------------------------------------------------------- SELECT GEM

    let selected = {
        rarity: selectedRarity,
        gem: selectedGem.gem,
        bonus: selectedGem.bonus,
    }

    console.log(selected)




}