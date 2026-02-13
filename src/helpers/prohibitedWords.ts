const STORAGE_KEY = "prohibitedWords";

// Default list
const defaultWords = ["badword1", "badword2", "badwordtest"];

export function getProhibitedWords(): string[] {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			return defaultWords;
		}
	}
	return defaultWords;
}

export function setProhibitedWords(words: string[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

export function resetProhibitedWords() {
	localStorage.removeItem(STORAGE_KEY);
}

export function containsProhibitedWord(text: string): boolean {
	const words = getProhibitedWords();
	return words.some((word) =>
		text.toLowerCase().includes(word.toLowerCase())
	);
}
