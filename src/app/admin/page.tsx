"use client";

import { useState, useEffect } from "react";
import {
	getProhibitedWords,
	setProhibitedWords,
	resetProhibitedWords,
} from "@/helpers/prohibitedWords";

export default function ProhibitedWordsAdmin() {
	const [words, setWords] = useState("");

	useEffect(() => {
		setWords(getProhibitedWords().join(", "));
	}, []);

	const save = () => {
		setProhibitedWords(
			words
				.split(",")
				.map((w) => w.trim())
				.filter(Boolean)
		);
		alert("Saved!");
	};

	const reset = () => {
		resetProhibitedWords();
		setWords(getProhibitedWords().join(", "));
	};

	return (
		<div>
			<h2>Prohibited Words Admin</h2>
			<textarea
				value={words}
				onChange={(e) => setWords(e.target.value)}
				rows={3}
				style={{ width: "50%" }}
			/>
			<br />
			<button className="btn btn-primary" onClick={save}>
				Save
			</button>
			<button className="btn btn-secondary ms-2" onClick={reset}>
				Reset to Default
			</button>
		</div>
	);
}
