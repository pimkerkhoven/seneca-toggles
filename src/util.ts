export function shuffleArray<T>(arr: T[]) {
    arr.sort(() => Math.random() - 0.5);
}

export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}