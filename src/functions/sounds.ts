const playBreakAudio = () => {
    const breakAudio = new Audio('/sounds/break_start-2.mp3');
    breakAudio.play();
}

const playAtentionAudio = () => {
    const atentionAudio = new Audio('/sounds/atention.mp3');
    atentionAudio.play();
}

const playErrorAudio = () => {
    const errorAudio = new Audio('/sounds/error.mp3');
    errorAudio.play();
}

const playFocusAudio = () => {
    const focusAudio = new Audio('/sounds/focus_start-2.mp3')
    focusAudio.play()
}

const playtToDoAllCompleted = () => {
    const allCompletedAudio = new Audio('/sounds/to-do_all-completed.mp3')
    allCompletedAudio.play()
}

const playToDoItemCompleted = () => {
    const itemCompletedAudio = new Audio('/sounds/to-do_item-completed.mp3')
    itemCompletedAudio.play()
}

const playToDoNewItem = () => {
    const newItemAudio = new Audio('/sounds/to-do_new-item.mp3')
    newItemAudio.play()
}

const playAchievementUnlocked = () => {
    const newAchievement = new Audio('/sounds/achievement2.mp3')
    newAchievement.play()
}

export { playBreakAudio, playAtentionAudio, playErrorAudio, playFocusAudio, playtToDoAllCompleted, playToDoItemCompleted, playToDoNewItem, playAchievementUnlocked }