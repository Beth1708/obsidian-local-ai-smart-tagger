import { Plugin, Notice } from 'obsidian';

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
                const fileContent = await this.app.vault.read(activeFile);
                console.log("File content length:", fileContent.length);

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
        console.log("SMART TAGGER UNLOADED");
    }
}