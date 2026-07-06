import { Plugin, Notice, requestUrl } from 'obsidian';

// Define an interface for the structured response we expect from the model
interface OllamaResponse {
    summary: string;
    tags: string[];
}

export default class SmartTaggerPlugin extends Plugin {
    onload() {
        console.log("SMART TAGGER LOADED SUCCESSFULLY");
        new Notice("Smart Tagger Baseline Loaded!");

        this.addCommand({
            id: 'test-simple-notice',
            name: 'AI: Test Simple Notice',
            callback: async () => {
                console.log("HOTKEY TRIGGERED SUCCESSFULLY");
                new Notice("The callback loop is working perfectly ...");
                const activeFile = this.app.workspace.getActiveFile();
                if (!activeFile) {
                    new Notice('Please open a note first.');
                    return;
                }
                console.log("Got the active file:", activeFile);
                console.log("Got the active file name:", activeFile?.name);

                new Notice('Analyzing note...');

                try {
                    // Async operations are perfectly safe here because they run
                    // inside the execution context of the hotkey trigger event
                    const fileContent = await this.app.vault.read(activeFile);
                    console.log("File content length:", fileContent.length);
                    console.log("Calling Ollama with content length:", fileContent.length);
                    const aiResult = await this.callOllamaJson(fileContent);
                    console.log("AI Result:", aiResult);

                    await this.app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
                         frontmatter['summary'] = aiResult.summary;
                         // Map through tags, force lowercase, trim spaces, and replace inner spaces with hyphens
                         if (Array.isArray(aiResult.tags)) {
                             frontmatter['tags'] = aiResult.tags.map(tag =>
                                 tag.toLowerCase().trim()
                                     .replace(/\s+/g, '-') // Swaps any number of consecutive spaces with a single hyphen
                             );
                         }
                    });
                    console.log("Frontmatter updated successfully!");

                    new Notice('Analysis complete!');
                } catch (error) {
                    new Notice('An error occurred.');
                }
            }
        });
    }

    /**
     * Sends the note content to a local Ollama instance and requests a structured JSON payload
     */
    async callOllamaJson(fileContent: string): Promise<OllamaResponse> {
        console.log("Calling Ollama with content length:", fileContent.length);

        // We use llama3 or another model that reliably supports JSON mode
        const MODEL_NAME = 'llama3.2:latest';
        const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

       const systemPrompt = `You are a precise metadata assistant for an Obsidian vault. 
Analyze the user's note text and return a JSON object with exactly two keys:
1. "summary": A comprehensive summary of the main ideas. If the note covers multiple distinct topics, ensure the summary synthesizes all of them cleanly. It can be multiple sentences or a short paragraph as needed.
2. "tags": An array of lowercase tags relevant to the text. Do not include the '#' symbol. Tags must not contain spaces; use hyphens instead (e.g., "competence-problem").

Your output must be raw JSON only. Do not wrap it in markdown blocks or include conversational text.`;

        try {
            // Obsidian's secure, CORS-bypassing network request utility
            console.log("Sending request to Ollama with model: ", MODEL_NAME);
            const response = await requestUrl({
                url: OLLAMA_ENDPOINT,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    prompt: `Note content:\n\n${fileContent}`,
                    system: systemPrompt,
                    stream: false,
                    format: 'json' // This forces Ollama to output valid JSON
                }),
            });

            if (response.status !== 200) {
                throw new Error(`Ollama returned status code ${response.status}`);
            }

            // Parse the string payload into our structured interface
            const data = JSON.parse(response.text);

            // Ollama nests its string response inside the "response" field
            const parsedOutput: OllamaResponse = JSON.parse(data.response);
            console.log("Received Ollama response:", parsedOutput);

            return {
                summary: parsedOutput.summary || "No summary generated.",
                tags: Array.isArray(parsedOutput.tags) ? parsedOutput.tags : []
            };

        } catch (error) {
            console.error("Error communicating with local Ollama service:", error);
            throw error; // Let the calling hotkey handler deal with updating the UI notice
        }
    }
    onunload() {
        console.log("SMART TAGGER UNLOADED");
    }
}