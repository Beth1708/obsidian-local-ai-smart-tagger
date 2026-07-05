import { Plugin, Notice } from 'obsidian';

export default class SmartTaggerPlugin extends Plugin {
    // 1. Keep onload synchronous so Obsidian initializes it instantly
    onload() {
        console.log('Loading Smart Tagger Plugin...');

        // 2. Registering the command layout is instantaneous and synchronous
        this.addCommand({
            id: 'generate-ai-metadata',
            name: 'AI: Discover Tags & Summary',
            // 3. The callback is where the async runtime safely belongs
            callback: async () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (!activeFile) {
                    new Notice('Please open a note first.');
                    return;
                }

                new Notice('Analyzing note...');

                try {
                    // Async operations are perfectly safe here because they run
                    // inside the execution context of the hotkey trigger event
                    const fileContent = await this.app.vault.read(activeFile);

                    // Call your API helper here...
                    new Notice('Analysis complete!');
                } catch (error) {
                    new Notice('An error occurred.');
                }
            }
        });
    }

    onunload() {
        console.log('Unloading Smart Tagger Plugin...');
    }
}