import { Plugin, Notice } from 'obsidian';

export default class SmartTaggerPlugin extends Plugin {
    onload() {
        console.log("SMART TAGGER LOADED SUCCESSFULLY");
        new Notice("Smart Tagger Baseline Loaded!");

        this.addCommand({
            id: 'test-simple-notice',
            name: 'AI: Test Simple Notice',
            callback: () => {
                console.log("HOTKEY TRIGGERED SUCCESSFULLY");
                new Notice("The callback loop is working perfectly ...");
            }
        });
    }

    onunload() {
        console.log("SMART TAGGER UNLOADED");
    }
}