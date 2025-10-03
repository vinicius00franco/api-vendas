import "reflect-metadata";
import { app } from "./app.js";
import { initializeDatabase } from "./shared/database/data-source.js";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

initializeDatabase()
	.then(() => {
		console.log("Database initialized");
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error("Failed to initialize database", error);
		process.exit(1);
	});
