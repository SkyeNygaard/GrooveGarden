import { useEffect } from "react";
import "./App.css";
import { Game, GameConfig } from "./game";

function App() {
	useEffect(() => {
		const game = new Game(GameConfig);

		return () => {
			game.destroy(true);
		};
	}, []);

	return (
		<div
			id="game-container"
			style={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#000",
			}}
		/>
	);
}

export default App;
